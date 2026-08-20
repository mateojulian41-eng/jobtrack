const jwt = require("jsonwebtoken");

function authenticate(request, response, next) {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    return response.status(401).json({
      status: "error",
      message: "Authentication token is required",
    });
  }

  const [type, token] = authorizationHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return response.status(401).json({
      status: "error",
      message: "Invalid authentication format",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    request.user = {
      id: decodedToken.userId,
      email: decodedToken.email,
    };

    return next();
  } catch (error) {
    return response.status(401).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }
}

module.exports = {
  authenticate,
};