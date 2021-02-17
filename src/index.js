//url section
const usersData = 'http://localhost:3000/users'
const favoritesData = 'http://localhost:3000/favorites'
const weatherUrl = ''
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip='
const key = 'appid=a676cbe359f328eaead7426bb2fac895'


//document elements
const form = document.querySelector("#location-form")
const favoriteDiv = document.querySelector('div.weather-wrapper')
const homeWeather = document.querySelector('.detail-image')
const homeLocation = document.querySelector('.title')
const userID = 1

//fetch functions
const getUser = _ => {
    fetch(usersData + '/1')
        .then(res => res.json())
        .then(dataArr => {
            dataArr.favorites.forEach(favorite => {
                getWeatherForLocation(favorite.zip, favorite.id)
            })
        })
        form.dataset.id = userID
}

getUser()

const getLocation = event => {
    event.preventDefault()
    const user_id = event.target.dataset.id
    const zip = event.target.location.value

    const newFavorite = {user_id, zip}

    configObj = {
        method: "POST",
        headers: { "Content-type":"application/json" },
        body: JSON.stringify(newFavorite)
    }

        return fetch(favoritesData, configObj)
        .then(res => res.json())
        .then(data => {
            getWeatherForLocation(data.zip, data.id)
        })
    // createHomeLocationForUser(zip)
    
}

const deleteLocation = event => {
    const deleteId = event.target.closest(".delete-box").dataset.id
    fetch(favoritesData + '/' + deleteId, {
        method: "DELETE",
    })
    .then(res => res.json())

    Array.from(favoriteDiv.children).forEach(child => child.remove())
    getUser()

}

const getWeatherForLocation = (zip, id) => {
    const ID = id
    fetch(baseUrl + `${zip}` + "&units=imperial&" + key)
        .then(res => res.json())
        .then(data => createNewFavorite(data, ID))
}

const detailWeather = _ => {
    console.log(event.target.closest("div"))
    weatherDetails
    // obtain weather details from openweatherapi
        // fetch get favoritedata with id
        // save zip to variable
        // fetch openweather with zip
        // parse data fill out 
    // fill OUT DOM

}
//display functions

const createNewFavorite = (weather, id) => {
    const favoriteCard = document.createElement('div')
    favoriteCard.className = "weather-card"
    favoriteCard.dataset.id = id

    const favoriteIcon = document.createElement('div')
    if (weather.weather[0].main === 'Clear') {
    favoriteIcon.className = "weather-icon sun"
    } else {
    favoriteIcon.className = "weather-icon cloud"
    }

    const h1 = document.createElement('h1')
    h1.innerText = Math.round(weather.main.temp) + '°'

    const p = document.createElement('p')
    p.innerText = weather.name

    const deleteDiv = document.createElement('div')
    deleteDiv.className = "delete-box"
    deleteDiv.dataset.id = id

    const boxLeft = document.createElement('div')
    boxLeft.className = 'box-left'

    const fa = document.createElement("i")
    fa.className = "but-icon fa fa-lg fa-times"

    boxLeft.append(fa)
    deleteDiv.append(boxLeft)
    favoriteCard.append(p, h1, favoriteIcon, deleteDiv)
    favoriteDiv.append(favoriteCard)

    deleteDiv.addEventListener('click', deleteLocation)
}

//event listeners
form.addEventListener("submit", getLocation)
favoriteDiv.addEventListener("click", detailWeather)

// testiing google maps
const googleKey = 'AIzaSyDbomeIPzvVSlX_5YR9hSPOofDQpHUvcZE'
