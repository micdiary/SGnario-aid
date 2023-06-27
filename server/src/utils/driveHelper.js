import { google } from "googleapis";

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

        console.log("Folder created successfully:", folderResponse.data);
        return folderResponse.data;
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

export { getDrive, createFolder, deleteFolder };

// router.post("/createFolder", async (req, res) => {
//     try {
//         const { folderName, folderId } = req.body;

//         const drive = await getDrive();

//         // Create a folder metadata object
//         const folderMetadata = {
//             name: folderName,
//             mimeType: "application/vnd.google-apps.folder",
//             parents: [folderId],
//         };

//         // Create the folder
//         const folderResponse = await drive.files.create({
//             requestBody: folderMetadata,
//         });

//         console.log("Folder created successfully:", folderResponse.data);

//         const newFolderId = folderResponse.data.id;

//         res.status(200).json({
//             message: "Folder created successfully",
//             folderId: newFolderId,
//         });
//     } catch (error) {
//         console.error("Error creating folder:", error);
//         res.status(500).json({ message: "Failed to create folder" });
//     }
// });

// router.post("/deleteFolder", async (req, res) => {
//     try {
//         const { folderId } = req.body;

//         const drive = await getDrive();
//         // Delete the folder
//         await drive.files.delete({
//             fileId: folderId,
//         });
//         console.log("Folder deleted successfully");
//         res.status(200).json({
//             message: "Folder deleted successfully",
//         });
//     } catch (error) {
//         console.error("Error deleting folder:", error);
//         res.status(500).json({ message: "Failed to delete folder" });
//     }
// });
