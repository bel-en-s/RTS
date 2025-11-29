import "./CardHub.css";

export default function CardHub({ title, icon, description }) {
  return (
    <div className="hub-card">
      <div className="hub-card-icon">
        <img src={icon} alt={title} />
      </div>

      <div className="hub-card-content">
        <h3 className="hub-card-title">{title}</h3>
        <p className="hub-card-desc">{description}</p>
      </div>

      <div className="hub-card-bg">
        <img src={icon} alt="" />
      </div>
    </div>
  );
}
