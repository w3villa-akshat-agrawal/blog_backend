const response = require("../../utils/response")
const { commentCreate } = require("../services/commentServices")



const createComment = async(req,res,next)=>{
    const userId = req.user.id
    const blogId =  req.params.id
    const result = await (commentCreate(blogId,userId))
}
module.exports = {createComment}