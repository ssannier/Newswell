import React, { useContext, useEffect, useState } from "react";
import { Container, Grid, Typography, Paper, Box, Tooltip, Fade, IconButton, Button, CircularProgress, Divider, TextField, Stack } from "@mui/material";

import { Context } from "../App";
const env = import.meta.env;

const EditableField = ({ id, field, placeholder, displayText, editCanvas = false, sx, multiline = false, rows = 1, ...props }) => {
  const splitAndLowerCase = (str) => {
    return str
      .split(/(?=[A-Z])/)
      .join(" ")
      .toLowerCase();
  };

  const [layout, setLayout] = useContext(Context);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(editCanvas ? layout?.[field] || "" : layout?.[id]?.[field] || "");

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editCanvas) {
      setLayout((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else {
      setLayout((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: value,
        },
      }));
    }
    setIsEditing(false);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default behavior of Enter key
      handleSave();
    }
  };

  useEffect(() => {
    setValue(editCanvas ? layout?.[field] : layout?.[id]?.[field]);
  }, [editCanvas ? layout?.[field] : layout?.[id]?.[field]]);

  if (isEditing) {
    return (
      <div style={{ display: "flex", alignItems: "center"}}>
        <TextField value={value} onChange={handleChange} onKeyDown={handleKeyDown} placeholder={placeholder} multiline={multiline} rows={rows} size="small" fullWidth sx={{ mr: 1 }} />
        <Button variant="contained" onClick={handleSave} size="small">
          Save
        </Button>
      </div>
    );
  }

  return (
    <Tooltip title={`Click to edit ${splitAndLowerCase(field)}`} arrow>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", cursor: "pointer", ...sx }} {...props} onClick={handleClick}>
        {value ? displayText(value) : `Click to add ${splitAndLowerCase(field)}`}
      </Typography>
    </Tooltip>
  );
};

export default EditableField;
