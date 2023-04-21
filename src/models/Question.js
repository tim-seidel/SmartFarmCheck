export default class Question {
	constructor(uuid, text, description, validator, formPriority) {
		this.uuid = uuid
		this.text = text
		this.description = description
		this.validator = validator
		this.formPriority = formPriority
		this.input = ''
		this.validity = 'unedited'
	}
}
