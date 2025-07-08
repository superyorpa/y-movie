import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import './CategoryPage.css';

const CategoryPage = ({ favorites, toggleFavorite }) => {
  const { id } = useParams();
  const [movies, setMovies] = useState([]);
  const [genreName, setGenreName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryMovies = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.REACT_APP_BASEURL}/discover/movie?api_key=${process.env.REACT_APP_APIKEY}&with_genres=${id}`
        );
        const data = await res.json();
        setMovies(data.results);

        // Fetch genre name
        const genreRes = await fetch(
          `${process.env.REACT_APP_BASEURL}/genre/movie/list?api_key=${process.env.REACT_APP_APIKEY}`
        );
        const genreData = await genreRes.json();
        const foundGenre = genreData.genres.find((g) => g.id.toString() === id);
        setGenreName(foundGenre ? foundGenre.name : "Unknown Genre");
      } catch (err) {
        console.error("Error fetching category movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryMovies();
  }, [id]);

  if (loading) {
    return <p className="Loading-text">Loading movies...</p>;
  }

  return (
    <div className="Category-page">
      {/* Hero Section */}
      <div className="Category-hero">
        <h2 className="Category-title">🎬 {genreName} Movies</h2>
        <p className="Category-subtitle">
          Explore the best {genreName} films curated for you!
        </p>
      </div>

      {/* Movie List */}
      {movies.length > 0 ? (
        <div className="Movie-container">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="Movie-card-link"
            >
              <div className="Movie-wrapper">
                <img
                  className="Movie-image"
                  src={
                    movie.poster_path
                      ? `${process.env.REACT_APP_IMAGE_URL}/${movie.poster_path}`
                      : "https://via.placeholder.com/300x450?text=No+Image"
                  }
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
        <p className="Empty-message">No movies found in this category 😢</p>
      )}
    </div>
  );
};

export default CategoryPage;
