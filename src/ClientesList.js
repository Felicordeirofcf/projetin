import React, { useEffect, useState } from "react";
import api from "./api"; // 🔄 Substituindo axios
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, IconButton, TextField, Button, Box,
  TablePagination, MenuItem, Tooltip, Snackbar, Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import ClienteForm from "./ClienteForm";

function ClientesList() {
  const [clientes, setClientes] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formEdicao, setFormEdicao] = useState({ nome: "", whatsapp: "", email: "" });
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("nome");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [alerta, setAlerta] = useState("");
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = () => {
    api.get("/clientes")
      .then(res => setClientes(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error("Erro ao buscar clientes:", err);
        setClientes([]);
      });
  };

  const deletarCliente = (id) => {
    if (!window.confirm("Deseja realmente excluir este cliente?")) return;
    api.delete(`/clientes/${id}`)
      .then(() => carregarClientes())
      .catch(err => console.error("Erro ao deletar cliente:", err));
  };

  const iniciarEdicao = (cliente) => {
    setEditandoId(cliente.id);
    setFormEdicao({ nome: cliente.nome, whatsapp: cliente.whatsapp || "", email: cliente.email || "" });
  };

  const salvarEdicao = (id) => {
    if (formEdicao.nome.trim() === "") {
      setAlerta("O nome é obrigatório.");
      setOpenAlert(true);
      return;
    }
    api.put(`/clientes/${id}`, formEdicao)
      .then(() => {
        setEditandoId(null);
        carregarClientes();
      })
      .catch(err => console.error("Erro ao atualizar cliente:", err));
  };

  const formatarWhatsapp = (valor) => {
    const somenteNumeros = valor.replace(/\D/g, "");
    return somenteNumeros
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const clientesFiltrados = clientes
    .filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) => ordenacao === "nome" ? a.nome.localeCompare(b.nome) : b.id - a.id);

  const clientesPaginados = clientesFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Lista de Clientes ({clientesFiltrados.length})
      </Typography>

      <ClienteForm onClienteAdicionado={carregarClientes} />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", mb: 2 }}>
        <TextField
          label="Buscar"
          variant="outlined"
          size="small"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
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
          label="Ordenar por"
          size="small"
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value)}
        >
          <MenuItem value="nome">Nome</MenuItem>
          <MenuItem value="id">Mais recentes</MenuItem>
        </TextField>

        <Button variant="outlined" color="secondary" onClick={() => exportarCSV(clientes)}>
          Exportar CSV
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>WhatsApp</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientesPaginados.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell>{c.id}</TableCell>
                <TableCell>
                  {editandoId === c.id ? (
                    <TextField
                      value={formEdicao.nome}
                      onChange={(e) => setFormEdicao({ ...formEdicao, nome: e.target.value })}
                      size="small"
                      fullWidth
                    />
                  ) : c.nome}
                </TableCell>
                <TableCell>
                  {editandoId === c.id ? (
                    <TextField
                      value={formEdicao.whatsapp}
                      onChange={(e) =>
                        setFormEdicao({
                          ...formEdicao,
                          whatsapp: formatarWhatsapp(e.target.value),
                        })
                      }
                      size="small"
                      fullWidth
                      placeholder="(99) 99999-9999"
                    />
                  ) : c.whatsapp || "-"}
                </TableCell>
                <TableCell>
                  {editandoId === c.id ? (
                    <TextField
                      value={formEdicao.email}
                      onChange={(e) => setFormEdicao({ ...formEdicao, email: e.target.value })}
                      size="small"
                      fullWidth
                    />
                  ) : c.email || "-"}
                </TableCell>
                <TableCell>
                  {editandoId === c.id ? (
                    <Tooltip title="Salvar">
                      <IconButton color="success" onClick={() => salvarEdicao(c.id)}>
                        <SaveIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <>
                      <Tooltip title="Editar">
                        <IconButton color="primary" onClick={() => iniciarEdicao(c)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton color="error" onClick={() => deletarCliente(c.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          count={clientesFiltrados.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Snackbar open={openAlert} autoHideDuration={3000} onClose={() => setOpenAlert(false)}>
        <Alert severity="warning">{alerta}</Alert>
      </Snackbar>
    </Box>
  );
}

const exportarCSV = (clientes) => {
  const linhas = [["ID", "Nome", "WhatsApp", "Email"]];
  clientes.forEach(c => {
    linhas.push([c.id, c.nome, c.whatsapp || "", c.email || ""]);
  });
  const csvContent = linhas.map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "clientes.csv";
  link.click();
};

export default ClientesList;
