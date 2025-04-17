import React, { useState } from "react";
import api from "./api"; // ✅ Wrapper com token
import {
  TextField, Button, Paper, Typography, Box, Snackbar, Alert
} from "@mui/material";

function ClienteForm({ onClienteAdicionado }) {
  const [form, setForm] = useState({ nome: "", whatsapp: "", email: "" });
  const [mensagem, setMensagem] = useState("");
  const [open, setOpen] = useState(false);

  const formatarWhatsapp = (valor) => {
    const numeros = valor.replace(/\D/g, "");
    return numeros
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "whatsapp" ? formatarWhatsapp(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome.trim()) {
      setMensagem("O nome é obrigatório.");
      setOpen(true);
      return;
    }
    try {
      const clienteComData = {
        ...form,
        data_cadastro: new Date().toISOString()
      };
      await api.post("/clientes", clienteComData); // ✅ Usando API com token
      setMensagem("Cliente cadastrado com sucesso!");
      setOpen(true);
      setForm({ nome: "", whatsapp: "", email: "" });
      if (onClienteAdicionado) onClienteAdicionado();
    } catch (err) {
      console.error("Erro ao salvar cliente:", err);
      setMensagem("Erro ao salvar cliente.");
      setOpen(true);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Cadastrar Novo Cliente
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="Nome"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="WhatsApp"
          name="whatsapp"
          value={form.whatsapp}
          onChange={handleChange}
          placeholder="(99) 99999-9999"
          inputProps={{ maxLength: 15 }}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">
          Salvar
        </Button>
      </Box>

      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
        <Alert severity={mensagem.includes("sucesso") ? "success" : "error"}>
          {mensagem}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default ClienteForm;
