# Tarefa 9 - Front-end de Anotacoes

Interface web desenvolvida utilizando HTML, CSS e JavaScript puro para consumir a API de anotacoes criada com Node.js e Express.

A aplicacao permite criar, visualizar, editar e remover anotacoes diretamente pelo navegador.

---

# Estrutura do Projeto

```text
index.html
css/
  styles.css
js/
  app.js
```

---

# Tecnologias Utilizadas

- HTML5;
- CSS3;
- JavaScript Vanilla;
- Fetch API;
- API REST;
- Render.

---

# Como Executar Localmente

Abra o arquivo `index.html` no navegador ou utilize um servidor local.

Exemplo utilizando Python:

```bash
python3 -m http.server 5173
```

Depois acesse:

```text
http://localhost:5173
```

---

# Configuracao da API

A URL da API esta definida diretamente no arquivo:

```text
js/app.js
```

Exemplo:

```js
const API_BASE_URL = "http://localhost:3000";
```

Caso a API esteja publicada no Render:

```js
const API_BASE_URL = "https://SEU-SERVICO.onrender.com";
```

---

# Funcionalidades

- Criacao de anotacoes;
- Listagem de anotacoes;
- Atualizacao de anotacoes;
- Exclusao de anotacoes;
- Exibicao de mensagens de sucesso;
- Exibicao de mensagens de erro;
- Consumo da API Express.

---

# Layout

A interface possui:

- Design responsivo;
- Tema moderno;
- Cartoes dinamicos para anotacoes;
- Feedback visual das operacoes;
- Atualizacao automatica da lista de anotacoes.

---

# Integracao com API

| Metodo | Endpoint     | Descricao                       |
| ------ | ------------ | ------------------------------- |
| GET    | `/notas`     | Lista todas as anotacoes        |
| GET    | `/notas/:id` | Busca uma anotacao por ID       |
| POST   | `/notas`     | Cria uma nova anotacao          |
| PUT    | `/notas/:id` | Atualiza uma anotacao existente |
| DELETE | `/notas/:id` | Remove uma anotacao             |

---

# Observacoes

A aplicacao depende da API Node.js estar em execucao para funcionamento correto.

Caso utilize o plano gratuito do Render, a primeira requisicao pode demorar alguns segundos devido ao tempo de inicializacao do servidor.

---

# Autor

Projeto desenvolvido para a disciplina de Desenvolvimento Web.
