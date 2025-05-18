const express = require('express');
const cors = require('cors');
const app = express();

const funcionariosRoutes = require('./routes/funcionarios');

app.use(cors());
app.use(express.json());

// Usa as rotas dos funcionários
app.use(funcionariosRoutes);

app.listen(3001, () => {
  console.log("Servidor backend rodando na porta 3001");
});
