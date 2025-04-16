import React, { useState, useEffect } from "react";
import api from "./api"; // 👈 Use a instância com token
import {
  Box, TextField, Button, Typography, MenuItem, Paper, Grid, Snackbar, Alert, InputAdornment
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function NovoCalculo() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    numero: "",
    tipo: "",
    valor: "",
    cliente: "",
    prazo: ""
  });
  const [clientes, setClientes] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api.get("/clientes")
      .then(res => setClientes(res.data))
      .catch((err) => {
        console.error("Erro ao buscar clientes:", err);
        setClientes([]);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/calculos", {
        ...form,
        valor: parseFloat(form.valor),
        status: "pendente"
      });
      setMensagem("Cálculo cadastrado com sucesso!");
      setOpen(true);
      setTimeout(() => navigate("/calculos-pendentes"), 1500);
    } catch (err) {
      console.error("Erro ao salvar cálculo:", err);
      setMensagem("Erro ao salvar cálculo.");
      setOpen(true);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>Cadastrar Novo Cálculo</Typography>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Número do Processo"
                name="numero"
                value={form.numero}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Tipo de Ação"
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="Civil">Civil</MenuItem>
                <MenuItem value="Trabalhista">Trabalhista</MenuItem>
                <MenuItem value="Federal">Federal</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Valor do Cálculo (R$)"
                name="valor"
                value={form.valor}
                onChange={handleChange}
                fullWidth
                type="number"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Vincular Cliente"
                name="cliente"
                value={form.cliente}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon />
                    </InputAdornment>
                  )
                }}
              >
                {clientes.map((cliente) => (
                  <MenuItem key={cliente.id} value={cliente.nome}>
                    {cliente.nome}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Prazo do Cálculo"
                name="prazo"
                type="date"
                value={form.prazo}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Salvar Cálculo
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
        <Alert severity={mensagem.includes("sucesso") ? "success" : "error"}>
          {mensagem}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default NovoCalculo;
