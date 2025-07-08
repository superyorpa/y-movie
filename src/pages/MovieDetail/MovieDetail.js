import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './MovieDetail.css'

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [tab, setTab] = useState("overview");

  const [cast, setCast] = useState([]);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const url = `${process.env.REACT_APP_BASEURL}/movie/${id}?api_key=${process.env.REACT_APP_APIKEY}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error("Fetch or JSON parsing error:", err);
      }
    };

    const getTrailer = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BASEURL}/movie/${id}/videos?api_key=${process.env.REACT_APP_APIKEY}`
        );
        const data = await res.json();

        const officialTrailer = data.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        setTrailerKey(officialTrailer?.key);
      } catch (err) {
        console.error("Trailer fetch error:", err);
      }
    };

    fetchMovieDetail();
    getTrailer();

    const fetchCast = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BASEURL}/movie/${id}/credits?api_key=${process.env.REACT_APP_APIKEY}`
        );
        const data = await res.json();
        setCast(data.cast.slice(0, 10)); // Ambil 10 cast teratas
      } catch (err) {
        console.error("Cast fetch error:", err);
      }
    };
    fetchCast();
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="Movie-detail">
      <button onClick={() => navigate(-1)} className="Back-button">
        ← Back
      </button>

      <div className="Movie-detail-wrapper">
        <img
          className="Movie-detail-poster"
          src={`${process.env.REACT_APP_IMAGE_URL}/${movie.poster_path}`}
          alt={movie.title}
        />

        <div className="Movie-detail-info">
          <h2>{movie.title}</h2>

          <div className="Info-tabs">
            <button
              className={tab === "overview" ? "active" : ""}
              onClick={() => setTab("overview")}
            >
              Overview
            </button>
            <button
              className={tab === "details" ? "active" : ""}
              onClick={() => setTab("details")}
            >
              Details
            </button>
            {trailerKey && (
              <button
                className={tab === "trailer" ? "active" : ""}
                onClick={() => setTab("trailer")}
              >
                Trailer
              </button>
            )}
            <button
              className={tab === "cast" ? "active" : ""}
              onClick={() => setTab("cast")}
            >
              Cast
            </button>
          </div>

          <div className="Movie-detail-card">
            {tab === "overview" && <p>{movie.overview}</p>}

            {tab === "details" && (
              <>
                <p>
                  <strong>Release:</strong> {movie.release_date}
                </p>
                <p>
                  <strong>Rating:</strong> {movie.vote_average.toFixed(1)}
                </p>
                <p>
                  <strong>Original Title:</strong> {movie.original_title}
                </p>
                <p>
                  <strong>Status:</strong> {movie.status}
                </p>
                <p>
                  <strong>Runtime:</strong> {movie.runtime} minutes
                </p>
                <p>
                  <strong>Language:</strong>{" "}
                  {movie.original_language.toUpperCase()}
                </p>
                <p>
                  <strong>Tagline:</strong> {movie.tagline}
                </p>
                <p>
                  <strong>Genre:</strong>{" "}
                  {movie.genres.map((g) => g.name).join(", ")}
                </p>
              </>
            )}

            {tab === "trailer" && (
              <iframe
                width="100%"
                height="300"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

            {tab === "cast" && (
              <div className="Cast-grid">
                {cast.map((actor) => (
                  <div key={actor.id} className="Cast-card">
                    <img
                      src={
                        actor.profile_path
                          ? `${process.env.REACT_APP_IMAGE_URL}/${actor.profile_path}`
                          : "https://via.placeholder.com/150x225?text=No+Image"
                      }
                      alt={actor.name}
                      className="Cast-photo"
                    />
                    <div className="Cast-info">
                      <p className="Cast-name">{actor.name}</p>
                      <p className="Cast-character">as {actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
