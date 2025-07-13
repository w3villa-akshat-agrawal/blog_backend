const response = require("../../utils/response")
const { adminService, blockingUser, unblockingUser } = require("../services/adminServices")


const adminPage = async(req,res,next)=>{
    const userId = req.user.id
    const search = req.query.search
    const page = req.query.page||1
    const limit = req.query.limit||10
try {
    const result = await adminService(userId,page,limit,search)
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