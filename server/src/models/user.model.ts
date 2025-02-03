import mongoose, { Document, Schema } from "mongoose";
import { compareValue, hashValue } from "../utils/bcryptjs";

interface UserPreferences {
  enable2FA: boolean;
  twoFactorSecret?: string;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  userPreferences: UserPreferences;
  comparePassword: (password: string) => Promise<boolean>;
}

const userPreferencesSchema = new Schema<UserPreferences>({
  enable2FA: {
    type: Boolean,
    default: false,
  },
  twoFactorSecret: {
    type: String,
    required: false,
  },
});

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userPreferences: {
      type: userPreferencesSchema,
      default: {}, // if not, this userPreferences field will not visible!
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashValue(this.password);
  }
  next();
});

userSchema.methods.comparePassword = async function (value: string) {
  return compareValue(value, this.password);
};

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
