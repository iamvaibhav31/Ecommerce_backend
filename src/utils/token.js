import jwt from "jsonwebtoken";


class Tokens{
  constructor(){
    this.option = {
      expires: new Date(
        Date.now() + process.env.COOKIES_EXPIRESIN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    }
  }
  genrateToken(data) {
    return jwt.sign(data, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRESIN,
    });
  }

  verifyToken(token){
    return jwt.verify(token, process.env.JWT_SECRET_KEY)
  }

  sendToken(user) {
    const token = user.getJwtToken();
  
    return {
      success: true,
      user,
      token,
      option:this.option
    };
  }

}

export default Tokens;
