const componentes = {
  statusApi: document.querySelector("#statusApi"),
  formularioNota: document.querySelector("#formularioNota"),
  campoIdOculto: document.querySelector("#identificadorNota"),
  entradaTitulo: document.querySelector("#campoTitulo"),
  entradaConteudo: document.querySelector("#campoConteudo"),
  tituloFormulario: document.querySelector("#tituloFormulario"),
  botaoSalvar: document.querySelector("#botaoSalvar"),
  botaoCancelar: document.querySelector("#botaoCancelar"),
  botaoRecarregar: document.querySelector("#botaoAtualizar"),
  caixaAviso: document.querySelector("#mensagemFeedback"),
  totalAnotacoes: document.querySelector("#quantidadeNotas"),
  areaAnotacoes: document.querySelector("#listaAnotacoes"),
};

const estadoAplicacao = {
  anotacoes: [],
  carregando: false,
  editando: false,
};

const API_BASE_URL = "https://aula-9-api.onrender.com";

componentes.statusApi.textContent = API_BASE_URL;

function alterarEstadoCarregamento(ativo) {
  estadoAplicacao.carregando = ativo;

  [
    componentes.botaoSalvar,
    componentes.botaoRecarregar,
    componentes.botaoCancelar,
  ].forEach((botao) => {
    botao.disabled = ativo;
  });
}

function mostrarAviso(mensagem, tipo = "info") {
  componentes.caixaAviso.textContent = mensagem;

  componentes.caixaAviso.className = `mensagem-feedback visivel ${tipo}`;
}

function esconderAviso() {
  componentes.caixaAviso.textContent = "";

  componentes.caixaAviso.className = "mensagem-feedback";
}

function formatarData(dataTexto) {
  if (!dataTexto) {
    return "--";
  }

  return new Date(dataTexto).toLocaleString("pt-BR");
}

async function requisicaoApi(rota, configuracao = {}) {
  const resposta = await fetch(`${API_BASE_URL}${rota}`, {
    ...configuracao,
    headers: {
      "Content-Type": "application/json",
      ...(configuracao.headers || {}),
    },
  });

  const textoResposta = await resposta.text();

  const dados = textoResposta.length > 0 ? JSON.parse(textoResposta) : null;

  if (!resposta.ok) {
    throw new Error(dados?.erro || "Erro inesperado na requisicao.");
  }

  return dados;
}

function limparFormulario() {
  estadoAplicacao.editando = false;

  componentes.formularioNota.reset();

  componentes.campoIdOculto.value = "";

  componentes.tituloFormulario.textContent = "Nova anotacao";

  componentes.botaoSalvar.textContent = "Salvar anotacao";

  componentes.botaoCancelar.classList.add("oculto");
}

function preencherFormularioEdicao(anotacao) {
  estadoAplicacao.editando = true;

  componentes.campoIdOculto.value = anotacao.id;

  componentes.entradaTitulo.value = anotacao.titulo;

  componentes.entradaConteudo.value = anotacao.conteudo;

  componentes.tituloFormulario.textContent = "Editar anotacao";

  componentes.botaoSalvar.textContent = "Atualizar anotacao";

  componentes.botaoCancelar.classList.remove("oculto");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function criarBotao(texto, classe, callback) {
  const botao = document.createElement("button");

  botao.type = "button";

  botao.className = classe;

  botao.textContent = texto;

  botao.addEventListener("click", callback);

  return botao;
}

function criarInformacao(texto) {
  const elemento = document.createElement("span");

  elemento.textContent = texto;

  return elemento;
}

function criarCartaoAnotacao(anotacao) {
  const cartao = document.createElement("article");

  cartao.className = "cartao-anotacao";

  const titulo = document.createElement("h3");

  titulo.textContent = anotacao.titulo;

  const conteudo = document.createElement("p");

  conteudo.textContent = anotacao.conteudo;

  const informacoes = document.createElement("div");

  informacoes.className = "meta-anotacao";

  informacoes.append(
    criarInformacao(`Criado em: ${formatarData(anotacao.criadoEm)}`),

    criarInformacao(`Atualizado em: ${formatarData(anotacao.atualizadoEm)}`),
  );

  const areaAcoes = document.createElement("div");

  areaAcoes.className = "acoes-anotacao";

  const botaoEditar = criarBotao("Editar", "botao-secundario", () =>
    preencherFormularioEdicao(anotacao),
  );

  const botaoExcluir = criarBotao("Excluir", "botao-perigo", () =>
    excluirAnotacao(anotacao.id),
  );

  areaAcoes.append(botaoEditar, botaoExcluir);

  cartao.append(titulo, conteudo, informacoes, areaAcoes);

  return cartao;
}

function renderizarMensagemVazia() {
  const vazio = document.createElement("div");

  vazio.className = "estado-vazio";

  vazio.innerHTML = `
    <div>
      <h3>Nenhuma anotacao encontrada</h3>
      <p>
        Crie uma nova anotacao utilizando o formulario ao lado.
      </p>
    </div>
  `;

  componentes.areaAnotacoes.appendChild(vazio);
}

function renderizarAnotacoes() {
  componentes.areaAnotacoes.innerHTML = "";

  componentes.totalAnotacoes.textContent = `${estadoAplicacao.anotacoes.length} ${
    estadoAplicacao.anotacoes.length === 1 ? "anotacao" : "anotacoes"
  }`;

  if (estadoAplicacao.anotacoes.length === 0) {
    renderizarMensagemVazia();

    return;
  }

  estadoAplicacao.anotacoes.forEach((anotacao) => {
    componentes.areaAnotacoes.appendChild(criarCartaoAnotacao(anotacao));
  });
}

async function carregarAnotacoes(mostrarMensagens = true) {
  alterarEstadoCarregamento(true);

  if (mostrarMensagens) {
    mostrarAviso("Carregando anotacoes...", "info");
  }

  try {
    const anotacoes = await requisicaoApi("/notas");

    estadoAplicacao.anotacoes = anotacoes;

    renderizarAnotacoes();

    if (mostrarMensagens) {
      esconderAviso();
    }
  } catch (erro) {
    mostrarAviso(erro.message || "Erro ao carregar anotacoes.", "erro");
  } finally {
    alterarEstadoCarregamento(false);
  }
}

async function enviarFormulario(evento) {
  evento.preventDefault();

  const idAtual = componentes.campoIdOculto.value;

  const dadosFormulario = {
    titulo: componentes.entradaTitulo.value.trim(),

    conteudo: componentes.entradaConteudo.value.trim(),
  };

  alterarEstadoCarregamento(true);

  try {
    const rota = idAtual ? `/notas/${idAtual}` : "/notas";

    const metodo = idAtual ? "PUT" : "POST";

    await requisicaoApi(rota, {
      method: metodo,
      body: JSON.stringify(dadosFormulario),
    });

    limparFormulario();

    await carregarAnotacoes(false);

    mostrarAviso(
      idAtual
        ? "Anotacao atualizada com sucesso."
        : "Nova anotacao criada com sucesso.",
      "sucesso",
    );
  } catch (erro) {
    mostrarAviso(erro.message || "Nao foi possivel salvar a anotacao.", "erro");
  } finally {
    alterarEstadoCarregamento(false);
  }
}

async function excluirAnotacao(id) {
  const confirmou = window.confirm("Deseja realmente excluir esta anotacao?");

  if (!confirmou) {
    return;
  }

  alterarEstadoCarregamento(true);

  try {
    await requisicaoApi(`/notas/${id}`, {
      method: "DELETE",
    });

    await carregarAnotacoes(false);

    limparFormulario();

    mostrarAviso("Anotacao removida com sucesso.", "sucesso");
  } catch (erro) {
    mostrarAviso(erro.message || "Erro ao remover anotacao.", "erro");
  } finally {
    alterarEstadoCarregamento(false);
  }
}

componentes.formularioNota.addEventListener("submit", enviarFormulario);

componentes.botaoCancelar.addEventListener("click", () => {
  limparFormulario();
  esconderAviso();
});

componentes.botaoRecarregar.addEventListener("click", () =>
  carregarAnotacoes(true),
);

carregarAnotacoes();
