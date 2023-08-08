const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { JWT_SECRET, JWT_REFRESH } = process.env;

const generateToken = (user) => {
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });
  return token;
};

const authenticate = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { id: decoded.id };
  } catch (err) {
    throw new Error("invalid token");
  }
};

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

const comparePasswords = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

module.exports = {
  generateToken,
  authenticate,
  hashPassword,
  comparePasswords,
};
