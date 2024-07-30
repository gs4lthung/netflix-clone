import axios from "axios";
import { ENV_VARS } from "../config/envVars.js";
export const fetchFromTMDB = async (url) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${ENV_VARS.TMDP_API_KEY}`,
    },
  };

  const res = await axios.get(url, options).catch((error) => {
    throw new Error("Failed to fetch data from TMDB: " + error.message);
  });
  return res.data;
};
