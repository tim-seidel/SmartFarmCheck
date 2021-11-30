export const NumberValidation = function (validator, input) {
	let validity = 'empty'
	let message = "Bitte einen Wert eingeben.";

	if (!isStringEmpty(input)) {
		validity = !isNaN(input) && input >= validator.min && input <= validator.max ? 'valid' : 'invalid'
	}

	if (validator.min === 0 && validator.max === 0) {
		return NoRangeValidation(validator, input)
	} else if (validator.min === 0 && validator.max > 0) {
		return NumberSmallerValidation(validator, input)
	} else if (validator.max === 0 && validator.min > 0) { //Treat it as no upper border
		return NumberBiggerValidation(validator, input)
	} else if (validator.min !== validator.max) {
		return NumberRangeValidation(validator, input)
	}

	return { validity: validity, message: message }
}

const NoRangeValidation = function (validator, input) {
	let validity = 'empty'
	let message = "Bitte einen Wert eingeben."

	if (!isStringEmpty(input)) {
		validity = !isNaN(input) ? 'valid' : 'invalid'
	}

	return { validity: validity, message: message }
}

const NumberRangeValidation = function (validator, input) {
	let validity = 'empty'
	const message = "Bitte einen Wert zwischen " + validator.min + " und " + validator.max + " eingeben.";

	if (!isStringEmpty(input)) {
		validity = !isNaN(input) && input >= validator.min && input <= validator.max ? 'valid' : 'invalid'
	}

	return { validity: validity, message: message }
}

const NumberSmallerValidation = function (validator, input) {
	let validity = 'empty'
	const message = "Bitte einen Wert bis " + validator.max + " eingeben.";

	if (!isStringEmpty(input)) {
		validity = !isNaN(input) && input >= validator.min && input <= validator.max ? 'valid' : 'invalid'
	}

	return { validity: validity, message: message }
}

const NumberBiggerValidation = function (validator, input) {
	let validity = 'empty'
	const message = "Bitte einen Wert ab " + validator.min + " eingeben.";

	if (!isStringEmpty(input)) {
		validity = !isNaN(input) && input >= validator.min ? 'valid' : 'invalid'
	}

	return { validity: validity, message: message }
}

export const StringValidation = function (validator, input) {
	let validity = 'empty'
	if (!isStringEmpty(input)) {
		validity = input.length >= validator.minLength && input.length <= validator.maxLength ? 'valid' : 'invalid'
	}
	const message = "Länge zwischen " + validator.minLength + " und " + validator.maxLength + " Zeichen.";

	return { validity: validity, message: message }
}

export const SelectValidation = function (validator, input) {
	let validity = 'empty'
	if (!isStringEmpty(input)) {
		validity = validator.options.includes(input) ? 'valid' : 'invalid'
	}
	const message = "Bitte eine Möglichkeit auswählen."

	return { validity: validity, message: message }
}

export function getValidation(validator) {
	return validator.inputType === "NUMBER" ? NumberValidation : validator.inputType === "SELECT" ? SelectValidation : StringValidation
}

export function isStringEmpty(str) {
	return !str || str.trim() != ''
}