import React, { useState } from "react";
import VideoPlayer from '../components/youtube';

const Home = () => {
  const videoIds = ['WVjEwrD1224', 'Z5t6Rcqf5aM', '6M9D7WvQTuQ', 'F54BBGFf75U', 'FZeiTvgRXrc', 'TcObb0nmBEA'];
  const [selectedVideoId, setSelectedVideoId] = useState(videoIds[0]);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleVideoChange = (videoId) => {
    setSelectedVideoId(videoId);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folderId", "1DFxwmy2wYp_HYMdgQO0EwtteWimvn8QZ");
      console.log(formData);
      console.log(selectedFile);
      console.log(formData.get("file"));
      fetch('http://localhost:3001/upload/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
            console.log("File id is: " + response.id);
          if (response.ok) {
            console.log('File uploaded successfully');
          } else {
            console.error('Failed to upload file');
          }
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    } else {
      console.error('No file selected');
    }
  };

    const handleFolderCreation = () => {
      const folderName = document.getElementById("folderName").value;
      const folderId = "1DFxwmy2wYp_HYMdgQO0EwtteWimvn8QZ";
      console.log(folderName);
      if (folderName !== "") {
        fetch("http://localhost:3001/upload/createFolder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folderName, folderId}),
        })
          .then((response) => {
            if (response.ok) {
              console.log("Folder created successfully");
            } else {
              console.error("Failed to create folder");
            }
          })
          .catch((error) => {
            console.error("Error creating folder:", folderName);
          });
      } else {
        console.error("No folder name entered");
      }
    };

  return (
    <div>
      <div>Welcome to SGnario-Aid</div>
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: '10px' }}>
          <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
            {videoIds.map((videoId) => (
              <li key={videoId}>
                <button className={selectedVideoId === videoId ? 'selected' : ''} onClick={() => handleVideoChange(videoId)}>
                  Scenario {videoIds.indexOf(videoId) + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <VideoPlayer videoId={selectedVideoId} />
      </div>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        <br></br>
        <input type="text" id="folderName"/>
        <button onClick={handleFolderCreation}>Create Folder</button>
      </div>
    </div>
  );
};

export default Home;