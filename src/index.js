/////// URL SECTION ///////
const usersData = 'http://localhost:3000/users'
const favoritesData = 'http://localhost:3000/favorites'
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip='
const cityUrl = 'http://api.openweathermap.org/data/2.5/weather?q='
const key = 'appid=a676cbe359f328eaead7426bb2fac895'


/////// DOCUMENT ELEMENTS ///////
const form = document.querySelector("#location-form")
const favoriteDiv = document.querySelector('div.weather-wrapper')
const homeWeather = document.querySelector('.detail-image')
const homeLocation = document.querySelector('.title')
const detailedWrapper = document.querySelector(".detailed-weather-wrapper")
const detailedCard = document.querySelector(".detailed-weather-card")
const detailedName = document.querySelector(".detail")
const detailedDetails = document.querySelector(".details")
const detailedIcon = document.querySelector(".detailed-weather-icon")
const detailedTemp = document.querySelector(".detail-temp")
const userID = 1


// Create a users route that checks for exsiting users
// or creates a new user in db
// Valdation for new users

// Valadation for multiple favorite locations

// 5 day forecast

// City name search should work as well

// Make app look pretty in CSS
// font color conditionals depending on temp

// Work on radar

// Delete button double click?
// Deletes may be happing optimistically

// Seed more data for "John"

// Accordian slider?
// https://accordionslider.com/

/////// FETCH FUNCTIONS ///////

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
  }


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
    const result = event.target.location.value

    if (isNumeric(result)){
        fetch(baseUrl + `${result}` + "&units=imperial&" + key)
            .then(res => res.json())
            .then(data => createLocationObj(data.name, user_id))
    }
    else {
        fetch(cityUrl + `${result}` + "&units=imperial&" + key)
            .then(res => res.json())
            .then(data => createLocationObj(data.name, user_id))
    }

    // const zip = event.target.location.value

    // const newFavorite = {user_id, zip}

    // configObj = {
    //     method: "POST",
    //     headers: { "Content-type":"application/json" },
    //     body: JSON.stringify(newFavorite)
    // }

    //     return fetch(favoritesData, configObj)
    //     .then(res => res.json())
    //     .then(data => {
    //         getWeatherForLocation(data.zip, data.id)
    //     })
    
}

const createLocationObj = (city, user_id) => {
    fetch(favoritesData, {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({city, user_id})
    })
        .then(res => res.json())
        .then(data => {getWeatherForLocation(data.name, data.id)})
}

const deleteLocation = event => {
    const deleteId = event.target.closest(".delete-box").dataset.id
    fetch(favoritesData + '/' + deleteId, {
        method: "DELETE",
    })
    .then(res => res.json())

    Array.from(favoriteDiv.children).forEach(child => child.remove())
    getUser()
    
    detailedCard.dataset.id = ""
    detailedIcon.className = "detailed-weather-icon"
    detailedName.innerText = ""
    detailedTemp.innerText = ""
    detailedDetails.innerHTML = ""

}

const getWeatherForLocation = (city, id) => {
    const ID = id
    fetch(cityUrl + `${city}` + "&units=imperial&" + key)
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

/////// DOM FUNCTIONS ///////
const createWeatherDetails = (weather, id) => {
    // Logic to change temp color based off temp number

    detailedCard.dataset.id = id

    if (weather.weather[0].description.includes("clear")) {
        detailedIcon.className = "detailed-weather-icon sun"
    }
    else if (weather.weather[0].description.includes("clouds")) {
        detailedIcon.className = "detailed-weather-icon cloudy"
    }
    else {
        detailedIcon.className = "detailed-weather-icon cloud"
    }

    detailedName.innerText = weather.name
    detailedTemp.innerText = `${Math.round(weather.main.temp)}°`
    detailedDetails.innerHTML = `<pre>
    The temperture feels like ${Math.round(weather.main.feels_like)}°
    Description: ${weather.weather[0].main} / ${weather.weather[0].description}
    The wind speed is currently ${weather.wind.speed} mph
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

/////// EVENT LISTENERS ///////
form.addEventListener("submit", getLocation)
favoriteDiv.addEventListener("click", showWeather)


/////// HELPER FUNCTIONS ///////
function isNumeric(str) {
    if (typeof str != "string") return false 
    return !isNaN(str) &&
           !isNaN(parseFloat(str))
  }
  
// testing google maps
const googleKey = 'AIzaSyDbomeIPzvVSlX_5YR9hSPOofDQpHUvcZE'

