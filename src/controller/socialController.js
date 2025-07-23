const response = require("../../utils/response")
const { followingService,getfollowingService,getfollowerService } = require("../services/socialServices")


const addFollowing = async (req,res,next) =>{
    try {
        userId = req.user.id
    userFollowingData = req.body
    console.log(req.body)
    const result = await followingService(userId,userFollowingData) 
    if(result){
        return (response(res,true,"add to following",result,200))
    }
    } catch (error) {
      console.log(error)
        next(error)
    }
    
}
const getFollowings = async(req,res,next)=>{
     let userId = req.user.id; 
     const id = req.query.ID
     console.log(id)
     if(id){
      userId = id
     }
    const search = req.query.search || "";           
    const page = parseInt(req.query.page) || 1;     
    const limit = parseInt(req.query.limit) || 10; 
  try {
    const following = await getfollowingService(search,page,limit,userId)
    return (response(res,true,"following data",following,200))
  } catch (error) {
    next(error)
  }
}


const getFollower = async(req,res,next)=>{
    let userId = req.user.id; 
     const id = req.query.ID
     console.log(id)
     if(id){
      userId = id
     }
     console.log(userId)
    const search = req.query.search || "";           
    const page = parseInt(req.query.page) || 1;     
    const limit = parseInt(req.query.limit) || 10; 
  try {
    const following = await getfollowerService(search,page,limit,userId)
    return (response(res,true,"follower data",following,200))
  } catch (error) {
    console.log(error)
    next(error)
  }
}


module.exports = {addFollowing,getFollowings,getFollower}