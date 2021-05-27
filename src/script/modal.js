export default class Modal {
    constructor(modalElement, title) {
        this.modalElement = modalElement;
        this.title = title;
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