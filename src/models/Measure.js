import { Item } from "react-navigation-header-buttons"

export default class Measure {
	constructor(uuid, name, excerpt, description, keywords, resources) {
		this.uuid = uuid
		this.name = name
		this.excerpt = excerpt
		this.description = description
        this.keywords = keywords ? keywords.split(",").map(kw => kw.trim()) : []
		this.resources = resources ?? []
	}
}
