import React, { useState } from "react";
import api from "./api"; // 👉 Agora o caminho correto: "./api"
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
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");

    try {
      const response = await api.post("/usuarios", form);

      if (response.data?.mensagem) {
        setMensagem(response.data.mensagem);
        setForm({ email: "", senha: "" }); // Limpa o formulário
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      const msg = error.response?.data?.detail || "Erro ao cadastrar usuário.";
      setErro(msg);
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
