import React, { useContext, useEffect, useState } from "react";
import { Container, Grid, Typography, Paper, Box, Tooltip, Fade, IconButton, Button, CircularProgress, Divider, TextField, Stack } from "@mui/material";

// import ImageUploader from "./ImageUploader";

import axios from "axios";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import EditableField from "./EditableField";
import HoverText from "./HoverText";
import ImageUploader from "./UploadImage";
import { Context } from "../App";
import { generateHeadline } from "../components/NewspaperLayout";
const Row4 = ({ id, width, height }) => {
  const [layout, setLayout] = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateHeadline = async () => {
    setIsLoading(true);
    const success = await generateHeadline(layout?.[id]?.body, layout?.[id]?.headlineLimit, id, function (response) {
      setLayout((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          title: response,
        },
      }));
    });
    setIsLoading(false);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ padding: "1rem 0" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6"
                sx={{
                  fontWeight: "400",
                  width: "fit-content",
                  fontFamily: "Bevan",
                  fontSize: "12pt",
                  color: "rgb(14,97,151)",
                  marginRight: "0.5rem", // Adds some space between the text and the divider
                }}
              >
                ECONOMICS
              </Typography>
              <Divider sx={{ flexGrow: 1 }} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "600", fontFamily:"Playfair Display", fontSize:"20pt" }} onClick={handleGenerateHeadline} style={{ cursor: "pointer", flexGrow: 1 }}>
              {layout?.[id].title || "Click to generate headline"}
            </Typography>
            <IconButton onClick={handleGenerateHeadline} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : <AutorenewIcon />}
            </IconButton>
          </Grid>

          <EditableField
            id={id}
            field="author"
            placeholder="Example Jane Smith"
            displayText={(temp) => {
              return temp;
            }}
          />

          <HoverText id={id} width={width} height={height} />

          {/* <EditableField
            id={id}
            field="linkToPage"
            placeholder="Example 2"
            displayText={(temp) => {
              return temp;
            }}
          /> */}
        </Grid>
        <Grid item xs={6}>
          <ImageUploader id={id} width={312} height={214.08} placeholder="Add Image" />
        </Grid>
      </Grid>
    </>
  );
};

export default Row4;
