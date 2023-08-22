const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { JWT_SECRET, JWT_REFRESH } = process.env;
let refreshTokens = [];

const generateToken = (user) => {
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "15m" });

  const refreshToken = jwt.sign(user, JWT_REFRESH);
  refreshTokens.push(refreshToken);

  return token;
};

const refreshToken = (token) => {
  const refreshToken = token;

  if (!refreshToken) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, JWT_REFRESH, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = generateToken({ id: user.id });
    return accessToken;
  });
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

const logout = (userToken) => {
  refreshTokens = refreshTokens.filter((token) => token !== userToken);
  res.sendStatus(204);
};

module.exports = {
  generateToken,
  refreshToken,
  authenticate,
  hashPassword,
  comparePasswords,
  logout,
};
