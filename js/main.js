// GET ELEMENTS FROM DOM
const elMoviesList = document.querySelector(".js-movies-list");
const elMoviesTemplate = document.querySelector(".js-movies-template").content;
const newMoviesFragment = document.createDocumentFragment();
// ----------------------------------------------------------------
const elSearchForm = document.querySelector(".js-search-form");
const elSearchInput = elSearchForm.querySelector(".js-search-input");
const elSearchSelect = elSearchForm.querySelector(".js-search-select");
const elFormYear = document.querySelector(".js-form-year");
const elToYear = document.querySelector(".js-to-year");
const elSearchSort = document.querySelector(".form-select-sort");

const normalizeMovies = movies.map((movie) => {
  return {
    movie_title: movie.Title,
    movie_fulltitle: movie.fulltitle,
    movie_year: movie.movie_year,
    movie_categories: movie.Categories,
    movie_summary: movie.summary,
    movie_imdb_id: movie.imdb_id,
    movie_imdb_rating: movie.imdb_rating,
    movie_runtime: movie.runtime,
    movie_language: movie.language,
    movie_ytid: movie.ytid,
  };
});

// GENERATED GENRES
const genres = [];
function generateGenres() {
  normalizeMovies.forEach((movie) => {
    movie.movie_categories.split("|").forEach((genre) => {
      if (!genres.includes(genre)) {
        genres.push(genre);
      }
    });
  });
  genres.sort();
}

generateGenres();

function renderGenres(_genres) {
  _genres.forEach((genre) => {
    const newOption = document.createElement("option");
    newOption.value = genre;
    newOption.textContent = genre;
    elSearchSelect.appendChild(newOption);
  });
}

renderGenres(genres);

// GET DURATION
function getDuration(_time) {
  const hours = Math.floor(_time / 60);
  const minutes = Math.floor(_time % 60);
  return `${hours} hrs ${minutes} min`;
}

// GET MODAL ELEMENTS FROM DOM
const elModal = document.querySelector(".js-modal");
const elModalTitle = document.querySelector(".js-modal-title");
const elModalIframe = document.querySelector(".js-modal-iframe");
const elModalRating = document.querySelector(".js-modal-rating");
const elModalYear = document.querySelector(".js-modal-year");
const elModalTime = document.querySelector(".js-modal-time");
const elModalCategories = document.querySelector(".js-modal-categories");
const elModalSummary = document.querySelector(".js-modal-summary");
const elModalLink = document.querySelector(".js-modal-link");

// RENDER MODAL FUNCTION
function movieModalInfo(_movie) {
  elModalTitle.textContent = _movie.movie_title;
  elModalIframe.src = `https://www.youtube.com/embed/${_movie.movie_ytid}`;
  elModalRating.textContent = _movie.movie_imdb_rating;
  elModalYear.textContent = _movie.movie_year;
  elModalTime.textContent = getDuration(_movie.movie_runtime);
  elModalCategories.textContent = _movie.movie_categories.split("|").join(", ");
  elModalSummary.textContent = _movie.movie_summary;
  elModalLink.href = `https://www.imdb.com/title/${_movie.movie_imdb_rating}`;
}

// RENDER MOVIES FUNCTION
function renderMovies(_movies) {
  elMoviesList.innerHTML = null;

  _movies.forEach((movie) => {
    const cloneMoviesTemp = elMoviesTemplate.cloneNode(true);

    cloneMoviesTemp.querySelector(
      ".js-movies-img"
    ).src = `https://i3.ytimg.com/vi/${movie.movie_ytid}/hqdefault.jpg`;
    cloneMoviesTemp.querySelector(".js-movies-img").alt = movie.movie_title;
    cloneMoviesTemp.querySelector(".js-movies-title").textContent =
      movie.movie_title;
    cloneMoviesTemp.querySelector(".js-movies-rating").textContent =
      movie.movie_imdb_rating;
    cloneMoviesTemp.querySelector(".js-movies-year").textContent =
      movie.movie_year;
    cloneMoviesTemp.querySelector(".js-movies-time").textContent = getDuration(
      movie.movie_runtime
    );
    cloneMoviesTemp.querySelector(".js-movies-categories").textContent =
      movie.movie_categories.split("|").join(", ");
    cloneMoviesTemp.querySelector(".js-movies-btn").dataset.id =
      movie.movie_imdb_id;

    newMoviesFragment.appendChild(cloneMoviesTemp);
  });
  elMoviesList.appendChild(newMoviesFragment);
}

// FIND MODAL EVENTS
elMoviesList.addEventListener("click", function (evt) {
  const btnId = evt.target.dataset.id;
  if (evt.target.matches(".js-movies-btn")) {
    const foundMovie = normalizeMovies.find(
      (item) => item.movie_imdb_id === btnId
    );
    movieModalInfo(foundMovie);
  }
});

// MODAL IFRAME CLEAR SRC EVENT
elModal.addEventListener("hide.bs.modal", function () {
  elModalIframe.src = null;
});

// SEARCH FUNCTIONS EVENTS
function showSearchResults(search) {
  const filteredMovies = normalizeMovies.filter(
    (movie) =>
      String(movie.movie_title).match(search) &&
      (elSearchSelect.value === "all" ||
        movie.movie_categories.split("|").includes(elSearchSelect.value)) &&
      (elFormYear.value === "" || movie.movie_year >= elFormYear.value) &&
      (elToYear.value === "" || movie.movie_year <= elToYear.value)
  );
  return filteredMovies;
}

elSearchForm.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const inputValue = elSearchInput.value.trim();
  const searchQuery = new RegExp(inputValue, "gi");
  const searchMovies = showSearchResults(searchQuery);

  if (searchMovies.length > 0) {
    renderMovies(searchMovies);
  } else {
    elMoviesList.innerHTML = `<div class="text-white display-3">Not found movie!!!</div>`;
  }
});

// CALL RENDER MOVIES FUNCTION
renderMovies(normalizeMovies.slice(0, 100));
