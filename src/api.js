module.exports = {
  getMovies: () => {
    return fetch('/api/movies')
      .then(response => response.json());
  }
};



//------------delete movies---------------------
// const deleteMovie = {
//   method: 'DELETE',
// }
//
// module.exports = {
// deleteMovie:(Id) => {
//   return fetch('/api/movies/' + Id, deleteMovie)
//       .then(response => response.json())
// }
// };