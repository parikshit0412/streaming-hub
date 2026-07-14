import './styles.css';
import { defineCustomElement } from 'vue';
import App from './app/App.vue';

// Define the custom element using Vue's defineCustomElement helper
const StreamHubBrowse = defineCustomElement(App);
customElements.define('streamhub-browse', StreamHubBrowse);

// Standalone mode bootstrap fallback (if not loaded by the React Host MFE)
if (!window.parent || window.parent === window || !(window as any).__POWERED_BY_HOST__) {
  const el = document.createElement('streamhub-browse');
  document.getElementById('root')?.appendChild(el);
}
