import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Recommendations from "../src/components/recommendations/Recommendations";

jest.mock("../src/components/recommendations/Recommendations.module.css", () => ({}));
jest.mock("../src/api/ApiClient", () => ({
  getAsync: jest.fn(() => Promise.resolve([])),
}));

describe("Recommendations Component", () => {
  test("Renderiza el título principal", () => {
    render(<Recommendations />);
    expect(screen.getByText("Recomendaciones de Ahorro")).toBeInTheDocument();
  });

  test("Muestra 0 dispositivos monitoreados cuando no hay datos", () => {
    render(<Recommendations />);

    const card = screen.getByText("Dispositivos monitoreados").closest("div");
    expect(card).toHaveTextContent("0");
  });

  test("Muestra ahorro implementado en 0 inicialmente", () => {
    render(<Recommendations />);

    const ahorroCard = screen.getByText("Ahorro Implementado").closest("div");
    expect(ahorroCard).toHaveTextContent("$0");
  });

  test("Existe el botón Exportar PDF", () => {
    render(<Recommendations />);
    expect(screen.getByText("Exportar PDF")).toBeInTheDocument();
  });
});
