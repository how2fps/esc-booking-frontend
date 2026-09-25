import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Login from '../src/features/pages/login/LoginForm';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../src/features/components/context/AuthContext";

// Helper wrapper for router + auth context
const renderWithRouter = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe("Login Page", () => {
  it("renders login header and form fields", () => {
    renderWithRouter();

    // Header (also matched by the submit button, so assert at least one instance renders)
    expect(screen.getAllByText(/login/i).length).toBeGreaterThan(0);

    // Email field
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();

    // Password field
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Remember Me checkbox
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();

    // Login button
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("allows typing into email and password fields", () => {
    renderWithRouter();

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("submits the form without crashing", () => {
    renderWithRouter();

    const form = screen.getByRole("button", { name: /login/i }).closest("form");
    expect(form).toBeInTheDocument();

    fireEvent.submit(form!); // No-op test for crash check
  });

  it("renders Register and Forget Password links", () => {
    renderWithRouter();

    expect(screen.getByText(/not registered yet/i)).toBeInTheDocument();
    expect(screen.getByText(/^register$/i)).toHaveAttribute("href", "/signup");

    expect(screen.getByText(/forgot your password/i)).toBeInTheDocument();
  });
});