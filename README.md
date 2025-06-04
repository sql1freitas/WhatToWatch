
<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=fff" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=fff" alt="FastAPI">
  <img src="https://img.shields.io/badge/tmdbsimple-API-01b4e4?logo=themoviedatabase&logoColor=fff" alt="TMDB API">
  <img src="https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20JS-e34c26?logo=html5&logoColor=fff" alt="Frontend">
</p>


# 🎬 What To Watch?

Bem-vindo ao **What To Watch?** – o seu site para nunca mais sofrer escolhendo o que assistir!  
Aqui você encontra um layout estiloso, animações maneiras e aquele toque especial para fugir do tédio na hora de escolher um filme ou série.

---

## 🚀 O que é esse projeto?

É um projeto web feito com **FastAPI** (backend Python) e um frontend moderno (HTML, CSS e JS) pensado pra ser leve, responsivo e com visual que chama atenção.  
A ideia é entregar uma experiência divertida e intuitiva pra quem quer uma ajudinha na missão de decidir o próximo entretenimento.

---

## ⚙️ Tecnologias utilizadas

### Backend
- **[Python 3.11+]**
- **FastAPI** — Framework web moderno e rápido para APIs REST.
- **Uvicorn** — Servidor ASGI para rodar o FastAPI.
- **python-dotenv** — Gerenciamento de variáveis de ambiente.
- **tmdbsimple** — Cliente Python para acessar a [API do TMDB](https://www.themoviedb.org/documentation/api).
- **python-multipart** — Suporte para uploads (caso precise).
- **requests** — Para requisições HTTP adicionais.

### Frontend
- **HTML5** — Estrutura da página.
- **CSS3** — Visual, animações, responsividade, gradientes e estrelas animadas.
- **JavaScript** — Geração dinâmica das estrelas de fundo.

### Outras
- **API do TMDB (The Movie Database)** — Fonte dos filmes, séries e sugestões.  
- **Docker** (opcional) — Para facilitar a execução e deploy do projeto.

---


## 🛠️ Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/sql1freitas/what-to-watch.git
cd what-to-watch
```

### 2. Instale as dependências do backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # ou .venv\Scripts\activate no Windows
pip install -r requirements.txt
```

### 3. Rode o backend (FastAPI)

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Acesse o site

Abra [http://localhost:8000](http://localhost:8000) no seu navegador
---

## 🦸‍♂️ Contribua!

Achou um bug, tem uma ideia, quer ajudar?  
Pode abrir uma issue, mandar um pull request ou só trocar uma ideia.

---

## 📝 Licença

Esse projeto é livre, pode usar, modificar e compartilhar.

---

## 🚀 Autor

Feito com 💜 por [@sql1freitas](https://github.com/sql1freitas)
