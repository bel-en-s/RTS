// ApproachButton.jsx
import React from "react";
import "./ApproachButton.css";

export default function ApproachButton({ label = "Our Approach", href = "#" }) {
  return (
    <a href={href} className="approach-btn">
      {label}
    </a>
  );
}
