// src/api/cart.js
import { fetchCSV } from "./csvClient";
import { transformCartRequests } from "../services/cart";



export const getCartRequest = async () => {
  // 1) Load Excel
  const results = await fetchCSV("/data/cart/cart.csv");
  const transformedRequests = transformCartRequests(results);
  return transformedRequests;
}
