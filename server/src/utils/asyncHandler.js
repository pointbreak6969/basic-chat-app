// this handler is used to handle async functions in express routes
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
      Promise.resolve(
        requestHandler(req, res, next)).catch((error) => next(error))
      ;
    };
  };
  export { asyncHandler };
  