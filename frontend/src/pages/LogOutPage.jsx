import React, { useState } from "react";
import { TextField, Button, Box, InputLabel, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API } from "../api";
import Layout from "../components/Layout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");


  return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
        width="100%">

<Typography>Logged out</Typography>
      </Box>
  );
}   