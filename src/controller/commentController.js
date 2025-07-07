const response = require("../../utils/response")
const { commentCreate,fetchComments } = require("../services/commentServices")



const createComment = async(req,res,next)=>{
   try {
     const userId = req.user.id
    const blogId =  req.params.id
    const data = req.body
    const result = await (commentCreate(blogId,userId,data))
    if(result){
        return res.send("comment done",result,200,true)
    }
   } catch (error) {
    console.log(error)
    next(error)
   }

}
const getComments = async(req,res,next)=>{
   try {
     const blogId = req.params.id
     const {page , limit} = req.query
    const result = await fetchComments(blogId,page,limit)
    if (result){
        return res.send(response("comments fetched success",result,200,true))
    }
    
   } catch (error) {
    next (error)
   }

}
module.exports = {createComment,getComments}