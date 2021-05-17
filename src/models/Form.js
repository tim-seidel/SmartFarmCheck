export default class Form {
    constructor(uuid, title, description, icon) {
        this.uuid = uuid
        this.title = title
        this.description = description
        this.icon = icon
        this.loaded = false
    }
}
