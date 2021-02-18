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
const detailedDiv = document.querySelector(".detailed-weather-card")
const detailedDivName = document.querySelector(".detail")
const detailedDivDetails = document.querySelector(".details")
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

const showWeather = _ => {
    weather_id = event.target.closest("div").dataset.id

        fetch(favoritesData + '/' + weather_id)
            .then(res => res.json())
            .then(data => fetchWeatherData(data.zip, weather_id))    
}

const fetchWeatherData = (zip, id) => {
    const ID = id
    fetch(baseUrl + `${zip}` + "&units=imperial&" + key)
        .then(res => res.json())
        .then(data => createWeatherDetails(data, ID))
}

//display functions
const createWeatherDetails = (weather, id) => {
    detailedDiv.dataset.id = id
    detailedDivName.innerText = weather.name
    detailedDivDetails.innerHTML = `<pre>
    The temperture is ${Math.round(weather.main.temp)}°
    The temperture feels like ${Math.round(weather.main.feels_like)}°
    ${weather.weather[0].main} with ${weather.weather[0].description}
    The wind speed is ${weather.wind.speed} mph
    `
}

const createNewFavorite = (weather, id) => {
    const favoriteCard = document.createElement('div')
    favoriteCard.className = "weather-card"
    favoriteCard.dataset.id = id

    const favoriteIcon = document.createElement('div')
    if (weather.weather[0].description.includes("clear")) {
        favoriteIcon.className = "weather-icon sun"
    }
    else if (weather.weather[0].description.includes("clouds")) {
        favoriteIcon.className = "weather-icon cloudy"
    }
    else {
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
favoriteDiv.addEventListener("click", showWeather)

// testiing google maps
const googleKey = 'AIzaSyDbomeIPzvVSlX_5YR9hSPOofDQpHUvcZE'

let map;

const initMap = _ => {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644},
    zoom: 8,
  });
}

initMap()
