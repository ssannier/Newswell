import { Box, Popover, Typography, Button, IconButton, CircularProgress } from "@mui/material";
import React, { useState, useRef, useCallback, useContext, useEffect } from "react";
import Cropper from "react-easy-crop";
import "../utils/uploadImage.css";
import { styled } from "@mui/material/styles";
import ImageIcon from "@mui/icons-material/Image";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { Context } from "../App";

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
const env = import.meta.env;

const ImageUploader = ({ id, height, width }) => {
  const [layout, setLayout] = useContext(Context);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileObj, setSelectedFileObj] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const fileInputRef = useRef(null);
  const imageBoxRef = useRef(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [isEdited, setIsEdited] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
    // setCroppedImage(croppedArea);
  }, []);
  // useEffect(() => {
  //   // Check if there's an existing image in the layout
  //   if (layout[id] && layout[id].imageDesc) {
  //     setSelectedFile(layout[id].imageDesc);
  //     setCroppedImage(layout[id].imageDesc);
  //   } else {
  //     // Reset state if no image in layout
  //     setSelectedFile(null);
  //     setCroppedImage(null);
  //   }
  // }, [layout, id]);
  useEffect(() => {
    if (layout[id]?.imageDesc) {
      if (layout[id].imageDesc instanceof File) {
        setSelectedFile(layout[id].imageDesc);
        setSelectedFileObj(URL.createObjectURL(layout[id].imageDesc));
      } else {
        setSelectedFile(layout[id].imageDesc);
        setSelectedFileObj(null);
      }
      setCroppedImage(layout[id].imageDesc);
    } else {
      setSelectedFile(null);
      setSelectedFileObj(null);
      setCroppedImage(null);
    }
  }, [layout, id]);

  useEffect(() => {
    return () => {
      if (selectedFileObj && selectedFile instanceof File) {
        URL.revokeObjectURL(selectedFileObj);
      }
    };
  }, [selectedFile, selectedFileObj]);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedFileObj(URL.createObjectURL(file));
      setAnchorEl(imageBoxRef.current);
      setIsEdited(true);
      setIsSaving(false);
      setCroppedImage(null);
    }
  };
  const handleSave = async () => {
    setIsSaving(true);
    try {
      let croppedFile = selectedFile;

      // If cropping is needed, generate the cropped image
      if (croppedAreaPixels) {
        const boxWidth = parseFloat(width); // Convert box width to pixels
        const boxHeight = parseFloat(height); // Convert box height to pixels

        const croppedBlob = await getCroppedImageBlob(selectedFile, croppedAreaPixels, boxWidth, boxHeight);
        croppedFile = new File([croppedBlob], selectedFile.name, { type: selectedFile.type });
      }

      // Perform new upload or re-upload based on whether an image ID exists
      if (!layout[id]?.id) {
        await uploadNewImage(id, croppedFile);
      } else {
        await reuploadImage(id, croppedFile);
      }

      setIsEdited(false);
      setAnchorEl(null);
    } catch (error) {
      console.error("Error during save operation:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const uploadNewImage = async (id, croppedFile) => {
    try {
      const uploadUrl = env.VITE_API_GET_PRESIGNED_URL_IMAGE_UPLOAD;
      const presignedUrlResponse = await fetchPresignedUrl(uploadUrl, "GET"); // Fetch presigned URL and file_id
      const { url: presignedUrl, file_id: newFileId } = presignedUrlResponse.body;

      await uploadToS3(presignedUrl, croppedFile, false); // Upload the cropped file

      setLayout((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          id: newFileId,
          imageDesc: croppedFile,
        },
      }));
    } catch (error) {
      console.error("Error uploading new image:", error);
      throw error;
    }
  };

  const reuploadImage = async (id, croppedFile) => {
    try {
      const url = `${env.VITE_API_REWRITE_IMAGE_UPLOAD}?id=${layout[id].id}`;
      const presignedUrlResponse = await fetchPresignedUrl(url, "POST"); // Fetch presigned URL for existing image
      await uploadToS3(presignedUrlResponse.url, croppedFile); // Upload the cropped file

      setLayout((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          imageDesc: croppedFile,
        },
      }));
    } catch (error) {
      console.error("Error rewriting image:", error);
      throw error;
    }
  };

  const fetchPresignedUrl = async (url, requestType = "GET") => {
    try {
      const response = await fetch(url, {
        method: requestType,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch presigned URL");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const uploadToS3 = async (url, file) => {
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
      if (!response.ok) {
        throw new Error("Failed to upload the image to S3");
      }
    } catch (error) {
      throw error;
    }
  };

  const getCroppedImageBlob = (imageFile, croppedAreaPixels, boxWidth, boxHeight) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const { x, y, width, height } = croppedAreaPixels;

        // Set the canvas size to the exact size of the crop area (no scaling)
        canvas.width = width;
        canvas.height = height;

        // Draw the cropped area of the image directly onto the canvas
        ctx.drawImage(
          image,
          x,
          y,
          width,
          height, // Source: crop area in the original image
          0,
          0,
          width,
          height // Destination: exactly fill the canvas
        );

        // Convert the canvas to a Blob (same file type as the original image)
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to convert canvas to blob"));
          }
        }, imageFile.type);
      };

      // Load the image from the file
      image.src = URL.createObjectURL(imageFile);
    });
  };
  return (
    <>
      {layout[id]?.loading ? (
        <>
          <Box sx={{ height, width, justifyContent: "center", alignItems: "center", display: "flex", background: "#ececec" }}>
            <CircularProgress size={24} />
          </Box>
        </>
      ) : (
        <Box
          sx={{
            width: width,
            height: height,
            position: "relative",
            background: "#ECECEC",
          }}
          id={id}
        >
          {selectedFile ? (
            <>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                }}
                ref={imageBoxRef}
                onClick={(e) => setAnchorEl(imageBoxRef.current)}
              >
                {!croppedImage ? (
                  <Cropper
                    image={selectedFileObj || selectedFile}
                    // image={selectedFile instanceof File ? URL.createObjectURL(selectedFile) : selectedFile}
                    crop={crop}
                    zoom={zoom}
                    aspect={width / height}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    objectFit="contain"
                    showGrid={false}
                    style={{
                      containerStyle: {
                        width: "100%",
                        height: "100%",
                      },
                      mediaStyle: {
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      },
                    }}
                  />
                ) : (
                  <>
                    <Box
                      component="img"
                      src={selectedFileObj || selectedFile}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </>
                )}
                {isEdited && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave(e, croppedAreaPixels);
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
                disableRestoreFocus
              >
                <Box sx={{ p: 2 }}>
                  {!croppedImage && (
                    <>
                      <Typography id={`zoom-slider-${id}`} gutterBottom>
                        Zoom
                      </Typography>

                      <div className="controls" style={{ width: width }}>
                        <input
                          type="range"
                          value={zoom}
                          min={1}
                          max={3}
                          step={0.1}
                          aria-labelledby="Zoom"
                          onChange={(e) => {
                            setZoom(e.target.value);
                            setIsEdited(true);
                          }}
                          className="zoom-range"
                        />
                      </div>
                      <Button variant="contained" color="primary" fullWidth component="span" onClick={handleSave} sx={{ mb: 2 }}>
                        Save Image
                      </Button>
                    </>
                  )}
                  <VisuallyHiddenInput type="file" accept="image/*" id={`raised-button-file-new-${id}`} onChange={handleFileChange} ref={fileInputRef} />
                  <label htmlFor={`raised-button-file-new-${id}`} style={{ width: "100%" }}>
                    <Button variant="outlined" color="primary" fullWidth component="span">
                      New Image
                    </Button>
                  </label>
                </Box>
              </Popover>
            </>
          ) : (
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
              <VisuallyHiddenInput type="file" accept="image/*" id={`raised-button-file-${id}`} onChange={handleFileChange} ref={fileInputRef} />
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
          )}
        </Box>
      )}
    </>
  );
};

export default ImageUploader;
