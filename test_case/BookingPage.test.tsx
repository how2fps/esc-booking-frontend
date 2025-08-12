import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import BookingPage from "../src/features/pages/booking/BookingPage";

const renderWithRouter = () =>
  render(
    <BrowserRouter>
      <BookingPage />
    </BrowserRouter>
  );

describe("BookingPage - Primitive Tests", () => {
  it("can find at least 4 editable text inputs (user info)", () => {
    renderWithRouter();
    const allInputs = screen.getAllByRole("textbox");
    const editableInputs = allInputs.filter(
      (el) => !el.hasAttribute("readonly")
    );
    expect(editableInputs.length).toBeGreaterThanOrEqual(4);
  });

  it("can type into all user input fields", () => {
    renderWithRouter();
    const inputs = screen.getAllByRole("textbox").filter((element) => !(element as HTMLInputElement).readOnly
);

    fireEvent.change(inputs[0], { target: { value: "Joe" } });   // First name
    fireEvent.change(inputs[1], { target: { value: "Mama" } }); // Last name
    fireEvent.change(inputs[2], { target: { value: "98765432" } }); // Phone
    fireEvent.change(inputs[3], { target: { value: "Joe@example.com" } }); // Email

    expect(inputs[0]).toHaveValue("Joe");
    expect(inputs[1]).toHaveValue("Mama");
    expect(inputs[2]).toHaveValue("98765432");
    expect(inputs[3]).toHaveValue("Joe@example.com");
  });

  it("can type into Special Requests textarea", () => {
    renderWithRouter();
    const textareas = screen.getAllByRole("textbox").filter(el => el.tagName === "TEXTAREA");
    fireEvent.change(textareas[0], { target: { value: "pls gimme a sea view" } });
    expect(textareas[0]).toHaveValue("pls gimme a sea view");
  });

  it("submits form without crashing", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as any;

    renderWithRouter();

    const inputs = screen.getAllByRole("textbox").filter(
  (elem) => elem.tagName === "INPUT" && !(elem as HTMLInputElement).readOnly
);
    fireEvent.change(inputs[0], { target: { value: "Ian" } });
    fireEvent.change(inputs[1], { target: { value: "Varella" } });
    fireEvent.change(inputs[2], { target: { value: "98765432" } });
    fireEvent.change(inputs[3], { target: { value: "ian@example.com" } });

    const button = screen.getByRole("button", { name: /checkout/i });
    fireEvent.click(button);

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
