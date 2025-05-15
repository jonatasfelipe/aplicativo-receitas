const legumesSelect = document.getElementById('legumes');
const verdurasSelect = document.getElementById('verduras');
const diversosSelect = document.getElementById('diversos');
const resultadoDiv = document.getElementById('resultado');

let receitas = [];

// Carrega o JSON com as receitas
fetch('receitas.json')
  .then(response => response.json())
  .then(data => {
    receitas = data;
    mostrarReceitas(receitas);
  })
  .catch(error => {
    resultadoDiv.innerHTML = '<p>Erro ao carregar as receitas.</p>';
    console.error('Erro ao carregar JSON:', error);
  });

// Mostra receitas como cards
function mostrarReceitas(lista) {
  if (lista.length === 0) {
    resultadoDiv.innerHTML = '<p>Nenhuma receita encontrada com os ingredientes selecionados.</p>';
    return;
  }

  resultadoDiv.innerHTML = '';
  lista.forEach(receita => {
    const div = document.createElement('div');
    div.classList.add('receita');
    div.innerHTML = `
      <h3>${receita.nome}</h3>
      <p><strong>Ingredientes:</strong> ${receita.ingredientes.join(', ')}</p>
      <p><strong>Modo de Preparo:</strong> ${receita.modo_preparo}</p>
      <p><strong>Tempo de Preparo:</strong> ${receita.tempo_preparo}</p>
    `;
    resultadoDiv.appendChild(div);
  });
}

// Obtém os itens selecionados de um select2
function getSelecionados(id) {
  return $(`#${id}`).val() || [];
}

// Atualiza as receitas com base nas seleções
function atualizarResultado() {
  const legumesSelecionados = getSelecionados('legumes');
  const verdurasSelecionadas = getSelecionados('verduras');
  const diversosSelecionados = getSelecionados('diversos');

  const ingredientesSelecionados = [
    ...legumesSelecionados,
    ...verdurasSelecionadas,
    ...diversosSelecionados
  ];

  if (ingredientesSelecionados.length === 0) {
    mostrarReceitas(receitas);
    return;
  }

  const receitasFiltradas = receitas.filter(receita =>
    ingredientesSelecionados.every(ing => receita.ingredientes.includes(ing))
  );

  mostrarReceitas(receitasFiltradas);
}

// Inicializa Select2 e adiciona eventos
$(document).ready(function () {
  $('#legumes, #verduras, #diversos').select2({
    placeholder: 'Selecione os ingredientes',
    width: '100%'
  });

  // Atualiza filtro ao mudar seleção
  $('#legumes, #verduras, #diversos').on('change', atualizarResultado);

  // Botão de limpar
  $('#btn-limpar').on('click', function () {
    $('#legumes, #verduras, #diversos').val(null).trigger('change');
    mostrarReceitas(receitas);
  });
});
