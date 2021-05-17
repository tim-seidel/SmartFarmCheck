export default class Validator {
    constructor(uuid, inputType, pattern = '', minLength = 0, maxLength = 0, min = 0, max = 0, options = [], repeatable = false, unit = null) {
        this.uuid = uuid
        this.inputType = inputType
        this.pattern = pattern
        this.minLength = minLength
        this.maxLength = maxLength ? maxLength: 1000
        this.min = min
        this.max = max
        this.options = options ?? []
        this.repeatable = repeatable
        this.unit = unit
    }
}
