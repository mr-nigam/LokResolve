import { Router } from "express";

import {
    authenticateUser
} from "@lokresolve/utils";

import {
    loginUser,
    getMyProfile
} from "../controllers/auth.js";


const router = Router();


router.post("/login", loginUser);


router.use(authenticateUser);


router.get("/me", getMyProfile);


export default router;