import { registerLazy } from '../src/lazy.js';
import { registerSuspense } from '../src/suspense.js';
import { registerErrorBoundary } from '../src/error-boundary.js';
import { registerErrorMessage } from './components/error-message.js';

customElements.define('x-demo', class extends HTMLElement {

    constructor() {
        super();
        registerLazy();
        registerSuspense();
        registerErrorBoundary();
        registerErrorMessage();
    }

    connectedCallback() {
        this.innerHTML = `
            <p>Lazy loading demo</p>
            <button id="lazy-load">Load lazy</button>
            <button id="error-reset" disabled>Reset error</button>
            <div id="lazy-load-div">
                <p>Click to load..</p>
            </div>
        `;
        const resetBtn = this.querySelector('button#error-reset')
        resetBtn.onclick = () => {
            this.querySelector('x-error-boundary').reset();
            resetBtn.setAttribute('disabled', true);
        };
        const loadBtn = this.querySelector('button#lazy-load');
        loadBtn.onclick = () => {
            this.querySelector('div#lazy-load-div').innerHTML = `
                <x-error-boundary>
                    <x-error-message slot="error"></x-error-message>
                    <x-suspense>
                        <p slot="fallback">Loading...</p>
                        <p>
                            <x-lazy>
                                <x-hello-world>I should never see this</x-hello-world>
                            </x-lazy>
                        </p>
                    </x-suspense>
                </x-error-boundary>
            `
            this.querySelector('x-error-boundary').addEventListener('error', _ => {
                resetBtn.removeAttribute('disabled');
            });
        };
    }

});
