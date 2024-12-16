const draggableList = document.getElementById('draggable-list');
const checkButton = document.getElementById('check');

const richestPeople = [
  'Jeff Bezos',
  'Bill Gates',
  'Warren Buffett',
  'Bernard Arnault',
  'Carlos Slim Helu',
  'Amancio Ortega',
  'Larry Ellison',
  'Mark Zuckerberg',
  'Michael Bloomberg',
  'Larry Page',
];

let dragStartIndex = null;

// Cria a lista embaralhada e insere no DOM
function createList() {
  const shuffledPeople = richestPeople
    .map((person) => ({ name: person, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .map((item) => item.name);

  const fragment = document.createDocumentFragment();

  shuffledPeople.forEach((person, index) => {
    const listItem = document.createElement('li');
    listItem.dataset.index = index;
    listItem.innerHTML = `
      <span class="number">${index + 1}</span>
      <div class="draggable" draggable="true">
        <p class="person-name">${person}</p>
        <i class="fas fa-grip-lines"></i>
      </div>
    `;
    fragment.appendChild(listItem);
  });

  draggableList.appendChild(fragment);
  addEventListeners();
}

// Troca dois itens de lugar no DOM
function swapItems(fromIndex, toIndex) {
  const items = document.querySelectorAll('.draggable-list li');
  const itemOne = items[fromIndex].querySelector('.draggable');
  const itemTwo = items[toIndex].querySelector('.draggable');

  items[fromIndex].appendChild(itemTwo);
  items[toIndex].appendChild(itemOne);
}

// Verifica a ordem dos itens
function checkOrder() {
  const items = document.querySelectorAll('.draggable-list li');

  items.forEach((item, index) => {
    const personName = item.querySelector('.person-name').textContent.trim();
    item.classList.toggle('right', personName === richestPeople[index]);
    item.classList.toggle('wrong', personName !== richestPeople[index]);
  });
}

// Adiciona os eventos de drag and drop
function addEventListeners() {
  const draggables = document.querySelectorAll('.draggable');
  const listItems = document.querySelectorAll('.draggable-list li');

  draggables.forEach((draggable) => {
    draggable.addEventListener('dragstart', () => {
      dragStartIndex = +draggable.closest('li').dataset.index;
    });
  });

  listItems.forEach((item) => {
    item.addEventListener('dragover', (e) => e.preventDefault());
    item.addEventListener('drop', () => {
      const dragEndIndex = +item.dataset.index;
      swapItems(dragStartIndex, dragEndIndex);
      item.classList.remove('over');
    });
    item.addEventListener('dragenter', () => item.classList.add('over'));
    item.addEventListener('dragleave', () => item.classList.remove('over'));
  });
}

// Inicialização
createList();
checkButton.addEventListener('click', checkOrder);
