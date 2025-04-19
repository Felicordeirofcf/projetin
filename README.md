# AJ Cálculos Judiciais

Sistema completo para gestão de clientes, cálculos judiciais e análise financeira, desenvolvido com **FastAPI** no back-end e **React + MUI** no front-end. Ideal para escritórios de cálculo judicial que precisam de uma interface responsiva, intuitiva e segura.

---

## 🚀 Funcionalidades

- Cadastro, listagem, edição e exclusão de clientes
- Cadastro e gestão de cálculos judiciais
- Filtros por tipo, cliente, prazo e status
- Dashboard com gráficos interativos e alertas
- Análise financeira com gráfico de entradas mensais
- Sistema de login seguro com token (autenticação baseada em token JWT)

---

## 📁 Tecnologias Utilizadas

### Backend
- [FastAPI](https://fastapi.tiangolo.com/)
- SQLite
- bcrypt (criptografia de senhas)
- CORS Middleware

### Frontend
- React (Vite ou Create React App)
- MUI (Material UI)
- Recharts (para gráficos)
- Axios com interceptador de token

---

## 🔧 Instalação Local

### 1. Clonar o Repositório
```bash
https://github.com/seu-usuario/calcaj-web.git
cd calcaj-web
```

### 2. Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate no Windows
pip install -r requirements.txt
uvicorn app:app --reload
```

### 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

---

## 🏠 Acesso e Login

1. Acesse http://localhost:3000
2. Crie um usuário pela rota `/cadastro`
3. Acesse com login/senha para visualizar o dashboard

---

## 🚫 Proteção por Token

- Todas as rotas são protegidas por `Bearer Token`
- Token é armazenado no localStorage e gerenciado via Axios

---

## 📤 Deploy no GitHub e Hospedagem

1. Crie um repositório no GitHub
2. Envie seu projeto com:
```bash
git init
git add .
git commit -m "Deploy inicial"
git branch -M main
git remote add origin https://github.com/seu-usuario/calcaj-web.git
git push -u origin main
```

### Hospedagem
- Frontend: [Vercel](https://vercel.com) ou [Netlify](https://www.netlify.com/)
- Backend: [Render](https://render.com) ou [Railway](https://railway.app)

---

## 🎓 Licença
Este projeto é livre para uso educacional ou comercial com atribuição.

---

## ✨ Autor
**Felipe Ferreira** - Desenvolvedor Full Stack

Conecte-se: [LinkedIn](https://www.linkedin.com/) | [GitHub](https://github.com/)

---

> Desenvolvido com ❤️ para ajudar escritórios a otimizar o controle de cálculos judiciais.

