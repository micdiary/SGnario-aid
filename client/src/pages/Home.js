import React, { useState } from "react";
import VideoPlayer from '../components/youtube';

import { Carousel } from 'antd';
import { Card } from 'antd';
const { Meta } = Card;

// css for intro
const styles = {
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  h1: {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "12px 0",
    wordWrap: "break-word",
  },
  p: {
    fontSize: "18px",
    margin: "12px 0",
    wordWrap: "break-word",
  },
};

// css for carousel
const contentStyle: React.CSSProperties = {
  height: '400px',
  width: '900px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
  margin: 'auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

// css for card
const cardStyle = {
  width: 370,
  marginBottom: 16,
};

const cardContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: 0,
};


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
          if (response.ok) {
            return response.json();
          } else {
            console.error('Failed to upload file');
          }
        })
        .then((data) => {
            console.log("File id is: " + data.fileId);
            console.log('File uploaded successfully');
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
        body: JSON.stringify({ folderName, folderId }),
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

  const handleFolderDeletion = () => {
    const fileId = document.getElementById("folderId").value;
    if (fileId !== "") {
      fetch("http://localhost:3001/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      })
        .then((response) => {
          if (response.ok) {
            console.log("file deleted successfully");
          } else {
            console.error("Failed to delete file");
          }
        })
        .catch((error) => {
          console.error("Error deleting file:", fileId);
        });
    }
  };

  return (
    <>
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
          <input type="text" id="folderName" />
          <button onClick={handleFolderCreation}>Create Folder</button>
          <br></br>
          <input type="text" id="folderId" />
          <button onClick={handleFolderDeletion}>Delete Folder</button>
        </div>
      </div>


      <br></br><br></br><br></br>

      <div style={styles.container}>
        <br />
        <h1>Welcome to SGnario-Aid</h1>
        <h2>The Simulated Scenario System</h2>

        <p style={styles.p}>Improve your social, interview, and speech skills by practicing real-life interactions with the free SGnario-Aid Simulated Scenario System. SGnario-Aid contains over 100 recorded video scenarios for you to work through. To learn more about this exciting system, visit the About page.</p>

        <p style={styles.p}>To begin using the simulated scenarios, please Register or Login to your free SGnario-Aid account and then navigate to the scenarios by the scenarios menu item.</p>
      </div>

      <div>
        <Carousel autoplay>
          <div>
            <img src={"https://asterius.federation.edu.au/scenariaid/images/teppssquare.png"} alt="Image 1" style={contentStyle} />
          </div>
          <div>
            <img src={"client/src/assets/logo.jpg"} alt="Image 2" style={contentStyle} />
          </div>
          <div>
            <img src={"https://asterius.federation.edu.au/scenariaid/templates/shape5_vertex/images/s5_logo.png"} alt="Image 3" style={contentStyle} />
          </div>
          <div>
            <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnk7ZsVLk1wx_-AkswB57_JJwi9SL1fBlHMA&usqp=CAU"} alt="Image 4" style={contentStyle} />
          </div>

        </Carousel>
      </div>

      <br></br><br></br><br></br><br></br>

      <div style={cardContainerStyle}>

        <Card
          hoverable
          style={cardStyle}
          cover={
            <img
              alt="example"
              src="https://www.nuhs.edu.sg/About-NUHS/careers/PublishingImages/Pages/Speech%20Therapist_Banner.jpg"
               style={{ height: '200px' }} 
            />
          }
        >
          <Meta
            title="What is Speech Therapy?"
            description={
              <div>
                <p>"Speech-language pathology is a healthcare field of expertise practiced globally. </p>
                <p>Speech-language pathology specializes in the evaluation, diagnosis, treatment, and prevention of communication disorders, cognitive-communication disorders, voice disorders, and swallowing disorder across the lifespan. </p>
              </div>
            }
          />
        </Card>

        <Card
          hoverable
          style={cardStyle}
          cover={<img 
            alt="example" 
            src="https://www.healthxchange.sg/sites/hexassets/Assets/children/speech-therapy-child-neurological-conditions-augmentative-alternative-communication.jpg"
            style={{ height: '200px' }} />}
        >
          <Meta
            title="What activities are done in speech therapy?"
            description={
              <div>
                <p>For children, speech therapy usually involves play, like sequencing activities or language-based board games. </p>
                <p>For adults, speech therapy is usually focused on improving or rebuilding particular skill sets like strengthening coordination between your brain and mouth. </p>
                <p>Some activities includes: </p>
                <ul>
                  <li>Tongue and mouth exercises</li>
                  <li>Facial movements</li>
                  <li>Reading out loud</li>
                  <li>Playing word games</li>
                </ul>
              </div>
            }
          />
        </Card>

        <Card hoverable
          style={cardStyle}
          cover={<img 
          alt="example" 
          src="https://t3.ftcdn.net/jpg/04/86/46/12/360_F_486461257_SM0fudzHMzXWsQEr7rAzazjTJyoriLHr.jpg" 
          style={{ height: '200px' }} />}>
          <Meta
            title="What are the benefits?"
            description={
              <div>
                <p>The goal of speech therapy is to improve skills that will allow you to communicate more effectively.</p>
                <p>Some Benefits includes: </p>
                <ul>
                  <li>Improvement in the ability to understand and express thoughts, ideas and feelings</li>
                  <li>Increased ability to problem-solve in an independent environment</li>
                  <li>Development of pre-literacy skills</li>
                  <li>Development of pre-literacy skills</li>
                  <li>Fluent speech</li>
                </ul>
              </div>
            }
          />
        </Card>

        <Card hoverable
          style={cardStyle}
          cover={<img 
          alt="example" 
          src="https://www.acerislaw.com/wp-content/uploads/2016/05/rate-of-success.jpg" 
          style={{ height: '200px' }} />}>
          <Meta
            title="Tips to Make Speech Therapy Successful"
            description={
              <div>
                <ul><li> Carryover
                  <ul>
                    <li>Carryover is a highly important aspect of speech therapy. The success of speech therapy depends significantly on the individual’s ability to receive additional practice time.</li>
                  </ul>
                </li></ul>
                <ul><li> Prioritizing Speech Therapy
                  <ul>
                    <li>Speech therapy can only be successful if it is made a priority. Taking breaks from speech therapy can result in regressing newly acquired skills and often will prolong the speech therapy progress.</li>
                  </ul>
                </li></ul>
                <ul><li> Positive Experience
                  <ul>
                    <li>Speech therapists work hard to ensure that speech therapy is a positive experience for all of the individuals they work with. When speech therapy is enjoyable, participation is more likely, and motivation to work and focus is increased.</li>
                  </ul>
                </li></ul>
              </div>
            }
          />
        </Card>

      </div>

    </>
  );
};

export default Home;