import express from "express";
import {
  deleteItemFromSearchHistory,
  searchHistory,
  searchMovie,
  searchPerson,
  searchTv,
} from "../controller/search.controller.js";

const router = express.Router();

router.get("/person/:query", searchPerson);
router.get("/movie/:query", searchMovie);
router.get("/tv/:query", searchTv);
router.get("/history", searchHistory);
router.delete("/history/:id", deleteItemFromSearchHistory);
export default router;
