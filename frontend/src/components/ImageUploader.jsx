import React, { useState, useCallback, useContext, useEffect } from "react";
import { Box, Button, Slider, Typography, Popover, IconButton, CircularProgress } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import SaveIcon from "@mui/icons-material/Save";
import Cropper from "react-easy-crop";
import { Context } from "../App";
import { styled } from "@mui/material/styles";
import axios from "axios";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ImageUploader = ({ width = "100%", height = "100%", id, ...props }) => {
  const [layout, setLayout] = useContext(Context);
  const [selectedFile, setSelectedFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(2);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEdited, setIsEdited] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [file, setFile] = useState();

  useEffect(() => {
    // Check if there's an existing image in the layout
    if (layout[id] && layout[id].imageDesc) {
      setSelectedFile(layout[id].imageDesc);
      setCroppedImage(layout[id].imageDesc);
    }
  }, [layout, id]);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, or GIF)");
        return;
      }

      setIsSaving(true); // Add a loading state

      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result);
        setCroppedImage(null);
        setAnchorEl(event.currentTarget);
        setIsEdited(true);
        setIsSaving(false);
      };
      reader.onerror = () => {
        console.error("Error reading file");
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
      setFile(file);
    }
  }, []);

  const handleSave = useCallback(
    async (e) => {
      setIsSaving(true);
      const imageToUpload = croppedImage || selectedFile;
      let url = process.env.VITE_API_IMAGE_UPLOAD;
      if (layout[id].id) {
        url = process.env.VITE_API_IMAGE_REWRITE + `?id=${layout[id].id}`;
      }

      setLayout((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          imageDesc: imageToUpload,
        },
      }));

      try {
        let response;
        if (imageToUpload.startsWith("data:image")) {
          // It's a base64 image
          const base64data = imageToUpload.split(",")[1];
          response = await axios.post(url, base64data, { mode: "cors" });
        } else {
          // It's a URL, just save it as is
          response = { data: { id: layout[id].id } };
        }

        setLayout((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            id: layout[id].id || response.data.id,
          },
        }));

        setIsEdited(false);
        setAnchorEl(null);
      } catch (error) {
        console.error("Failed to save the image:", error);
      } finally {
        setIsSaving(false);
      }
    },
    [croppedImage, selectedFile, id, layout, setLayout]
  );

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
    setIsEdited(true); // Mark as edited
  }, []);

  const handleZoomChange = useCallback((_, newZoom) => {
    setZoom(newZoom);
    setIsEdited(true); // Mark as edited
    onCropComplete();
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(selectedFile, croppedAreaPixels);
      setCroppedImage(croppedImage);
      setAnchorEl(null);
      setIsEdited(true); // Mark as edited after cropping
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, selectedFile]);

  const getCroppedImg = (imageSrc, pixelCrop) => {
    const image = new Image();
    image.src = imageSrc;

    return new Promise((resolve) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

        resolve(canvas.toDataURL("image/jpeg"));
      };
    });
  };

  const resetImage = () => {
    setCroppedImage(null);
    // setZoom(1);
    // setCrop({ x: 0, y: 0 });
    setAnchorEl(null);
    setIsEdited(true); // Mark as edited after resetting
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <Box sx={{ width, height, cursor: "pointer", ...props.sx }}>
      {!selectedFile ? (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ECECEC",
            cursor: "pointer",
          }}
        >
          <VisuallyHiddenInput type="file" accept="image/*" id={`raised-button-file-${id}`} onChange={handleFileChange} />
          <label
            htmlFor={`raised-button-file-${id}`}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ImageIcon sx={{ fontSize: "2rem" }} />
          </label>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            {!croppedImage ? (
              <Cropper
                image={selectedFile}
                crop={crop}
                zoom={zoom}
                aspect={width / height}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={handleZoomChange}
                cropSize={{ width, height }}
                style={{
                  containerStyle: { width: "100%", height: "100%" },
                  cropAreaStyle: { width: "100%", height: "100%" },
                }}
              />
            ) : (
              <Box
                component="img"
                src={croppedImage}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}

            {isEdited && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                disabled={isSaving}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                  },
                }}
              >
                {isSaving ? <CircularProgress size={24} /> : <SaveIcon />}
              </IconButton>
            )}
          </Box>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Box
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
              }}
            >
              {!croppedImage && (
                <>
                  <Typography id={`zoom-slider-${id}`} gutterBottom>
                    Zoom
                  </Typography>
                  <Slider value={zoom} min={0.1} max={3} step={0.1} aria-labelledby={`zoom-slider-${id}`} onChange={handleZoomChange} sx={{ width: 200 }} />
                </>
              )}
              {!croppedImage ? (
                <>
                  {/* <Button onClick={showCroppedImage} variant="outlined" color="secondary" fullWidth>
                    Crop Image
                  </Button> */}
                  <VisuallyHiddenInput type="file" accept="image/*" id={`raised-button-file-new-${id}`} onChange={handleFileChange} />
                  <label htmlFor={`raised-button-file-new-${id}`} style={{ width: "100%" }}>
                    <Button variant="outlined" color="primary" fullWidth component="span">
                      New Image
                    </Button>
                  </label>
                </>
              ) : (
                <>
                  <Button onClick={resetImage} variant="outlined" color="secondary" fullWidth>
                    Re-crop
                  </Button>
                  <VisuallyHiddenInput type="file" accept="image/*" id={`raised-button-file-new-${id}`} onChange={handleFileChange} />
                  <label htmlFor={`raised-button-file-new-${id}`} style={{ width: "100%" }}>
                    <Button variant="outlined" color="primary" fullWidth component="span">
                      New Image
                    </Button>
                  </label>
                </>
              )}
            </Box>
          </Popover>
        </>
      )}
    </Box>
  );
};

export default ImageUploader;
