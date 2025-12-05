import "./CardHub.css";

export default function CardHub({
  title,
  icon,
  image,
  description,
  descriptionLight,
}) {
  return (
    <div className="hub-card">
    
      <div className="hub-left">
        <img className="hub-left-icon" src={icon} alt={title} />
        <h3 className="hub-left-title">{title}</h3>
      </div>

   
      <div className="hub-center">
        <img src={image} alt="" />
      </div>

      {/* RIGHT — text block */}
      <div className="hub-right">
        <p className="hub-right-desc">{description}</p>
        {descriptionLight && (
          <p className="hub-right-desc-light">{descriptionLight}</p>
        )}
      </div>
    </div>
  );
}
