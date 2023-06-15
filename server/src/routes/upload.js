import express from 'express';

import { google } from 'googleapis';
import fs from 'fs';



const router = express();


// Route to handle file uploads
router.post('/upload/api/upload', async (req, res) => {
	const credentials = require('./credentials.json');

    // Authenticate with the Google Drive API using credentials from the credentials.json file
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
    const drive = google.drive({ version: 'v3', auth });

    // Define the uploadToDrive function
    const uploadToDrive = async (fileData) => {
      try {
        // Create a file metadata object
        const fileMetadata = {
          name: fileData.name,
          parents: ["1s_cWpmb0--1JndRK6Q6bwrsYym5s9-L0"],
        };

        // Create the media upload object
        const media = {
          mimeType: fileData.type,
          body: fs.createReadStream(fileData.path), 
        };

        // Upload the file
        const response = await drive.files.create({
          requestBody: fileMetadata,
          media: media,
        });

        console.log('File uploaded successfully:', response.data);
        return response.data;   
      } catch (error) {
        console.error('Error uploading file to Google Drive:', error);
        throw error;
      }
    };

    const handleUpload = (req, res) => {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const file = req.files.file;

      uploadToDrive(file)
        .then(() => {
          res.status(200).json({ message: 'File uploaded successfully' });
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
          res.status(500).json({ message: 'Failed to upload file' });
        });
    };
});

export { router as uploadRouter };