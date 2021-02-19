//url section
const usersData = 'http://localhost:3000/users'
const favoritesData = 'http://localhost:3000/favorites'
const weatherUrl = ''
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip='
const forecastUrl = 'http://api.openweathermap.org/data/2.5/forecast?zip='
const key = 'appid=a676cbe359f328eaead7426bb2fac895'


//document elements
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
const nameContainer = document.querySelector(".name-container")

const dayOne = document.querySelector(".day-one")
const dayOneIcon = document.querySelector(".day-one-weather-icon")
const dayOneH1 = document.querySelector(".day-one-detail")
const dayOneH2 = document.querySelector(".day-one-date")

const dayTwo = document.querySelector(".day-two")
const dayTwoIcon = document.querySelector(".day-two-weather-icon")
const dayTwoH1 = document.querySelector(".day-two-detail")
const dayTwoH2 = document.querySelector(".day-two-date")

const dayThree = document.querySelector(".day-three")
const dayThreeIcon = document.querySelector(".day-three-weather-icon")
const dayThreeH1 = document.querySelector(".day-three-detail")
const dayThreeH2 = document.querySelector(".day-three-date")


const dayFour = document.querySelector(".day-four")
const dayFourIcon = document.querySelector(".day-four-weather-icon")
const dayFourH1 = document.querySelector(".day-four-detail")
const dayFourH2 = document.querySelector(".day-four-date")

const dayFive = document.querySelector(".day-five")
const dayFiveIcon = document.querySelector(".day-five-weather-icon")
const dayFiveH1 = document.querySelector(".day-five-detail")
const dayFiveH2 = document.querySelector(".day-five-date")

const userID = 1

//fetch functions
// Create a users route that checks for exsiting users
// or creates a new user in db

// font color conditionals depending on temp

// Delete button double click?
// Deletes may be happing optimistically

// Seed more data for "John"

const newName = prompt("Welcome, what is your name?", "John")

const findNewName = _ => {
    fetch(usersData)
        .then(res => res.json())
        .then(userArr => userArr.find(user => user.name === newName))
        .then(user => getUser(user.id))
}

findNewName()

const getUser = id => {
    fetch(usersData + `/${id}`)
        .then(res => res.json())
        .then(dataArr => {
            dataArr.favorites.forEach(favorite => {
                getWeatherForLocation(favorite.zip, favorite.id)
            })
        })
        form.dataset.id = id
        displayName()
}

// getUser()

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
    
    detailedCard.dataset.id = ""
    detailedIcon.className = "detailed-weather-icon"
    detailedName.innerText = ""
    detailedTemp.innerText = ""
    detailedDetails.innerHTML = ""

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

    fetch(forecastUrl + `${zip}` + ",US&units=imperial&" + key)
        .then(res => res.json())
        .then(data => createForecastDetails(data))
}

//display functions
const createForecastDetails = (weather) => {
    // Day One
    if (weather.list[1].weather[0].description.includes("clear")) {
        dayOneIcon.className = "day-one-weather-icon sun"
    }
    else if (weather.list[1].weather[0].description.includes("clouds")) {
        dayOneIcon.className = "day-one-weather-icon cloudy"
    }
    else {
        dayOneIcon.className = "day-one-weather-icon cloud"
    }
    dayOneH1.innerText = `${Math.round(weather.list[1].main.temp)}`
    dayOneH2.innerText = `${weather.list[1].dt_txt.substring(0, 10)}`
    
    // Day Two
    if (weather.list[10].weather[0].description.includes("clear")) {
        dayTwoIcon.className = "day-one-weather-icon sun"
    }
    else if (weather.list[10].weather[0].description.includes("clouds")) {
        dayTwoIcon.className = "day-one-weather-icon cloudy"
    }
    else {
        dayTwoIcon.className = "day-one-weather-icon cloud"
    }
    dayTwoH1.innerText = `${Math.round(weather.list[10].main.temp)}`
    dayTwoH2.innerText = `${weather.list[10].dt_txt.substring(0, 10)}`


    // Day Three
    if (weather.list[19].weather[0].description.includes("clear")) {
        dayThreeIcon.className = "day-one-weather-icon sun"
    }
    else if (weather.list[19].weather[0].description.includes("clouds")) {
        dayThreeIcon.className = "day-one-weather-icon cloudy"
    }
    else {
        dayThreeIcon.className = "day-one-weather-icon cloud"
    }
    dayThreeH1.innerText = `${Math.round(weather.list[19].main.temp)}`
    dayThreeH2.innerText = `${weather.list[19].dt_txt.substring(0, 10)}`


    // Day Four
    if (weather.list[28].weather[0].description.includes("clear")) {
        dayFourIcon.className = "day-one-weather-icon sun"
    }
    else if (weather.list[28].weather[0].description.includes("clouds")) {
        dayFourIcon.className = "day-one-weather-icon cloudy"
    }
    else {
        dayFourIcon.className = "day-one-weather-icon cloud"
    }
    dayFourH1.innerText = `${Math.round(weather.list[28].main.temp)}`
    dayFourH2.innerText = `${weather.list[28].dt_txt.substring(0, 10)}`

    // Day Five
    if (weather.list[37].weather[0].description.includes("clear")) {
        dayFiveIcon.className = "day-one-weather-icon sun"
    }
    else if (weather.list[37].weather[0].description.includes("clouds")) {
        dayFiveIcon.className = "day-one-weather-icon cloudy"
    }
    else {
        dayFiveIcon.className = "day-one-weather-icon cloud"
    }
    dayFiveH1.innerText = `${Math.round(weather.list[37].main.temp)}`
    dayFiveH2.innerText = `${weather.list[37].dt_txt.substring(0, 10)}`


}
const createWeatherDetails = (weather, id) => {
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

const displayName = _ => {
    nameContainer.innerText = `Welcome, ${newName}!`
}

//event listeners
form.addEventListener("submit", getLocation)
favoriteDiv.addEventListener("click", showWeather)


