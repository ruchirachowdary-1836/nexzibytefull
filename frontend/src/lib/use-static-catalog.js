import { useEffect, useState } from "react";
import { api } from "./api.js";

export function useStaticCatalog(catalog) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api.getContentCatalog(catalog)
      .then((rows) => {
        if (active) setItems(rows);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "Content could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [catalog]);

  return { items, loading, error };
}
