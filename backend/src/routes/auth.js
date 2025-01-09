import express from "express";
import { register, signin } from "../controllers/authController.js";
import { validate } from "../middlewares/validate.js";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../validators/validationSchema.js";

const router = express.Router();

router.post("/register", validate(userRegistrationSchema), register);
router.post("/signin", validate(userLoginSchema), signin);

export default router;
