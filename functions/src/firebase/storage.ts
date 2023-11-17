import firebaseApp from "../config/firebase";
import "firebase/compat/storage";
// import Logger from "../services/logger";
import sharp from "sharp";

class Bucket {
  // private logger: Logger;
  private storage;
  private storageRef;

  constructor() {
    this.storage = firebaseApp.storage();
    // Create a storage reference from our storage service
    this.storageRef = this.storage.ref();

    // this.logger = new Logger("logs/app.log");
    console.log("info", "DB connection established");
  }

  public async uploadImage(ref: string, file: any, metaData: string): Promise<string> {
    const metadata = {
      contentType: metaData, // 'image/jpeg',
    };
  
    try {
      console.log("info", `Uploading image with reference: ${ref}`);
      const imageRef = this.storageRef.child(ref);
  
      const compressedImage = await sharp(file).resize({ height: 1920, width: 1080, fit: "contain" }).toBuffer();
  
      const snapshot = await imageRef.child(`${new Date().getTime()}`).put(compressedImage, metadata);
      const downloadURL = await snapshot.ref.getDownloadURL();
      console.log("Download URL:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.log("fatal", `Error occurred while uploading image with reference: ${ref}. Error: ${error.message}.`);
      throw error;
    }
  }

  public async deleteImageRef(ref: string): Promise<void> {
    try {
      console.log("info", `Deleting images with reference: ${ref}`);
      const imageRef = this.storageRef.child(ref);

      // await imageRef.delete();
      // Get the list of files in the images directory
      const fileNames = await imageRef.listAll();
      // Delete each file
      await Promise.all(
        fileNames.items.map((file) => {
          console.log("Deleting");
          return file.delete();
        })
      );
    } catch (error) {
      console.log("fatal", `Error occurred while uploading image with reference: ${ref}. Error: ${error.message}.`);
      throw error;
    }
  }

  public async deleteImage(url: string): Promise<void> {
    try {
      console.log("info", `Deleting image with url: ${url}`);
      const imageRef = this.storageRef.child(url);
      
      await imageRef.delete();
    } catch (error) {
      console.log("fatal", `Error occurred while deleting image with url: ${url}. Error: ${error.message}.`);
      throw error;
    }
    /**
     * 
     * const deleteFromFirebase = (url) => {
        //1.
        let pictureRef = storage.refFromURL(url);
      //2.
        pictureRef.delete()
          .then(() => {
            //3.
            setImages(allImages.filter((image) => image !== url));
            alert("Picture is deleted successfully!");
          })
          .catch((err) => {
            console.log(err);
          });
        };
     */
  }

}


export default Bucket;

