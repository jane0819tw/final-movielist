

(function () {
  const model = {

    list: document.getElementById('list'),
    genres: {
      "1": "Action",
      "2": "Adventure",
      "3": "Animation",
      "4": "Comedy",
      "5": "Crime",
      "6": "Documentary",
      "7": "Drama",
      "8": "Family",
      "9": "Fantasy",
      "10": "History",
      "11": "Horror",
      "12": "Music",
      "13": "Mystery",
      "14": "Romance",
      "15": "Science Fiction",
      "16": "TV Movie",
      "17": "Thriller",
      "18": "War",
      "19": "Western"
    },
    moviesData: [],
    getMoviesData() {
      axios.get('https://movie-list.alphacamp.io/api/v1/movies').then(res => {
        this.moviesData = res.data.results
        console.log(this.moviesData)
      })
    }
  }
  const view = {
    writeGenres() {
      document.getElementById('list').innerHTML = ''
      Object.entries(model.genres).forEach(genre => document.getElementById('list').innerHTML += this.writeGenre(genre))
    },
    writeGenre(genre) {
      return `<li data-id=${genre[0]} class="list-group-item ${genre[0] === '1' ? 'active' : ''}">${genre[1]}</li>`
    },
    writeMovies(data, nowGenreId) {
      document.getElementById('results').innerHTML = ''
      console.log(data)
      data.forEach(movie => document.getElementById('results').innerHTML += this.writeMovie(movie, nowGenreId))
    },
    writeMovie(movie, nowGenreId) {
      let imageUrl = `https://movie-list.alphacamp.io/posters/${movie.image}`
      return `
      <div class="card col-3" style="width: 18rem;">
        <img class="card-img-top" src=${imageUrl} alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <div class="genres">
            ${this.writeMovieGenres(movie.genres, nowGenreId)}
          </div>
        </div>
      </div>`
    },
    writeMovieGenres(genresNum, nowGenreId) {
      let genre_content = ''
      genresNum.forEach(genreNum => {
        let color = genreNum === nowGenreId ? 'btn-danger' : 'btn-light'
        genre_content += `<div class="btn ${color} btn-sm m-2">${model.genres[genreNum]}</div>`
      })
      return genre_content
    }
  }

  const controller = {
    nowGenreId: 1,
    init() {
      model.getMoviesData()
      view.writeGenres()
      setTimeout(() => {
        view.writeMovies(this.filterGenreData(), this.nowGenreId)
        this.addListener()
      }, 500)
    },
    filterGenreData() {
      return model.moviesData.filter(movie => movie.genres.some(genreId => genreId === this.nowGenreId))
    },
    addListener() {
      model.list.addEventListener('click', evt => {
        if (evt.target.tagName === 'LI') {
          model.list.querySelector('.active').classList.remove('active')
          evt.target.classList.add('active')
          this.nowGenreId = +evt.target.dataset.id
          view.writeMovies(this.filterGenreData(), this.nowGenreId)
        }
      })
    }
  }
  controller.init()
})()
