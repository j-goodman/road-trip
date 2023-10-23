const getCountryByCode = (code) => {
    fetch(`https://restcountries.com/v3.1/alpha/${code}`)
    .then(response => response.json())
    .then(data => {
        countryData[code] = data[0]
        update()
    })
}

const youAreHere = document.querySelector("#you-are-here")
const extraInfo = document.querySelector("#extra-info")
const howToPlay = document.querySelector("#how-to-play")
const xButton = document.querySelector("#x-button")
const shareButton = document.querySelector("#share-button")
const destination = document.querySelector("#destination")
const subregion = document.querySelector("#subregion")
const travelFromHere = document.querySelector("#travel-from-here")
const bordersContainer = document.querySelector("#border-countries")

shareButton.onclick = function () {
    window.open(`sms:&body=My%20text%20for%20iOS%208`, '_self');
    return false;
}

xButton.onclick = () => {
    howToPlay.style.display = "none"
}

const update = () => {
    let country = countryData[currentLocation]
    youAreHere.innerText = `You're in ${nameWithThe(country.name.common)} ${country.flag}`

    if (
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

    destination.innerText = `Destination: ${nameWithThe(countryData[finish].name.common)} (${countryData[finish].subregion})`
    subregion.innerText = countryData[currentLocation].subregion.toUpperCase()

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
    
    extraInfo.innerText = `${useThe(country.name.official) ? "The " : ""}${country.name.official} is in ${country.subregion}. There are ${country.population.toLocaleString()} ${country.demonyms.eng.f} people, and the capital is ${country.capital}${country.capital[0][country.capital[0].length - 1] === "." ? "" : "."}`
    
    if (currentLocation === finish) {
        success()
    }
}

let path = []

const useThe = (name) => {
    let words = name.split(" ")
    if (
        words.includes("Republic") ||
        words.includes("Federation") ||
        words.includes("Kingdom") ||
        words.includes("Duchy") ||
        words.includes("State") ||
        words.includes("Confederation") ||
        words.includes("Principality") ||
        words.includes("Sultanate") ||
        words.includes("United")
        ) {
            return true
        }
        return false
    }
    
    const nameWithThe = (name) => {
        return `${useThe(name) ? "the " : ""}${name}`
    }
    
    const success = () => {
        console.log("Success!")
        path.push(currentLocation)
        extraInfo.innerText = ""
        destination.innerText = ""
        subregion.innerText = ""
        travelFromHere.innerText = ""
        bordersContainer.innerHTML = "You've arrived!"
        shareButton.classList.remove("nondisplay")
    }
    
    let countryData = {}
    
    const someAccessibleCountries = ["GUA","MEX","SLV","HND","BLZ","NIC","CRI","PAN","COL","VEN","GUY","SUR","GUF","BRA","BOL","PER","ECU","CHL","PRY","URY","ARG","USA","CAN","RUS","BLR","CHN","NPL","IND","BTN","MAC","LAO","KGZ","PRK","KOR","MNG","MMR","THA","MYS","IDN","TLS","BRN","KHM","VNM","HKG","TJK","UZB","TKM","IRN","IRQ","SAU","ARE","YEM","KWT","QAT","OMN","JOR","PSE","ISR","EGY","LBY","NER","BFA","GHA","CIV","MLI","SEN","GNB","GIN","MRT","DZA","TUN","LBN","SYR","PAK","AFG","AZE","GEO","TUR","ARM","TCD","CMR","GAB","COG","AGO","ZMB","NAM","BWA","ZAF","MOZ","LSO","SWZ","ZWE","TZA","KEN","MWI","UGA","RWA","COD","BDI","SOM","ETH","ERI","SDN","CAF","MAR","ESP","PRT","GIB","AND","FRA","MCO","CHE","AUT","CZE","DEU","DNK","POL","LTU","LVA","EST","FIN","SWE","NOR","BGD","GRC","ALB","MKD","SRB","HRV","SVN","ITA","BIH","ROU","MDA","UKR","HUN","LIE","SMR","VAT","BEL","NLD"] // 142

const setDestination = () => {
    start = someAccessibleCountries[Math.floor(Math.random() * someAccessibleCountries.length)]
    finish = someAccessibleCountries[Math.floor(Math.random() * someAccessibleCountries.length)]
    
    while (start === finish) {
        finish = someAccessibleCountries[Math.floor(Math.random() * someAccessibleCountries.length)]
    }

    getCountryByCode(start)
    getCountryByCode(finish)
    currentLocation = start
}

let start, finish, currentLocation;
setDestination()

getCountryByCode(currentLocation)