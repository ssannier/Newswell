import React, { useContext, useEffect, useState } from "react";
import { Container, Grid, Typography, Paper, Box, Tooltip, Fade, IconButton, Button, CircularProgress, Divider, TextField, Stack } from "@mui/material";

// import ImageUploader from "./ImageUploader";

import axios from "axios";

import EditableField from "./EditableField";
import HoverText from "./HoverText";
import ImageUploader from "./UploadImage";

const env = import.meta.env;

const Row1 = ({ id, width, height}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
      <>
        <Stack>
          <HoverText id={id} height={height} width={width} fontFamily="Playfair Display"
          fontWeight="400"
          fontSize="12pt"
          lineHeight="14.4pt"/>
          <EditableField
            id={id}
            field="linkToPage"
            placeholder="See page 5"
            displayText={(temp) => {
              return temp;
            }}
            style={{
              fontFamily: "Playfair Display",
              fontWeight: "700", // Bold weight
              fontSize: "12pt",
              lineHeight: "14.4pt",
              textTransform: "uppercase", // All caps
            }}
          />
        </Stack>
      </>
      <ImageUploader
        id={id}
        width={156}
        height={156}
        sx={{
          marginLeft: 2,
        }}
      />
    </Box>
  );
};
export default Row1;
