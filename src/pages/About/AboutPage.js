import "./AboutPage.css";

const AboutPage = () => {
  return (
    <div className="About-page">
      <div className="About-container">
        <h1>About Y Movie 🎥</h1>
        <p>
          <strong>Y Movie</strong> is a simple platform for discovering and exploring popular movies from around the world. 
          This website was built with <strong>React.js</strong> and leverages <strong>The Movie Database (TMDb) API</strong> to display real-time movie data.
        </p>
        <p>
          This project was developed as part of a learning journey in building modern web applications with a focus on responsive and user-friendly interfaces.
        </p>

        <div className="About-links">
          <a href="https://github.com/username" target="_blank" rel="noreferrer">
            🌐 View on GitHub
          </a>
          <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
            🎬 Powered by TMDb
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
