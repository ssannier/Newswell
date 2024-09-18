import React, { createContext, useState } from "react";
import { AppBar, Toolbar, Typography, Grid, Button, Box, Paper, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";
import ReplayIcon from "@mui/icons-material/Replay";
import NewspaperLayout from "./NewspaperLayout";
import GenerateNews from "./GenerateNews";
import { useContext } from "react";
import { cleanLayoutForAPI, Context, initializeLayout, newsIds } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "react-toastify/dist/ReactToastify.css";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import downloadGif from "../assets/download.gif"; // Import your GIF
import successGif from "../assets/success.gif"; // Import your GIF

// Assuming you're using react-toastify for toast notifications
const StyledAppBar = styled(AppBar)({
  backgroundColor: "white",
  boxShadow: "none",
});
const Logo = styled(Typography)({
  color: "#FFA500",
  fontWeight: "bold",
});
const ContentArea = styled(Box)({
  backgroundColor: "#B0E0E6",
  padding: "20px",
  minHeight: "calc(100vh - 64px)", // Subtract AppBar height
});
const WhiteBox = styled(Paper)({
  backgroundColor: "white",
  borderRadius: "8px",
  // padding: "20px",
  // marginBottom: "20px",
  height: "100%",
});
const ActionButton = styled(Button)({
  textTransform: "none",
});
const env = import.meta.env;

const AppLayout = ({ layoutLoading }) => {
  const [layout, setLayout, undo, redo] = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [openResetDialog, setOpenResetDialog] = useState(false);

  const handleOpenResetDialog = () => {
    setOpenResetDialog(true);
  };

  const handleCloseResetDialog = () => {
    setOpenResetDialog(false);
  };

  const handleReset = () => {
    setLayout(initializeLayout());
    handleCloseResetDialog();
  };

  const handleSave = async () => {
    setLoading(true);
    const cleanLayout = cleanLayoutForAPI(layout);

    try {
      const res = await axios.post(env.VITE_API_JSON_UPLOAD, cleanLayout.cleanedLayout, {
        mode: "cors",
        headers: {},
      });
      const message = res.data.body;
      toast.success("Newspaper Layout saved successfully", {
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Function to generate IDML and download both images and IDML in a zip
  const generateIDML = async (zip) => {
    try {
      const fetchresponse = await fetch(env.VITE_API_GET_IDML);
      if (fetchresponse.status === 200) {
        const data = await fetchresponse.json();
        const fileBlob = await downloadFileFromS3(data.s3_presigned_url);

        // Add the IDML file to the zip, specifying binary handling
        zip.file("newspaper.idml", fileBlob, { binary: true });
      } else {
        throw new Error("API call failed");
      }
    } catch (error) {
      console.error("Error generating IDML:", error);
      throw error;
    }
  };

  // Function to download the file from S3 and return it as a blob
  const downloadFileFromS3 = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl);
      if (response.status === 200) {
        return await response.blob(); // Return the blob, no need to trigger the download here
      } else {
        throw new Error("Error downloading file");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  };

  // Main function to create a zip with both images and the IDML file
  const handleCreatePDF = async () => {
    const cleanedLayout = cleanLayoutForAPI(layout);
    const numberOfImages = newsIds.length;
    const totalTasks = numberOfImages * 2 + 2; // Adjusting for tasks
    let progress = 0;
    let currentTask = "Starting PDF Generation...";

    const toastId = toast.info(
      <>
        <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
          <Typography variant="body2">{currentTask}</Typography>
          <LinearProgressWithLabel value={0} />
        </Box>
      </>,
      {
        position: "bottom-right",
        autoClose: false,
        icon: ({ theme, type }) => <img src={downloadGif} alt="Downloading..." width={24} height={24} style={{ marginRight: "8px" }} />,
        closeOnClick: false,
        draggable: false,
        progress: 0,
      }
    );

    const updateProgress = (increment, task) => {
      progress += increment;
      currentTask = task;

      toast.update(toastId, {
        render: (
          <>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body2">{currentTask}</Typography>
            </Box>
            <LinearProgressWithLabel value={progress} />
          </>
        ),

        // progress: progress / 100,
      });
    };

    if (cleanedLayout.missingFields.length > 0) {
      toast.error("PDF generation failed: Missing required fields.", {
        position: "bottom-right",
      });
    } else {
      const zip = new JSZip(); // Initialize the zip file
      // Step 1: Generate the IDML file and add it to the zip
      updateProgress(0, "Generating IDML...");
      await generateIDML(zip);
      updateProgress(6.25, "IDML generated successfully");
      // Step 2: Download and add images to the zip
      updateProgress(0, "Downloading images...");
      await downloadLayoutImages(layout, newsIds, zip, (progressIncrement) => {
        updateProgress(progressIncrement, `Downloading image ${Math.floor(progress / 12.5)} of ${newsIds.length}`);
      });
      // Step 3: Generate and download the zip
      updateProgress(0, "Zipping files...");

      const qrCodeBlob = await getImage(layout.qrCodeImage);
      zip.file(`${layout.qrCode}.jpg`, qrCodeBlob, { binary: true }); // Assuming PNG format

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "archive.zip");
      updateProgress(6.25, "Zipping completed");
      // Final step: Show success message once complete
      toast.update(toastId, {
        render: "Layout files downloaded successfully!",
        type: "success",
        autoClose: 5000,
        icon: ({ theme, type }) => <img src={successGif} alt="Downloaded" width={24} height={24} style={{ marginRight: "8px" }} />,
        progress: 100,
      });
    }
  };
  const downloadLayoutImages = async (layout, newsIds, zip, updateProgress) => {
    try {
      const downloadPromises = newsIds.map(async (newsId) => {
        const item = layout[newsId];

        if (item?.imageDesc) {
          if (typeof item.imageDesc === "string" && item.imageDesc.startsWith("https://")) {
            // Case 1: imageDesc is a URL
            try {
              const blob = await getImage(item.imageDesc);
              zip.file(`${item.id}.jpg`, blob, { binary: true }); // Add the image to the zip
              updateProgress(12.5); // Increment the progress
            } catch (error) {
              console.error(`Error downloading file for newsId ${newsId}:`, error);
            }
          } else if (item.imageDesc instanceof File) {
            // Case 2: imageDesc is a File object
            try {
              const fileBlob = item.imageDesc;
              zip.file(`${item.id}.jpg`, fileBlob, { binary: true }); // Add the file directly to the zip
              updateProgress(12.5); // Increment the progress
            } catch (error) {
              console.error(`Error adding file for newsId ${newsId}:`, error);
            }
          } else {
            console.warn(`Invalid imageDesc for newsId ${newsId}:`, item.imageDesc);
          }
        }
      });

      await Promise.all(downloadPromises);
      console.log("All images added to the zip successfully.");
    } catch (error) {
      console.error("Error downloading layout images:", error);
      throw error;
    }
  };
  const getImage = async (imageDesc, zip, updateProgress) => {
    const response = await fetch(imageDesc, { mode: "cors", cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    return await response.blob();
  };
  return (
    <>
      <StyledAppBar position="static">
        <Toolbar sx={{ alignItems: "flex-end" }}>
          <Typography variant="h5" gutterBottom sx={{ color: "#FFC627", fontWeight: "bold" }}>
            NEWS
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ color: "#4AB7C4", fontWeight: "bold" }}>
            WELL
          </Typography>
        </Toolbar>
      </StyledAppBar>
      <ContentArea>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <WhiteBox sx={{ height: "100%" }}>
              {layoutLoading ? (
                <>
                  <Box sx={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center", display: "flex" }}>
                    <CircularProgress size={60} />
                  </Box>
                </>
              ) : (
                <NewspaperLayout />
              )}
            </WhiteBox>
          </Grid>
          <Grid item xs={12} md={4}>
            <GenerateNews currentText={currentText} setCurrentText={setCurrentText} />
            <div style={{ height: "1px", backgroundColor: "black", margin: "0rem 4rem" }}></div>
            <Box mt={2} sx={{ display: "flex", justifyContent: "center" }}>
              <Button variant="outlined" startIcon={<ReplayIcon />} onClick={undo}>
                Undo
              </Button>
              <div style={{ borderRight: "1px solid", marginLeft: "1rem", marginRight: "1rem" }}></div>
              <Button onClick={handleOpenResetDialog} variant="outlined">
                Reset the canvas
              </Button>
            </Box>
            <div style={{ height: "1px", backgroundColor: "black", marginTop: "1rem" }}></div>
            <Box mt={2} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">
                Want to save the changes made so far? <br></br>Click on the save button
              </Typography>
              <ActionButton variant="contained" color="primary" onClick={handleSave} sx={{ mt: 1, backgroundColor: "#4682B4", "&:hover": { backgroundColor: "#357AE8" } }}>
                Save
              </ActionButton>
            </Box>
            <div style={{ height: "1px", backgroundColor: "black", marginTop: "1rem" }}></div>
            <Box mt={2} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">Done with editing? Click on this button to generate the PDF</Typography>
              <ActionButton
                variant="contained"
                onClick={handleCreatePDF}
                sx={{
                  mt: 1,
                  backgroundColor: "#FFD700",
                  color: "black",
                  "&:hover": {
                    backgroundColor: "#FFC700",
                  },
                }}
              >
                Create PDF
              </ActionButton>
            </Box>
          </Grid>
        </Grid>
      </ContentArea>
      <Dialog open={openResetDialog} onClose={handleCloseResetDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Confirm Reset"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure you want to reset the canvas?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResetDialog} color="primary">
            Cancel
          </Button>
          <ActionButton variant="contained" color="primary" onClick={handleReset} sx={{ "&:hover": { backgroundColor: "#357AE8" } }}>
            Reset
          </ActionButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default AppLayout;
