import { google } from "googleapis";
import { getVideoDurationInSeconds } from "get-video-duration";
import fs from "fs";

const getDrive = async (clientEmail, privateKey) => {
    try {
        const credentials = {
            client_email: clientEmail,
            private_key: privateKey,
        };

        // Authenticate with the Google Drive API using credentials from the credentials.json file
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ["https://www.googleapis.com/auth/drive.file"],
        });

        const client = await auth.getClient();
        return google.drive({ version: "v3", auth: client });
    } catch (err) {
        console.log(err);
        return false;
    }
};

const createFolder = async (folderName, folderId, _drive) => {
    try {
        const drive = _drive;
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
        if (folderResponse) {
            console.log("Folder created successfully:", folderResponse.data);
            return folderResponse.data;
        } else {
            console.log("Failed to create folder:", folderResponse.data);
            return folderResponse.data;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
};

const deleteFolder = async (folderId, _drive) => {
    try {
        const drive = _drive;

        // Delete the folder
        await drive.files.delete({
            fileId: folderId,
        });
        console.log("Folder deleted successfully");
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

// Get the duration of the uploading video in seconds
const getDuration = async (filePath) => {
    try {
        const duration = await getVideoDurationInSeconds(filePath);
        return Math.round(duration);
    } catch (error) {
        console.log(error);
        throw "Not a video";
    }
};

// Function to upload video to drive
const uploadToDrive = async (drive, fileData, folderId) => {
    try {
        //Get video duration
        const duration = await getDuration(fileData.path);

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

        const finalResponse = {
            "responseData": response.data,
            "duration": duration,
        };

        console.log("File uploaded successfully:", finalResponse);
        return finalResponse;
    } catch (error) {
        console.log("Error uploading file to Google Drive:", error);
        throw error;
    }
};

// Calling uploadToDrive
const doUpload = async (file, folderId, clientEmail, privateKey) => {
    try {
        // Check if a file was uploaded
        if (!file) {
            return null;
        }

        const drive = await getDrive(clientEmail, privateKey);

        // Call the uploadToDrive function with the uploaded file
        const uploadedFile = await uploadToDrive(drive, file, folderId);

        // Delete the temporary file
        fs.unlinkSync(file.path);

        return uploadedFile;
    } catch (error) {
        console.error("Error handling file upload:", error);
        return null;
    }
};

export { getDrive, createFolder, deleteFolder, doUpload };
