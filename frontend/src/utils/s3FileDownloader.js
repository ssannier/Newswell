// import axios from "axios";

// class S3FileDownloader {
//   constructor(bucketUrl) {
//     this.bucketUrl = bucketUrl;
//   }

//   async downloadFile(fileName) {
//     const url = `${this.bucketUrl}/${fileName}`;

//     try {
//       const response = await axios({
//         url,
//         method: "GET",
//         responseType: "blob", // Important for handling file downloads
//       });

//       // Create a blob link to download
//       const blob = new Blob([response.data], { type: response.headers["content-type"] });
//       const link = document.createElement("a");
//       link.href = window.URL.createObjectURL(blob);
//       link.download = fileName;

//       // Append to html link element page
//       document.body.appendChild(link);

//       // Start download
//       link.click();

//       // Clean up and remove the link
//       link.parentNode.removeChild(link);

//       return true; // Download successful
//     } catch (error) {
//       console.error("Download failed", error);
//       throw error; // Rethrow the error for the caller to handle
//     }
//   }

//   async getFileUrl(fileName) {
//     return `${this.bucketUrl}/${fileName}`;
//   }
// }

// export default S3FileDownloader;
