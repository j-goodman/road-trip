let pathsFromStart = {}
let pathStart
let pathFinish
let shortestPath

const findShortestPath = (start, finish) => {
    console.log(`Finding path between ${start} and ${finish}...`)
    pathStart = start
    pathFinish = finish
    pathsFromStart = {}
    getCountryByCode(start, continuePathing, pathsFromStart, 0)
}

const continuePathing = (country, accumulator, distance) => {
    let code = country.cca3
    if (code === "RUS" && !country.borders.includes("USA")) {
        country.borders.push("USA")
    } else if (code === "USA" && !country.borders.includes("RUS")) {
        country.borders.push("RUS")
    }
    country.borders.forEach(border => {
        if (accumulator[border] === undefined) {
            accumulator[border] = distance
            getCountryByCode(border, continuePathing, accumulator, distance + 1)
        }
    })
    if (code === pathFinish) {
        console.log(`The shortest path between ${countryData[pathStart].name.common} and ${countryData[pathFinish].name.common} passes through ${pathsFromStart[pathFinish]} countries.`)
        shortestPath = pathsFromStart[pathFinish]
    }
}