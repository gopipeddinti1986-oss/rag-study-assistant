import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

//
// ===========================
// Authentication
// ===========================
//

export const loginUser = async (email, password) => {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
  });

  return response.data;
};

//
// ===========================
// PDF Upload
// ===========================
//

export const uploadPDF = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

//
// ===========================
// Ask Question
// ===========================
//

export const askQuestion = async (
  question,
  conversationId = null
) => {
  const response = await api.post("/ask", {
    question,
    conversation_id: conversationId,
  });

  return response.data;
};

//
// ===========================
// Conversations
// ===========================
//

export const getConversations = async () => {
  const response = await api.get("/conversations");
  return response.data;
};

export const getConversation = async (conversationId) => {
  const response = await api.get(
    `/conversations/${conversationId}`
  );

  return response.data;
};

export const deleteConversation = async (
  conversationId
) => {
  const response = await api.delete(
    `/conversations/${conversationId}`
  );

  return response.data;
};

//
// ===========================
// Export Axios instance
// ===========================
//

export default api;

export const generateQuiz = async (difficulty, count) => {
  const response = await api.post("/quiz/", {
    difficulty,
    count,
  });

  return response.data;
};