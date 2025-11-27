import "./Footer.css";

export default function Footer() {
  return (
    <footer >

      {/* CONTENIDO SUPERIOR */}
      <div className="footer footer-container">
        <div className="footer-left">
          <img 
            src={`${import.meta.env.BASE_URL}footer.png`} 
            alt="RTS Logo"
            className="footer-logo" 
          />

          <h2 className="footer-title display-sm">
            SPARK INDUSTRIAL<br />BRILLIANCE
          </h2>
        </div>

        <div className="footer-columns">
          <div className="footer-column">
            <h4 className="footer-heading">DEPARTMENTS</h4>
            <ul>
              <li>Automation & Controls</li>
              <li>Digital Skills</li>
              <li>Energy & Infrastructure</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">RESOURCES</h4>
            <ul>
              <li>Media kit</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">POLICY</h4>
            <ul>
              <li>Privacy Policy</li>
              <li>Cookie Settings</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">SOCIAL</h4>
            <ul>
              <li>Linkedin</li>
              <li>Youtube</li>
              <li>Discord</li>
            </ul>
          </div>
        </div>
      </div>

 
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <div className="fb-left mobile-only">
            <span>Privacy Policy</span>
            <span>Cookie Settings</span>
          </div>

          <p className="fb-center">All Rights Reserved ©2025 RTS Group</p>

        </div>
      </div>

    </footer>
  );
}
