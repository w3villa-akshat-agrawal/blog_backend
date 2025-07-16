const response = require("../../utils/response")
const { commentCreate, fetchComments, commentDelete } = require("../services/commentServices")



const createComment = async (req, res, next) => {
    try {
        const userId = req.user.id
        const blogId = req.params.id
        const data = req.body
        console.log(userId,blogId,data)
        const result = await (commentCreate(blogId, userId, data))
        if (result) {
            return res.send(response(res,true,"comment done", result, 200))
        }
    } catch (error) {
        console.log(error)
        next(error)
    }

}


const getComments = async (req, res, next) => {
    try {
        const blogId = req.params.id
        const { page, limit } = req.query
        const result = await fetchComments(blogId, page, limit)
        if (result) {
            return res.send(response(true,"comments fetched success", result, 200, true))
        }

    } catch (error) {
        next(error)
    }

}


const deleteComment = async (req, res, next) => {
    try {
        comentId = req.params.id
        userId = req.user.id
        const result = await commentDelete(comentId, userId)
        if (result) {
            return res.send(true,"comment deleted", result, 200, true)
        }
        else {
            console.log("service problem")
        }
    } catch (error) {
        next(error)
    }
}



module.exports = { createComment, getComments, deleteComment }