import ErrorHandles from "../utils/error.js";
import httpStatus from "http-status";
import {
  createNewUserService,
  isUserExist,
  userLoginService,
} from "../services/userServices.js";

const register = async (req, res, next) => {
  try {
    const created = await createNewUserService(req?.body);

    if (created?.success) {
      res.cookie("token", created?.token, created?.option);
      delete created["option"];
      return res.status(httpStatus.CREATED).json(created);
    } else {
      return next(new ErrorHandles(created?.message, 400));
    }
  } catch (error) {
    return next(new ErrorHandles(error?.message, 400));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req?.body;

    if (!email || !password) {
      return next(
        new ErrorHandles(
          "Email or Password cannot be empty",
          httpStatus.UNAUTHORIZED
        )
      );
    } else {
      const userData = await isUserExist({ email });

      if (userData?.success) {
        await userLoginService(
          { ...req?.body, userDetails: userData?.user },
          (err, result) => {
            if (err) {
              return next(
                new ErrorHandles(err?.message, httpStatus.UNAUTHORIZED)
              );
            } else {
              res.cookie("token", result?.token, result?.option);
              delete result["option"];
              return res.status(httpStatus.OK).json(result);
            }
          }
        );
      } else {
        return next(
          new ErrorHandles(userData?.message, httpStatus.UNAUTHORIZED)
        );
      }
    }
  } catch (error) {
    return next(new ErrorHandles(error?.message, 400));
  }
};

const logout = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    return res.status(httpStatus.OK).json({
      success: true,
      message: "Log Out Succesfully",
    });
  } catch (error) {
    return next(new ErrorHandles(error?.message, 400));
  }
};

export { register, login , logout };
