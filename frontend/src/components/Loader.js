// ============================================================
// CMIS - components/Loader.js
// Reusable loading spinner component
// ============================================================

import React from "react";

const Loader = ({ fullScreen = false, text = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "14px",
          background: "#f1f5f9",
        }}
      >
        <div className="spinner" />
        <span className="loader-text">{text}</span>
      </div>
    );
  }

  return (
    <div className="loader-wrap">
      <div className="spinner" />
      <span className="loader-text">{text}</span>
    </div>
  );
};

export default Loader;
