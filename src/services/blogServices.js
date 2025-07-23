const redis = require("../../config/redis_connection");
const checkExistence = require("../../utils/existence");
const ApiError = require("../../utils/globalError");
const { Blog, sequelize ,User,Comment,SubscriptionPlan} = require("../models");
const { QueryTypes } = require("sequelize");
const Following = require("../models/following");
const Followers = require("../models/follower");
const clearUserAndPlanCache = require("../../utils/redisKeysDel");





const blogCreateService = async (userId, data) => {
  const { title, body, type='public' } = data;

  const existingBlog = await checkExistence(Blog, { title });
  if (existingBlog) {
    throw new ApiError("Title already booked. Please choose another.", 400);
  }

  try {
    const newBlog = await Blog.create({
      title,
      body,
      type ,
      userId,
    });

    
   await redis.del("allBlog");
   await redis.incr(`blogCount:${userId}`)
   await redis.del(`userDetail:${userId}`)
    return newBlog.id;

  } catch (error) {
    console.error(error);
    throw new ApiError("DB error while creating blog", 500);
  }
};

const getAllBlogService = async (id) => {
  const userID = id;
  const cacheKey = "allBlog";
  try {
    const cachedBlog = await redis.get(cacheKey)
    if (cachedBlog) {
      console.log("Coming from Redis");
      return JSON.parse(cachedBlog); // convert back to object
    }

    const allBlog = await Blog.findAll({
      where:{type:"public"},
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
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    await redis.set(cacheKey, JSON.stringify({data:allBlog}), 'EX', 600); // expires in 2 minutes
    console.log("Coming from DB");

    return {userId:id,data:allBlog};
  } catch (error) {
    console.log(error);
    throw new ApiError("Server error");
  }
};

const particularBlogServices = async (id,userId) => {
  try {
    const userBlog = await Blog.findAll({
      where: { id: id },
      attributes: ['id', 'title', 'body'],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        },
        {
          model: Comment,
          as: 'comments',
          attributes: ['comment'],
          separate: true,
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: User,
              as: 'commentAuthor',
              attributes: ['id', 'username']
            }
          ]
        }
      ]
    });

    if (!userBlog || userBlog.length === 0) {
      throw new ApiError("Blog not found", 400);
    }

    return {userId:userId,data:userBlog};
  } catch (error) {
    console.log(error);
    throw new ApiError("Server error");
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
    await redis.decr(`blogCount:${userId}`)
    await redis.del(`userDetail:${userId}`)
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

const desiredUserFetch = async (id,loginUserID) => {
  let followingStatus
  const userData = await redis.get(`userDetail:${id}`)
      if(userData){
        const data = JSON.parse(userData)
        console.log("redis profile")
        return (data)
      }
  try {
    const [userDetail, followingAgg, followerAgg,isFollowing] = await Promise.all([
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
              },
              
            ],
             order: [['createdAt','DESC']]
          },
          {
                model:SubscriptionPlan,
                as:'subscription',
                attributes:['name']
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
      ]),
      Following.findOne({
  userId: Number(loginUserID), // the person who is logged in
  'following.userId': Number(id) // the person whose profile is being viewed
})
      


    ]);

    if (!userDetail) {
      throw new ApiError("User not found", 501);
    }
    if(isFollowing){
       followingStatus = true
    }
console.log(followingAgg)
    // Extract count from aggregation result (array of 1)
    const followingCount = followingAgg[0]?.followingCount || 0;
    const followerCount = followerAgg[0]?.followerCount || 0;
    const data ={
      loginUserID,
      userDetail,
      followingCount,
      followerCount,
      followingStatus
    }
    await redis.set(`userDetail:${id}`,JSON.stringify(data))
    return {
      loginUserID,
      userDetail,
      followingCount,
      followerCount,
      followingStatus
    };
  } catch (error) {
    console.error(error);
    throw new ApiError("Error fetching user data", 500);
  }
};




module.exports = { blogCreateService, getAllBlogService,blogDelete,blogUpdate,desiredUserFetch,particularBlogServices };
