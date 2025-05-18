import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import Select from "react-select";

// Funções auxiliares de padronização
function onlyLetters(value) {
  // Permite letras, acentos e espaço, até 30 caracteres
  return value.replace(/[^A-Za-zÀ-ÿ\s]/g, '').slice(0, 30);
}
function onlyNumbers(value, max) {
  return value.replace(/\D/g, '').slice(0, max);
}
function maskCPF(value) {
  value = value.replace(/\D/g, "").slice(0, 11);
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return value;
}
function isValidCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0, rest;
  for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i-1, i)) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(9, 10))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i-1, i)) * (12 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(10, 11))) return false;
  return true;
}

// Componente de Formulário de Funcionários
const FormularioFuncionarios = () => {
  const [form, setForm] = useState({
    matricula: "",
    cpf: "",
    nome: "",
    mae: "",
    pai: "",
    sexo: "",
    nascimento: "",
    estadoCivil: "",
    naturalidade: "",
    nacionalidade: "",
    escolaridade: "",
    raca: "",
    deficiencia: "",
    email: "",
    telefone: "",
    celular: "",
    pis: "",
    rg: "",
    orgaoEmissor: "",
    ufRg: "",
    dtEmissRg: "",
    ctps: "",
    serieCtps: "",
    ufCtps: "",
    dtEmissCtps: "",
    titulo: "",
    zona: "",
    secao: "",
    endereco: "",
    cep: "62380000",
    tipoLogradouro: "",
    logradouro: "",
    numero: "",
    bairro: "",
    complemento: ""
  });

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [buscando, setBuscando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Padronizações específicas
    if (name === "cpf") {
      setForm({ ...form, cpf: maskCPF(value) });
      setErro(""); // limpa erro ao digitar
    } else if (["nome", "mae", "pai"].includes(name)) {
      setForm({ ...form, [name]: onlyLetters(value) });
    } else if (name === "pis") {
      setForm({ ...form, pis: onlyNumbers(value, 11) });
    } else if (name === "titulo") {
      setForm({ ...form, titulo: onlyNumbers(value, 12) });
    } else if (name === "cep") {
      setForm({ ...form, cep: onlyNumbers(value, 8) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");
    setEnviando(true);

    // Validação de CPF antes de enviar
    if (!isValidCPF(form.cpf)) {
      setErro("CPF inválido.");
      setEnviando(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/api/funcionarios", form);
      setMensagem(`Funcionário cadastrado com sucesso! Matrícula: ${res.data.matricula}`);
      limparFormulario();
      buscarFuncionarios();
    } catch (err) {
      setErro("Erro ao cadastrar funcionário. Verifique os dados e tente novamente.");
    }
    setEnviando(false);
  };

  const handleSalvar = async () => {
    setMensagem("");
    setErro("");
    setSalvando(true);

    if (!isValidCPF(form.cpf)) {
      setErro("CPF inválido.");
      setSalvando(false);
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/funcionarios/${form.matricula}`, form);
      setMensagem("Funcionário atualizado com sucesso!");
      buscarFuncionarios();
    } catch (err) {
      setErro("Erro ao atualizar funcionário. Verifique os dados e tente novamente.");
    }
    setSalvando(false);
  };

  const limparFormulario = () => {
    setForm({
      matricula: "",
      cpf: "",
      nome: "",
      mae: "",
      pai: "",
      sexo: "",
      nascimento: "",
      estadoCivil: "",
      naturalidade: "",
      nacionalidade: "",
      escolaridade: "",
      raca: "",
      deficiencia: "",
      email: "",
      telefone: "",
      celular: "",
      pis: "",
      rg: "",
      orgaoEmissor: "",
      ufRg: "",
      dtEmissRg: "",
      ctps: "",
      serieCtps: "",
      ufCtps: "",
      dtEmissCtps: "",
      titulo: "",
      zona: "",
      secao: "",
      endereco: "",
      cep: "",
      tipoLogradouro: "",
      logradouro: "",
      numero: "",
      bairro: "",
      complemento: ""
    });
  };

  const buscarFuncionarios = async () => {
    setBuscando(true);
    try {
      const res = await axios.get("http://localhost:3001/api/funcionarios");
      setFuncionarios(res.data);
      res.data.length === 0
        ? setMensagem("Nenhum funcionário cadastrado.")
        : setMensagem("");
    } catch (error) {
      setErro("Erro ao buscar funcionários.");
    }
    setBuscando(false);
  };

  const handleSelectFuncionario = (selected) => {
    if (!selected) {
      limparFormulario();
    } else {
      const funcionario = funcionarios.find(f => f.cpf === selected.value);
      if (funcionario) setForm(funcionario);
    }
  };

  const formatOptionLabel = (option, { context }) => {
    if (context === "menu") {
      return (
        <div style={{
          display: "grid",
          gridTemplateColumns: "100px 1fr 140px",
          gap: "10px",
          alignItems: "center"
        }}>
          <span style={{ fontWeight: 500, color: "#00796b" }}>{option.matricula}</span>
          <span>{option.nome}</span>
          <span style={{ fontFamily: "monospace", color: "#555" }}>{option.cpf}</span>
        </div>
      );
    }
    return `${option.nome} (${option.cpf})`;
  };

  const selectOptions = funcionarios.map(f => ({
    value: f.cpf,
    label: `${f.nome} (${f.cpf})`,
    matricula: f.matricula,
    nome: f.nome,
    cpf: f.cpf
  }));

  const selectedOption = form.cpf
    ? selectOptions.find(opt => opt.value === form.cpf)
    : null;

  return (
    <div className="form-funcionarios">
      <h2>Cadastro de Funcionários</h2>

      {funcionarios.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <label>Selecione um Funcionário: </label>
          <div style={{
            display: "grid",
            gridTemplateColumns: "100px 1fr 140px",
            gap: "10px",
            fontWeight: "bold",
            fontSize: 13,
            color: "#888",
            margin: "4px 2px 0 2px"
          }}>
            <span>Matrícula</span>
            <span>Nome</span>
            <span>CPF</span>
          </div>
          <Select
            options={selectOptions}
            value={selectedOption}
            onChange={handleSelectFuncionario}
            isClearable
            placeholder="Buscar funcionário..."
            isSearchable
            noOptionsMessage={() => "Nenhum funcionário encontrado"}
            formatOptionLabel={formatOptionLabel}
            styles={{
              menu: provided => ({
                ...provided,
                marginTop: 0
              }),
              option: provided => ({
                ...provided,
                paddingTop: 8,
                paddingBottom: 8
              })
            }}
          />
        </div>
      )}

      {mensagem && <div className="msg-sucesso">{mensagem}</div>}
      {erro && <div className="msg-erro">{erro}</div>}

      <form onSubmit={handleSubmit} autoComplete="off">
        <div style={{ display: "flex", gap: "10px", marginBottom: 15 }}>
          <button type="button" onClick={buscarFuncionarios} disabled={buscando}>
            {buscando ? "Buscando..." : "Buscar Funcionários"}
          </button>
          <button type="submit" disabled={enviando}>
            {enviando ? "Enviando..." : "Cadastrar"}
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Folha
          </button>
          {form.matricula && (
            <button
              type="button"
              className="btn-save"
              onClick={handleSalvar}
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Salvar"}
            </button>
             


          )}
        </div>
        {/* Dados Pessoais */}
        <fieldset>
          <legend>Dados Pessoais</legend>
          <div className="form-row">
            <div>
              <label htmlFor="matricula">Matrícula</label>
              <input
                id="matricula"
                name="matricula"
                value={form.matricula}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="cpf">CPF *</label>
              <input
                id="cpf"
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                onBlur={e => {
                  if (form.cpf && !isValidCPF(form.cpf)) {
                    setErro("CPF inválido.");
                  } else {
                    setErro("");
                  }
                }}
                placeholder="000.000.000-00"
                required
                maxLength={14}
                inputMode="numeric"
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="nome">Nome *</label>
              <input
                id="nome"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                maxLength={30}
                required
                placeholder="Até 30 letras"
              />
            </div>
            <div>
              <label htmlFor="mae">Nome da Mãe *</label>
              <input
                id="mae"
                name="mae"
                value={form.mae}
                onChange={handleChange}
                maxLength={30}
                required
                placeholder="Até 30 letras"
              />
            </div>
            <div>
              <label htmlFor="pai">Nome do Pai *</label>
              <input
                id="pai"
                name="pai"
                value={form.pai}
                onChange={handleChange}
                maxLength={30}
                required
                placeholder="Até 30 letras"
              />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label htmlFor="sexo">Sexo *</label>
              <select id="sexo" name="sexo" value={form.sexo} onChange={handleChange} required>
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div>
              <label htmlFor="nascimento">Dta. Nasc. *</label>
              <input type="date" id="nascimento" name="nascimento" value={form.nascimento} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="estadoCivil">Estado Civil *</label>
              <select id="estadoCivil" name="estadoCivil" value={form.estadoCivil} onChange={handleChange} required>
                <option value="">Selecione</option>
                <option value="Solteiro(a)">Solteiro(a)</option>
                <option value="Casado(a)">Casado(a)</option>
                <option value="Divorciado(a)">Divorciado(a)</option>
                <option value="Viúvo(a)">Viúvo(a)</option>
                <option value="Separado(a)">Separado(a)</option>
              </select>
            </div>
            <div>
              <label htmlFor="naturalidade">Naturalidade *</label>
              <input id="naturalidade" name="naturalidade" value={form.naturalidade} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label htmlFor="nacionalidade">Nacionalidade *</label>
              <input id="nacionalidade" name="nacionalidade" value={form.nacionalidade} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="escolaridade">Escolaridade *</label>
              <input id="escolaridade" name="escolaridade" value={form.escolaridade} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="raca">Raça *</label>
              <input id="raca" name="raca" value={form.raca} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="deficiencia">Deficiência *</label>
              <input id="deficiencia" name="deficiencia" value={form.deficiencia} onChange={handleChange} required />
            </div>
          </div>
        </fieldset>

        {/* Documentos */}
        <fieldset>
          <legend>Documentos</legend>
          <div className="form-row">
            <div>
              <label htmlFor="pis">PIS/PASEP</label>
              <input
                id="pis"
                name="pis"
                value={form.pis}
                onChange={handleChange}
                maxLength={11}
                placeholder="Somente números"
                inputMode="numeric"
              />
            </div>
            <div>
              <label htmlFor="rg">RG *</label>
              <input id="rg" name="rg" value={form.rg} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="orgaoEmissor">Orgão Emissor</label>
              <input id="orgaoEmissor" name="orgaoEmissor" value={form.orgaoEmissor} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="ufRg">UF</label>
              <input id="ufRg" name="ufRg" value={form.ufRg} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="dtEmissRg">Dt. Emiss</label>
              <input type="date" id="dtEmissRg" name="dtEmissRg" value={form.dtEmissRg} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label htmlFor="ctps">CTPS</label>
              <input id="ctps" name="ctps" value={form.ctps} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="serieCtps">Série</label>
              <input id="serieCtps" name="serieCtps" value={form.serieCtps} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="ufCtps">UF</label>
              <input id="ufCtps" name="ufCtps" value={form.ufCtps} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="dtEmissCtps">Dt. Emiss</label>
              <input type="date" id="dtEmissCtps" name="dtEmissCtps" value={form.dtEmissCtps} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label htmlFor="titulo">Título de Eleitor *</label>
              <input
                id="titulo"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                maxLength={12}
                required
                placeholder="Somente números"
                inputMode="numeric"
              />
            </div>
            <div>
              <label htmlFor="zona">Zona</label>
              <input id="zona" name="zona" value={form.zona} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="secao">Seção</label>
              <input id="secao" name="secao" value={form.secao} onChange={handleChange} />
            </div>
          </div>
        </fieldset>

        {/* Endereço */}
        <fieldset>
          <legend>Endereço</legend>
          <div className="form-row">
            <div>
              <label htmlFor="endereco">Endereço *</label>
              <input
                id="endereco"
                name="endereco"
                value={form.endereco}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="cep">CEP *</label>
              <input
                id="cep"
                name="cep"
                value={form.cep}
                onChange={handleChange}
                maxLength={8}
                required
                placeholder="Somente números"
                inputMode="numeric"
              />
            </div>
            <div>
              <label htmlFor="tipoLogradouro">Tipo Logradouro *</label>
              <input
                id="tipoLogradouro"
                name="tipoLogradouro"
                value={form.tipoLogradouro}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="logradouro">Logradouro *</label>
              <input
                id="logradouro"
                name="logradouro"
                value={form.logradouro}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label htmlFor="numero">Número *</label>
              <input
                id="numero"
                name="numero"
                value={form.numero}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="bairro">Bairro *</label>
              <input
                id="bairro"
                name="bairro"
                value={form.bairro}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="complemento">Complemento</label>
              <input
                id="complemento"
                name="complemento"
                value={form.complemento}
                onChange={handleChange}
              />
            </div>
          </div>
        </fieldset>

        {/* Contato */}
        <fieldset>
          <legend>Contato</legend>
          <div className="form-row">
            <div>
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="telefone">Telefone</label>
              <input
                id="telefone"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="celular">Celular</label>
              <input
                id="celular"
                name="celular"
                value={form.celular}
                onChange={handleChange}
              />
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};






const menus = [
  {
    label: "Estrutura Organizacional",
    items: [
      "Entidades", "Órgãos", "Fontes", "Secretaria/Setores", "Vínculos", "Cargos", "Classes", "Rubricas"
    ]
  },
  {
    label: "Movimentações",
    items: [
      "Folha de Pagamento", "Folhas", "Inicializar Folha", "Funcionários", "Recálculo",
      "Movimentação Coletiva da Rubricas", "Movimentação de Funcionários", "Afastamento Coletivo", "Desligamento Coletivo"
    ]
  },
  { label: "Tabelas", items: ["Desconto INSS", "Desconto IRRF"] },
  { label: "Relatórios", items: ["Folha de Pagamento"] },
  { label: "Utilitários", items: ["Exportação de Dados"] }
];

const FormularioRubricas = () => {
  const [form, setForm] = useState({
    matricula: "",
    cpf: "",
  });

  return (

      <div style={{ display: "flex", gap: "10px", marginBottom: 15 }}>
        
        { <button
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            cadastrar
          </button>}

          { <button
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            consultar
          </button>
}
          {<button
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            excluir
          </button>
          
          
          }
    </div>

  );
};



const App = () => {
  const [componenteAtivo, setComponenteAtivo] = useState("Funcionários");

  const handleSelecaoMenu = (item) => {
    setComponenteAtivo(item);
  };

  return (
    <div className="app">
      <nav className="navbar">
        {menus.map((menu) => (
          <div key={menu.label} className="dropdown">
            <button className="dropdown-btn">
              {menu.label}
              <span className="arrow">▼</span>
            </button>
            <div className="dropdown-content">
              {menu.items.map((item) => (
                <div
                  key={item}
                  className="dropdown-item"
                  onClick={() => handleSelecaoMenu(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <main className="content-area">
        {componenteAtivo === "Funcionários" && <FormularioFuncionarios />}
        {componenteAtivo === "Rubricas" && <FormularioRubricas />}
      </main>
    </div>
  );
};
export default App;
