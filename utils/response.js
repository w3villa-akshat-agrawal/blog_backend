const response = (res, success = true, message = "Success", data = {}, code = 200) => {
  return res.status(code).json({
    success,
    message,
    data,
    code,
    status: success,
  });
};

module.exports = response;
