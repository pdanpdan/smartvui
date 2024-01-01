import { h } from 'vue';
import './index.css';

export default function Page() {
  return h('div', [
    h('h1', { class: 'colored' }, 'HTML Only'),
    h('button', 'Loading...'),
  ]);
}
