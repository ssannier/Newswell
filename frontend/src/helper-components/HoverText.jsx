import React, { useContext, useEffect, useState } from "react";
import { Container, Grid, Typography, Paper, Box, Tooltip, Fade, IconButton, Button, CircularProgress, Divider, TextField, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { styled } from "@mui/system";
import { Context } from "../App";
import { getNews } from "../components/GenerateNews";

const env = import.meta.env;

const OverlayBox = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "flex-start",
  backgroundColor: "white",
  "&:hover .overlay": {
    opacity: 1,
    zIndex: 1, // Ensure it's above other elements
  },
}));

const Overlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0,
  transition: "opacity 0.3s",
  zIndex: -1, // Default z-index to ensure it only shows on hover
}));
const TextBox = styled(Typography)(({ theme }) => ({
  position: "absolute",
  color: "#000",
  cursor: "pointer",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  color: "#fff",
  borderColor: "#fff",
}));
const HoverText = ({ id, width, height, fontFamily, fontWeight, fontSize, lineHeight}) => {
  const [loading, setLoading] = useState(false);
  const [layout, setLayout] = useContext(Context);
  const handleEdit = () => {
    setLayout((prev) => {
      return { ...prev, selectedTextbox: id };
    });
  };
  const handleRegenerate = () => {
    setLayout((prev) => {
      return { ...prev, [id]: { ...prev[id] } };
    });
    setLoading(true);
    getNews(layout[id]?.body, layout[id]?.maxLimit, "", function (res) {
      setLayout((prev) => {
        setLoading(false);
        return {
          ...prev,
          selectedTextbox: id,
          [id]: {
            ...prev[id],
            body: res,
            // loading: false,
          },
        };
      });
    });
  };
  return (
    <OverlayBox
      sx={{
        width: width,
        height: height,
        boxShadow: id === layout.selectedTextbox ? "0px 3px 3px -2px #abd8de, 0px 3px 4px 0px rgb(176 224 230), 0px 1px 8px 0px rgb(176 224 230)" : "none",
      }}
    >
      <TextBox sx={{ height: "100%", width: "100%", fontSize: layout[id].body ? "1rem" : "1rem"}} fontFamily={fontFamily}
        fontWeight={fontWeight}
        fontSize={fontSize}
        lineHeight={lineHeight} >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress />
          </Box>
        ) : (
          layout[id].body || "Click to add text"
        )}
      </TextBox>
      <Overlay className="overlay">
        <StyledButton variant="text" onClick={handleEdit} startIcon={<EditIcon />}>
          Edit
        </StyledButton>
        <StyledButton variant="text" onClick={handleRegenerate} startIcon={<AutorenewIcon />}>
          Regenerate
        </StyledButton>
      </Overlay>
    </OverlayBox>
  );
};
export default HoverText;
