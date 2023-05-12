import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "./App";
import "@testing-library/jest-dom";
import { createStore } from "./store";

test("renders learn react link", () => {
  const store = createStore();

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  waitFor(() =>
    expect(screen).toHaveTextContent(/Weather report for Paramotor Pilots/i)
  );
});
