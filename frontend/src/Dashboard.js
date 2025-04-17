import React, { useEffect, useState } from "react";
import api from "./api"; // ✅ usando o wrapper com token
import {
  Box, Typography, Grid, Card, CardContent, Divider, List, ListItem,
  ListItemText, Alert, CardActionArea, Button
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ErrorIcon from "@mui/icons-material/Error";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import FinanceiroChart from "./FinanceiroChart";

function Dashboard() {
  const [clientes, setClientes] = useState([]);
  const [calculos, setCalculos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resClientes = await api.get("/clientes");
        const resCalculos = await api.get("/calculos");
        setClientes(resClientes.data);
        setCalculos(resCalculos.data);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard", err);
      }
    };
    fetchData();
  }, []);

  const marcarComoRealizado = async (id) => {
    try {
      await api.put(`/calculos/${id}/status`, {
        status: "realizado"
      });
      const res = await api.get("/calculos");
      setCalculos(res.data);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Erro ao marcar como realizado.");
    }
  };

  const hoje = new Date();
  const amanha = new Date();
  amanha.setDate(hoje.getDate() + 1);
  const seteDias = new Date();
  seteDias.setDate(hoje.getDate() + 7);

  const totalClientes = clientes.length;
  const totalRealizados = calculos.filter(c => c.status === "realizado").length;
  const totalPendentes = calculos.filter(c => c.status === "pendente").length;
  const totalVencidos = calculos.filter(c => c.status === "pendente" && new Date(c.prazo) < hoje).length;
  const vencemAmanha = calculos.filter(c => c.status === "pendente" && new Date(c.prazo).toDateString() === amanha.toDateString());

  const ultimosCalculos = calculos.slice(-5).reverse();

  const tipos = ["Civil", "Trabalhista", "Federal"];
  const distTipo = tipos.map((tipo) => ({
    name: tipo,
    value: calculos.filter(c => c.tipo === tipo).length
  }));

  const barData = [
    { name: "Clientes", total: totalClientes },
    { name: "Realizados", total: totalRealizados },
    { name: "Pendentes", total: totalPendentes },
    { name: "Vencidos", total: totalVencidos }
  ];

  const cores = ["#1976d2", "#2e7d32", "#ed6c02", "#d32f2f"];

  const navigateTo = (rota) => navigate(rota);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

      {totalVencidos > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Existem {totalVencidos} cálculo(s) pendente(s) com prazo vencido!
        </Alert>
      )}

      {vencemAmanha.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Atenção: {vencemAmanha.length} cálculo(s) vencem amanhã!
        </Alert>
      )}

      {/* Cards Resumo */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <CardActionArea onClick={() => navigateTo("/clientes")}>
            <Card sx={{ p: 2, textAlign: "center" }}>
              <PeopleIcon color="primary" fontSize="large" />
              <Typography variant="h6">Clientes</Typography>
              <Typography variant="h4">{totalClientes}</Typography>
            </Card>
          </CardActionArea>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardActionArea onClick={() => navigateTo("/calculos-realizados")}>
            <Card sx={{ p: 2, textAlign: "center" }}>
              <CheckCircleIcon color="success" fontSize="large" />
              <Typography variant="h6">Realizados</Typography>
              <Typography variant="h4">{totalRealizados}</Typography>
            </Card>
          </CardActionArea>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CardActionArea onClick={() => navigateTo("/calculos-pendentes")}>
            <Card sx={{ p: 2, textAlign: "center" }}>
              <HourglassEmptyIcon color="warning" fontSize="large" />
              <Typography variant="h6">Pendentes</Typography>
              <Typography variant="h4">{totalPendentes}</Typography>
            </Card>
          </CardActionArea>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: "center" }}>
            <ErrorIcon color="error" fontSize="large" />
            <Typography variant="h6">Vencidos</Typography>
            <Typography variant="h4">{totalVencidos}</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Totais do Sistema</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Distribuição por Tipo</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={distTipo} dataKey="value" nameKey="name" outerRadius={90}>
                    {distTipo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico Financeiro */}
        <Grid item xs={12}>
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Entradas Financeiras por Mês</Typography>
              <FinanceiroChart />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Últimos Cálculos */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Últimos Cálculos</Typography>
          <Divider sx={{ mb: 1 }} />
          <List>
            {ultimosCalculos.map((calc) => (
              <ListItem key={calc.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                <ListItemText
                  primary={`#${calc.numero} - ${calc.cliente}`}
                  secondary={`Tipo: ${calc.tipo} • Prazo: ${new Date(calc.prazo).toLocaleDateString()} • Status: ${calc.status}`}
                />
                {calc.status === "pendente" && (
                  <Button
                    variant="outlined"
                    size="small"
                    color="success"
                    onClick={() => marcarComoRealizado(calc.id)}
                  >
                    Marcar como Realizado
                  </Button>
                )}
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Dashboard;
