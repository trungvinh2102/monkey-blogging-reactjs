import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";

export default function useFirebaseImage(
  setValue,
  getValues,
  imageName = null,
  cb = null
) {
  // state
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState("");

  if (!setValue || !getValues) return;

  // handle select image in my file
  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setValue("image_name", file.name);
    handleUploadImage(file);
  };

  // handle upload image
  const handleUploadImage = (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressPercent =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercent);
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            console.log("");
        }
      },
      (error) => {
        console.log("Upload Image Error");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImage(downloadURL);
        });
      }
    );
  };

  // handle delete image
  const handleDeleteImage = () => {
    const storage = getStorage();
    const imageRef = ref(
      storage,
      "images/" + (imageName || getValues("image_name"))
    );
    deleteObject(imageRef)
      .then(() => {
        console.log("Delete Image Successfully");
        // Deleted the image successfully and then returned the original image
        setImage("");
        // Deleted the image successfully and then returned the progress 0%
        setProgress(0);
        // callback function
        cb && cb();
      })
      .catch((error) => {
        console.log("Delete Image Error");
      });
  };

  // handle reset upload image
  const handleResetUpload = () => {
    setImage("");
    setProgress(0);
  };

  // return
  return {
    image,
    setImage,
    progress,
    handleResetUpload,
    handleSelectImage,
    handleDeleteImage,
  };
}
