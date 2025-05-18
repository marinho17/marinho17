import React, { useState } from "react";
import "./FormularioFolhaPagamento.css"; // Estilo próprio da folha
import axios from "axios";

export default function FormularioFolhaPagamento() {
  const [matricula, setMatricula] = useState("");
  const [funcionario, setFuncionario] = useState(null);
  const [rubricas, setRubricas] = useState([]);
  const [resumo, setResumo] = useState({ proventos: 0, descontos: 0, total: 0, remuneracao: 0 });

  const buscarFuncionario = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/funcionarios/${matricula}`);
      setFuncionario(res.data);
    } catch (error) {
      console.error("Erro ao buscar funcionário.");
    }
  };

  const handleRecalcular = () => {
    const proventos = rubricas.filter(r => r.tipo === "Provento").reduce((s, r) => s + parseFloat(r.valor), 0);
    const descontos = rubricas.filter(r => r.tipo === "Desconto").reduce((s, r) => s + parseFloat(r.valor), 0);
    const total = proventos - descontos;
    setResumo({ proventos, descontos, total, remuneracao: proventos });
  };

  const adicionarRubrica = () => {
    setRubricas([...rubricas, { codigo: "", rubrica: "", tipo: "Provento", referencia: "", valor: "" }]);
  };

  const atualizarRubrica = (index, campo, valor) => {
    const atualizadas = [...rubricas];
    atualizadas[index][campo] = valor;
    setRubricas(atualizadas);
  };

  return (
    <div className="folha-container">
      <div className="topo-formulario">
        <label>
          Matrícula (F2 para pesquisar):{" "}
          <input
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            onBlur={buscarFuncionario}
          />
        </label>

        {funcionario && (
          <div className="dados-funcionario">
            <p><strong>Órgão:</strong> {funcionario.orgao}</p>
            <p><strong>Lotação:</strong> {funcionario.setor}</p>
            <p><strong>Cargo:</strong> {funcionario.cargo}</p>
            <p><strong>Vínculo:</strong> {funcionario.vinculo}</p>
            {/* Adicione os demais campos conforme necessário */}
          </div>
        )}

        <div className="botoes-secundarios">
          <button className="verde">Contracheque</button>
          <button className="azul">Ficha Financeira</button>
        </div>
      </div>

      <table className="tabela-rubricas">
        <thead>
          <tr>
            <th>Código</th>
            <th>Rubrica</th>
            <th>Tipo</th>
            <th>Referência</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {rubricas.map((r, i) => (
            <tr key={i}>
              <td><input value={r.codigo} onChange={(e) => atualizarRubrica(i, "codigo", e.target.value)} /></td>
              <td><input value={r.rubrica} onChange={(e) => atualizarRubrica(i, "rubrica", e.target.value)} /></td>
              <td>
                <select value={r.tipo} onChange={(e) => atualizarRubrica(i, "tipo", e.target.value)}>
                  <option>Provento</option>
                  <option>Desconto</option>
                </select>
              </td>
              <td><input value={r.referencia} onChange={(e) => atualizarRubrica(i, "referencia", e.target.value)} /></td>
              <td><input value={r.valor} onChange={(e) => atualizarRubrica(i, "valor", e.target.value)} /></td>
              <td>
                <button onClick={() => setRubricas(rubricas.filter((_, idx) => idx !== i))}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="resumo-pagamento">
        <p>Proventos: R$ {resumo.proventos.toFixed(2)}</p>
        <p>Descontos: R$ {resumo.descontos.toFixed(2)}</p>
        <p>Total a Receber: R$ {resumo.total.toFixed(2)}</p>
        <p>Remuneração: R$ {resumo.remuneracao.toFixed(2)}</p>
        <button onClick={handleRecalcular}>Recalcular</button>
      </div>

      <div className="acoes-formulario">
        <button className="verde" onClick={() => alert("Salvo!")}>Salvar</button>
        <button className="vermelho">Cancelar</button>
        <button className="azul" onClick={adicionarRubrica}>Nova Rubrica</button>
      </div>
    </div>
  );
}
