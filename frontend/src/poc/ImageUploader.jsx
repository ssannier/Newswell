import React, { useState, useCallback } from "react";
import { Box, Button, Slider, Typography } from "@mui/material";
import Cropper from "react-easy-crop";

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setSelectedFile(reader.result);
        setCroppedImage(null);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(selectedFile, croppedAreaPixels);
      setCroppedImage(croppedImage);
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
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  return (
    <Box sx={{ width: 300, height: 300, position: "relative" }}>
      {!selectedFile ? (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            border: "2px dashed grey",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input accept="image/*" style={{ display: "none" }} id="raised-button-file" type="file" onChange={handleFileChange} />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span">
              Upload Image
            </Button>
          </label>
        </Box>
      ) : (
        <>
          <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
            {!croppedImage ? (
              <Cropper image={selectedFile} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
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
          </Box>
          <Box sx={{ position: "absolute", bottom: -50, left: 0, right: 0 }}>{!croppedImage && <Slider value={zoom} min={1} max={3} step={0.1} aria-labelledby="Zoom" onChange={(e, zoom) => setZoom(zoom)} />}</Box>
          <Box sx={{ position: "absolute", bottom: -90, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 2 }}>
            {!croppedImage ? (
              <Button onClick={showCroppedImage} variant="contained" color="primary">
                Crop Image
              </Button>
            ) : (
              <>
                <Button onClick={resetImage} variant="contained" color="secondary">
                  Re-crop
                </Button>
                <input accept="image/*" style={{ display: "none" }} id="raised-button-file-new" type="file" onChange={handleFileChange} />
                <label htmlFor="raised-button-file-new">
                  <Button variant="contained" component="span">
                    New Image
                  </Button>
                </label>
              </>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ImageUploader;
