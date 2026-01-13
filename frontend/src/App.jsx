// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import LoginPage from "./pages/LoginPage.jsx";
import CandidateApplication from "./pages/CandidateApplication.jsx";
import CreateNewApplication from "./pages/CreateNewApplication.jsx";
import ApplicationsOverview from "./pages/ApplicationsOverview";
import ApplicationDetail from "./pages/ApplicationDetail";
import JobsOverview from "./pages/JobsOverview.jsx";
import LogoutPage from "./pages/LogOutPage.jsx";


export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/apply" element={<CandidateApplication />} />
          <Route path="/create" element={<CreateNewApplication />} />
          <Route path="/applications" element={<ApplicationsOverview />} />
          <Route path="/applications/:id" element={<ApplicationDetail />} />
          <Route path="/jobs" element={<JobsOverview />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
