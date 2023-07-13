const bcrypt = require("bcryptjs");
const pool = require("./config");
const jwt = require("jsonwebtoken");

const registrarUsuario = async (usuario) => {
  let { email, password, rol, lenguage } = usuario;
  const passwordEncriptada = bcrypt.hashSync(password);
  password = passwordEncriptada;
  const values = [email, passwordEncriptada, rol, lenguage];
  const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)";
  await pool.query(consulta, values);
};

const getUsuario = async (email) => {
  const values = [email];
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const { rows: rowCount } = await pool.query(consulta, values);
  if (!rowCount) throw { code: 401, message: "Email o contraseña incorrecta" };
  return rowCount[0];
};

const verificarCredenciales = async (email, password) => {
  const values = [email];
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values);
  const { password: passwordEncriptada } = usuario;
  const passwordCorrecta = bcrypt.compareSync(password, passwordEncriptada);
  if (!passwordCorrecta || !rowCount)
    throw { code: 401, message: "Email o contraseña incorrecta" };
};

const validarToken = (req) => {
  const Authorization = req.header("Authorization");
  const token = Authorization.split("Bearer ")[1];
  jwt.verify(token, "az_AZ");
  const { email } = jwt.decode(token);
  return email
};

const requestTime = (req) => {
  console.log("\x1b[31m", Date().toString());
  console.log("Se ha realizado una consulta a la siguiente direccion:");
  console.log("%s\x1b[0m", req.originalUrl);
};

module.exports = {
  getUsuario,
  verificarCredenciales,
  requestTime,
  registrarUsuario,
  validarToken
};
