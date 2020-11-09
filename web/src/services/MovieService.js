import api from "../api-common";

const getAll = () => {
  return api.get("/movies");
};

const get = id => {
  return api.get(`/movies/${id}`);
};

const create = data => {
  return api.post("/movies", data);
};

const update = (id, data) => {
  return api.put(`/movies/${id}`, data);
};

const remove = id => {
  return api.delete(`/movies/${id}`);
};

const removeAll = () => {
  return api.delete(`/movies`);
};

const findByTitle = title => {
  return api.get(`/movies?title=${title}`);
};

const MovieDataService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByTitle
};

export default MovieDataService