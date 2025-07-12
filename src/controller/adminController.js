const response = require("../../utils/response")
const { adminService, blockingUser, unblockingUser } = require("../services/adminServices")


const adminPage = async(req,res,next)=>{
    userId = req.user.id
try {
    const result = await adminService(userId)
    return res.send(response(true,"adminPanneldetails",result,200,true))
} catch (error) {
    console.log(error)
    next(error)
}
}

const userBlock = async (req,res,next)=>{
   try {
     const userId = req.user.id;
     const userBlockId = req.params.id;
    const result = await blockingUser(userId,userBlockId)
    return (res.send(response(true,"userBlocked",{},200)))
   } catch (error) {
    console.log(error)
    next(error)
   }
}



const userUnBlock = async (req,res,next)=>{
   try {
     const userId = req.user.id;
     const userBlockId = req.params.id;
    const result = await unblockingUser(userId,userBlockId)
    return (res.send(response(true,"userUnBlocked",{},200)))
   } catch (error) {
    console.log(error)
    next(error)
   }
}


module.exports = {adminPage,userBlock,userUnBlock}