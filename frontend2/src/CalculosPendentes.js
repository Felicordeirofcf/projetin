import React, { useEffect, useState } from "react";
import api from "./api"; // ✅ wrapper com token
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, TextField, MenuItem, InputAdornment
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";

function CalculosPendentes() {
  const [calculos, setCalculos] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("");
  const [prazoFiltro, setPrazoFiltro] = useState("todos");

  const carregarCalculos = () => {
    api.get("/calculos")
      .then(res => {
        const pendentes = res.data.filter(calc => calc.status === "pendente");
        setCalculos(pendentes);
      })
      .catch(err => console.error("Erro ao carregar cálculos:", err));
  };

  const deletarCalculo = (id) => {
    api.delete(`/calculos/${id}`)
      .then(() => carregarCalculos())
      .catch(err => console.error("Erro ao deletar cálculo:", err));
  };

  const marcarComoRealizado = (id) => {
    api.put(`/calculos/${id}/status`, { status: "realizado" })
      .then(() => carregarCalculos())
      .catch(err => console.error("Erro ao atualizar status:", err));
  };

  useEffect(() => {
    carregarCalculos();
  }, []);

  const hoje = new Date();
  const filtrarCalculos = () => {
    return calculos.filter(calc => {
      const condTipo = filtroTipo ? calc.tipo === filtroTipo : true;
      const condCliente = filtroCliente ? calc.cliente.toLowerCase().includes(filtroCliente.toLowerCase()) : true;
      const prazoData = new Date(calc.prazo);
      const condPrazo =
        prazoFiltro === "anteriores" ? prazoData < hoje :
        prazoFiltro === "posteriores" ? prazoData > hoje : true;

      return condTipo && condCliente && condPrazo;
    });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Cálculos Pendentes
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
        <TextField
          select
          label="Filtrar por Tipo"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          sx={{ width: 220 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="Civil">Civil</MenuItem>
          <MenuItem value="Trabalhista">Trabalhista</MenuItem>
          <MenuItem value="Federal">Federal</MenuItem>
        </TextField>

        <TextField
          label="Filtrar por Cliente"
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
          sx={{ width: 240 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />

        <TextField
          select
          label="Prazo"
          value={prazoFiltro}
          onChange={(e) => setPrazoFiltro(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="todos">Todos</MenuItem>
          <MenuItem value="anteriores">Antes de hoje</MenuItem>
          <MenuItem value="posteriores">Depois de hoje</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Valor (R$)</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Prazo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtrarCalculos().map((calc) => (
              <TableRow key={calc.id}>
                <TableCell>{calc.numero}</TableCell>
                <TableCell>{calc.tipo}</TableCell>
                <TableCell>{calc.valor.toFixed(2)}</TableCell>
                <TableCell>{calc.cliente}</TableCell>
                <TableCell>{new Date(calc.prazo).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton color="success" onClick={() => marcarComoRealizado(calc.id)}>
                    <CheckCircleIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => deletarCalculo(calc.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default CalculosPendentes;
