const response = require("../../utils/response")
const {blogCreateService,getAllBlogService,blogDelete, blogUpdate,desiredUserFetch} = require ("../services/blogServices.js")
const createBlog = async (req,res,next) => {
    try {
         const userId =req.user.id
         const result = await (blogCreateService(userId,req.body))
         if(result){
            return res.send(response(true,"blog created successfully",{result},200,true))
         }
    } catch (error) {
        console.log(error)
        next(error)
    }

}
const allBlog = async(req,res,next)=>{
    try {
            const blogs  = await getAllBlogService()
            return res.send(response("blogs fetch success",blogs,200,true))
    } catch (error) {
        next(error)
    }
    
}
const deleteBlog = async(req,res,next)=>{
        try {
                const userId = req.user.id
                const blogId = req.params.id
                const result = await blogDelete(userId,blogId)
                if(result){
                         return res.send(response("blog deleted success",200))
                }
        } catch (error) {
            next(error)
        }
}
const updateBlog = async (req,res,next) =>{
    const userId = req.user.id
    const blogId = req.params.id
    const data = req.body
    const result = await blogUpdate(userId,blogId,data)
    if(result){
        return res.send(response("blog updated sucess",200))
    }
}
const anyUserDetail = async(req,res,next)=>{
    const desiredUserId = req.params.id
    const result = await desiredUserFetch(desiredUserId)
    if(result){
                return res.send(response(true,"user fetched",result,200))
    }

}
module.exports = {createBlog,allBlog,deleteBlog,updateBlog,anyUserDetail}