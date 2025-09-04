import { Router } from "express";
import {
  validateEmail,
  validateLoginEmail,
  validateLoginMobile,
  validateMobile,
} from "../middlewares/validators.middleware.js";
import {
  getCurrentUser,
  loginViaEmail,
  loginViaMobile,
  logout,
  signUpEmail,
  signUpMobile,
} from "../controllers/auth.controller.js";
import auth from "../middlewares/auth.middleware.js";
import passport from "passport";
import generateToken from "../utils/token.utils.js";

const router = Router();

router.post("/signup/email", validateEmail, signUpEmail);
router.post("/signup/mobile", validateMobile, signUpMobile);

router.post("/login/email", validateLoginEmail, loginViaEmail);
router.post("/login/mobile", validateLoginMobile, loginViaMobile);

router.get("/google", (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
  })(req, res, next);
});
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}&provider=google`);
  }
);

router.get("/facebook", (req, res, next) => {
  passport.authenticate("facebook", { scope: ["email", "public_profile"] })(
    req,
    res,
    next
  );
});

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
  }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(
      `${process.env.FRONTEND_URL}?token=${token}&provider=facebook`
    );
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
  }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}&provider=github`);
  }
);

router.get("/me", auth, getCurrentUser);

router.post("/logout", auth, logout);

export default router;
