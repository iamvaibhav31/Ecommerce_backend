import { Router } from "express";
import {
  register,
  login,
  logout,
  forgotpassword,
  resetPassword,
} from "../../controller/userControllers.js";

const usersRoutes = Router();

usersRoutes.post("/register", register);
usersRoutes.post("/login", login);
usersRoutes.get("/logout", logout);
usersRoutes.get("/forgetpassword", forgotpassword);
usersRoutes.post("/resetPassword", resetPassword);

export default usersRoutes;
