import React, { useContext, useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { Context, fetchImageUrl } from "../App";

const Masthead = () => {
  const [layout, setLayout] = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    setLoading(true);
    fetchImageUrl(layout.mastheadId, function (response) {
      setLoading(false);
      setImageUrl(response);
      setLayout((prev) => ({
        ...prev,
        masthead: response,
      }));
    });
  }, [layout?.mastheadId]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt="Masthead"
          style={{
            width: "80%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      ) : (
        <ImageIcon sx={{ color: "#9e9e9e", fontSize: 50 }} />
      )}
    </Box>
  );
};

export default Masthead;
