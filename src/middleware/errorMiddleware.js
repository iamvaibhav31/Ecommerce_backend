const errorHandler = (err, req, res, next) => {
  console.log(
    "name :-",
    err.name,
    "\npath :-",
    err.path,
    "\nmessage :-",
    err.message,
    "\nstack :-",
    err.stack
  );
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  return res.status(err.statusCode).json({
    success: false,
    // error: {name : err.name, path : err.path , message : err.message} ,
    message: err.message,
  });
};

export { errorHandler };
