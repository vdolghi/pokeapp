import Poke from "../controllers/app.controllers.mjs";
import express from "express";
import bodyParser from "body-parser";

const router = express.Router();
  
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/populate", Poke.populate);
router.post("/create", Poke.create);
router.get("/get", Poke.getAll);
router.get("/get/:id", Poke.getOne);
router.put("/update/:id", Poke.update);
router.delete("/delete/:id", Poke.deleteOne);
router.delete("/delete", Poke.deleteAll);

export default router;
