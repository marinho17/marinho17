const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3001;

// Configuração do banco PostgreSQL
const pool = new Pool({
  user: 'postgles',
  host: 'localhost',
  database: 'folha_pagamento',
  password: 'admin',
  port: 5432, // padrão do PostgreSQL
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());

app.post('/api/funcionarios', async (req, res) => {
  try {
    const f = req.body;

const query = `
  INSERT INTO funcionarios (
    cpf, nome, mae, pai, sexo, nascimento, estado_civil, naturalidade, nacionalidade,
    escolaridade, raca, deficiencia, email, telefone, celular, pis, rg, orgao_emissor,
    uf_rg, dt_emiss_rg, ctps, serie_ctps, uf_ctps, dt_emiss_ctps, titulo, zona, secao,
    endereco, cep, tipo_logradouro, logradouro, numero, bairro, complemento
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
    $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
    $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
    $31, $32, $33, $34
  )
  RETURNING matricula;  -- Retorna a matrícula gerada
`;


    const result = await pool.query(query, values);
    const matriculaGerada = result.rows[0].matricula; // Acessa o valor retornado

    res.status(200).json({ 
      message: 'Funcionário cadastrado com sucesso.',
      matricula: matriculaGerada // Campo corrigido
    });

  } catch (err) {
    // ... tratamento de erro ...
  }
});

// Rota para consultar todos os funcionários
app.get('/api/funcionarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM funcionarios');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao consultar funcionários:', err);
    res.status(500).json({ error: 'Erro ao consultar funcionários.' });
  }
});

// Rota para consultar um funcionário por CPF
app.get('/api/funcionarios/:cpf', async (req, res) => {
  const { cpf } = req.params;
  try {
    const result = await pool.query('SELECT * FROM funcionarios WHERE cpf = $1', [cpf]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Funcionário não encontrado.' });
    }
  } catch (err) {
    console.error('Erro ao consultar funcionário:', err);
    res.status(500).json({ error: 'Erro ao consultar funcionário.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});