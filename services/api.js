const BASE_URL = "http://192.168.8.101:4500";

export const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/api/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return await response.json();
};

export const getProducts = async (token) => {
  const response = await fetch(`${BASE_URL}/api/product`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await response.json();
};
