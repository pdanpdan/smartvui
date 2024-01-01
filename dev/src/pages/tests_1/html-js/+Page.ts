import { h } from 'vue';
import './index.css';

export default function Page() {
  return h('div', [
    h('h1', { class: 'colored' }, 'HTML + JS'),
    h('button', { class: 'test-html-js' }, 'Loading...'),
  ]);
}
