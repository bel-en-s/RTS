import "./Banner.css";
import Button from "../UI/ApproachButton";
import bgBanner from "../../assets/Banner.jpeg";

export default function Banner() {
  return (
    <section
      className="banner"
      style={{ backgroundImage: `url(${bgBanner})` }}
    >
      <div className="banner-inner">
        <h2 className="banner-title display-md">
          <span className="desktop">
            LET’S SPARK YOUR<br />
            INDUSTRIAL BRILLANCE
          </span>
          <span className="mobile display-md">
            LET’S SPARK<br />
            YOUR INDUSTRIAL<br />
            BRILLANCE
          </span>
        </h2>

        <p className="banner-body body-lg">
          <span className="desktop">
            Every challenge is an opportunity. Share yours, and<br />
            let’s explore how to bring your vision to life.
          </span>
          <span className="mobile body-lg">
            Every challenge is an opportunity. Share yours,<br />
            and let’s explore how to<br />
            bring your vision to life.
          </span>
        </p>

        <div className="banner-button">
          <Button label="Book a meeting now" />
        </div>
      </div>
    </section>
  );
}
