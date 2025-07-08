import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import './TrendingPage.css'

const TrendingPage = ({ favorites, toggleFavorite }) => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.REACT_APP_BASEURL}/trending/movie/week?api_key=${process.env.REACT_APP_APIKEY}`
        );
        const data = await res.json();
        setTrendingMovies(data.results);
      } catch (err) {
        console.error("Error fetching trending movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  if (loading) {
    return <p className="Loading-text">Loading trending movies...</p>;
  }

  return (
    <div className="Trending-page">
      {/* Hero Section */}
      <div className="Trending-hero">
        <h2 className="Trending-title">🔥 Trending Movies</h2>
        <p className="Trending-subtitle">
          Check out what’s popular this week in the movie world!
        </p>
      </div>

      {/* Movie List */}
      {trendingMovies.length > 0 ? (
        

        <div className="Movie-container">
  {trendingMovies.map((movie) => (
    <Link
      key={movie.id}
      to={`/movie/${movie.id}`}
      className="Movie-card-link"
    >
      <div className="Movie-wrapper">
        <img
          className="Movie-image"
          src={`${process.env.REACT_APP_IMAGE_URL}/${movie.poster_path}`}
          alt={movie.title || "movie_poster"}
        />
        <div className="Movie-info">
          <div className="Movie-title">{movie.title}</div>
          <div className="Movie-date">
            Release date: {movie.release_date || "Unknown"}
          </div>
          <div className="Movie-rate">
            {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
          </div>
          <div>
            <button
              className="Favorite-button"
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(movie);
              }}
            >
              {favorites.some((f) => f.id === movie.id) ? "❤️" : "🤍"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  ))}
</div>


      ) : (
        <p className="Empty-message">
          No trending movies found 😢
        </p>
      )}
    </div>
  );
};

export default TrendingPage;
