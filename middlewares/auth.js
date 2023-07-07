const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/UnauthorizedError");

//const extractBearerToken = (header) => header.replace("Bearer ", "");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return UnauthorizedError("Необходима авторизация");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, "super-strong-secret");
    req.user = payload;
  } catch (err) {
    throw UnauthorizedError("Необходима авторизация");
  }

  // req.user = payload;
  return next();
};
