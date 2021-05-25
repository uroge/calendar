export default class Modal {
    constructor(modalElement, isUpdate, isNewEvent, title) {
        this.modalElement = modalElement;
        this.isUpdate = isUpdate;
        this.isNewEvent = isNewEvent;
        this.title = title;

        if(this.isUpdate) {
            this.title ? this.title.textContent = 'Update Event' : null;
        }

        if(this.isNewEvent) {
            this.title ? this.title.textContent = 'New Event' : null;
        }
    }

    /**
     * Function that shows modal
    */
    showModal() {
        this.modalElement.classList.replace('hide', 'show');
    }

    /**
     * Function that closes modal
    */
    closeModal() {
        this.modalElement.classList.replace('show', 'hide');
    }
}