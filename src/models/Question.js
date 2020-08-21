export default class Question {
    constructor(uuid, text, descripton, validator, formPriority){
        this.uuid = uuid
        this.text = text
        this.descripton = descripton
        this.validator = validator 
        this.formPriority = formPriority 
    }
}