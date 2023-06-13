import express from "express";
import jwt, { verify } from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

import { UserModel } from "../models/Users.js";
import { SuperuserModel } from "../models/Superusers.js";
import { AdminModel } from "../models/Admins.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
    const { name, email, password, dob, gender, issue, therapist } = req.body;

    // Checking if user exists
    if (await userExists(email)) {
        return res.status(409).json({ message: "User already exists!" });
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

    // Checking if user exists
    if (await userExists(email)) {
        return res.status(409).json({ message: "User already exists!" });
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

router.post("/register-admin", async (req, res) => {
    const { name, email, password, dob, gender, issue, therapist } = req.body;

    // Checking if user exists
    if (await userExists(email)) {
        return res.status(409).json({ message: "User already exists!" });
    }

    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new AdminModel({
        name: name,
        email: email,
        password: hashedPassword,
        role: "admin",
    });

    await newUser.save();

    res.status(201).json({ message: "Admin registered successfully!" });
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });
    const superuser = await SuperuserModel.findOne({ email: email });
    const admin = await AdminModel.findOne({ email: email });

    let isPasswordValid;
    let id;
    let accountRole;
    // Check if user exists and
    // Check if credentials are valid
    if (!(await userExists(email))) {
        return res.status(404).json({ message: "User doesn't exists!" });
    } else if (user) {
        ({ isPasswordValid, id, accountRole } = await verifyAccount(
            user,
            password
        ));
    } else if (superuser) {
        ({ isPasswordValid, id, accountRole } = await verifyAccount(
            superuser,
            password
        ));
    } else if (admin) {
        ({ isPasswordValid, id, accountRole } = await verifyAccount(
            admin,
            password
        ));
    }

    if (!isPasswordValid) {
        return res
            .status(401)
            .json({ message: "Email or password is incorrect" });
    }

    // Login user and return JWT token for cookie storage
    const token = jwt.sign(
        { id: id, role: accountRole },
        process.env.JWT_SECRET
    );

    res.status(200).json({ token: token, userID: id });
});

// Forgot password
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    // Check if user exists
    if (!(await userExists(email))) {
        return res.status(404).json({ message: "User doesn't exist!" });
    }

    // Generate JWT token for password reset
    // Token expiry time: 20 minutes
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
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
        text: `Click the following link to reset your password: http:localhost:3000/reset-password?token=${resetToken}`,
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

        // Hashing password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        let user;
        if (decodedToken.email !== undefined) {
            // user was not logged in
            const { email } = decodedToken;
            const userFound = await UserModel.findOne({ email: email });
            const superuserFound = await SuperuserModel.findOne({
                email: email,
            });
            const adminFound = await AdminModel.findOne({});
            user = userFound || superuserFound || adminFound;
        } else {
            // user is logged in
            const { id, role } = decodedToken;
            if (role == "user") {
                user = await UserModel.findOne({ _id: id });
            } else if (role == "therapist" || role == "educator") {
                user = await SuperuserModel.findOne({ _id: id });
            } else if (role == "admin") {
                user = await AdminModel.findOne({ _id: id });
            }
        }

        // Update user password
        // const user = await UserModel.findOne({ email: email });
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
    let therapistsNames = [];
    console.log(therapists);

    therapists.forEach((therapist) => {
        therapistsNames[therapist.email] = therapist.name;
    });

    res.status(200).json({ "therapists": therapistsNames });
});

// Get User's Role
router.get("/role/:token", async (req, res) => {
    const token = req.params.token;

    try {
        // Verify token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id } = decodedToken;

        let user;
        const userFound = await UserModel.findOne({ _id: id });
        const superuserFound = await SuperuserModel.findOne({ _id: id });
        const adminFound = await AdminModel.findOne({ _id: id });

        user = userFound || superuserFound || adminFound;

        return res.status(201).json({ "role:": user.role });
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
});

/** Helper functions **/
// Login
async function verifyAccount(account, password) {
    const isPasswordValid = await bcrypt.compare(password, account.password);
    const { _id: id, role: accountRole } = account;
    return { isPasswordValid, id, accountRole };
}

// User Exists
async function userExists(email) {
    const user = await UserModel.findOne({ email: email });
    const superuser = await SuperuserModel.findOne({ email: email });
    const admin = await AdminModel.findOne({ email: email });
    if (user || superuser || admin) {
        return true;
    }
    return false;
}

export { router as authRouter };
