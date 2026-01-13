import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function Layout({ title, setWidth, children }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "background.default",
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "90%",
          maxWidth: setWidth,
          p: 5,
          borderRadius: 4,
        }}
      >
        {title && (
          <Typography
            variant="h4"
            color="primary"
            align="center"
            gutterBottom
            sx={{ mb: 3 }}
          >
            {title}
          </Typography>
        )}
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          {children}
        </Box>
      </Paper>
    </Box>
  );
}   