const getCountryByCode = (code, callback, accumulator, distance) => {
    fetch(`https://restcountries.com/v3.1/alpha/${code}`)
    .then(response => response.json())
    .then(data => {
        countryData[code] = data[0]
        if (callback) {
            callback(data[0], accumulator, distance)
        }
        update()
    })
}

const youAreHere = document.querySelector("#you-are-here")
const extraInfo = document.querySelector("#extra-info")
const howToPlay = document.querySelector("#how-to-play")
const xButton = document.querySelector("#x-button")
const destination = document.querySelector("#destination")
const subregion = document.querySelector("#subregion")
const travelFromHere = document.querySelector("#travel-from-here")
const bordersContainer = document.querySelector("#border-countries")
const speedSymbols = {
    perfect: "🐆",
    speedy: "🐎",
    tourist: "🐢",
    snail: "🐌"
}

const getRank = (path, shortestPath) => {
    if (path.length - 1 === shortestPath) {
        return "perfect"
    } else if (path.length - 1 <= shortestPath * 1.5) {
        return "speedy"
    } else if (path.length - 1 <= shortestPath * 4) {
        return "tourist"
    } else {
        return "snail"
    }
}

const getShareString = (plainText) => {
    let shareString = ``
    shareString += `${countryData[start].flag}`
    shareString += speedSymbols[getRank(path, shortestPath)]
    shareString += `${emojiNumber((path.length - 1).toString().padStart(2, "0"))}`
    shareString += `${countryData[finish].flag}`
    if (path.length - 1 <= 40) {
        path.forEach((code, index) => {
            if (index > 0) {
                shareString += countryData[code].flag
            }
            if (index % 5 === 0 && index !== path.length - 1) {
                shareString += plainText ? `\n` : `%0A`
            }
        })
    } else {
        shareString += plainText ? `\n` : `%0A`
        shareString += `🐌🐌🐌🐌🐌`
    }
    return shareString.trim()
}

const shareResults = () => {
    const shareString = getShareString(false)
    console.log(shareString)
    window.open(`sms:&body=${shareString}`, `_self`);
    return false;
}

xButton.onclick = () => {
    howToPlay.style.display = "none"
}

const update = () => {
    let country = countryData[currentLocation]
    
    if (!country) {
        return false
    }

    youAreHere.innerText = `You're in ${nameWithThe(country.name.common)} ${country.flag}`

    let borders = country.borders
    bordersContainer.innerHTML = ""

    if (currentLocation === "USA" && !borders.includes("RUS")) {
        borders.push("RUS")
    } else if (currentLocation === "RUS" && !borders.includes("USA")) {
        borders.push("USA")
    }

    if (countryData[finish]) {
        destination.innerHTML = `Destination: ${nameWithThe(countryData[finish].name.common)} <br class="visible-on-narrow">(${countryData[finish].subregion})`
        subregion.innerText = countryData[currentLocation].subregion.toUpperCase()
    }

    borders.sort().forEach(code => {
        if (countryData[code]) {
            let button = document.createElement("div")
            button.innerText = countryData[code].name.common + " " + countryData[code].flag
            bordersContainer.appendChild(button)
            button.onclick = () => {
                path.push(currentLocation)
                currentLocation = code
                update()
            }
        } else {
            getCountryByCode(code)
        }
    })
    
    let capitalString = ``
    if (!country.capital) {
        capitalString = `it doesn't have an official capital.`
    } else if (country.capital.length > 1) {
        let list = ""
        country.capital.forEach((city, index) => {
            if (index === country.capital.length - 1) {
                list += `and ${city}`
            } else {
                list += `${city}, `
            }
            capitalString = `the capital cities are ${list}.`
        })
    } else {
        capitalString = `the capital is ${nameWithThe(country.capital[0])}${country.capital[0][country.capital[0].length - 1] === "." ? "" : "."}`
    }

    extraInfo.innerText = `${useThe(country.name.official) ? "The " : ""}${country.name.official} is in ${country.subregion}. There are about ${approximateNumber(country.population)} ${country.demonyms.eng.f} people, and ${capitalString}`
    
    if (currentLocation === finish) {
        success()
    }
}

let path = []
let isRandomMode = false

const success = () => {
    destination.innerText = "You made it!"
    const rank = getRank(path, shortestPath)
    subregion.innerText = `Number of countries passed through: ${path.length - 1}\n${getShareString(true)}`
    if (rank === "perfect") {
        travelFromHere.innerHTML = `Your rank is: <br class="visible-on-narrow"><b>${speedSymbols[rank]}${rank}${isRandomMode ? `` : `!`}</b>\nYou found the shortest possible path between ${nameWithThe(countryData[start].name.common)} and ${nameWithThe(countryData[finish].name.common)}. ${isRandomMode ? `` : `Congratulations, world traveler!`}`
    } else if (rank === "speedy"){
        travelFromHere.innerHTML = `Your rank is: <b>${speedSymbols[rank]}${rank}</b>. Well done, but a faster path is possible!`
    } else {
        travelFromHere.innerHTML = `Your rank is: <b>${speedSymbols[rank]}${rank}</b>. Better luck next time!`
    }
    bordersContainer.innerHTML = ""
    
    if (rank !== "perfect") {
        let tryAgain = document.createElement("div")
        tryAgain.innerText = "Try Again?"
        tryAgain.className = "share-button"
        tryAgain.onclick = () => {
            currentLocation = start
            travelFromHere.innerText = "You can travel to:"
            path = []
            update()
        }
        bordersContainer.appendChild(tryAgain)
    }
    
    if (!isRandomMode) {
        let shareButton = document.createElement("div")
        shareButton.onclick = shareResults
        shareButton.className = "share-button"
        shareButton.innerText = "Share by Text"
        bordersContainer.appendChild(shareButton)
    }

    if (rank === "perfect") {
        let randomMode = document.createElement("div")
        isRandomMode = true
        randomMode.innerText = "Random Mode"
        randomMode.className = "share-button"
        randomMode.onclick = () => {
            setDestination(true)
            currentLocation = start
            travelFromHere.innerText = ""
            path = []
            update()
        }
        bordersContainer.appendChild(randomMode)
    }

    bordersContainer.appendChild(buildMidnightTimer())
}

let countryData = {}

const setDestination = (random) => {
    let daysSinceGameStarted = Math.floor(Date.now()/1000/60/60/24) - 19653
    // days since October 23, 2023
    let startIndex = daysSinceGameStarted % destinations.length
    let finishIndex = (daysSinceGameStarted + 1) % destinations.length
    if (random) {
        start = null
        finish = null
        while (start === finish) {
            startIndex = Math.floor(Math.random() * destinations.length)
            finishIndex = Math.floor(Math.random() * destinations.length)
            start = destinations[startIndex]
            finish = destinations[finishIndex]
        }
    }
    start = destinations[startIndex]
    finish = destinations[finishIndex]

    findShortestPath(start, finish)
    currentLocation = start
}

let start, finish, currentLocation;
getCountryByCode(finish)
setDestination()

getCountryByCode(currentLocation)