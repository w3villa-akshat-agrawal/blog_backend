const response = require("../../utils/response")
const { followingService } = require("../services/socialServices")


const addFollowing = async (req,res,next) =>{
    try {
        userId = req.user.id
    userFollowingData = req.body
    const result = await followingService(userId,userFollowingData) 
    if(result){
        return res.send(response("add to following",result,200,true))
    }
    } catch (error) {
        next(error)
    }
    
}

module.exports = {addFollowing}