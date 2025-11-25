import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <img src="/footer.png" alt="RTS Logo" className="footer-logo" />
          <h2 className="footer-title display-sm">
            SPARK INDUSTRIAL<br />BRILLIANCE
          </h2>
        </div>

        <div className="footer-columns">
          <div className="footer-column">
            <h4 className="footer-heading">Departments</h4>
            <ul>
              <li>Automation & Controls</li>
              <li>Digital Skills</li>
              <li>Energy & Infrastructure</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Resources</h4>
            <ul>
              <li>Media kit</li>
            </ul>
          </div>

          <div className="footer-column mobile-only">
            <h4 className="footer-heading">Policy</h4>
            <ul>
              <li>Privacy Policy</li>
              <li>Cookie Settings</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>All Rights Reserved ©2025 RTS Group</p>
      </div>
    </footer>
  );
}
