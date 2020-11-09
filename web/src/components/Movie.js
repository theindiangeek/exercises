import React, { useState, useEffect } from "react";
import MovieDataService from "../services/MovieService";

const Movie = props => {
  const initialMovieState = {
    id: null,
    title: "",
    description: "",
    published: false
  };
  const [currentMovie, setCurrentMovie] = useState(initialMovieState);
  const [message, setMessage] = useState("");

  const getMovie = id => {
    MovieDataService.get(id)
      .then(response => {
        setCurrentMovie(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getMovie(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentMovie({ ...currentMovie, [name]: value });
  };

  const updatePublished = status => {
    var data = {
      id: currentMovie.id,
      title: currentMovie.title,
      description: currentMovie.description,
      published: status
    };

    MovieDataService.update(currentMovie.id, data)
      .then(response => {
        setCurrentMovie({ ...currentMovie, published: status });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const updateMovie = () => {
    MovieDataService.update(currentMovie.id, currentMovie)
      .then(response => {
        console.log(response.data);
        setMessage("The Movie was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteMovie = () => {
    MovieDataService.remove(currentMovie.id)
      .then(response => {
        console.log(response.data);
        props.history.push("/Movies");
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {currentMovie ? (
        <div className="edit-form">
          <h4>Movie</h4>
          <form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={currentMovie.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                value={currentMovie.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>
                <strong>Status:</strong>
              </label>
              {currentMovie.published ? "Published" : "Pending"}
            </div>
          </form>

          {currentMovie.published ? (
            <button
              className="badge badge-primary mr-2"
              onClick={() => updatePublished(false)}
            >
              UnPublish
            </button>
          ) : (
            <button
              className="badge badge-primary mr-2"
              onClick={() => updatePublished(true)}
            >
              Publish
            </button>
          )}

          <button className="badge badge-danger mr-2" onClick={deleteMovie}>
            Delete
          </button>

          <button
            type="submit"
            className="badge badge-success"
            onClick={updateMovie}
          >
            Update
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Movie...</p>
        </div>
      )}
    </div>
  );
};

export default Movie;