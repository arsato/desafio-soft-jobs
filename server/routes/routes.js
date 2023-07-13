const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const {
  registrarUsuario,
  getUsuario,
  verificarCredenciales,
  requestTime,
  validarToken,
} = require("../queries");

router.use(express.json());

router.get("/usuarios", async (req, res) => {
  try {
    requestTime(req);
    let data = await getUsuario(validarToken(req));
    res.send(data);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

router.post("/usuarios", async (req, res) => {
  try {
    requestTime(req);
    const usuario = req.body;
    await registrarUsuario(usuario);
    res.send("Usuario creado con éxito");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    requestTime(req);
    const { email, password } = req.body;
    await verificarCredenciales(email, password);
    const token = jwt.sign({ email }, "az_AZ");
    res.send(token);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
});

router.get("*", (req, res) => {
  requestTime(req);
  res.status(404).send("Esta ruta no existe");
});

module.exports = router;
