const response = (message="success",data = {},code= 200,status = true)=>{
    return ({message,data,code,status})
}
module.exports = response;