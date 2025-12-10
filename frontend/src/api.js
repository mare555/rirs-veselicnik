export const API_BASE = "http://localhost:3000";import applications from "./data/applications.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


export const API = {
  async login(email, password) {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Login failed");

    return {
      success: true,
      token: data.token,
      role: data.role,
    };
  },


  getApplications: async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/applications/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch applications");
    return res.json();
  },

  getApplicationById: async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/applications/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch applications");
    return res.json();
  },

  submitApplication: async (data) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to submit application");
    }
    return res.json();
  },

  createApplication: async (data) => {
    console.log("Created new job application:", data);
    return { success: true };
  },

  getJobs: async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/job/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch jobs");
    return res.json();
  }
};
