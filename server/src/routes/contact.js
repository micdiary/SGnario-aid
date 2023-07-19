import express from "express";
import nodemailer from "nodemailer";

import {
    EMAIL_NAME,
    EMAIL_USER,
    EMAIL_PASS,
    INTERNAL_SERVER_ERROR,
} from "../constants.js";

const router = express.Router();

// Contact Us Email
router.post("/", async (req, res) => {
    const { name, email, category, message } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS,
            },
        });

        const reporter = name ? name : "Anonymous";
        const reporterEmail = email ? email : "Anonymous";
        const emailBody = `Reported By: ${reporter}<br>Email: ${reporterEmail}<br><br>${message}`;

        const mailOptions = {
            from: {
                name: EMAIL_NAME,
                address: EMAIL_USER,
            },
            to: EMAIL_USER,
            subject: category,
            html: emailBody,
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                res.status(500).json({ error: "Failed to send reset email" });
            } else {
                res.status(200).json({ message: "Reset email sent" });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
});

export { router as contactRouter };
