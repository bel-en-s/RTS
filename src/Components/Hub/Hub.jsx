import CardHub from "../UI/CardHub";
import "./HUB.css";

import iconInnovation from "../../assets/hub/innovation.png";
import iconAcademy from "../../assets/hub/academy.png";
import iconBTL from "../../assets/hub/below.png";

export default function HUB() {
  return (
    <section className="hub-section">
      <div className="hub-container">

        <div className="hub-header">
          <h4 className="hub-subtitle">RTS HUB</h4>
          <h2 className="hub-title">
            RTS HUB IS OUR LABORATORY
            <br />
            OF IDEAS AND EXECUTION
          </h2>
        </div>

        <div className="hub-cards">
          <CardHub
            title="INNOVATION LAB"
            icon={iconInnovation}
            description="It is more than a testing ground—it is a laboratory of ideas and execution. Here, we develop new technologies, provide practical tech consulting, and pilot innovative projects that transform real-world practice."
          />

          <CardHub
            title="ACADEMY"
            icon={iconAcademy}
            description="Dedicated to advancing technical skills and knowledge in industrial automation, OT/IT convergence, and advanced data analytics."
          />

          <CardHub
            title="BELOW THE LINE"
            icon={iconBTL}
            description="A creative and experiential unit where ideas meet industry. Through initiatives like Rocking the Industry and the Data Driven Lab, we go beyond tradition to explore innovation, collaboration, and leadership."
          />
        </div>
      </div>
    </section>
  );
}
