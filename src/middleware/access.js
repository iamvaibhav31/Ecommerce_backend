function  accessByUserType  (req,res,next) {
    req.userTypeAllowed = this
    next()
}


export {
    accessByUserType
}