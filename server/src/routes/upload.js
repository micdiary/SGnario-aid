import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";

import { SuperuserModel } from "../models/Superusers.js";
import { doUpload } from "../utils/driveHelper.js";
import { decrypt } from "../utils/cryptography.js";

import { INTERNAL_SERVER_ERROR } from "../constants.js";

const router = express.Router();

// Configure Multer to handle file uploads
const upload = multer({ dest: "uploads/" });

// Sample uploads for therapist to test their configurations
router.post("/test", upload.single("file"), async (req, res) => {
    try {
        const { token } = req.body;

        if (!req.file) {
            return res.status(404).json({ error: "No file uploaded" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decodedToken;

        // Get drive credentials
        const user = await SuperuserModel.findOne({ _id: id });
        const { clientEmail, privateKey, rootFolderId } = user;
        const decryptedPrivateKey = decrypt(privateKey);

        // Upload file
        const uploadDetails = await doUpload(
            req.file,
            rootFolderId,
            clientEmail,
            decryptedPrivateKey
        );

        if (!uploadDetails) {
            return res
                .status(400)
                .json({ error: "Only video files are accepted" });
        }

        return res.status(201).json({ message: "File uploaded successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: INTERNAL_SERVER_ERROR });
    }
});

export { router as uploadRouter };
