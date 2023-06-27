import express from "express";
import { google } from "googleapis";
import fs from "fs";
import multer from "multer";
import { getVideoDurationInSeconds } from "get-video-duration";

const router = express.Router();

// Configure Multer to handle file uploads
const upload = multer({ dest: "uploads/" });

const getDrive = async () => {
    const credentials = {
        client_email: "sgnario-aid@sgnario-aid.iam.gserviceaccount.com",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCnzWyCX75JVaP5\nWh4tzgwq4M+ltZrLUruW/KrTvbQKtgfE8ujoAiIueSz9GrlHu3W70vikNL914gev\niOqNisQNGCR5TYk2JBqIgZf6Giphna1pOK+QBYEPkNl120YzmbCqiWSxiLQdPA2v\nr/UAVxFN9E5ok/XR5kogKeNpZ4DOAQ4fCHEVGz1AkFt3/eFPEliBHW9mLqP/xwnj\nvGz3xxnlP1KO5Kj87nBecCvuFMlptWoZsLBAcgkM9XJvSHLIctdG7d3RlH45yE5+\nWnWb+Nng97lQ65Vyb/8mz3G5MALlJXn3uHVXCc1ytJM6hVcuztSn0M9Qkai0+ALe\nUEg8IQunAgMBAAECggEABsIbxi5z/AEifwb1ozOiwtFWG57yUpEM9BpOCQQhbbMC\nIhkEb1+yn7uKp9D9OFng9oUbNYXYVjeZxqSVicjWd46K3YXVamRO20OY6t5F6bOP\niebaD0thdM6JK5l+vNJKTrwE3a+bTXgfNv23uOFI1aJqzAR1iJQlVSFKwvKDugg5\nHI9vR1nEDkgM+KoaPjuJki6afUc+yWdGsSvztJdhW6Zv4amkhCSrAMWSXkgY7gyU\nDcuQHdVzpAk4JOj9DD+oM4Dcz3q/7EjIsvWVwSAfjYbbZ0PYo02G7ECwQXPmPiUS\nCZf9cBEaQhYnDa1A9gKoi7VZDG8cLZDruwT0mO0zpQKBgQDeMmql3QCoH/GrcIeE\n1bbeNzTqpdCclnZ9fMfvUL02SregSa54ZTRaxGC48omd0PRqmH/ResNq/354DqPE\nL17v1L1F2eemdMGpFwJEBd7tggmTazqW7tSJpcub5hiZR1xdoNWnF30K7qZ8jjpR\nTms5InAU4F/jlVmsKsKrs7udPQKBgQDBVJVGRPNPulXsCzzbNHf2deyG5YoajVbw\nvcs7/MSMKnrweoEYgwzyTdIKyHuVTKp8oauqaJ2MyjeUMCLqg3pgeLr3FGC3eCSR\ni8jTGXvEWUPkax9srZZL90f381+Z6YC9a6/ur2vyQ514ywIr6zESP1B1Nb5kT/Ud\nPeN7qlAiswKBgQDEQqX+sTGmTujotDGPfDHVH9BGvoV/+krY1oHG+XrXXLHLC6nm\nwAW5cqG4WsqBMhLhoKetwRChDuGHa+7tF6Z0kmVIMIuzdIemMiOXL9RT1ztcEiej\nL3tdxasNnfT2VpjYPnrY5x9Uq600cXBDZs/AnJGBbxpjbATT1MU0YkICRQKBgQCe\nXiBNyKubcuNxkZ8PXcKrRNw1gJCJwaAnYwG5qQyEWUQN+/wGTUvsrOzTYnlByuSZ\nZYIO/NWagAfZPzlK69rybdOSFMJJaIRkKaKfsm9dX1YrJck/KE9G+VCd/2If3VRV\nVoJuvoppkRPM4FduDKJM9Up+SUEmQQ1kH89Z/SDZ2wKBgQDSrfH5Jq5Jt9LEPFKN\nL7gtOYuhBLRewMTpw/jPpXS8Rg1FWDzeV50zs/S/AUUNuNPW4z1CTLM3Q8YpGz7p\nLpXZPCyAythCMFuhwajAeJdEIR9wEoXFvUp+ofC8eJDgtBKDmzvtlGaUpzXrPs6j\nt96gAAh5L200a8XEaF+FFw1WbA==\n-----END PRIVATE KEY-----\n",
    };
    // Authenticate with the Google Drive API using credentials from the credentials.json file
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const client = await auth.getClient();
    return google.drive({ version: "v3", auth: client });
};

const getDuration = async (filePath) => {
    try {
        const duration = await getVideoDurationInSeconds(filePath);
        return Math.round(duration);
    } catch (error) {
        throw error;
    }
};

// Route to handle file uploads
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const {
            file,
            body: { folderId },
        } = req;

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

                //Get video duration
                const duration = await getDuration(fileData.path);
                console.log(duration); //Add to DB

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

router.post("/delete", async (req, res) => {
    try {
        const { fileId } = req.body;

        const drive = await getDrive();
        // Delete the folder/file
        await drive.files.delete({
            fileId: fileId,
        });
        console.log( fileId + " deleted successfully");
        res.status(200).json({
            message: fileId + " deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ message: "Failed to delete file"});
    }
});


export { router as uploadRouter };
