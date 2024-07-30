import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
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
  image: {
    type: String,
    required: false,
    default: "https://via.placeholder.com/150",
  },
  searchHistory: {
    type: Array,
    default: [],
  },
});

export const User=mongoose.model("User", userSchema);
