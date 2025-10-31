// src/Components/UI/Card.jsx
import React from "react";
import "./Card.css";

export default function Card({
  title,
  subtitle,
  image,
  description,
  onClick,
  children,
  style = {},
}) {
  return (
    <div className="card-component" style={style} onClick={onClick}>
      {image && <img src={image} alt={title} className="card-image" />}

      <div className="card-content">
        {title && <h2 className="card-title">{title}</h2>}
        {subtitle && <h3 className="card-subtitle">{subtitle}</h3>}
        {description && <p className="card-description">{description}</p>}
        {children && <div className="card-children">{children}</div>}
      </div>
    </div>
  );
}
