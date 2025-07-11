const response = (success = true,message="success",data = {},code= 200,status = true)=>{
    return ({success ,message,data,code,status})
}
module.exports = response;