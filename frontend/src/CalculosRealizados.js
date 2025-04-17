import React, { useEffect, useState } from "react";
import api from "./api"; // ✅ importa com autenticação
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  TextField, MenuItem, InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function CalculosRealizados() {
  const [calculos, setCalculos] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("");
  const [prazoFiltro, setPrazoFiltro] = useState("todos");

  const carregarCalculos = () => {
    api.get("/calculos")
      .then(res => {
        const realizados = res.data.filter(calc => calc.status === "realizado");
        setCalculos(realizados);
      })
      .catch(err => console.error("Erro ao carregar cálculos:", err));
  };

  useEffect(() => {
    carregarCalculos();
  }, []);

  const hoje = new Date();
  const filtrarCalculos = () => {
    return calculos.filter(calc => {
      const condTipo = filtroTipo ? calc.tipo === filtroTipo : true;
      const condCliente = filtroCliente
        ? calc.cliente.toLowerCase().includes(filtroCliente.toLowerCase())
        : true;
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
        Cálculos Realizados
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default CalculosRealizados;
