const errorHandler = (err, req, res, next) => {
    // console.log(err, err.statusCode, err.message);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    return res.status(err.statusCode).json({
        success: false,
        // error: {name : err.name, path : err.path , message : err.message} ,
        message: err.message,
    });
};

export {
    errorHandler
}
