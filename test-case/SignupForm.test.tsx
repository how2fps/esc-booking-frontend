import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import SignupForm from "../src/features/pages/sign-up/SignUpForm";

describe("SignupForm", () => {
       const renderWithRouter = () =>
              render(
                     <BrowserRouter>
                            <SignupForm />
                     </BrowserRouter>
              );

       it("renders name, email, password, and confirm password fields", () => {
              renderWithRouter();
              expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
              expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
              expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
              expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
       });

       it("renders the register button", () => {
              renderWithRouter();
              expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
       });

       it("allows user input in all fields", () => {
              renderWithRouter();
              fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Nicky" } });
              fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "nicky@example.com" } });
              fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "Password1" } });
              fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "Password1" } });

              expect(screen.getByLabelText(/name/i)).toHaveValue("Nicky");
              expect(screen.getByLabelText(/email/i)).toHaveValue("nicky@example.com");
              expect(screen.getByLabelText(/^password$/i)).toHaveValue("Password1");
              expect(screen.getByLabelText(/confirm password/i)).toHaveValue("Password1");
       });

       it("disables the register button if form is invalid", () => {
              renderWithRouter();
              const button = screen.getByRole("button", { name: /register/i });
              expect(button).toBeDisabled();
       });

       it("enables the register button if all fields are valid", () => {
              renderWithRouter();
              fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Nicky" } });
              fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "nicky@example.com" } });
              fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "Password1" } });
              fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "Password1" } });

              expect(screen.getByRole("button", { name: /register/i })).not.toBeDisabled();
       });

       it("submits the form without crashing", () => {
              renderWithRouter();
              const form = screen.getByRole("button", { name: /register/i }).closest("form");
              expect(form).toBeInTheDocument();
              fireEvent.submit(form!);
       });
});
