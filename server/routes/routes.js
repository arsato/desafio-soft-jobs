const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
require("dotenv").config();

const {
  registrarUsuario,
  getUsuario,
  verificarCredenciales,
  requestTime,
  validarToken,
} = require("../queries");

router.use(express.json());

router.get("/usuarios", requestTime, validarToken, async (req, res) => {
  try {
    const auth = req.header("Authorization");
    const token = auth.split("Bearer ")[1];
    const { email } = jwt.decode(token);
    const data = await getUsuario(email);
    res.send(data);
  } catch (error) {
    res.status(error.code || 500).send(error.message);
  }
});

router.post("/usuarios", requestTime, async (req, res) => {
  try {
    const usuario = req.body;
    await registrarUsuario(usuario);
    res.send("Usuario creado con éxito");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/login", requestTime, async (req, res) => {
  try {
    const { email, password } = req.body;
    await verificarCredenciales(email, password);
    const token = jwt.sign({ email }, process.env.TOKEN_SECRET);
    res.send(token);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error.message);
  }
});

module.exports = router;
