const checkExistence = require("../../utils/existence");
const ApiError = require("../../utils/globalError");
const { Blog, sequelize ,User,Comment} = require("../models");
const { QueryTypes } = require("sequelize");




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


const getAllBlogService = async ()=>{
  try {
    const alBlog = await Blog.findAll({
      where:{type:'private'},
      attributes:['id','title','body'],
      include:[
        {
          model:User,
          as:'author',
          attributes:['id','username']
        },{
          model:Comment,
          as:"comments",
          attributes:["comment"],
          separate:true,
          limit:5,
          orderBy: [['createdAt', 'DESC']]  
        }

      ]
    })
    return (alBlog)
  } catch (error) {
    console.log(error)
    throw(new ApiError("queryError"))
  }
}







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
const desiredUserFetch = async (data) => {
  const id = data;

  try {
    const userDetail = await User.findOne({
      where: { id },
      attributes: ['username', 'email', 'phone'],
      include: [
        {
          model: Blog,
          as: 'blogs',
          attributes: ['title', 'body'],
          include: [
            {
              model: Comment,
              as: 'comments',
              attributes: ['comment'],
              include: [
                {
                  model: User,
                  as: 'commentAuthor',
                  attributes: ['username']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!userDetail) {
      throw new ApiError("user not found", 501);
    }

    return userDetail;

  } catch (error) {
    console.log(error);
    throw new ApiError("error");
  }
};


module.exports = { blogCreateService, getAllBlogService,blogDelete,blogUpdate,desiredUserFetch };
