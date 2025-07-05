const jwt = require ("jsonwebtoken")

const userToken = (payload, secret,expiresIn)=>{
    return jwt.sign(payload,secret,{expiresIn})
}
const tokenCheck = (token,secret)=>{
const result = jwt.verify(token,secret)
return result
}
module.exports = {userToken,tokenCheck};