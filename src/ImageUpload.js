import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { storage, db } from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";

function ImageUpload({ username }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        // complete function
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    
    <div className="imageupload">
      <input
        type="text"
        placeholder="Enter a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className='input-content'
      /><br/>
      <input type="file" onChange={handleChange}/>
      <br/>
      {image ? (
        <>
          <Button variant="contained" color="primary" onClick={handleUpload} style={{margin: '5px auto', width: '100%'}}>
            Upload
          </Button>
          <progress className="imageupload__progress" value={progress} max="100" />
        </>
      ) : (
        <p></p>
      )}
      
    </div>
  );
}

export default ImageUpload;
