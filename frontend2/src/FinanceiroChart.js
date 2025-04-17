import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import {
  Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from "@mui/material";
import api from "./api";

function FinanceiroChart() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const res = await api.get("/calculos");
        const realizados = res.data.filter(c => c.status === "realizado" && c.data_realizado);

        const agrupado = {};

        realizados.forEach(c => {
          const data = new Date(c.data_realizado);
          const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;

          if (!agrupado[chave]) {
            agrupado[chave] = 0;
          }
          agrupado[chave] += c.valor;
        });

        const dadosFormatados = Object.entries(agrupado).map(([mes, total]) => ({
          mes: formatarMes(mes),
          total: parseFloat(total.toFixed(2))
        }));

        setDados(dadosFormatados);
      } catch (error) {
        console.error("Erro ao carregar dados financeiros:", error);
      }
    };

    carregarDados();
  }, []);

  const formatarMes = (yyyymm) => {
    const [ano, mes] = yyyymm.split("-");
    const nomes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return `${nomes[parseInt(mes, 10) - 1]}/${ano}`;
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(valor);
  };

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      {dados.length === 0 ? (
        <Typography variant="body1">Nenhum cálculo realizado com data registrada.</Typography>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>Gráfico de Entradas Financeiras</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis tickFormatter={formatarMoeda} />
              <Tooltip formatter={(value) => formatarMoeda(value)} />
              <Bar dataKey="total" fill="#2e7d32" />
            </BarChart>
          </ResponsiveContainer>

          <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>Tabela de Entradas por Mês</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Mês</strong></TableCell>
                  <TableCell><strong>Total Recebido</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dados.map((row) => (
                  <TableRow key={row.mes}>
                    <TableCell>{row.mes}</TableCell>
                    <TableCell>{formatarMoeda(row.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Paper>
  );
}

export default FinanceiroChart;
