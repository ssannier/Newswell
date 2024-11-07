import React, { useContext, useEffect, useState } from "react";
import { TextField, Button, Box, Typography, Paper, IconButton, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import { Context } from "../App";
import { generateHeadline } from "./NewspaperLayout";
const env = import.meta.env;
const GenerateNews = () => {
  const [layout, setLayout] = useContext(Context);
  const selectedTextbox = layout?.selectedTextbox;
  const maxLimit = layout[selectedTextbox]?.maxLimit || 0;
  const [errorText, setErrorText] = useState("");
  const [editorMessage, setEditorMessage] = useState("");
  const [content, setContent] = useState(layout[selectedTextbox]?.body || "");
  const [loading, setLoading] = useState(false);
  const [headline, setHeadline] = useState("");

  useEffect(() => {
    setErrorText("");
    setEditorMessage("");
    setContent(layout[selectedTextbox]?.body || "");
  }, [layout, selectedTextbox]);

  const handleGetNews = () => {
    setLoading(true);
    getNews(content, maxLimit, editorMessage, async function (res) {
      setLoading(false);
      if (!layout?.[layout?.selectedTextbox]?.body && layout[layout?.selectedTextbox].headlineLimit > 0) {
        const success = await generateHeadline(content, layout?.[selectedTextbox]?.headlineLimit, selectedTextbox, function (response) {
          setHeadline(response);
        });
      } else {
        setHeadline("");
      }
      setContent(res);
    });
  };

  const handleUpdateClick = async () => {
    const charCount = content?.length;

    if (charCount <= maxLimit) {
      setLayout((prev) => {
        const updatedTextbox = {
          ...prev[prev.selectedTextbox],
          body: content,
        };

        if (headline) {
          updatedTextbox.title = headline;
        }

        return {
          ...prev,
          [prev.selectedTextbox]: updatedTextbox,
        };
      });

      setErrorText("");
    } else {
      setErrorText(`Maximum character count (${maxLimit}) exceeded. Current count: ${charCount}`);
    }
  };
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Paper sx={{ p: 4, maxWidth: "600px", width: "100%", borderRadius: 4, boxShadow: 3, backgroundColor: "#ffffff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <h2 style={{ fontSize: "16px", margin: 0 }}>
            Edit Text <span style={{ fontSize: "12px", fontWeight: "normal" }}>(Click on any text box on the left template to edit)</span>
          </h2>
          <button
            style={{
              backgroundColor: "#FFC627",
              color: "black",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              opacity: selectedTextbox ? 1 : 0.5,
              pointerEvents: selectedTextbox ? "auto" : "none",
            }}
            onClick={handleUpdateClick}
          >
            Update
          </button>
        </div>
        <Box
          sx={{
            position: "relative",
            border: "1px solid #ccc",
            borderRadius: 2,
            p: 2,
            mb: 2,
            minHeight: "150px",
            backgroundColor: selectedTextbox ? "#f9f9f9" : "#e0e0e0",
            overflowY: "auto",
            pointerEvents: selectedTextbox ? "auto" : "none",
          }}
        >
          <TextField
            variant="standard"
            fullWidth
            multiline
            rows={5}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            InputProps={{
              disableUnderline: true,
              style: { paddingRight: "40px" },
              readOnly: !selectedTextbox,
            }}
            helperText={content ? errorText || `Maximum ${maxLimit} characters allowed` : ""}
            error={!!errorText}
          />
          {selectedTextbox && (
            <IconButton color="primary" onClick={handleGetNews} sx={{ position: "absolute", bottom: "8px", right: "8px" }} disabled={loading}>
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <IconButton>
                  <RefreshIcon />
                </IconButton>
              )}
            </IconButton>
          )}
        </Box>
        <Typography variant="body2" sx={{ mb: 2, textAlign: "center", color: "gray" }}>
          The changes made to the text in the above box will automatically reflect on its respective text box on the left-side newspaper template.
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: 3, p: "2px 4px", mb: 2 }}>
          <TextField multiline maxRows={4} placeholder="Enter prompt here..." variant="outlined" value={editorMessage} onChange={(e) => setEditorMessage(e.target.value)} fullWidth disabled={!selectedTextbox || loading} sx={{ "& fieldset": { border: "none" } }} />
          <IconButton color="primary" onClick={handleGetNews} disabled={!selectedTextbox || loading}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default GenerateNews;

export const getNews = async (content, length, editorMessage, onSuccess) => {
  const request = {
    content: content,
    length: length,
    editor_message: editorMessage,
  };
  try {
    const res = await axios.post(env.VITE_API_ARTICLE_SUMMARY, request, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const message = res.data.body;
    if (onSuccess) {
      onSuccess(message);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
