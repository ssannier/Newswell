import React from "react";
import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import ImageIcon from "@mui/icons-material/Image";

const NewsArticle = () => {
  const handleEditClick = () => {
    console.log("Edit option clicked");
  };

  const handleRegenerateClick = () => {
    console.log("Regenerate option clicked");
  };

  return (
    <Card sx={{ position: "relative" }}>
      <CardContent className="content">
        <Box display="flex" alignItems="center">
          <Box
            className="text-box"
            sx={{
              width: 150, // Adjust the width to make the box smaller
              height: 80, // Adjust the height as needed
              padding: 1,
              border: "1px solid #ccc",
              position: "relative",
              overflow: "hidden", // Ensure content fits within the box
              "&:hover": {
                backgroundColor: "lightgrey",
                color: "grey", // Ensure text color changes on hover
              },
              "&:hover .overlay": {
                display: "flex",
              },
            }}
          >
            <Typography variant="body2">
              {" "}
              {/* Change to 'body2' for smaller text */}
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
            </Typography>
            <Box
              className="overlay"
              sx={{
                display: "none",
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
              }}
            >
              <IconButton onClick={handleEditClick} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleRegenerateClick} color="primary">
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>
          <Box
            className="image-box"
            sx={{
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #ccc",
              marginLeft: 2,
            }}
          >
            <ImageIcon />
          </Box>
        </Box>
        <Typography variant="body2" color="textSecondary">
          See Page 5
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NewsArticle;
