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
const Col1 = ({ id, width, height }) => {
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
      <Grid container item xs={12} direction="column" spacing={2}>
        <Grid item>
          <Paper elevation={0} sx={{ padding: "1rem 0" }}>
            <Typography sx={{ fontWeight: "bold", backgroundColor: "#FFFF00", width: "fit-content", fontSize: "20px" }}>CULTURE</Typography>
          </Paper>
          <Divider />
        </Grid>
        <Grid item>
          <ImageUploader id={id} width={312} height={216} placeholder="Add Image" />
        </Grid>
        <Grid item container direction="row">
          <Grid item xs={10}>
            <Typography variant="h6" sx={{ fontWeight: "600" }} onClick={handleGenerateHeadline} style={{ cursor: "pointer", flexGrow: 1 }}>
              {layout?.[id].title || "Click to generate headline"}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton onClick={handleGenerateHeadline} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : <AutorenewIcon />}
            </IconButton>
          </Grid>
        </Grid>
        <Grid item>
          <EditableField
            id={id}
            field="author"
            placeholder="Example Jane Smith"
            displayText={(temp) => {
              return temp;
            }}
          />
        </Grid>
        <Grid item>
          <HoverText id={id} width={width} height={height} />
        </Grid>
        <Grid item>
          <EditableField
            id={id}
            field="linkToPage"
            placeholder="Example 2"
            displayText={(temp) => {
              return temp;
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Col1;
