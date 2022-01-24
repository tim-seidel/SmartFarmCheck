export default class Rating {
	constructor(uuid, name, excerpt, rating, debug = "") {
		this.uuid = uuid
		this.name = name
		this.excerpt = excerpt
		this.rating = rating
        this.debug = debug
	}
}
