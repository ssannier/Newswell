import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";

const GenerateNews = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const extractMessage = (data) => {
    try {
      return data.message;
    } catch (error) {
      console.error("Error parsing message from data:", error);
      return "";
    }
  };

  const handleSendMessage = async () => {
    try {
      const res = await axios.get("https://mpb9f281282085983d26.free.beeceptor.com/generateNews", {
        headers: {
          "Content-Type": "application/json",
        },
        params: { prompt },
      });
      const message = extractMessage(res.data);
      setResponse(message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleRegenerate = async () => {
    try {
      const res = await axios.get("https://mpb9f281282085983d26.free.beeceptor.com/generateNews", {
        headers: {
          "Content-Type": "application/json",
        },
        params: { prompt },
      });
      const message = extractMessage(res.data);
      setResponse(message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#e0f7fa" }}>
      <Paper sx={{ p: 4, maxWidth: "600px", width: "100%", borderRadius: 4, boxShadow: 3, backgroundColor: "#ffffff" }}>
        <Typography variant="h5" sx={{ mb: 1, textAlign: "center", fontWeight: "bold" }}>
          Edit Text
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, textAlign: "center", color: "gray" }}>
          (Click on any text box on the left template to edit)
        </Typography>
        <Box sx={{ position: "relative", border: "1px solid #ccc", borderRadius: 2, p: 2, mb: 2, minHeight: "150px", backgroundColor: "#f9f9f9", overflowY: "auto" }}>
          <Typography variant="body1">{response || ""}</Typography>
          <IconButton color="primary" onClick={handleRegenerate} sx={{ position: "absolute", bottom: "8px", right: "8px" }}>
            <RefreshIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ mb: 2, textAlign: "center", color: "gray" }}>
          The changes made to the text on the above box will automatically reflect on its respective text box on the left side newspaper template.
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: 50, p: "2px 4px", mb: 2 }}>
          <TextField placeholder="Enter prompt here..." variant="outlined" value={prompt} onChange={(e) => setPrompt(e.target.value)} fullWidth sx={{ "& fieldset": { border: "none" } }} />
          <IconButton color="primary" onClick={handleSendMessage}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default GenerateNews;
