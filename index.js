// Configuration object
const autoCompleteConfig = {
  renderOption : (movie) => {
    let imgSource = '';
    // Check if there is an image
    if(movie.Poster !== 'N/A') {
      imgSource = movie.Poster;
    }
    // return the formed movie info for dropdown
    return `
    <img src="${imgSource}" />
    ${movie.Title} (${movie.Year})
    `;
  },
  inputValue : (movie) => {
    return movie.Title;
  },
  // By search using s parameter
  fetchData : async (searchValue) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        // the parameters to append to the api url
        params: {
            apikey: conf.MY_KEY,
            s: searchValue        // search parameter
        }
    });
    // Check for error in the response
    if(response.data.Error){
      return []; // empty array, no movies data
    }
    // return a Promise with movies data
    return response.data.Search; 
  }
};

// create left element
createAutoComplete({
  rootElement : document.querySelector("#left-autocomplete"),
  ...autoCompleteConfig,
  onOptionSelect : (movie) => {
    // hide the info-label with instructions column
    document.querySelector('.info-label').classList.add('is-hidden');
    // get the complete movie info
    onMovieSelect(movie.imdbID, document.querySelector("#left-summary"), "left");
  }
});

// create right element
createAutoComplete({
  rootElement : document.querySelector("#right-autocomplete"),
  ...autoCompleteConfig,
  onOptionSelect : (movie) => {
    // hide the tutorial column
    document.querySelector('.info-label').classList.add('is-hidden');
    // get the complete movie info
    onMovieSelect(movie.imdbID, document.querySelector("#right-summary"), "right");
  }
});

let leftMovie;
let rightMovie;
// gets a movie detailed info to display using id
const onMovieSelect = async (id, summaryDiv, position) => {
  const response = await axios.get('http://www.omdbapi.com/', {
      // the parameters to append to the api url
      params: {
          apikey: conf.MY_KEY,
          i: id       
      }
  });

  // display the movie summary 
  summaryDiv.innerHTML = movieTemplate(response.data);
  // get left and right movie
  if (position === "left") 
  {
    leftMovie = response.data;
  } 
  else 
  {
    rightMovie = response.data;
  }

  // check if there are two movies found on both sides
  if (leftMovie && rightMovie) 
  {
    compareMovies();
  }
}

// compares the movies ratings
const compareMovies = () => {
  const leftMovieStats = document.querySelectorAll("#left-summary .notification");
  const rightMovieStats = document.querySelectorAll("#right-summary .notification");

  // loop all stats
  leftMovieStats.forEach((leftElementStat, index) => {

    // access the numeric values of the elements
    const leftMovieValue = parseFloat(leftElementStat.dataset.value);
    const rightMovieValue = parseFloat(rightMovieStats[index].dataset.value);

    // check if the values on both sides are numeric
    if(!isNaN(leftMovieValue) && !isNaN(rightMovieValue)) 
    {     
      if (rightMovieValue > leftMovieValue) 
      {
        leftElementStat.classList.remove('is-primary');
        leftElementStat.classList.add('is-warning');
      } 
      else if(rightMovieValue < leftMovieValue) 
      {
        rightMovieStats[index].classList.remove('is-primary');
        rightMovieStats[index].classList.add('is-warning');
      }
    }
    else 
    { 
      // change the background color on both side stats to blue
      leftElementStat.classList.remove('is-primary');
      leftElementStat.classList.add('is-info');
      rightMovieStats[index].classList.remove('is-primary');
      rightMovieStats[index].classList.add('is-info');
    } 
  });
};

// constucts a template with the selected movie info
const movieTemplate = movieInfo => {

  // calculate the number of awards
  const awards = movieInfo.Awards.split(' ').reduce((previous,element) => {
    const value = parseInt(element);
    if (!isNaN(value)) 
    {
       previous += value;
    } 
      return previous;
  }, 0); // previous starts with 0


  // get numeric values from the strings
  const dollars = parseInt(movieInfo.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));

  const metascore = parseInt(movieInfo.Metascore);

  const imdbRating = parseFloat(movieInfo.imdbRating);

  const votes = parseInt(movieInfo.imdbVotes.replace(/,/g, ''));


  return `
  <article class="media">
  <figure class="media-left">
    <p class="image">
      <img src="${movieInfo.Poster}">
    </p>
  </figure>
    <div class="media-content">
      <div class="content">
        <h1>${movieInfo.Title}</h1>
        <h4>${movieInfo.Genre}</h4>
        <p>${movieInfo.Plot}</p>
      </div>
  </article>

  <article data-value=${awards} class="notification is-primary">
    <p class="title">${movieInfo.Awards}</p>
    <p class="subtitle">Awards</p>
  </article>

  <article data-value=${dollars} class="notification is-primary">
    <p class="title">${movieInfo.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
  </article>

  <article data-value=${metascore} class="notification is-primary">
    <p class="title">${movieInfo.Metascore}</p>
    <p class="subtitle">Metascore</p>
  </article>

  <article data-value=${imdbRating} class="notification is-primary">
    <p class="title">${movieInfo.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
  </article>

  <article data-value=${votes} class="notification is-primary">
    <p class="title">${movieInfo.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
  </article>
  `;
}