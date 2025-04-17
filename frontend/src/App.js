import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import ClientesList from "./ClientesList";
import CalculosPendentes from "./CalculosPendentes";
import CalculosRealizados from "./CalculosRealizados";
import NovoCalculo from "./NovoCalculo";
import Dashboard from "./Dashboard";
import Login from "./Login";
import CadastroUsuario from "./CadastroUsuario";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import LogoutIcon from "@mui/icons-material/Logout";

function App() {
  const [autenticado, setAutenticado] = useState(() => !!localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAutenticado(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAutenticado(false);
    window.location.href = "/login"; // força redirecionamento para login
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url('/logoaj.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "40%",
          opacity: 0.04,
          zIndex: 0,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Router>
          {autenticado && (
            <AppBar position="static">
              <Toolbar>
                <img
                  src="/logoaj.png"
                  alt="Logo AJ"
                  style={{ height: 40, marginRight: 10 }}
                />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  AJ Cálculos Judiciais
                </Typography>
                <Button color="inherit" component={Link} to="/">
                  <DashboardIcon sx={{ mr: 1 }} /> Dashboard
                </Button>
                <Button color="inherit" component={Link} to="/clientes">
                  <PeopleIcon sx={{ mr: 1 }} /> Clientes
                </Button>
                <Button color="inherit" component={Link} to="/calculos-realizados">
                  <CheckCircleOutlineIcon sx={{ mr: 1 }} /> Realizados
                </Button>
                <Button color="inherit" component={Link} to="/calculos-pendentes">
                  <HourglassEmptyIcon sx={{ mr: 1 }} /> Pendentes
                </Button>
                <Button color="inherit" component={Link} to="/novo-calculo">
                  <AddCircleOutlineIcon sx={{ mr: 1 }} /> Novo Cálculo
                </Button>
                <Button color="inherit" component={Link} to="/cadastro">
                  <PersonAddAltIcon sx={{ mr: 1 }} /> Cadastrar Usuário
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} /> Sair
                </Button>
              </Toolbar>
            </AppBar>
          )}

          <Box sx={{ padding: 3 }}>
            <Routes>
              <Route path="/login" element={<Login setAutenticado={setAutenticado} />} />
              <Route path="/cadastro" element={<CadastroUsuario />} />
              {autenticado ? (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/clientes" element={<ClientesList />} />
                  <Route path="/calculos-realizados" element={<CalculosRealizados />} />
                  <Route path="/calculos-pendentes" element={<CalculosPendentes />} />
                  <Route path="/novo-calculo" element={<NovoCalculo />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/login" replace />} />
              )}
            </Routes>
          </Box>
        </Router>
      </div>
    </div>
  );
}

export default App;
