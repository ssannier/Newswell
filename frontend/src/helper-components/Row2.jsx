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
          <EditableField
            id={id}
            field="title"
            multiline
            rows={4}
            placeholder="Example Julia Watson"
            displayText={(temp) => {
              return temp;
            }}
            sx={{ fontWeight: "600", fontFamily: "Playfair Display", fontSize: "34pt", lineHeight: "38pt" }}
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
            sx={{ fontWeight: "400", fontFamily: "Merriweather", fontSize: "10pt", lineHeight: "14pt" }}
          />
          <HoverText id={id} width={width} height={height} fontFamily="Merriweather" fontWeight="400" fontSize="10pt" lineHeight="14pt" />
          <EditableField
            id={id}
            field="linkToPage"
            placeholder="See full story in page 4"
            displayText={(temp) => {
              return temp;
            }}
            sx={{ fontWeight: "700", fontFamily: "Merriweather", fontSize: "10pt", lineHeight: "14pt", textTransform: "uppercase" }}
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
        <EditableField
          id={id}
          field="credits"
          placeholder=""
          displayText={(temp) => {
            return temp;
          }}
          // sx={{ fontSize: "16px", textAlign: "center", fontWeight: 500 }}
          sx={{
            fontFamily: "'Playfair Display'",
            fontweight: 400,
            textAlign: "end",
            fontSize: 12,
          }}
        />
      </Grid>
    </>
  );
};

export default Row2;
