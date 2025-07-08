import "./Footer.css";

const Footer = () => {
  return (
    <footer className="Footer">
      <div className="Footer-content">
        <p>© 2025 Y-Movie. All rights reserved.</p>
        <p>
          Powered by{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
          >
            TMDb API
          </a>
        </p>
        <p>
          Built with ❤️ from Raditya Prima 
        </p>
      </div>
    </footer>
  );
};

export default Footer;
