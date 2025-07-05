const bcrypt = require("bcrypt");

const hashedPassword = async (password) => {
  const hashed = await bcrypt.hash(password, 10);
  return hashed;
};
const comparingPassword = async (password,storePassword)=>{
  const isMatch = await bcrypt.compare(password, storePassword);
  return (isMatch)
}
module.exports = {hashedPassword,comparingPassword};

