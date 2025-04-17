// src/pages/CadastroUsuario.js
import React, { useState } from "react";
import api from "../api"; // 👉 Agora importando o api configurado
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";

function CadastroUsuario() {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");

    try {
      const res = await api.post("/usuarios", form); // 👉 Corrigido para usar `api.post`

      setMensagem(res.data.mensagem || "Usuário cadastrado com sucesso!");
      setForm({ email: "", senha: "" });
    } catch (err) {
      const msg = err.response?.data?.detail || "Erro ao cadastrar usuário.";
      setErro(msg);
      console.error("Erro no cadastro:", err);
    }
  };

  return (
    <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>
          Cadastrar Novo Usuário
        </Typography>
        <form onSubmit={handleCadastro}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            label="Senha"
            name="senha"
            type="password"
            fullWidth
            required
            margin="normal"
            value={form.senha}
            onChange={handleChange}
          />
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
            Cadastrar
          </Button>
          {mensagem && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {mensagem}
            </Alert>
          )}
          {erro && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {erro}
            </Alert>
          )}
        </form>
      </Paper>
    </Box>
  );
}

export default CadastroUsuario;
