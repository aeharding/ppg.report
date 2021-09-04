import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "./App";
import { createStore } from "./store";

test("renders learn react link", () => {
  const store = createStore();

  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const linkElement = screen.getByText(/Weather report for Paramotor Pilots/i);
  expect(linkElement).toBeInTheDocument();
});
