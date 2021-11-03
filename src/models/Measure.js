export default class Measure {
    constructor(uuid, name, excerpt, description, resources) {
        this.uuid = uuid
        this.name = name
        this.excerpt = excerpt
        this.description = description
        this.resources = resources ?? []
    }
}
