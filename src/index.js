//url section
const railsData = 'http://localhost:3000/users'
const weatherUrl = ''
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip='

//document elements
const form = document.querySelector("#location-form")
const favoriteDiv = document.querySelector('#favorites')
const homeWeather = document.querySelector('.detail-image')
const homeLocation = document.querySelector('.title')

//fetch functions
const getUser = _ => {
    fetch(railsData + '/1')
        .then(res => res.json())
        .then(dataArr => {
            dataArr.favorites.forEach(favorite => {
                getWeatherForLocation(favorite.location.zip)
            })
        })
}

getUser()

const getLocation = event => {
    event.preventDefault()
    const userId = event.target.dataset.id
    const zip = event.target.location.value

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
    const span = document.createElement('span')
    const h5 = document.createElement('h5')
    h5.innerText = weather.name
    span.innerText = weather.main.temp
    // const favBtn
    span.append(h5)
    favoriteDiv.append(span)
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