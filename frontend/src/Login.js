import React, { useState } from "react";
import api from "./api"; // ✅ Agora o caminho correto: "./api"
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
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const response = await api.post("/login", form);

      if (response.data?.mensagem && response.data?.token) {
        localStorage.setItem("token", response.data.token);
        setAutenticado(true);
        navigate("/");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      const msg = error.response?.data?.detail || "Email ou senha inválidos.";
      setErro(msg);
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
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
          >
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
