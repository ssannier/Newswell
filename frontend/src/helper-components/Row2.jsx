import React, { useContext, useEffect, useState } from "react";
import { Container, Grid, Typography, Paper, Box, Tooltip, Fade, IconButton, Button, CircularProgress, Divider, TextField, Stack } from "@mui/material";

// import ImageUploader from "./ImageUploader";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import axios from "axios";
import ImageUploader from "./UploadImage";

import EditableField from "./EditableField";
import HoverText from "./HoverText";
import { Context } from "../App";
import { generateHeadline } from "../components/NewspaperLayout";
const Row2 = ({ id, width, height }) => {
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
      <Grid item xs={4} container spacing={2} direction="row" alignContent="flex-start">
        <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
          {/* <Typography variant="h5" sx={{ fontWeight: "600" }} onClick={handleGenerateHeadline} style={{ cursor: "pointer", flexGrow: 1 }}>
            {layout?.[id].title || "Click to generate headline"}
          </Typography> */}

          <EditableField
            id={id}
            field="title"
            multiline
            rows={4}
            placeholder="Example Julia Watson"
            displayText={(temp) => {
              return temp;
            }}
            sx={{ fontWeight: "600", fontSize: "1.5rem", lineHeight: "1.334" }}
          />
          <IconButton onClick={handleGenerateHeadline} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : <AutorenewIcon />}
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <EditableField
            id={id}
            field="author"
            placeholder="Example Julia Watson"
            displayText={(temp) => {
              return temp;
            }}
          />
          <HoverText id={id} width={width} height={height} />
          <EditableField
            id={id}
            field="linkToPage"
            placeholder="See full story in page 4"
            displayText={(temp) => {
              return temp;
            }}
          />
        </Grid>
      </Grid>
      <Grid item xs={8} sx={{ height: "100%" }}>
        <ImageUploader
          id={id}
          width={648}
          height={480}
          sx={{
            marginLeft: 2,
          }}
        />
        <EditableField
          id={id}
          field="imageSubtitle"
          placeholder="A short description of the image"
          displayText={(temp) => {
            return temp;
          }}
          sx={{ fontWeight: 400, fontSize: 12, margin: "8px 0px 8px 17px" }}
        />
      </Grid>
    </>
  );
};

export default Row2;
