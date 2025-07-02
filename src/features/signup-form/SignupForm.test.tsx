import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SignupForm } from "./SignupForm";

describe("SignupForm", () => {
       it("renders email, password, and confirm password fields", () => {
              render(<SignupForm />);
              expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
              expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
              expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
       });

       it("renders signup button", () => {
              render(<SignupForm />);
              expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
       });

       it("allows typing in the email, password, and confirm password fields", () => {
              render(<SignupForm />);
              const emailInput = screen.getByLabelText(/email/i);
              const passwordInput = screen.getByLabelText(/^password$/i);
              const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

              fireEvent.change(emailInput, { target: { value: "test@example.com" } });
              fireEvent.change(passwordInput, { target: { value: "secret" } });
              fireEvent.change(confirmPasswordInput, { target: { value: "secret" } });

              expect(emailInput).toHaveValue("test@example.com");
              expect(passwordInput).toHaveValue("secret");
              expect(confirmPasswordInput).toHaveValue("secret");
       });

       it("submits the form without crashing", () => {
              render(<SignupForm />);
              const form = screen.getByRole("button", { name: /sign up/i }).closest("form");
              expect(form).toBeInTheDocument();
              fireEvent.submit(form!);
       });
});
