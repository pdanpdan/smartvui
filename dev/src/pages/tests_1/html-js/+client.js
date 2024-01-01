// https://vike.dev/render-modes

function handleCounter() {
  const counterEl = document.querySelector('button.test-html-js');
  console.log(counterEl);
  let countState = 0;
  const txt = () => `Counter ${ countState } (Vanilla JS)`;
  counterEl.textContent = txt(countState);
  counterEl.onclick = () => {
    countState++;
    counterEl.textContent = txt(countState);
  };
}

handleCounter();
