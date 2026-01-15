import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API } from "../api";
import Layout from "../components/Layout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await API.login(email, password);

    if (res && res.token) {
      // Save token and user info to localStorage
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);
      localStorage.setItem("email", email);

      // Navigate to main page (e.g., Applications dashboard)
      navigate("/applications");
    } else {
      alert(res.error || "Invalid login credentials");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Login failed. Please try again.");
  }
};


  return (
    <Layout title="Login to proceed," setWidth="30%"> 
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
        width="100%">

        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleLogin} fullWidth>
          Login
        </Button>
        <Button variant="text" onClick={() => navigate("/apply")} fullWidth>
          New Application
        </Button>
      </Box>
    </Layout>
  );
}   