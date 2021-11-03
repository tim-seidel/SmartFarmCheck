export default class Rating {
    constructor(uuid, name, excerpt, rating) {
        this.uuid = uuid
        this.name = name
        this.excerpt = excerpt
        this.rating = rating
        this.weighted = 1.0;
    }
}
