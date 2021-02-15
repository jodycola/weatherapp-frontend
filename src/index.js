//url section
const usersData = 'http://localhost:3000/users'
const favoritesData = 'http://localhost:3000/favorites'
const weatherUrl = ''
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip='

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
                getWeatherForLocation(favorite.zip)
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

    fetch(favoritesData, configObj)
    .then(res => res.json())
    .then(data => {
        console.log(data)
    })


    // createHomeLocationForUser(zip)
    getWeatherForLocation(zip)
}


const getWeatherForLocation = zip => {
    fetch(baseUrl + `${zip}` + "&units=imperial&appid=a676cbe359f328eaead7426bb2fac895")
        .then(res => res.json())
        .then(data => createNewFavorite(data))
}

//display functions

const createNewFavorite = weather => {
    const favoriteCard = document.createElement('div')
    favoriteCard.className = "weather-card"

    const favoriteIcon = document.createElement('div')
    favoriteIcon.className = "weather-icon sun"
    
    const h1 = document.createElement('h1')
    h1.innerText = Math.round(weather.main.temp) + '°'

    const p = document.createElement('p')
    p.innerText = weather.name

    favoriteCard.append(p, h1, favoriteIcon)
    favoriteDiv.append(favoriteCard)
}


// const getUsers = _ => {
//     fetch ('http://localhost:3000/users')
//     .then(res => res.json())
//     .then(userArr => userArr.forEach(user => {
//         showName(user)
//     }))
// }

// const showName = user => {
//     const name = document.createElement("div")
//     const h2 = document.createElement('h2')
//     h2.innerText = `${user.name}`

//     name.append(h2)
//     document.body.append(name)
// }


// getCurrentLocation()
// getWeatherForLocation(location)
// getUsers()

//event listeners
form.addEventListener("submit", getLocation)