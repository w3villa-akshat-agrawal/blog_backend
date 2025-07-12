const response = require("../../utils/response")
const { adminService } = require("../services/adminServices")


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

module.exports = {adminPage}