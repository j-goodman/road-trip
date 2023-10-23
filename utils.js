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

const approximateNumber = (number) => {
    let orderOfMagnitude = 10 ** (number.toString().length - 1)
    if (orderOfMagnitude === 1000000000) {
        orderOfMagnitude /= 10
    }
    const roundedNumber = Math.round(number / orderOfMagnitude) * orderOfMagnitude
    const numberWords = {
        1000000000: "billion",
        1000000: "million",
        1000: "thousand",
        100: "hundred",
    }
    const numbersWithWords = Object.keys(numberWords)
    let numberString
    for (wordNumber of numbersWithWords) {
        if (roundedNumber >= wordNumber) {
            numberString = `${roundedNumber / wordNumber} ${numberWords[wordNumber]}`
        }
    }
    return numberString
}

function emojiNumber(number) {
    // Define an array of combining characters for numbers 0-9
    const numberEmojis = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
  
    // Convert the number to a string and split it into individual digits
    const numberString = number.toString();
    const numberDigits = numberString.split('');
  
    // Use map to replace each digit with its corresponding emoji
    const emojiString = numberDigits.map(digit => numberEmojis[digit]).join('');
  
    return emojiString;
}