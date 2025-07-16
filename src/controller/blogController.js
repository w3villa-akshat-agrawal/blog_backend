const response = require("../../utils/response")
const {blogCreateService,getAllBlogService,blogDelete, blogUpdate,desiredUserFetch, particularBlogServices} = require ("../services/blogServices.js")
const createBlog = async (req,res,next) => {
    try {
         const userId =req.user.id
         const result = await (blogCreateService(userId,req.body))
         if(result){
            return (response(res,true,"blog created successfully",{result},200))
         }
    } catch (error) {
        console.log(error)
        next(error)
    }

}
const allBlog = async(req,res,next)=>{
    userId = req.user.id
    try {
            const blogs  = await getAllBlogService(userId)
            return (response(res,true,"blogs fetch success",blogs,200))
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
                         return res.send(response(res,true,"blog deleted success",200))
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
        return res.send(response(res,true,"blog updated sucess",{},200))
    }
}
const anyUserDetail = async(req,res,next)=>{
   try {
         const desiredUserId = req.user.id
    const result = await desiredUserFetch(desiredUserId)
    if(result){
                return (response(res,true,"user fetched",result,200))
    }
   } catch (error) {
    next(error)
   }
}

const blogParticular = async (req,res,next)=>{
    const BlogId = req.params.id
    try {
        const result = await particularBlogServices(BlogId)
        if(res){
            return response(res,true,"blog sent",result,200)
        }
    } catch (error) {
        next(error)
    }
}
module.exports = {createBlog,allBlog,deleteBlog,updateBlog,anyUserDetail,blogParticular}