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

  const handleCreatePDF = async () => {
    const cleanedLayout = cleanLayoutForAPI(layout);
    if (cleanedLayout.missingFields.length > 0) {
      toast.error("PDF generation failed: Missing required fields.", {
        position: "bottom-right",
      });
    } else {
      await generateIDML();
      await downloadLayoutImages(layout, newsIds);

      toast.success("Check now", {
        position: "bottom-right",
      });
    }
  };
  const downloadLayoutImages = async (layout, newsIds) => {
    try {
      // Create an array of promises to fetch and download each image
      const downloadPromises = newsIds.map(async (newsId) => {
        const item = layout[newsId];
        if (item?.imageDesc?.startsWith("https://")) {
          try {
            // Fetch the image
            const response = await fetch(item.imageDesc, {
              mode: "cors",
              cache: "no-cache",
            });
            if (!response.ok) {
              throw new Error(`Failed to fetch image: ${response.statusText}`);
            }
            // Convert the response to a blob
            const blob = await response.blob();
            // Create a download link for the file
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${item.id}.jpg`; // Adjust extension if necessary
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url); // Clean up URL object after download
          } catch (error) {
            console.error(`Error downloading file for newsId ${newsId}:`, error);
          }
        }
      });

      // Wait for all download promises to complete
      await Promise.all(downloadPromises);
      console.log("All images downloaded successfully.");
    } catch (error) {
      console.error("Error downloading layout images:", error);
      throw error;
    }
  };
  const generateIDML = async () => {
    try {
      const fetchresponse = await fetch("https://nrcetz8fb3.execute-api.us-east-1.amazonaws.com/dev/idml-gen");
      if (fetchresponse.status === 200) {
        const data = await fetchresponse.json();
        return downloadFileFromS3(data.s3_presigned_url, "newspaper.idml"); // Return the S3 path
      } else {
        throw new Error("API call failed");
      }
    } catch (error) {
      console.error("Error generating IDML:", error);
      throw error;
    }
  };
  const downloadFileFromS3 = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      if (response.status === 200) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        throw new Error("Error downloading file");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
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
