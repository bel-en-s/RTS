import "./Footer.css";

export default function Footer() {
  return (
    <footer>
      <div className="footer footer-container">
        <div className="footer-left">
          <div className="footer-brand">
            <img
              src={`${import.meta.env.BASE_URL}footer.png`}
              alt="RTS Logo"
              className="footer-logo"
            />

            <h2 className="footer-title headline-sm">
              SPARK INDUSTRIAL<br />BRILLIANCE
            </h2>
          </div>
        </div>

        <div className="footer-columns">
          <div className="footer-column">
            <h4 className="footer-heading title-body ">Departments</h4>
            <ul>
              <li>Automation & Controls</li>
              <li>Digital Skills</li>
              <li>Energy & Infrastructure</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading title-body">Resources</h4>
            <ul>
              <li>Media kit</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
  <div className="footer-bottom-inner">
    <div className="fb-col fb-left">
      <span>Privacy Policy</span>
      <span>Cookie Settings</span>
    </div>

    <p className="fb-col fb-center">All Rights Reserved ©2025 RTS Group</p>

    <div className="fb-col fb-right">
      <span>Linkedin</span>
      <span>Youtube</span>
      <span>Discord</span>
    </div>
  </div>
</div>

    </footer>
  );
}
