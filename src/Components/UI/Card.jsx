// src/Components/UI/Card.jsx
import React from "react";
import "./Card.css";


export default function Card({ title, description, image, children }) {
  return (
    <div className="card-component">
      <img src={image} alt={title} className="card-image" />

 
      <h3 className="card-floating-title title-sm">{title}</h3>


      <div className="card-hover">
        <p className="card-hover-description body-sm">{description}</p>

        <button className="card-hover-button body-sm">
          Learn more
        </button>
      </div>
    </div>
  );
}