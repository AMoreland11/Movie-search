//http://www.omdbapi.com/?apikey=[yourkey]&
//key = 9a8004ec
//https://www.omdbapi.com/?s=tt3896198&apikey=9a8004ec  omDb API
//http://img.omdbapi.com/?apikey=[9a8004ec]&

const movieSearchBox = document.getElementById("movie__search-box");
const searchList = document.getElementById("search__list");
const resultGrid = document.getElementById("result__grid");

async function loadMovies(searchTerm) {
  const URL = `https://www.omdbapi.com/?s=${searchTerm}&apikey=9a8004ec`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  if (data.Response == "True") displayMovieList(data.Search);
}

function findMovies() {
  let searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide__search-list");
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hide__search-list");
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let i = 0; i < movies.length; i++) {
    let movieListItem = document.createElement('div');
    movieListItem.dataset.id = movies[i].imdbID;
    movieListItem.classList.add('search__list-item');
    if (movies[i].Poster !== "N/A") 
        moviePoster = movies[i].Poster;
    else 
        moviePoster = "image_not_found.png";

    movieListItem.innerHTML = `
    <div class="search__item-thumbnail">
        <img src="${moviePoster}">
    </div>
    <div class="search__item-info">
        <h3>${movies[i].Title}</h3>
        <p>${movies[i].Year}</p>
    </div>
    `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll('.search__list-item');
  searchListMovies.forEach((movie) => {
    movie.addEventListener('click', async () => {
      searchList.classList.add('hide__search-list');
      movieSearchBox.value = "";
      const result = await fetch(
        `http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=9a8004ec`);
      const movieDetails = await result.json();
      displayMovieDetails(movieDetails);
    });
  });
}

function displayMovieDetails(details) {
    resultGrid.innerHTML = `
    <div class="movie__poster">
        <img src= "${details.Poster !== "N/A"}" alt="movie poster">
    </div>
    <div class="movie__info">
        <h3 class="movie__title">
            ${details.Title}
        </h3>
        <ul class="movie__msc-info">
            <li class="year">${details.Year}</li>
            <li class="rated">${details.Rated}</li>
            <li class="released">Released:${details.Released}</li>
        </ul>
        <p class="genre"><b>Genre:</b> ${details.Genre}</p>
        <p class="writer"><b>Writer:</b> ${details.Writer}</p>
        <p class="actors"><b>Actors:</b>${details.Actors}</p>
        <p class="plots"><b>Plot:</b>${details.Plot}</p>
        <p class="language"><b>Language:</b>${details.Language}</p>
        <p class="awards"><i class="fa-solid fa-award"></i><b>${details.Awards}</b></p>
    </div>
    `;
}


window.addEventListener('click', (event) => {
  if(event.target.className !== "form__control"){
    searchList.classList.add('hide__search-list');
  }
});