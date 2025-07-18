
const response = require("../../utils/response")
const subscriptionService = require("../services/subscriptionService")

const subscriptionController = async (req,res,next)=>{
    userId = req.user.id
    data = req.body
    try {
        const result = await subscriptionService(userId,data)
        return (response(res,true,"plan subscribed",result,200))
    } catch (error) {
        console.log(error)
        next(error)
    }

}
module.exports = {subscriptionController}