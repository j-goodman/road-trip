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
const flag = document.querySelector("#flag")
const howToPlay = document.querySelector("#how-to-play")
const xButton = document.querySelector("#x-button")
const startFinish = document.querySelector("#start-finish")

xButton.onclick = () => {
    howToPlay.style.display = "none"
}

const update = () => {
    let country = countryData[currentLocation]
    youAreHere.innerText = `You're in ${useThe(country.name.common) ? "the " : ""}${country.name.common}.`
    flag.innerText = country.flag
    startFinish.innerText = `How fast can you get from ${countryData[start].name.common} to ${countryData[finish].name.common}?`
    let borders = country.borders
    let bordersContainer = document.querySelector("#border-countries")
    bordersContainer.innerHTML = ""
    if (currentLocation === "USA" && !borders.includes("RUS")) {
        borders.push("RUS")
    } else if (currentLocation === "RUS" && !borders.includes("USA")) {
        borders.push("USA")
    }
    borders.forEach(code => {
        if (countryData[code]) {
            let button = document.createElement("div")
            button.innerText = countryData[code].name.common
            bordersContainer.appendChild(button)
            button.onclick = () => {
                currentLocation = code
                update()
            }
        } else {
            getCountryByCode(code)
        }
    })
    extraInfo.innerText = `${useThe(country.name.official) ? "The " : ""}${country.name.official} is in ${country.subregion}. There are ${country.population.toLocaleString()} ${country.demonyms.eng.f} people, and the capital is ${country.capital}${country.capital[0][country.capital[0].length - 1] === "." ? "" : "."}`
}

let path = []

let useThe = (name) => {
    let words = name.split(" ")
    if (
        words.includes("Republic") ||
        words.includes("Federation") ||
        words.includes("Kingdom") ||
        words.includes("Duchy") ||
        words.includes("United")
    ) {
        return true
    }
    return false
}

let countryData = {}

const someAccessibleCountries = ["GUA","MEX","GTM","SLV","HND","BLZ","NIC","CRI","PAN","COL","VEN","GUY","SUR","GUF","BRA","BOL","PER","ECU","CHL","PRY","URY","ARG","USA","CAN","RUS","BLR","CHN","NPL","IND","BTN","MAC","LAO","KGZ","PRK","KOR","MNG","MMR","THA","MYS","IDN","PNG","TLS","BRN","KHM","VNM","HKG","TJK","UZB","TKM","IRN","IRQ","SAU","ARE","YEM","KWT","QAT","OMN","JOR","PSE","ISR","EGY","LBY","NER","BFA","GHA","CIV","MLI","SEN","GNB","GIN","MRT","DZA","TUN","LBN","SYR","PAK","AFG","AZE","GEO","TUR","ARM","TCD","CMR","GAB","COG","AGO","ZMB","NAM","BWA","ZAF","MOZ","LSO","SWZ","ZWE","TZA","KEN","MWI","UGA","RWA","COD","BDI","SOM","ETH","ERI","SDN","CAF","MAR","ESP","PRT","GIB","AND","FRA","MCO","CHE","AUT","CZE","DEU","DNK","POL","LTU","LVA","EST","FIN","SWE","NOR","BGD","GRC","ALB","MKD","SRB","HRV","SVN","ITA","BIH","ROU","MDA","UKR","HUN","LIE","SMR","VAT","BEL","NLD"] // 143

const start = someAccessibleCountries[Math.floor(Math.random() * someAccessibleCountries.length)]
const finish = someAccessibleCountries[Math.floor(Math.random() * someAccessibleCountries.length)]
getCountryByCode(start)
getCountryByCode(finish)

let currentLocation = start
getCountryByCode(currentLocation)
