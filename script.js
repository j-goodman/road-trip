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
    "direct route": "🐆",
    "quick": "🐎",
    "tourist": "🐢",
    "snail": "🐌"
}

const getRank = (path, shortestPath) => {
    if (path.length - 1 === shortestPath) {
        return "direct route"
    } else if (path.length - 1 <= shortestPath * 1.5) {
        return "quick"
    } else if (path.length - 1 <= shortestPath * 4) {
        return "tourist"
    } else {
        return "snail"
    }
}

const getShareString = (plainText, short) => {
    let shareString = ``
    shareString += `${countryData[start].flag}`
    shareString += speedSymbols[getRank(path, shortestPath)]
    shareString += `${emojiNumber((path.length - 1).toString().padStart(2, "0"))}`
    shareString += `${countryData[finish].flag}`
    if (!short) {
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
    }
    return shareString.trim()
}

const shareResults = () => {
    const shareString = getShareString(false, true)
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
    if (flagMode) {
        youAreHere.innerText = `${country.flag}`
    }

    let borders = country.borders
    bordersContainer.innerHTML = ""

    if (currentLocation === "USA" && !borders.includes("RUS")) {
        borders.push("RUS")
    } else if (currentLocation === "RUS" && !borders.includes("USA")) {
        borders.push("USA")
    }

    if (countryData[finish]) {
        destination.innerHTML = `Destination: ${nameWithThe(countryData[finish].name.common)} <br class="visible-on-narrow">(<span class="text-small">${countryData[finish].subregion}</span>)`
        subregion.innerText = countryData[currentLocation].subregion.toUpperCase()
    }

    borders.sort().forEach(code => {
        if (countryData[code]) {
            let button = document.createElement("a")
            button.innerText = countryData[code].name.common + " " + countryData[code].flag
            if (flagMode) {
                button.innerText = countryData[code].flag
            }
            bordersContainer.appendChild(button)
            button.onclick = () => {
                path.push(currentLocation)
                xButton.onclick()
                currentLocation = code
                update()
            }
        } else {
            getCountryByCode(code)
        }
    })
    
    let capitalString = ``
    if (!country.capital) {
        capitalString = `it has no official capital.`
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

    let languageString = "The main "
    let languageList = Object.keys(country.languages)
    
    if (languageList.length === 1) {
        languageString += `language is `
    } else {
        languageString += `languages are `
    }
    
    languageList.forEach((key, index) => {
        if (languageList.length === 1) {
            languageString += `${country.languages[key]}.`
        } else if (index === languageList.length - 1) {
            languageString += `and ${country.languages[key]}.`
        } else if (languageList.length === 2) {
            languageString += `${country.languages[key]} `
        } else {
            languageString += `${country.languages[key]}, `
        }
    })

    extraInfo.innerText = `${useThe(country.name.official) ? "The " : ""}${country.name.official} is in ${country.subregion}. ${languageString} There are about ${approximateNumber(country.population)} ${country.demonyms.eng.f} people, and ${capitalString}`
    
    if (currentLocation === finish) {
        success()
    }
}

let path = []
let isRandomMode = false
let flagMode = false

const success = () => {
    destination.innerText = "You made it!"
    const rank = getRank(path, shortestPath)
    subregion.innerHTML = `Number of countries passed through: ${path.length - 1}\n`
    let flags = document.createElement("span")
    flags.innerText = getShareString(true)
    subregion.appendChild(flags)
    if (rank === "direct route") {
        travelFromHere.innerHTML = `Your rank: <br class="visible-on-narrow"><b>${speedSymbols[rank]} ${rank}${isRandomMode ? `.` : `!`}</b>\nYou found the shortest path between ${nameWithThe(countryData[start].name.common)} and ${nameWithThe(countryData[finish].name.common)}. ${isRandomMode ? `` : `Congratulations!`}`
    } else if (rank === "quick"){
        travelFromHere.innerHTML = `Your rank: <br class="visible-on-narrow"><b>${speedSymbols[rank]} ${rank}</b>. Well done, but there was a faster path!`
    } else if (rank === "tourist") {
        travelFromHere.innerHTML = `Your rank: <br class="visible-on-narrow"><b>${speedSymbols[rank]} ${rank}</b>. You took your time to see the sights!`
    } else {
        travelFromHere.innerHTML = `Your rank: <br class="visible-on-narrow"><b>${speedSymbols[rank]} ${rank}</b>. Better luck next time!`
    }
    bordersContainer.innerHTML = ""
    
    if (rank !== "direct route") {
        let tryAgain = document.createElement("a")
        tryAgain.innerText = "Try Again?"
        tryAgain.className = "share-button"
        tryAgain.onclick = () => {
            currentLocation = start
            travelFromHere.innerText = "You can drive to:"
            path = []
            update()
        }
        bordersContainer.appendChild(tryAgain)
    }
    
    if (!isRandomMode) {
        let shareButton = document.createElement("a")
        shareButton.onclick = shareResults
        shareButton.className = "share-button"
        shareButton.innerText = "Share by Text"
        bordersContainer.appendChild(shareButton)
    }

    if (rank === "direct route") {
        let randomMode = document.createElement("a")
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

    let mapLink = document.createElement("a")
    mapLink.href = countryData[finish].maps.googleMaps
    console.log(mapLink.href)
    mapLink.innerText = `Map 🗺`
    mapLink.className = `share-button`
    // bordersContainer.appendChild(mapLink)

    bordersContainer.appendChild(buildMidnightTimer())
}

let countryData = {}
// const arrows = `⬅️↖️⬆️↗️➡️↘️⬇️↙️`

const setDestination = (random) => {
    let daysSinceGameStarted = Math.floor(((Date.now()/1000/60/60) - 4)/24) - 19654
    // days since October 24, 2023

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

    getCountryByCode(finish, update)
    getCountryByCode(currentLocation, update)

    findShortestPath(start, finish)
    currentLocation = start
}

let start, finish, currentLocation;

setDestination()