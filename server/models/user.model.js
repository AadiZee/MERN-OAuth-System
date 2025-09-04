import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String },
    mobile: { type: String, unique: true, sparse: true, trim: true },
    name: { type: String, trim: true, maxLength: 100 },
    avatar: { type: String },
    providers: [
      {
        name: {
          type: String,
          enum: ["local", "mobile", "google", "facebook", "github"],
        },
        id: String,
      },
    ],
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: Date.now },
    role: { type: String, default: "User" },
  },
  { timestamps: true, autoIndex: true }
);

userSchema.index({ email: 1 });
userSchema.index({ mobile: 1 });
userSchema.index({ "providers.name": 1, "providers.id": 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false;

  return bcrypt.compare(password, this.password);
};

userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  return this.save();
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = model("User", userSchema);

export default User;
