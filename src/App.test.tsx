import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "./App";
import "@testing-library/jest-dom";
import { createStore } from "./store";

test("renders learn react link", async () => {
  const store = createStore();

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(
    await screen.findByText("Weather report for Paramotor Pilots")
  ).toBeVisible();
});
