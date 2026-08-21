function notFound(request, response) {
  return response.status(404).json({
    status: "error",
    message: "Route not found",
  });
}

function errorHandler(error, request, response, next) {
  console.error(error);

  return response.status(error.statusCode || 500).json({
    status: "error",
    message: error.message || "Internal server error",
  });
}

module.exports = {
  notFound,
  errorHandler,
};
