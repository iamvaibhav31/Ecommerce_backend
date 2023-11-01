import { Router } from "express";
import { register ,login  , logout} from "../../controller/userControllers.js";

const usersRoutes = Router();

usersRoutes.post("/register", register);
usersRoutes.post("/login", login);
usersRoutes.get("/logout", logout);

export default usersRoutes
