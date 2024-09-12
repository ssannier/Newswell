import React, { useContext, useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { Context, fetchImageUrl } from "../App";

const QRUpload = () => {
  const [layout, setLayout] = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    setLoading(true);
    fetchImageUrl(layout.qrCode, function (response) {
      setLoading(false);
      setImageUrl(response);
      setLayout((prev) => ({
        ...prev,
        qrCodeImage: response,
      }));
    });
  }, [layout?.qrCode]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // border: "1px dashed #9e9e9e",
        // borderRadius: "8px",,
        backgroundColor: "#f5f5f5",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt="Uploaded QR"
          style={{
            width: "100%",
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

export default QRUpload;
