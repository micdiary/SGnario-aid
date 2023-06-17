import express from "express";
import { google } from "googleapis";
import fs from "fs";
import multer from "multer";

const router = express.Router();

// Configure Multer to handle file uploads
const upload = multer({ dest: "uploads/" });

const getDrive = async () => {
    const credentials = {
        client_email: "Client Email Here",
        private_key: "Private key here",
    };
    // Authenticate with the Google Drive API using credentials from the credentials.json file
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const client = await auth.getClient();
    return google.drive({ version: "v3", auth: client });
};

// Route to handle file uploads
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const { file, body: {folderId} } = req;

        // Check if a file was uploaded
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const drive = await getDrive();

        // Define the uploadToDrive function
        const uploadToDrive = async (fileData, folderId) => {
            try {
                // Create a file metadata object
                const fileMetadata = {
                    name: fileData.originalname,
                    parents: [folderId],
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
        const uploadedFile = await uploadToDrive(file, folderId);

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

router.post("/createFolder", async (req, res) => {
    try {
        const { folderName, folderId } = req.body;

        const drive = await getDrive();

        // Create a folder metadata object
        const folderMetadata = {
            name: folderName,
            mimeType: "application/vnd.google-apps.folder",
            parents: [folderId],
        };

        // Create the folder
        const folderResponse = await drive.files.create({
            requestBody: folderMetadata,
        });

        console.log("Folder created successfully:", folderResponse.data);

        const newFolderId = folderResponse.data.id;

        res.status(200).json({
            message: "Folder created successfully",
            folderId: newFolderId,
        });
    } catch (error) {
        console.error("Error creating folder:", error);
        res.status(500).json({ message: "Failed to create folder" });
    }
});

export { router as uploadRouter };
