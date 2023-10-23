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
    loafer: "🐌"
}

const getRank = (path, shortestPath) => {
    if (path.length - 1 === shortestPath) {
        return "perfect"
    } else if (path.length - 1 <= shortestPath * 1.5) {
        return "speedy"
    } else if (path.length - 1 <= shortestPath * 3) {
        return "tourist"
    } else {
        return "loafer"
    }
}

const getShareString = (plainText) => {
    let shareString = ``
    shareString += `${countryData[start].flag}`
    shareString += speedSymbols[getRank(path, shortestPath)]
    shareString += `${emojiNumber((path.length - 1).toString().padStart(2, "0"))}`
    shareString += `${countryData[finish].flag}`
    if (path.length - 1 <= 35) {
        path.forEach((code, index) => {
            if (index > 0) {
                shareString += countryData[code].flag
            }
            if (index % 5 === 0) {
                shareString += plainText ? `\n` : `%0A`
            }
        })
    } else {
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

    if (
        countryData[start] && countryData[finish] &&
        countryData[start].continents[0] === countryData[finish].continents[0] ||
        countryData[start].borders.includes(finish)
    ) {
        setDestination()
    }

    let borders = country.borders
    bordersContainer.innerHTML = ""

    if (currentLocation === "USA" && !borders.includes("RUS")) {
        borders.push("RUS")
    } else if (currentLocation === "RUS" && !borders.includes("USA")) {
        borders.push("USA")
    }

    if (countryData[finish]) {
        destination.innerText = `Destination: ${nameWithThe(countryData[finish].name.common)} (${countryData[finish].subregion})`
        subregion.innerText = countryData[currentLocation].subregion.toUpperCase()
    }

    borders.forEach(code => {
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
        capitalString = `it does not have an official capital.`
    } else {
        capitalString = `the capital is ${nameWithThe(country.capital[0])}${country.capital[0][country.capital[0].length - 1] === "." ? "" : "."}`
    }

    extraInfo.innerText = `${useThe(country.name.official) ? "The " : ""}${country.name.official} is in ${country.subregion}. There are about ${approximateNumber(country.population)} ${country.demonyms.eng.f} people, and ${capitalString}`
    
    if (currentLocation === finish) {
        success()
    }
}

let path = []

const success = () => {
    console.log("Success!")
    destination.innerText = "You made it!"
    const rank = getRank(path, shortestPath)
    subregion.innerText = getShareString(true)
    if (rank === "perfect") {
        travelFromHere.innerHTML = `Your rank is: <b>${speedSymbols[rank]}${rank}!</b>\nYou found the shortest possible path between ${nameWithThe(countryData[start].name.common)} and ${nameWithThe(countryData[finish].name.common)}. Congratulations, world traveler!`
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
    
    let shareButton = document.createElement("div")
    shareButton.onclick = shareResults
    shareButton.className = "share-button"
    shareButton.innerText = "Share by Text"
    bordersContainer.appendChild(shareButton)
}

let countryData = {}

const someAccessibleCountries = ["GUA","MEX","SLV","HND","BLZ","NIC","CRI","PAN","COL","VEN","GUY","SUR","GUF","BRA","BOL","PER","ECU","CHL","PRY","URY","ARG","USA","CAN","RUS","BLR","CHN","NPL","IND","BTN","MAC","LAO","KGZ","PRK","KOR","MNG","MMR","THA","MYS","IDN","TLS","BRN","KHM","VNM","HKG","TJK","UZB","TKM","IRN","IRQ","SAU","ARE","YEM","KWT","QAT","OMN","JOR","PSE","ISR","EGY","LBY","NER","BFA","GHA","CIV","MLI","SEN","GNB","GIN","MRT","DZA","TUN","LBN","SYR","PAK","AFG","AZE","GEO","TUR","ARM","TCD","CMR","GAB","COG","AGO","ZMB","NAM","BWA","ZAF","MOZ","LSO","SWZ","ZWE","TZA","KEN","MWI","UGA","RWA","COD","BDI","SOM","ETH","ERI","SDN","CAF","MAR","ESP","PRT","GIB","AND","FRA","MCO","CHE","AUT","CZE","DEU","DNK","POL","LTU","LVA","EST","FIN","SWE","NOR","BGD","GRC","ALB","MKD","SRB","HRV","SVN","ITA","BIH","ROU","MDA","UKR","HUN","LIE","SMR","VAT","BEL","NLD"] // 142

const setDestination = () => {
    start = someAccessibleCountries[Math.floor(Math.random() * someAccessibleCountries.length)]
    finish = someAccessibleCountries[Math.floor(Math.random() * someAccessibleCountries.length)]
    
    while (start === finish) {
        finish = someAccessibleCountries[Math.floor(Math.random() * someAccessibleCountries.length)]
    }

    findShortestPath(start, finish)
    currentLocation = start
}

let start, finish, currentLocation;
setDestination()

getCountryByCode(currentLocation)