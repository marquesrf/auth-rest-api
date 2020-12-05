// packages imports
import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

// mongoose User schema
const userSchema = Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    birthday: String,
    job: String,
  },
  { collection: "User" }
);

// 'pre' save user
userSchema.pre("save", function (next) {
  const user = this;

  // only hash password if it's new or has been modified
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (error, salt) {
      // handle error
      if (error) return next(error);

      // hash password using the new salt
      bcrypt.hash(user.password, salt, function (error, hash) {
        // handle error
        if (error) return next(error);

        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

// 'post' save user
userSchema.post("save", function (user, next) {
  next();
});

// compare password
userSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

// pass plugin to handle password hashing
userSchema.plugin(passportLocalMongoose);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
