import React from "react";
import Magnifier from "react-magnifier";

const ProductZoom = ({ image }) => {
  const imageSrc = image || "https://shilpokotha.com/path-to-your-image.jpg";

  return (
    <div
      className="product-zoom-container"
      style={{
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
        cursor: "none", // Hides the real mouse so only the lens shows
      }}
    >
      <Magnifier
        src={imageSrc}
        width="100%"
        zoomFactor={1.5} // How much it zooms
        mgShape="circle" // THE AARONG STYLE ROUND LENS
        mgWidth={180} // Diameter of the circle
        mgHeight={180} // Diameter of the circle
        mgBorderWidth={2} // Thin premium border
        mgShowOverflow={false} // Keeps the circle inside the image frame
        mgMouseOffsetX={0}
        mgMouseOffsetY={0}
      />
    </div>
  );
};

export default ProductZoom;
