export default class Event {
    constructor(uuid, title, description, startDate, endDate, link, image, maxParticipantCount = 0){
        this.uuid = uuid
        this.title = title
        this.description = description
        this.startDate = startDate
        this.endDate = endDate
        this.link = link
        this.image = image
        this.maxParticipantCount = maxParticipantCount
    }
}
