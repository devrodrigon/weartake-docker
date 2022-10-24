const produtos = document.querySelector('.produtos');

function criarItemLista(id) {
  const produtoItem = document.createElement('li');
  produtoItem.classList.add('produto');
  produtoItem.id = id;

  return produtoItem;
}

function convertReal(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderItem() {
  data.forEach((produto) => {
    const produtoItem = criarItemLista(produto.id);

    produtoItem.innerHTML = `
        <img class="produtoImg" src=${produto.img} />
        <div class="info">
          <span class="categoria small-detail">${produto.tag[0]}</span>
          <h3 class="nomeProduto title3">${produto.nameItem}</h3>
          <p class="descricao body">
            ${produto.description}
          </p>
          <strong class="preco body-semi-bold">${convertReal(
            produto.value
          )}</strong>
          <button class="adicionar small">${produto.addCart}</button>
        </div>
        `;

    produtos.appendChild(produtoItem);
  });
}

renderItem();

/******************* Adicionar item no carrinho ***********/

const produto = document.querySelectorAll('.produto');

const produtosCarrinho = document.querySelector('.produtosCarrinho');

let carrinho = [];

produto.forEach((item) => item.addEventListener('click', addCarrinho));

function criarItemCarrinho(id) {
  const itemCarrinho = document.createElement('li');
  itemCarrinho.classList.add('produtoCarrinho');
  itemCarrinho.id = id;

  return itemCarrinho;
}

function addCarrinho(event) {
  if (event.target.classList.contains('adicionar')) {
    const { id } = event.currentTarget;

    const itemCarrinho = criarItemCarrinho(id);

    const { img, nameItem, value } = data.find((item) => item.id == id);

    itemCarrinho.innerHTML = `
      <img class="produtoImg" src=${img} />
      <div class="infoProduto">
        <h4 class="nomeProduto title4">${nameItem}</h4>
        <strong class="preco body-semi-bold">${convertReal(value)}</strong>
        <button class="remover body">Remover Produto</button>
      </div>
    `;
    carrinho.push(itemCarrinho);

    renderItemCarrinho();

    updateInfoCarrinho();

    document.querySelector('.carrinho-sem-item').style.display = 'none';
    document.querySelector('.carrinho-com-item').style.display = 'flex';
    document.querySelector('.infoCarrinho').style.display = 'flex';
  }
}

function renderItemCarrinho() {
  produtosCarrinho.innerText = '';
  carrinho.forEach((item) => produtosCarrinho.appendChild(item));
}

/* Atualiza as informações de quantidade e preço total do carrinho*/
function updateInfoCarrinho() {
  let soma = 0;
  const qtdItems = carrinho.length;

  carrinho.forEach((item) => {
    const { value } = data.find((produto) => produto.id == item.id);

    soma += value;
  });

  const qtd = document.getElementById('qtd');
  const preco = document.getElementById('preco');

  qtd.innerText = qtdItems;
  preco.innerText = convertReal(soma);
}

/*************** Remover item do carrinho ******************/
let produtoCarrinho = document.querySelectorAll('.produtoCarrinho');

/* Atualiza a lista de produtoCarrinho */
document.addEventListener('click', () => {
  produtoCarrinho = document.querySelectorAll('.produtoCarrinho');
  produtoCarrinho.forEach((item) => item.addEventListener('click', removerItem));
});

function removerItem(event) {
  if (event.target.classList.contains('remover')) {
    carrinho = carrinho.filter((item) => item != event.currentTarget);

    renderItemCarrinho();

    updateInfoCarrinho();

    if (carrinho.length == 0) {
      document.querySelector('.carrinho-sem-item').style.display = 'flex';
      document.querySelector('.carrinho-com-item').style.display = 'none';
      document.querySelector('.infoCarrinho').style.display = 'none';
    }
  }
}

/*********** Funcionalidade barra de pesquisa ***************/
const buttonPesquisar = document.querySelector('.button');

buttonPesquisar.addEventListener('click', () => {
  const inputValue = document.getElementById('input').value.toLowerCase();
  const arrIds = []; //armazena os ids dos produtos que contém a string pesquisada

  data.forEach((produto) => {
    const nameItem = produto.nameItem.toLowerCase();
    nameItem.includes(inputValue) && arrIds.push(produto.id);
  });

  const produtoPesquisado = Object.values(produto).filter((produto) =>
    arrIds.includes(parseInt(produto.id))
  );

  if (produtoPesquisado.length > 0) {
    produtos.innerText = '';

    produtoPesquisado.forEach((produto) => produtos.appendChild(produto));
  } else {
    produtos.innerHTML = '<h3>Nenhum item encontrado</h3>';
  }
});

/************** Funcionalidade filtro do header *****************/
const categoriaHeader = document.querySelectorAll('.categoriaHeader');

function changeFontWeightMenu(element) {
  categoriaHeader.forEach((category) => {
    if (category !== element) {
      category.style = 'font-weight: 400';
    } else {
      element.style = 'font-weight: 600';
      document.querySelector('.categoriaHeaderTodos').style = 'font-weight: 400';
    }
  });
}

categoriaHeader.forEach((categoria) => {
  categoria.addEventListener('click', filtrarCategoria);
});

function filtrarCategoria(event) {
  const categoria = event.currentTarget.textContent;
  const arrIds = [];

  changeFontWeightMenu(event.currentTarget);

  data.forEach(
    (produto) => produto.tag.includes(categoria) && arrIds.push(produto.id)
  );

  const categoriaFiltrada = Object.values(produto).filter((produto) =>
    arrIds.includes(parseInt(produto.id))
  );

  if (categoriaFiltrada.length > 0) {
    produtos.innerText = '';

    categoriaFiltrada.forEach((produto) => produtos.appendChild(produto));
  } else {
    produtos.innerHTML = `<h3>Não há produtos com a categoria ${categoria} cadastrado no momento</h3>`;
  }
}
