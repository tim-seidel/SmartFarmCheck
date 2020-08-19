export const NumberValidatior = function (validator, input) {
    let validity = 'empty'
    if (input !== null && input !== undefined && input !== '') {
        validity = !isNaN(input) && input >= validator.min && input <= validator.max ? 'valid' : 'invalid'
    }
    const message = "Bitte einen Wert zwischen " + validator.min + " und " + validator.max + " eingeben.";

    return { validity: validity, message: message }
}

export const StringValidator = function (validator, input) {
    let validity = 'empty'
    if (input !== null && input !== undefined && input.length > 0) {
        validity = input.length >= validator.minLength && input.length <= validator.maxLength ? 'valid' : 'invalid'
    }
    const message = "Länge zwischen " + validator.minLength + " und " + validator.maxLength + " Zeichen.";

    return { validity: validity, message: message }
}

export const SelectValidator = function (validator, input) {
    let validity = 'empty'
    if (input !== null && input !== undefined && input.length > 0) {
        validity = validator.options.includes(input) ? 'valid' : 'invalid'
    }
    const message = "Bitte eine Möglichkeit auswählen."

    return { validity: validity, message: message }
}
