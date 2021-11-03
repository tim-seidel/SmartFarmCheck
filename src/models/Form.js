export default class Form {
	constructor(uuid, title, description, icon, hidden) {
		this.uuid = uuid
		this.title = title
		this.description = description
		this.icon = icon
		this.hidden = hidden
		this.loaded = false
	}
}
