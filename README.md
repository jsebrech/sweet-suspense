# Sweet Suspense

A port of React's Suspense, lazy() and error boundary to vanilla web components.

Part of the [Plain Vanilla Web](https://plainvanillaweb.com) project.

## Using

### Setup

Copy the contents of the `src/` folder into your project:

- `lazy.js`
- `suspense.js`
- `error-boundary.js`

Register the custom elements:

```js
import { registerLazy } from './components/sweet-suspense/lazy.js';
import { registerSuspense } from './components/sweet-suspense/suspense.js';
import { registerErrorBoundary } from './components/sweet-suspense/error-boundary.js';

// ...
    registerLazy();
    registerSuspense();
    registerErrorBoundary();
// ...
```

### Lazy loading

Load custom elements on-demand.

```html
<x-lazy><x-on-demand></x-on-demand></x-lazy>
```

This will load the `<x-on-demand>` custom element if it doesn't exist yet by:

1. Importing the ESM module `./components/on-demand/on-demand.js`
   (the path and filename is derived by convention from the custom element's name, and relative to the current document)
2. Optionally: running the default export function of that module to register the element

To override the path that it loads from, set the root attribute:

```html
<x-lazy root="./submodule/components/"><x-on-demand></x-on-demand></x-lazy>
```

Or specify the path to the JS file directly on the element itself:

```html
<x-lazy><x-on-demand lazy-path="./submodule/components/my-on-demand.js"></x-on-demand></x-lazy>
```

Note that:

- Only direct children of `<x-lazy>` are loaded, only on initial DOM insert,
  and only if they are custom elements that are not yet registered
- To show a loading screen, put the `<x-lazy>` somewhere inside an `<x-suspense>` (see below)
- To show an error if loading fails, wrap that suspense in an error boundary (see below)

### Lazy components

A component loaded using `<lazy>` should use one of these patterns:

```js
customElements.define('x-my-component', class extends HTMLElement { 
  ... 
})
```

or

```js
class MyComponent extends HTMLElement {
  ...
}
export default function register() {
  customElements.define('x-my-component', MyComponent);
}
```

### Suspense

Display a fallback while children are loading (code or data).

```html
<x-suspense>
    <p slot="fallback">Loading...</p>
    <x-lazy><x-on-demand></x-on-demand></x-lazy>
</x-suspense>
```

Note that:

- Any elements placed in the fallback slot (`slot="fallback"`) will be shown while a nested `<x-lazy>` is loading.
- To show the fallback while data is loading, call `Suspense.waitFor(sender, promise)`.
  `sender` is the nested element that is loading the data, the fallback will be shown until the promises passed to `waitFor` complete.
- To show an error when loading fails, put the suspense inside an error boundary (see below)

### Error boundary

Display an error when a nested suspense fails, or when an error occurs in a child element.

```html
<x-error-boundary>
    <p slot="error">Something went wrong</p>
    <x-suspense>
        <p slot="fallback">Loading...</p>
        <x-lazy><x-on-demand></x-on-demand></x-lazy>
    </x-suspense>
</x-error-boundary>
```

Note that:

- Any elements placed in the error slot (`slot="error"`) will be shown when an error reaches the boundary.
- A nested suspense will set an error on the nearest boundary when loading fails.
- To show the error explicitly, call `ErrorBoundary.showError(sender, error)`.
  `sender` is the nested element that owns the error, the error message will be shown until the boundary is reset.
- To hide the shown error, call `reset()` on the boundary element.
- To use the error's text inside the slot's content, make a custom element that will show the error and accepts an `error` property
  or an `error` attribute. (See the example code for more details.)

## Example

Run a static server:

`npx http-server . -c-1`

Browse to http://localhost:8080/example/index.html

See the code in the `example/` folder.

