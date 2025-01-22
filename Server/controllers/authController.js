import User from "../models/User.js";
import jwt from "jsonwebtoken";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const signup = async (req, res) => {
  const { name, email, password, age, gender, genderPreference } = req.body;
  try {
    if (!name || !email || !password || !age || !gender || !genderPreference) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all the fields" });
    }
    if (age < 18) {
      return res.status(400).json({
        success: false,
        message: "you must be 18 years or older to use this app",
      });
    }
    const newUser = await User.create({
      name,
      email,
      password,
      age,
      gender,
      genderPreference,
    });

    const token = signToken(newUser._id);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true, //prevents xss attacks
      sameSite: "strict", //prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("error in the sign up controller", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if(!email || !password){
            return res.status(400).json({success:false, message:"Please provide email and password"})
        }

        const user= await User.findOne({email}).select("+password");

        if(!user || !(await user.matchPassword(password))){
            return res.status(401).json({success:false, message:"Invalid email or password"})            
        }

        const token = signToken(user._id);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true, //prevents xss attacks
            sameSite: "strict", //prevent CSRF attacks
            secure: process.env.NODE_ENV === "production",
        });
        res.status(200).json({ success: true, user: user });

    } catch (error) {
        console.log("error in the log in controller", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
export const logout = async (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "Logged out successfully" });

};
