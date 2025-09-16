import React from 'react';

interface Model3DViewerProps {
  src: string;
}

const Model3DViewer: React.FC<Model3DViewerProps> = ({ src }) => {
  return (
    <div
      className="square-wrapper"
      style={{ position: "relative", width: "100%", paddingBottom: "100%" }}
    >
      <iframe
        title="3D Model"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; fullscreen; xr-spatial-tracking"
        src={src}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
      />
    </div>
  );
};

export default Model3DViewer;