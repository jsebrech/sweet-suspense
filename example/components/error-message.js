class ErrorMessage extends HTMLElement {
    connectedCallback() {
        this.update();
    }

    static get observedAttributes() {
        return ['error'];
    }
    
    attributeChangedCallback() {
        this.update();
    }
    
    update() {
        const errorMsg = this.getAttribute('error') || '';
        this.innerHTML = `<p>${errorMsg}</p>`;
    }
}

export const registerErrorMessage = () => customElements.define('x-error-message', ErrorMessage);
