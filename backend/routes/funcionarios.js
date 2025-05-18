const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Conexão com PostgreSQL (ajuste o usuário se necessário)
const pool = new Pool({
  user: 'postgres', // Confirme o usuário do seu banco
  host: 'localhost',
  database: 'folha_pagamento',
  password: 'admin',
  port: 5432,
});

// POST - Cadastrar funcionário
router.post('/api/funcionarios', async (req, res) => {
  const {
    cpf, nome, mae, pai, sexo, nascimento, estadoCivil, naturalidade,
    nacionalidade, escolaridade, raca, deficiencia, email, telefone,
    celular, pis, rg, orgaoEmissor, ufRg, dtEmissRg, ctps, serieCtps,
    ufCtps, dtEmissCtps, titulo, zona, secao, endereco, cep,
    tipoLogradouro, logradouro, numero, bairro, complemento
  } = req.body;

  try {
    const result = await pool.query(`
      INSERT INTO funcionarios (
        cpf, nome, mae, pai, sexo, nascimento, estado_civil, naturalidade, nacionalidade,
        escolaridade, raca, deficiencia, email, telefone, celular, pis, rg, orgao_emissor,
        uf_rg, dt_emiss_rg, ctps, serie_ctps, uf_ctps, dt_emiss_ctps, titulo, zona, secao,
        endereco, cep, tipo_logradouro, logradouro, numero, bairro, complemento
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24, $25, $26, $27,
        $28, $29, $30, $31, $32, $33, $34
      )
      RETURNING matricula;  // Alterado para retornar apenas a matrícula
    `, [
      cpf, nome, mae, pai, sexo, nascimento, estadoCivil, naturalidade, nacionalidade,
      escolaridade, raca, deficiencia, email, telefone, celular, pis, rg, orgaoEmissor,
      ufRg, dtEmissRg, ctps, serieCtps, ufCtps, dtEmissCtps, titulo, zona, secao,
      endereco, cep, tipoLogradouro, logradouro, numero, bairro, complemento
    ]);

    res.status(201).json({ 
      message: 'Funcionário cadastrado com sucesso!',
      matricula: result.rows[0].matricula // Frontend espera este campo
    });

  } catch (error) {
    console.error("Erro ao cadastrar funcionário:", error);
    res.status(500).json({ error: 'Erro ao cadastrar funcionário.' });
  }
});

// GET - Listar todos os funcionários
router.get('/api/funcionarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM funcionarios ORDER BY nome');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao listar funcionários:", error);
    res.status(500).json({ error: 'Erro ao buscar funcionários.' });
  }
});

// PUT - Atualizar funcionário por matrícula
router.put('/api/funcionarios/:matricula', async (req, res) => {
  const { matricula } = req.params;
  const {
    cpf, nome, mae, pai, sexo, nascimento, estadoCivil, naturalidade,
    nacionalidade, escolaridade, raca, deficiencia, email, telefone,
    celular, pis, rg, orgaoEmissor, ufRg, dtEmissRg, ctps, serieCtps,
    ufCtps, dtEmissCtps, titulo, zona, secao, endereco, cep,
    tipoLogradouro, logradouro, numero, bairro, complemento
  } = req.body;

  try {
    await pool.query(`
      UPDATE funcionarios SET
        cpf = $1, nome = $2, mae = $3, pai = $4, sexo = $5, nascimento = $6, 
        estado_civil = $7, naturalidade = $8, nacionalidade = $9, escolaridade = $10, 
        raca = $11, deficiencia = $12, email = $13, telefone = $14, celular = $15, 
        pis = $16, rg = $17, orgao_emissor = $18, uf_rg = $19, dt_emiss_rg = $20, 
        ctps = $21, serie_ctps = $22, uf_ctps = $23, dt_emiss_ctps = $24, 
        titulo = $25, zona = $26, secao = $27, endereco = $28, cep = $29, 
        tipo_logradouro = $30, logradouro = $31, numero = $32, bairro = $33, complemento = $34
      WHERE matricula = $35
    `, [
      cpf, nome, mae, pai, sexo, nascimento, estadoCivil, naturalidade, nacionalidade,
      escolaridade, raca, deficiencia, email, telefone, celular, pis, rg, orgaoEmissor,
      ufRg, dtEmissRg, ctps, serieCtps, ufCtps, dtEmissCtps, titulo, zona, secao,
      endereco, cep, tipoLogradouro, logradouro, numero, bairro, complemento,
      matricula
    ]);

    res.status(200).json({ message: 'Funcionário atualizado com sucesso!' });

  } catch (error) {
    console.error("Erro ao atualizar funcionário:", error);
    res.status(500).json({ error: 'Erro ao atualizar funcionário.' });
  }
});

module.exports = router;
