const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3001;

// Configuração do banco PostgreSQL
const pool = new Pool({
  user: 'postgles', // verifique se o usuário está correto
  host: 'localhost',
  database: 'folha_pagamento',
  password: 'admin',
  port: 5432,
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rota para cadastrar funcionário (POST)
app.post('/api/funcionarios', async (req, res) => {
  try {
    const f = req.body;

    const values = [
      f.cpf, f.nome, f.mae, f.pai, f.sexo, f.nascimento, f.estadoCivil, f.naturalidade, f.nacionalidade,
      f.escolaridade, f.raca, f.deficiencia, f.email, f.telefone, f.celular, f.pis, f.rg, f.orgaoEmissor,
      f.ufRg, f.dtEmissRg, f.ctps, f.serieCtps, f.ufCtps, f.dtEmissCtps, f.titulo, f.zona, f.secao,
      f.endereco, f.cep, f.tipoLogradouro, f.logradouro, f.numero, f.bairro, f.complemento
    ];

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
      RETURNING matricula;
    `;

    const result = await pool.query(query, values);
    const matriculaGerada = result.rows[0].matricula;

    res.status(200).json({
      message: 'Funcionário cadastrado com sucesso.',
      matricula: matriculaGerada
    });

  } catch (err) {
    console.error('Erro ao cadastrar funcionário:', err);
    res.status(500).json({ error: 'Erro ao cadastrar funcionário.' });
  }
});

// Rota para consultar todos os funcionários (GET)
app.get('/api/funcionarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM funcionarios ORDER BY matricula');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao consultar funcionários:', err);
    res.status(500).json({ error: 'Erro ao consultar funcionários.' });
  }
});

// Rota para consultar um funcionário por CPF (GET)
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

// Rota para atualizar funcionário por matrícula (PUT)
app.put('/api/funcionarios/:matricula', async (req, res) => {
  const { matricula } = req.params;
  const f = req.body;
  try {
    const query = `
      UPDATE funcionarios SET
        cpf = $1, nome = $2, mae = $3, pai = $4, sexo = $5, nascimento = $6, estado_civil = $7, naturalidade = $8, nacionalidade = $9,
        escolaridade = $10, raca = $11, deficiencia = $12, email = $13, telefone = $14, celular = $15, pis = $16, rg = $17, orgao_emissor = $18,
        uf_rg = $19, dt_emiss_rg = $20, ctps = $21, serie_ctps = $22, uf_ctps = $23, dt_emiss_ctps = $24, titulo = $25, zona = $26, secao = $27,
        endereco = $28, cep = $29, tipo_logradouro = $30, logradouro = $31, numero = $32, bairro = $33, complemento = $34
      WHERE matricula = $35
    `;
    const values = [
      f.cpf, f.nome, f.mae, f.pai, f.sexo, f.nascimento, f.estadoCivil, f.naturalidade, f.nacionalidade,
      f.escolaridade, f.raca, f.deficiencia, f.email, f.telefone, f.celular, f.pis, f.rg, f.orgaoEmissor,
      f.ufRg, f.dtEmissRg, f.ctps, f.serieCtps, f.ufCtps, f.dtEmissCtps, f.titulo, f.zona, f.secao,
      f.endereco, f.cep, f.tipoLogradouro, f.logradouro, f.numero, f.bairro, f.complemento,
      matricula
    ];
    await pool.query(query, values);
    res.status(200).json({ message: 'Funcionário atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar funcionário:', err);
    res.status(500).json({ error: 'Erro ao atualizar funcionário.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
