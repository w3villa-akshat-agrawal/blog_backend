const response = require("../../utils/response")
const { followingService,getfollowingService,getfollowerService } = require("../services/socialServices")


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
const getFollowings = async(req,res,next)=>{
     const userId = req.user.id; 
    const search = req.query.search || "";           
    const page = parseInt(req.query.page) || 1;     
    const limit = parseInt(req.query.limit) || 10; 
  try {
    const following = await getfollowingService(search,page,limit,userId)
    return res.send(response(true,"following data",following,200,true))
  } catch (error) {
    next(error)
  }
}


const getFollower = async(req,res,next)=>{
     const userId = req.user.id; 
     console.log(userId)
    const search = req.query.search || "";           
    const page = parseInt(req.query.page) || 1;     
    const limit = parseInt(req.query.limit) || 10; 
  try {
    const following = await getfollowerService(search,page,limit,userId)
    return res.send(response(true,"follower data",following,200,true))
  } catch (error) {
    console.log(error)
    next(error)
  }
}


module.exports = {addFollowing,getFollowings,getFollower}