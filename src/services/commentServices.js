const checkExistence = require("../../utils/existence");
const ApiError = require("../../utils/globalError");
const { Blog, sequelize,Comment,User } = require("../models");
const { QueryTypes } = require("sequelize");

const commentCreate = async (blogId,userId,data)=>{
   try {
    const {comment} = data
    const blog = await Blog .findOne({where:{id:blogId}})
    if(blog){
        const createdComment = await Comment.create ({
            blogId,
            comment,
            commentUserId:userId,
        })
        return createdComment
    
    };
    throw(new ApiError("blog not found "))
   } catch (error) {
        throw (new ApiError("query problem"))
   }
}
// all comments with pagination 
const fetchComments = async (blogId,page,limit)=>{
    pageval = page || 1
    limitval = limit || 10
    const offset = (pageval-1)*limitval
    const data = await Comment.findAll({
        where:{blogId},
        limit: parseInt(limitval),
        offset:parseInt(offset),
        include:[
            {
                model:User,
                as:'commentAuthor',
                attributes:['username','id']
            }
        ]
    
    })

    if(data){
        if(data.length === 0){
            throw (new ApiError("no comments in this blog"))
        }
        return data
    }
    else{
        throw (new ApiError("query problem"))
    }
}

module.exports = {commentCreate,fetchComments}