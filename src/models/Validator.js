export default class Validator {
	constructor(uuid, inputType, pattern = '', minLength = 0, maxLength = 0, min = 0, max = 0, options = [], repeatable = false, unit = null) {
		this.uuid = uuid
		this.inputType = inputType
		this.pattern = pattern
		this.minLength = minLength
		this.maxLength = maxLength ? maxLength : 1000
		this.min = max != 0 ? Math.min(min, max) : min
		this.max = max != 0 ? Math.max(min, max) : max
		this.options = options ?? []
		this.repeatable = repeatable
		this.unit = unit
	}
}
