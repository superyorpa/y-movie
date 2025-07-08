import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './FavoritesPage.css'

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
  try {
    const saved = localStorage.getItem("favorites");
    setFavorites(saved ? JSON.parse(saved) : []);
  } catch (e) {
    console.error("Invalid JSON in favorites:", e);
    setFavorites([]);
  }
}, []);

  return (
    <div className="Favorites-page">
      <h2 className="Favorites-head">My Favorites</h2>
      <hr className="Divider" />

      <div className="Movie-container">
  {favorites.length === 0 ? (
    <p style={{ color: "white" }}>No favorites yet.</p>
  ) : (
    favorites.map((movie) => (
      <Link
      key={movie.id}
      to={`/movie/${movie.id}`}
      className="Movie-card-link"
    >
      <div className="Movie-wrapper" key={movie.id}>
        <img
          className="Movie-image"
          src={`${process.env.REACT_APP_IMAGE_URL}/${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="Movie-info">
          <div className="Movie-title">{movie.title}</div>
          <div className="Movie-date">Release: {movie.release_date}</div>
          <div className="Movie-rate">{movie.vote_average}</div>

          {/* Tombol Hapus */}
          <button
            className="Favorite-button"
              onClick={(e) => {
                e.preventDefault();
                const updated = favorites.filter((f) => f.id !== movie.id);
                setFavorites(updated);
                localStorage.setItem("favorites", JSON.stringify(updated));
              }}
          >
            X 
          </button>
        </div>
      </div>
  </Link>
    ))
  )}
</div>

</div>
  );
};

export default FavoritesPage;
