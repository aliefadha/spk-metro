export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token; // true kalau token ada
  };
  