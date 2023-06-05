import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

import { UserModel } from "../models/Users.js";
import { SuperuserModel } from "../models/Superusers.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
    const { name, email, password, dob, gender, issue, therapist } = req.body;
    const user = await UserModel.findOne({ email: email });

    // Checking if user exists
    if (user) {
        return res.json({ message: "User already exists!" });
    }

    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({
        name: name,
        email: email,
        password: hashedPassword,
        role: "user",
        dob: dob,
        gender: gender,
        issue: issue,
        therapist: therapist,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
});

// Register new therapist/educator
router.post("/register-superuser", async (req, res) => {
    const { name, email, password, role, purpose, organisation } = req.body;
    const user = await SuperuserModel.findOne({ email: email });

    // Checking if user exists
    if (user) {
        return res.json({ message: "User already exists!" });
    }

    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new SuperuserModel({
        name: name,
        email: email,
        password: hashedPassword,
        role: role,
        purpose: purpose,
        organisation: organisation,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
});

// Login user
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });

    // Check if user exists
    if (!user) {
        return res.json({ message: "User doesn't exist!" });
    }

    // Check if credentials are valid
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.json({ message: "Email or password is incorrect" });
    }

    // Login user and return JWT token for cookie storage
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token: token, userID: user._id });
});

// Forgot password
// TODO to use jwt cookie instead of email for verification
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    const user = await UserModel.findOne({ email: email });

    // Check if user exists
    if (!user) {
        return res.json({ message: "User doesn't exist!" });
    }

    // Generate JWT token for password reset
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1200s",
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset",
        text: `Click the following link to reset your password: http:localhost:3000/reset-password/${token}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            res.status(500).json({ error: "Failed to send reset email" });
        } else {
            res.status(200).json({ message: "Reset email sent" });
        }
    });
});

// Reset Password
router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Verify JWT token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = decodedToken;

        // Hashing password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password
        const user = await UserModel.findOne({ email: email });
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password successfully resetted" });
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
});

// Get therapists
router.get("/therapists", async (req, res) => {
    const therapists = await SuperuserModel.find({ role: "therapist" });
    let therapistsNames = {};
    console.log(therapists);

    therapists.forEach((therapist) => {
        therapistsNames[therapist.email] = therapist.name;
    });

    res.status(200).json({ "therapists": therapistsNames });
});

export { router as userRouter };
