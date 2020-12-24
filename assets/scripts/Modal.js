import { DOMHelper } from './Utility.js';

export class Modal {
    constructor(targetId, hasAccpetButton = true, hasCancelButton = true) {
        this.hasAccpetButton = hasAccpetButton;
        this.hasCancelButton = hasCancelButton;

        this.modal = document.getElementById(targetId);
        this.backdrop = document.getElementById('backdrop');

        this.modalCancelButton = this.modal.querySelector('button.modal_cancel');
        this.modalAcceptButton = this.modal.querySelector('button.modal_accept');
    }

    connectEventListenrs() {
        this.modalCancelButton.addEventListener('click', this.hideModal.bind(this));
        this.modalAcceptButton.addEventListener('click', this.acceptModalFn);
        this.backdrop.addEventListener('click', this.hideBackDrop.bind(this));
        return this;
    }

    clearEventListener() {
        DOMHelper.clearEventListeners(this.backdrop);
        DOMHelper.clearEventListeners(this.modalCancelButton);
        DOMHelper.clearEventListeners(this.modalAcceptButton);
        return this;
    }

    setModalFunction(acceptModalFn) {
        this.acceptModalFn = acceptModalFn;
        return this;
    }

    showModal() {
        this.modal.classList.add('visible');
        const scrollTop = window.scrollY;
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        const modalWidth = this.modal.clientWidth;
        const modalHeight = this.modal.clientHeight;
        this.modal.style.left = (x - modalWidth / 2) + 'px';
        this.modal.style.top = (y - modalHeight / 2) + 'px';
        return this;
    }

    hideModal() {
        this.modal.classList.remove('visible');
        this.backdrop.classList.remove('visible');
        this.clearEventListener();
        return this;
    }

    showBackDrop() {
        this.backdrop.classList.add('visible');
        return this;
    }

    hideBackDrop() {
        this.modal.classList.remove('visible');
        this.backdrop.classList.remove('visible');
        this.clearEventListener();
        return this;
    }
}
