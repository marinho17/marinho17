import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{ padding: 30 }}>
      <h1>Sistema de Folha de Pagamento</h1>
      <nav>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          <li><Link to="/funcionarios">Funcionário</Link></li>
        </ul>
      </nav>
    </div>
  );
}