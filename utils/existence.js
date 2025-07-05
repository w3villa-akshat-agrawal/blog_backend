const checkExistence = async (model, condition) => {
  if (!model || typeof model.findOne !== "function") {
    throw new Error("Invalid Sequelize model passed");
  }

  const result = await model.findOne({ where: condition });
  return result;
};

module.exports = checkExistence;
