import express from "express";
import { google } from "googleapis";
import fs from "fs";
import multer from "multer";

const router = express.Router();

// Configure Multer to handle file uploads
const upload = multer({ dest: "uploads/" });

// Route to handle file uploads
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Authenticate with the Google Drive API using credentials from the credentials.json file
        const auth = new google.auth.GoogleAuth({
            keyFile: "./src/routes/credentials.json",
            scopes: ["https://www.googleapis.com/auth/drive.file"],
        });

        const client = await auth.getClient();
        const drive = google.drive({ version: "v3", auth: client });

        // Define the uploadToDrive function
        const uploadToDrive = async (fileData) => {
            try {
                // Create a file metadata object
                const fileMetadata = {
                    name: fileData.originalname,
                    parents: ["1s_cWpmb0--1JndRK6Q6bwrsYym5s9-L0"],
                };


                // Create the media upload object
                const media = {
                    mimeType: fileData.mimetype,
                    body: fs.createReadStream(fileData.path),
                };

                // Upload the file
                const response = await drive.files.create({
                    requestBody: fileMetadata,
                    media: media,
                    fields: "kind, id, name, mimeType, webViewLink",
                });

                // Append permissions to make it readable by everyone and editable by uploader
                await drive.permissions.create({
                    fileId: response.data.id,
                    requestBody: {
                        role: "reader",
                        type: "anyone",
                    },
                    supportsAllDrives: true,
                });

                console.log("File uploaded successfully:", response.data);
                return response.data;
            } catch (error) {
                console.error("Error uploading file to Google Drive:", error);
                throw error;
            }
        };

        // Call the uploadToDrive function with the uploaded file
        const file = req.file;
        const uploadedFile = await uploadToDrive(file);

        // Delete the temporary file
        fs.unlinkSync(file.path);

        res.status(200).json({
            message: "File uploaded successfully",
            fileId: uploadedFile.id,
        });
    } catch (error) {
        console.error("Error handling file upload:", error);
        res.status(500).json({ message: "Failed to upload file" });
    }
});

export { router as uploadRouter };
