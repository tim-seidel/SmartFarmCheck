export default class ContactRequest {
    constructor(formUuid, answers, email, status = 0) {
        this.formUuid = formUuid
        this.answers = answers
        this.email = email
        this.status = status
    }
}