import { useEffect, useState } from "react";
import "./App.css";
import { getMovieList, searchMovie } from "./api";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import FavoritesPage from "./pages/Favorites/FavoritesPage";
import MovieDetail from "./pages/MovieDetail/MovieDetail";
import CategoryPage from "./pages/Category/CategoryPage";
import TrendingPage from "./pages/Trending/TrendingPage";
import AboutPage from "./pages/About/AboutPage";
import Footer from "./components/Footer";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("favorites");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse favorites from localStorage:", error);
      return [];
    }
  });

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const closeCategory = () => {
    setIsCategoryOpen(false);
  };

  // Fetch popular movies
  useEffect(() => {
    getMovieList().then((result) => {
      setPopularMovies(result);
    });
  }, []);

  // Fetch genre list
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BASEURL}/genre/movie/list?api_key=${process.env.REACT_APP_APIKEY}&language=en-US`
        );
        const data = await res.json();
        setGenres(data.genres); // Array of genres
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };

    fetchGenres();
  }, []);

  const HeroThumbnail = () => {
    const [index, setIndex] = useState(0);

    // Filter movie dengan backdrop
    const heroImages = popularMovies
      .filter((movie) => movie?.backdrop_path)
      .slice(0, 5) // ambil 5 gambar
      .map((movie) => ({
        image: `${process.env.REACT_APP_BACKDROP_URL}${movie.backdrop_path}`,
        title: movie.title,
        subtitle: movie.overview,
      }));

    // Ganti gambar otomatis
    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }, [heroImages.length]);

    const nextSlide = () => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    };

    const prevSlide = () => {
      setIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    };

    if (heroImages.length === 0) return null;

    return (
      <div
        className="Hero-thumbnail"
        style={{
          backgroundImage: `url(${heroImages[index].image})`,
        }}
      >
        <div className="Hero-overlay">
          <h2 className="Hero-title">Welcome to Y MOVIE</h2>
          <p className="Hero-subtitle">
            Find your favorite movies, search by title, and browse thousands of
            popular movies. 🎬
          </p>
          <a href="#movie-list" className="Hero-button">
            Explore now!
          </a>

          {/* Tombol Next & Prev */}
          <button className="Hero-prev" onClick={prevSlide}>
            &lt;
          </button>
          <button className="Hero-next" onClick={nextSlide}>
            &gt;
          </button>
        </div>
      </div>
    );
  };

  const PopularMovieList = () => {
    return popularMovies.map((movie, i) => {
      return (
        <Link to={`/movie/${movie.id}`} className="Movie-card-link">
          <div className="Movie-wrapper" key={i}>
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
                    e.preventDefault(); // supaya tidak ikut navigate saat klik ❤️
                    toggleFavorite(movie);
                  }}
                >
                  {favorites.some((f) => f.id === movie.id) ? "❤️" : "🤍"}
                </button>
              </div>
            </div>
          </div>
        </Link>
      );
    });
  };

  const search = async (q) => {
    if (q.length > 3) {
      const query = await searchMovie(q);
      setPopularMovies(query.results);
    }
  };

  const toggleFavorite = (movie) => {
    let updated;
    if (favorites.some((f) => f.id === movie.id)) {
      updated = favorites.filter((f) => f.id !== movie.id); // remove
    } else {
      updated = [...favorites, movie]; // add
    }

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <header className="Top-bar">
          <h1 className="Movie-webName">Y-movie</h1>

          <nav className="Top-nav">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="Top-nav-link" 
            >
              Home
            </Link>

            {/* Dropdown for Category */}
            <div className="Dropdown" onMouseLeave={closeCategory}>
              <span
                className="Dropdown-title"
                tabIndex={0}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => toggleCategory()}
              >
                Category ▾
              </span>

              {isCategoryOpen && (
                <div className="Dropdown-content">
                  {genres.map((genre) => (
                    <Link
                      key={genre.id}
                      to={`/category/${genre.id}`}
                      className="Dropdown-link"
                      onClick={() => {
                        closeCategory();
                        window.scrollTo(0, 0);
                      }}
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/trending" className="Top-nav-link">
              Trending
            </Link>

            <Link to="/favorites" className="Top-nav-link">
              Favorite
            </Link>

            <Link to="/about" className="Top-nav-link">
              About
            </Link>

            <button
              onClick={() =>
                document
                  .getElementById("search-bar")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="Search-icon"
            >
              🔍
            </button>
          </nav>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <main className="App-header">
                <HeroThumbnail />
                <hr className="Divider" />
                <h2 id="movie-list" className="Section-title">
                  Browse Movies
                </h2>
                <p className="Search-desc">
                  Search for movies by title or explore popular recommendations
                  🎞️
                </p>
                <input
                  id="search-bar"
                  placeholder="Search movie.."
                  className="Movie-search"
                  onChange={({ target }) => search(target.value)}
                />
                <hr className="Divider" />
                <div className="Movie-container">
                  <PopularMovieList />
                </div>
              </main>
            }
          />

          <Route
            path="/trending"
            element={
              <TrendingPage
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            }
          />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/movie/:id" element={<MovieDetail />} />

          <Route
            path="/category/:id"
            element={
              <CategoryPage
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            }
          />

          <Route path="/about" element={<AboutPage />}></Route>
        </Routes>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
