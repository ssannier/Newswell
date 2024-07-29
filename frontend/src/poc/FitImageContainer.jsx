import React, { useState } from "react";
import Draggable from "react-draggable";

const FitImageContainer = () => {
  const [image, setImage] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setImage(e.target.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleResize = (event, direction, ref, delta) => {
    setDimensions({
      width: ref.offsetWidth,
      height: ref.offsetHeight,
    });
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && (
        <Draggable>
          <div
            style={{
              position: "relative",
              width: dimensions.width,
              height: dimensions.height,
            }}
          >
            <img
              src={image}
              alt="Uploaded"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                cursor: "nwse-resize",
                width: 20,
                height: 20,
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                const onMouseMove = (moveEvent) => {
                  const newWidth = dimensions.width + (moveEvent.clientX - e.clientX);
                  const newHeight = dimensions.height + (moveEvent.clientY - e.clientY);
                  setDimensions({ width: newWidth, height: newHeight });
                };
                const onMouseUp = () => {
                  document.removeEventListener("mousemove", onMouseMove);
                  document.removeEventListener("mouseup", onMouseUp);
                };
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
              }}
            ></div>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default FitImageContainer;
