const redis = require("../../config/redis_connection");
const checkExistence = require("../../utils/existence");
const ApiError = require("../../utils/globalError");
const { Blog, sequelize ,User,Comment} = require("../models");
const { QueryTypes } = require("sequelize");
const Following = require("../models/following");
const Followers = require("../models/follower");





const blogCreateService = async (userId, data) => {
  const { title, body, type } = data;

  const existingBlog = await checkExistence(Blog, { title });
  if (existingBlog) {
    throw new ApiError("Title already booked. Please choose another.", 400);
  }

  try {
    const newBlog = await Blog.create({
      title,
      body,
      type,
      userId,
    });
    const exists = await redis.exists("allBlog")
    if(exists){
      await redis.del("allBlog")    
    }
    return newBlog.id;
  } catch (error) {
    throw new ApiError("DB error while creating blog", 500);
  }
};




const blogDelete = async (userId, blogId) => {
  try {
    // Fetch the blog by its ID
    const blog = await Blog.findOne({ where: { id: blogId } });

    // If blog not found
    if (!blog) {
      throw new ApiError("Blog not found", 404);
    }

    // Check if the user is the owner
    if (userId !== blog.userId) {
      throw new ApiError("Unauthorized: You don't have access to delete this blog", 403);
    }

    // Delete the blog
    await Blog.destroy({ where: { id: blogId } });

    return "Blog deleted successfully";
  } catch (error) {
    throw error;
  }
};




const blogUpdate = async (userId,blogId,data)=>{
   try {
    // Fetch the blog by its ID
    const {title,body} = data
    const blog = await Blog.findOne({ where: { id: blogId } });

    // If blog not found
    if (!blog) {
      throw new ApiError("Blog not found", 404);
    }

    // Check if the user is the owner
    if (userId !== blog.userId) {
      throw new ApiError("Unauthorized: You don't have access to delete this blog", 403);
    }

    // Delete the blog
    const  isUpdated =await Blog.update({title,body},{ where: { id: blogId } });
      if(isUpdated){
         return "Blog updated successfully";
      }
   
  } catch (error) {
    throw error;
  }
}




// const getAllBlogService = async () => {
//   try {
//     const [blogs] = await sequelize.query(
//       "SELECT `userId`, `title`, `body`,`id` FROM `Blogs` WHERE `type` = 'public' ORDER BY `createdAt` DESC"
//     );
//     return blogs;
//   } catch (error) {
//     console.log(error);
//     throw new ApiError("Error in query", 501);
//   }
// };



// jHm4lnXzwbRvDzxx mongo db
// AQSwzaNo7JZLvKNd    blog_App

const getAllBlogService = async () => {
  const cacheKey = "allBlog";
  try {
    const cachedBlog = await redis.get(cacheKey);

    if (cachedBlog) {
      console.log("Coming from Redis");
      return JSON.parse(cachedBlog); // convert back to object
    }

    const allBlog = await Blog.findAll({
      where: { type: 'public' },
      attributes: ['id', 'title', 'body'],
      order:[["createdAt","DESC"]],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        },
        {
          model: Comment,
          as: "comments",
          attributes: ["comment"],
          separate: true,
          limit: 5,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    await redis.set(cacheKey, JSON.stringify(allBlog), 'EX', 120); // expires in 2 minutes
    console.log("Coming from DB");
    return allBlog;
  } catch (error) {
    console.log(error);
    throw new ApiError("Query error");
  }
};








// const desiredUserFetch = async (data){ => {
//   const id = data;
  

//   const userDetail = await sequelize.query(
//     // `SELECT \`b\`.\`title\`, \`b\`.\`body\` 2
//     //  FROM \`Users\` AS \`u\`
//     //  INNER JOIN \`Blogs\` AS \`b\`
//     //  ON \`u\`.\`id\` = \`b\`.\`userId\`
//     //  WHERE \`u\`.\`id\` = ?`,

//      `SELECT u.username, u.email, u.phone, b.title, b.body
//    FROM Users AS u
//    INNER JOIN Blogs AS b ON u.id = b.userId
//    WHERE u.id = ?`,
//     {
//       replacements: [id],
//       type: QueryTypes.SELECT,
//     }
//   );

//   return userDetail;
// };
// const desiredUserFetch = async (data) => {
//   const id = data;
//   console.log(data)

//   try {
//     const {userDetail,followingData,followerData} = await Promise.all(await User.findOne({
//       where: { id },
//       attributes: ['username', 'email', 'phone'],
//       include: [
//         {
//           model: Blog,
//           as: 'blogs',
//           attributes: ['title', 'body','id'],
//           include: [
//             {
//               model: Comment,
//               as: 'comments',
//               attributes: ['comment'],
//               include: [
//                 {
//                   model: User,
//                   as: 'commentAuthor',
//                   attributes: ['username']
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     }),await Following.findOne({ userId: id }) || {},await Followers.findOne({ userId: id }) || {};)

// //     const userDetail = await User.findOne({
// //       where: { id },
// //       attributes: ['username', 'email', 'phone'],
// //       include: [
// //         {
// //           model: Blog,
// //           as: 'blogs',
// //           attributes: ['title', 'body','id'],
// //           include: [
// //             {
// //               model: Comment,
// //               as: 'comments',
// //               attributes: ['comment'],
// //               include: [
// //                 {
// //                   model: User,
// //                   as: 'commentAuthor',
// //                   attributes: ['username']
// //                 }
// //               ]
// //             }
// //           ]
// //         }
// //       ]
// //     });

    
// //  const followingData = await Following.findOne({ userId: id }) || {};
// //     const followerData = await Followers.findOne({ userId: id }) || {};

//     const followingList = followingData.following || [];
//     const followerList = followerData.follower || [];

//     if (!userDetail) {
//       throw new ApiError("User not found", 501);
//     }

//     return { userDetail, followingList, followerList };

//   } catch (error) {
//     console.log(error);
//     throw new ApiError("error");
//   }
// };


// const desiredUserFetch = async (id) => {
//   try {
//     const [userDetail, followingData, followerData] = await Promise.all([
//       User.findOne({
//         where: { id },
//         attributes: ['username', 'email', 'phone'],
//         include: [
//           {
//             model: Blog,
//             as: 'blogs',
//             attributes: ['title', 'body', 'id'],
//             include: [
//               {
//                 model: Comment,
//                 as: 'comments',
//                 attributes: ['comment'],
//                 include: [
//                   {
//                     model: User,
//                     as: 'commentAuthor',
//                     attributes: ['username']
//                   }
//                 ]
//               }
//             ]
//           }
//         ]
//       }),
//       Following.findOne({ userId: id }),
//       Followers.findOne({ userId: id })
//     ]);

//     if (!userDetail) {
//       throw new ApiError("User not found", 501);
//     }

//     const followingList = followingData?.following || [];
//     const followerList = followerData?.follower || [];

//     return { userDetail, followingList, followerList };
//   } catch (error) {
//     console.error(error);
//     throw new ApiError("Error fetching user data", 500);
//   }
// };

const desiredUserFetch = async (id) => {
  try {
    const [userDetail, followingAgg, followerAgg] = await Promise.all([
      // Sequelize: Fetch user detail + blogs + comments
      User.findOne({
        where: { id },
        attributes: ['username', 'email', 'phone'],
        include: [
          {
            model: Blog,
            as: 'blogs',
            attributes: ['title', 'body', 'id'],
            include: [
              {
                model: Comment,
                as: 'comments',
                attributes: ['comment'],
                include: [
                  {
                    model: User,
                    as: 'commentAuthor',
                    attributes: ['username','id']
                  }
                ]
              }
            ]
          }
        ]
      }),

      // MongoDB: Get count of following
      Following.aggregate([
        { $match: { userId: Number(id) } },
        {
          $project: {
            _id: 0,
            followingCount: { $size: "$following" }
          }
        }
      ]),

      // MongoDB: Get count of followers
      Followers.aggregate([
        { $match: { userId: Number(id) } },
        {
          $project: {
            _id: 0,
            followerCount: { $size: "$follower" }
          }
        }
      ])
    ]);

    if (!userDetail) {
      throw new ApiError("User not found", 501);
    }
console.log(followingAgg)
    // Extract count from aggregation result (array of 1)
    const followingCount = followingAgg[0]?.followingCount || 0;
    const followerCount = followerAgg[0]?.followerCount || 0;

    return {
      userDetail,
      followingCount,
      followerCount
    };
  } catch (error) {
    console.error(error);
    throw new ApiError("Error fetching user data", 500);
  }
};




module.exports = { blogCreateService, getAllBlogService,blogDelete,blogUpdate,desiredUserFetch };
