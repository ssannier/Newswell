import React, { memo, useEffect } from "react";
import AppLayout from "./components/AppLayout"; // Import the main layout component
import "./App.css"; // Import any global styles
import { useState, createContext } from "react";
import axios from "axios";
import { getDayOfWeek, getFormattedDate } from "./components/NewspaperLayout";
export const LayoutContext = createContext();
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import useHistoryState from "./utils/useHistoryState";

export const Context = React.createContext();
const env = import.meta.env;

const App = () => {
  const [layout, setLayout, undo, redo] = useHistoryState(initializeLayout());
  const [layoutLoading, setLayoutLoading] = useState(true);

  const fetchImageUrl = async (layoutId, id) => {
    try {
      const res = await axios.post(
        env.VITE_API_GET_IMAGE_URL,
        { id },
        {
          mode: "cors",
          headers: {},
        }
      );
      const response = res.data.body;
      setLayout((prev) => ({
        ...prev,
        [layoutId]: {
          ...prev[layoutId],
          imageDesc: response,
          loading: false,
        },
      }));
      return response;
    } catch (error) {
      console.error(`Error fetching image URL for id ${id}:`, error);
      return null;
    }
  };

  const fetchLayout = async () => {
    try {
      const res = await axios.get(env.VITE_API_GET_JSON, null, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // const layoutData = initializeLayout({
      //   header: "NEWSWELL",
      //   price: "$4.50 / 3.20",
      //   country: "USA / UK",
      //   banner: "MASTHEAD",
      //   date: "SEPTEMBER 4, 2024",
      //   day: "WEDNESDAY",
      //   issueNumber: "77",
      //   bannerSubtitle: "Your daily source for the latest and greatest in San Diego.",
      //   row1_1: {
      //     id: "27daf8af-b1d8-4f41-952f-6f53733c8c39",
      //     title: "",
      //     body: "Skateboarding Drew\nBryce Wettstein of Encinitas at Olympics, But Her Passions Run Deeper",
      //     linkToPage: "See Page 5",
      //     maxLimit: 108,
      //     author: "",
      //     headlineLimit: 0,
      //     image: "",
      //     imageSubtitle: "",
      //   },
      //   row1_2: {
      //     id: "87f1ac65-dbc7-45b7-8f27-9a2ad89091db",
      //     title: "",
      //     body: "SD County Taxpayers Association, Crediting\nCEO Hong with Growth, Extends His Tenure",
      //     linkToPage: "See Page 5",
      //     maxLimit: 108,
      //     author: "",
      //     headlineLimit: 0,
      //     image: "",
      //     imageSubtitle: "",
      //   },
      //   row1_3: {
      //     id: "aa5f0605-35d9-4c60-8ead-988853899ae0",
      //     title: "",
      //     body: "Public Meetings on\nTrash Collection and\nServices Under\nMeasure B to Begin\nMonday",
      //     linkToPage: "See Page 8",
      //     maxLimit: 108,
      //     author: "By Sarah Jones | The Times",
      //     headlineLimit: 0,
      //     image: "",
      //     imageSubtitle: "",
      //   },
      //   row2: {
      //     id: "d65b1082-e564-4b39-a6b3-3c846a1fc3fc",
      //     title: "Gas prices continue to drop locally and nationally",
      //     body: "The average price is 1.6 cents less than one week ago, 10.7 cents less than one month ago, and 40.3 cents less than one year ago, according to figures from the AAA and Oil Price Information Service. It has dropped $1.719 since rising to a record $6.435 on Oct. 5,\n2022. The national average price dropped for the eighth straight day. It is 3.2 cents less than one week ago. The national average price has dropped $1.542 since rising to a record $5.016 on June 14, 2022. The prices continue to fall steadily.",
      //     linkToPage: "Full story in page 4",
      //     maxLimit: 524,
      //     author: "By Jamie Watson | Etimes",
      //     headlineLimit: 34,
      //     image: "",
      //     imageSubtitle: "This aerial image captures a multi-lane highway interchange with steady traffic flow in both directions. Surrounding the roads are patches of greenery and a mix of industrial and natural landscapes. ",
      //   },
      //   row3: {
      //     id: "b23f6781-5663-4297-ac89-a8bda0846a52",
      //     title: "ALERTCalifornia images now available on Watch Duty app",
      //     body: "Watch Duty, the non-profit public safety information organization and app, has announced the addition of UC San Diego's ALERTCalifornia camera network to the platform, integrating the camera feeds directly into the Watch Duty map.",
      //     linkToPage: "More news on Page 2",
      //     maxLimit: 233,
      //     author: "By James Smith | The Times",
      //     headlineLimit: 57,
      //     image: "",
      //     imageSubtitle: "",
      //   },
      //   row4: {
      //     id: "9e97a4e6-a028-4d49-85ea-4abe279cbad9",
      //     title: "Time to Fill Up: San Diego County Gas Prices Drop Again",
      //     body: "The average price of a gallon of self-serve regular gasoline in San Diego County dropped 1.5 cents Saturday to $4.743. The average price is 5.2.",
      //     linkToPage: "More news on Page 2",
      //     maxLimit: 144,
      //     author: "By James Smith | The Times",
      //     headlineLimit: 57,
      //     image: "",
      //     imageSubtitle: "",
      //   },
      //   col1: {
      //     id: "1bd4298a-045a-4810-836c-22ffec624f4b",
      //     title: "Red Cross Seeking Donations to Meet Emergency Shortage",
      //     body: "The American Red Cross is seeking donations due to an emergency blood shortage exacerbated by dangerous heat levels during the end of vacation season. Since July 1, the Red Cross national blood supply has fallen by over 25% according to a news release from the Southern California Red Cross.",
      //     linkToPage: "More news on Page 2",
      //     maxLimit: 291,
      //     headlineLimit: 57,
      //     author: "By Jane Doe | The Times",
      //     image: "",
      //     imageSubtitle: "",
      //   },
      // });
      const layoutData = initializeLayout(res.data.body);
      if (layoutData) {
        for (const newsId of newsIds) {
          if (layoutData[newsId] && layoutData[newsId].id) {
            fetchImageUrl(newsId, layoutData[newsId].id);
            layoutData[newsId].loading = true;
          } else {
            layoutData[newsId].loading = false;
          }
        }
      }
      setLayout(layoutData);
    } catch (error) {
      setLayout(initializeLayout());
      console.error("Error fetching data:", error);
    } finally {
      setLayoutLoading(false);
    }
  };
  useEffect(() => {
    fetchLayout();
  }, []);

  return (
    <Context.Provider value={[layout, setLayout, undo, redo]}>
      <div className="App">
        <AppLayout layoutLoading={layoutLoading} />
        <ToastContainer />
      </div>
    </Context.Provider>
  );
};

export default memo(App);

export const blankLayout = {
  header: "NEWSWELL",
  price: "$4.50 / 3.20",
  country: "USA / UK",
  banner: "MASTHEAD",
  date: getFormattedDate(),
  day: getDayOfWeek(),
  issueNumber: "77",
  bannerSubtitle: "Your daily source for the latest and greatest in San Diego.",
  qrCode: "",
  mediaAddress: "",
  row1_1: {
    id: "",
    title: "",
    body: "",
    linkToPage: "",
    maxLimit: 108,
    author: "",
    headlineLimit: 0,
    imageSubtitle: "",
  },
  row1_2: {
    id: "",
    title: "",
    body: "",
    linkToPage: "",
    maxLimit: 108,
    author: "",
    imageSubtitle: "",
    headlineLimit: 0,
  },
  row1_3: {
    id: "",
    title: "",
    body: "",
    linkToPage: "",
    maxLimit: 108,
    author: "",
    imageSubtitle: "",
    headlineLimit: 0,
  },
  row2: {
    id: "",
    title: "",
    body: "",
    linkToPage: "",
    maxLimit: 524,
    author: "",
    imageSubtitle: "",
    headlineLimit: 34,
  },
  row3: {
    id: "",
    title: "",
    body: "",
    linkToPage: "",
    maxLimit: 233,
    author: "",
    headlineLimit: 57,
    imageSubtitle: "",
    loading: false,
  },
  row4: {
    id: "",
    title: "",
    body: "",
    linkToPage: "",
    maxLimit: 144,
    author: "",
    imageSubtitle: "",
    headlineLimit: 57,
  },
  col1: {
    id: "",
    title: "",
    body: "",
    linkToPage: "",
    maxLimit: 291,
    headlineLimit: 57,
    imageSubtitle: "",
    author: "",
  },
};

export const initializeLayout = (tLayout) => {
  let layout = structuredClone(tLayout || blankLayout);
  for (const newsId of newsIds) {
    layout = {
      ...layout,
      [newsId]: {
        ...layout[newsId],
        imageDesc: "",
        id: tLayout ? layout[newsId].id : "",
        loading: false,
      },
    };
  }
  layout = { ...layout, qrCode: tLayout?.qrCode || "", mediaAddress: tLayout?.mediaAddress || "", selectedTextbox: "" };

  return layout;
};
export const cleanLayoutForAPI = (layout) => {
  const cleanedLayout = structuredClone(layout);
  let missingFields = [];

  for (const newsId of newsIds) {
    if (cleanedLayout[newsId]) {
      // Remove imageDesc and loading properties
      delete cleanedLayout[newsId].imageDesc;
      delete cleanedLayout[newsId].loading;
      // Check if 'id' and 'body' fields are present and not empty
      if (!cleanedLayout[newsId].id || !cleanedLayout[newsId].body) {
        missingFields.push(newsId);
      }
      // If the newsId object is empty after removing properties, remove the entire object
      if (Object.keys(cleanedLayout[newsId]).length === 0) {
        delete cleanedLayout[newsId];
      }
    }
  }
  // Remove selectedTextbox property
  delete cleanedLayout.selectedTextbox;

  return { missingFields: missingFields, cleanedLayout: cleanedLayout };
};
export const newsIds = ["row1_1", "row1_2", "row1_3", "row2", "row3", "row4", "col1"];

// import React, { useState } from "react";
// function App() {
//   const [imageUrl, setImageUrl] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   // Function to fetch the presigned URL
//   const fetchPresignedUrl = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch("https://brm58cgoi8.execute-api.us-west-2.amazonaws.com/dev/file-upload", {
//         method: "GET",
//         // headers: {
//         //   'Content-Type': 'application/json',
//         // },
//         // body: JSON.stringify({ id: 'some_unique_id' }),  // Replace with your ID logic
//       });
//       if (!response.ok) {
//         throw new Error("Failed to fetch presigned URL");
//       }
//       const data = await response.json();
//       const presignedUrl = data.body.url;
//       setImageUrl(presignedUrl); // Store the presigned URL for upload
//     } catch (error) {
//       setError("Error fetching presigned URL");
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   // Function to handle the file selection
//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };
//   // Function to upload the image to S3
//   const uploadImageToS3 = async () => {
//     if (!selectedFile || !imageUrl) {
//       alert("Please select a file and fetch the presigned URL first!");
//       return;
//     }
//     try {
//       // Prepare the PUT request to upload the image to S3
//       const response = await fetch(imageUrl, {
//         method: "PUT",
//         headers: {
//           "Content-Type": selectedFile.type, // Ensure the Content-Type matches the file type
//         },
//         body: selectedFile, // Attach the file itself in the body
//       });
//       if (!response.ok) {
//         throw new Error("Failed to upload the image to S3");
//       }
//       alert("Image uploaded successfully to S3!");
//     } catch (error) {
//       setError("Error uploading image");
//       console.error("Error:", error);
//     }
//   };
//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Image Upload to S3 using Presigned URL</h1>
//         {/* Input to select a file */}
//         <input type="file" onChange={handleFileChange} />
//         {/* Button to fetch the presigned URL */}
//         <button onClick={fetchPresignedUrl} disabled={loading}>
//           {loading ? "Fetching URL..." : "Fetch S3 Presigned URL"}
//         </button>
//         {/* Button to upload the image */}
//         <button onClick={uploadImageToS3} disabled={!imageUrl || !selectedFile}>
//           Upload Image to S3
//         </button>
//         {/* Display error message if any */}
//         {error && <p style={{ color: "red" }}>{error}</p>}
//       </header>
//     </div>
//   );
// }
// export default App;
