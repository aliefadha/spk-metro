import { useEffect } from "react";

export default function NotFoundPage() {
  useEffect(() => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }, []);

  return null;
}
