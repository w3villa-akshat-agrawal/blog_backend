
const response = require("../../utils/response")
const subscriptionplan = require("../models/subscriptionplan")
const {subscriptionService, getPlanDetail }= require("../services/subscriptionService")

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

const userPlan = async (req,res,next)=>{
    userId = req.user.id
    try {
        const result = await getPlanDetail(userId)
        return (response(res,true,"all plans",result,200))
    } catch (error) {
        console.log(error)
        next(error)
    }
}
module.exports = {subscriptionController , userPlan}