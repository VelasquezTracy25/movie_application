const genreList = ['Comedy', "Family", "Suspense", "Drama", "Dark Comedy", "Action", "Cultural Reset", "Satire", "Romance", "Fantasy", "Mystery"]
const $ = require('jquery');
// const {deleteMovie} = require('./api.js');

import movieKey from './keys.js'

console.log(movieKey)
/**
 * es6 modules and imports
 */
import sayHello from './hello';

sayHello('World');

/**
 * require style imports
 */
// Retrieves Movie Info
const {getMovies} = require('./api.js');

//Build API call and pulls poster
const moviePoster = function (title) {
    const opt = {
        method: "GET"
    }
    return fetch(`http://www.omdbapi.com/?apikey=dc658566&s=${title}`, opt)
        .then((response) => response.json())

}

moviePoster('Legally Blonde')


// Generates Movies on Table with all info
const renderMovies = function (genre) {
    getMovies().then((movies) => {
        console.log('Here are all the movies:');
        let idTag = ["#family-movies", "#comedy-movies", "#suspense-movies", "#general-movies"];
        let moviesSection = "";
        const movieFilter = movies.filter(function (movie) {
            return movie.genre === genre
        })
        movieFilter.forEach(({title, image, rating, year, genre, id}) => {
            if (genre === "Family") {
                moviesSection = idTag[0];
            } else if (genre === "Comedy") {
                moviesSection = idTag[1];
            } else if (genre === "Suspense") {
                moviesSection = idTag[2];
            } else {
                moviesSection = idTag[3];
            }
            console.log(`id#${id} - ${title} - rating: ${rating}`);
            // if Images is empty then it goes into OMDb to pull the poster image
            if (image === "") {
                moviePoster(title)
                    .then(function (poster) {
                        console.log(poster)
                        let imageURL = poster.Search[0].Poster;
                        image = imageURL;
                        fetch("/api/movies/" + id, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                image: imageURL
                            })
                        }).catch(error => {
                            console.log(error)
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            }
            $(moviesSection).append(`
<div class="cardbox">
                 <div class="box cardimage" style="background-image: url(${image})">
                  <div class="cardoverlay"> 
                      <p> ${title}</p>
                      <p> ${year}</p>
                      <p> ${genre}</p>
                      <p> ${rating} </p>
                      <p><a href="#" class="deleteMovieButton" data-id="${id}"><img class="trash-icon" src="img/cute-trash-can.png" alt="cute lil trashcan"></a></p>
                  </div>
                  </div>
</div>`)
        });
    }).catch((error) => {
        alert('Oh no! Something went wrong.\nCheck the console for details.');
        console.log(error);
    });
}

// initial call for renderMovies and for loop generate filtering
renderMovies()

for (let i = 0; i < genreList.length; i++) {
    renderMovies(genreList[i]);
}


// Adds Movie
$('#newMovieButton').click(function (event) {
    event.preventDefault();
    const movieName = $('#movieNameInput').val();
    const movieGenre = $('#addMovieGenre').val();
    const movieYear = $('#addMovieYear').val()
    const movieRating = $('#rating-hidden').val();
    $('#insertProducts').empty();

// Stores Movies
    $.ajax("/api/movies", {
        type: "POST",
        data: {
            title: movieName,
            rating: movieRating,
            genre: movieGenre,
            year: movieYear
        }
    })
        // Updates Table using callback function
        .done(renderMovies);

});


//Edit Movie Start
$('#editMovieButton').click(function () {
    const movieID = $('#editMovieId');
    const newMovieName = $('#editMovieName');
    const newMovieGenre = $('#editMovieGenre');
    const newMovieYear = $('#editMovieYear');
    const newMovieRating = $('#edit-rating-hidden');
    const moviePost = {
        id: movieID.val(),
        title: newMovieName.val(),
        rating: newMovieRating.val(),
        genre: newMovieGenre.val(),
        year: newMovieYear.val()
    };
    console.log(moviePost);
    const url = '/api/movies/' + movieID.val();
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(moviePost),
    };
    fetch(url, options).then(response => response.json());
    $('#insertProducts').empty();
// Updates Table using callback function
    renderMovies();

});

// //Delete movie button

$(document).on("click", '.deleteMovieButton', function () {
    console.log('test')
    $.ajax({
        url: `/api/movies/${$(this).attr('data-id')}`,
        type: "DELETE",
        dataType: "json",
    })
        .done(location.reload());
});

// Binds Rating to Star Selection
function bindStarEvents() {
    [...document.querySelectorAll('span.star')].map(star => {
        star.addEventListener('click', e => {
            let clicked = e.currentTarget;
            let input = document.querySelector('#rating-hidden');
            input.value = clicked.getAttribute('data-star');
            [...document.querySelectorAll('span.star')].map(star => {
                let val = star.getAttribute('data-star');
                let active = val > input.value ? 'star' : 'star-active';
                star.classList.remove('star-active');
                star.classList.add(active);
            });
        });
    });
}

bindStarEvents();

function editStarEvents() {
    [...document.querySelectorAll('span.editStar')].map(editStar => {
        editStar.addEventListener('click', e => {
            let clicked = e.currentTarget;
            let input = document.querySelector('#edit-rating-hidden');
            input.value = clicked.getAttribute('data-edit-star');
            [...document.querySelectorAll('span.editStar')].map(editStar => {
                let val = editStar.getAttribute('data-edit-star');
                let active = val > input.value ? 'editStar' : 'editStar-active';
                editStar.classList.remove('editStar-active');
                editStar.classList.add(active);
            });
        });
    });
}

editStarEvents();


