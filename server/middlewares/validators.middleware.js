import { body } from "express-validator";

const validateEmail = [
  body("email").isEmail().normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const validateMobile = [
  body("mobile").isEmail().normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const validateLoginEmail = [
  body("email").isEmail().normalizeEmail(),
  body("password").exists(),
];

const validateLoginMobile = [
  body("mobile").isMobilePhone(),
  body("password").exists(),
];

export {
  validateEmail,
  validateMobile,
  validateLoginEmail,
  validateLoginMobile,
};
