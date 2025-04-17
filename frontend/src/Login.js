import React, { useState } from "react";
import api from "../api"; // 👉 Aqui trocamos axios por a importação do api configurado
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Login({ setAutenticado }) {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      // 👉 Troquei axios.post por api.post
      const res = await api.post("/login", form);

      if (res.data.mensagem && res.data.token) {
        // ✅ Armazena o token
        localStorage.setItem("token", res.data.token);

        setAutenticado(true);
        navigate("/");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setErro("Email ou senha inválidos");
    }
  };

  return (
    <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
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
            Entrar
          </Button>
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

export default Login;
