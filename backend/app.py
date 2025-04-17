from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import sqlite3
from datetime import datetime
import bcrypt
import secrets


app = FastAPI()

# Libera o front-end acessar a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://projetin-black.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ MODELOS ------------------

class Cliente(BaseModel):
    nome: str
    whatsapp: str = ""
    email: str = ""
    data_cadastro: str = None

class Calculo(BaseModel):
    numero: str
    tipo: str
    valor: float
    cliente: str
    prazo: str
    status: str = "pendente"

class Usuario(BaseModel):
    email: str
    senha: str

# ------------------ AUTENTICAÇÃO ------------------

tokens_validos = set()

def verificar_token(authorization: str):
    token = authorization.replace("Bearer ", "") if authorization else ""
    if token not in tokens_validos:
        raise HTTPException(status_code=401, detail="Não autorizado")

# ------------------ TABELAS ------------------

def criar_tabela_cliente():
    with sqlite3.connect("banco.db") as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS cliente (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                whatsapp TEXT,
                email TEXT,
                data_cadastro TEXT
            )
        """)

def criar_tabela_calculo():
    with sqlite3.connect("banco.db") as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS calculo (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                numero TEXT NOT NULL,
                tipo TEXT,
                valor REAL,
                cliente TEXT,
                prazo TEXT,
                status TEXT,
                data_realizado TEXT
            )
        """)

def criar_tabela_usuario():
    with sqlite3.connect("banco.db") as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS usuario (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                senha_hash TEXT NOT NULL
            )
        """)

criar_tabela_cliente()
criar_tabela_calculo()
criar_tabela_usuario()

# ------------------ CLIENTES ------------------

@app.post("/clientes")
def adicionar_cliente(cliente: Cliente, authorization: str = Header(...)):
    verificar_token(authorization)
    try:
        with sqlite3.connect("banco.db") as conn:
            cursor = conn.cursor()
            data = cliente.data_cadastro or datetime.now().isoformat()
            cursor.execute("""
                INSERT INTO cliente (nome, whatsapp, email, data_cadastro)
                VALUES (?, ?, ?, ?)
            """, (cliente.nome, cliente.whatsapp, cliente.email, data))
            cliente_id = cursor.lastrowid
        return { "id": cliente_id, **cliente.dict(), "data_cadastro": data }
    except Exception as e:
        return {"erro": str(e)}

@app.get("/clientes")
def listar_clientes(authorization: str = Header(...)):
    verificar_token(authorization)
    try:
        with sqlite3.connect("banco.db") as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM cliente")
            colunas = [desc[0] for desc in cursor.description]
            dados = cursor.fetchall()
            return [dict(zip(colunas, linha)) for linha in dados]
    except Exception as e:
        return {"erro": str(e)}

# ------------------ CÁLCULOS ------------------

@app.post("/calculos")
def adicionar_calculo(calc: Calculo, authorization: str = Header(...)):
    verificar_token(authorization)
    try:
        with sqlite3.connect("banco.db") as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO calculo (numero, tipo, valor, cliente, prazo, status, data_realizado)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (calc.numero, calc.tipo, calc.valor, calc.cliente, calc.prazo, calc.status, None))
            novo_id = cursor.lastrowid
        return { "id": novo_id, **calc.dict() }
    except Exception as e:
        return {"erro": str(e)}

@app.get("/calculos")
def listar_calculos(authorization: str = Header(...)):
    verificar_token(authorization)
    try:
        with sqlite3.connect("banco.db") as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM calculo")
            colunas = [desc[0] for desc in cursor.description]
            dados = cursor.fetchall()
            return [dict(zip(colunas, linha)) for linha in dados]
    except Exception as e:
        return {"erro": str(e)}

@app.put("/calculos/{calculo_id}/status")
def atualizar_status_calculo(calculo_id: int, dados: dict, authorization: str = Header(...)):
    verificar_token(authorization)
    try:
        novo_status = dados.get("status", "pendente")
        with sqlite3.connect("banco.db") as conn:
            cursor = conn.cursor()
            if novo_status == "realizado":
                data_realizado = datetime.now().isoformat()
                cursor.execute("""
                    UPDATE calculo
                    SET status = ?, data_realizado = ?
                    WHERE id = ?
                """, (novo_status, data_realizado, calculo_id))
            else:
                cursor.execute("""
                    UPDATE calculo
                    SET status = ?, data_realizado = NULL
                    WHERE id = ?
                """, (novo_status, calculo_id))
        return {"mensagem": "Status atualizado com sucesso"}
    except Exception as e:
        return JSONResponse(content={"erro": str(e)}, status_code=500)

# ------------------ USUÁRIOS ------------------

@app.post("/usuarios")
def cadastrar_usuario(usuario: Usuario):
    try:
        senha_hash = bcrypt.hashpw(usuario.senha.encode('utf-8'), bcrypt.gensalt())
        with sqlite3.connect("banco.db") as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO usuario (email, senha_hash) VALUES (?, ?)", (usuario.email, senha_hash))
        return {"mensagem": "Usuário criado com sucesso"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/login")
def login(usuario: Usuario):
    try:
        with sqlite3.connect("banco.db") as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT senha_hash FROM usuario WHERE email = ?", (usuario.email,))
            resultado = cursor.fetchone()
        if not resultado:
            raise HTTPException(status_code=401, detail="Email ou senha incorretos")
        if not bcrypt.checkpw(usuario.senha.encode('utf-8'), resultado[0]):
            raise HTTPException(status_code=401, detail="Email ou senha incorretos")
        token = secrets.token_hex(16)
        tokens_validos.add(token)
        return { "mensagem": "Login realizado com sucesso", "token": token }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
