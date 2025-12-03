import CardHub from "../UI/CardHub";
import "./Hub.css";

import iconInnovation from "../../assets/hub/icon1.png";
import iconAcademy from "../../assets/hub/icon1.png";
import iconBTL from "../../assets/hub/icon1.png";

import imgInnovation from "../../assets/hub/innovation.png";
import imgAcademy from "../../assets/hub/academy.png";
import imgBTL from "../../assets/hub/below.png";

export default function HUB() {
  const cardData = [
    {
      title: "BELOW THE LINE",
      icon: iconBTL,
      image: imgBTL,
      description:
        "Below-the-line powerhouse — a creative and experiential unit where ideas meet industry.",
        descriptionLight:"Through initiatives like Rocking the Industry and the Data-Driven LAB, we go beyond traditional services to spark interaction, collaboration, and thought leadership."
    },
    {
      title: "ACADEMY",
      icon: iconAcademy,
      image: imgAcademy,
      description:
        "Dedicated to advancing technical skills and knowledge in industrial automation, OT/IT convergence, and analytics.",
      descriptionLight:"It serves as a center of excellence both for our internal teams and for clients, helping professionals stay ahead in arapidly evolving industry."
      },
    {
      title: "INNOVATION LAB",
      icon: iconInnovation,
      image: imgInnovation,
      description:
        "Is more than a testing ground — it is a laboratory of ideas and execution where we develop new technologies.",
      descriptionLight:"Here, we develop new technologies, provide industrial tech consulting, and design pilot projects that bring innovation into real practice. It is where  concepts are tested, validated, and transformed into solutions that empower industries."
      },
  ];


  return (
    <section className="hub-section">
      <div className="hub-fixed-header">
        <h2 className="hub-title headline-medium">
          <span className="gradient-text">RTS HUB</span> IS OUR LABORATORY
          <br />
          OF IDEAS AND EXECUTION
        </h2>
      </div>

      <div className="hub-stack-container">
        {cardData.map((item, i) => (
          <div className="hub-card-wrapper" key={i}>
          <CardHub 
            title={item.title} 
            icon={item.icon} 
            image={item.image} 
            description={item.description}
            descriptionLight={item.descriptionLight}
          />

          </div>
        ))}
      </div>
    </section>
  );
}
