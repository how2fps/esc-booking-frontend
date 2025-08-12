import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import ProfilePage from "../src/features/pages/profile/ProfilePage";
import { AuthProvider } from "../src/features/components/context/AuthContext";

// Stub fetch so the session call succeeds
beforeEach(() => {
  global.fetch = async () =>
    new Response(
      JSON.stringify({
        success: true,
        data: { name: "Alice Tan", email: "alice@example.com", phone_number: "91234567" },
      }),
      { status: 200 }
    );
});

// Helper wrapper for router + auth context
const renderWithRouter = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <ProfilePage />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe("Profile Page", () => {
  it("renders profile header and user fields after session loads", async () => {
    renderWithRouter();

    expect(await screen.findByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByText("Alice Tan")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("91234567")).toBeInTheDocument();
  });

  it("allows typing into name and phone number fields (in edit mode)", async () => {
    renderWithRouter();

    expect(await screen.findByText(/profile/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    // Your labels aren't associated to inputs; query by current values instead
    const nameInput = screen.getByDisplayValue("Alice Tan");
    const phoneInput = screen.getByDisplayValue("91234567");

    fireEvent.change(nameInput, { target: { value: "Alice Lim" } });
    fireEvent.change(phoneInput, { target: { value: "+65 9123 4567" } });

    expect(nameInput).toHaveValue("Alice Lim");
    expect(phoneInput).toHaveValue("+65 9123 4567");
  });

  it("saves changes without crashing (shows success message)", async () => {
    renderWithRouter();

    expect(await screen.findByText(/profile/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    // Save (fetch is stubbed to return success)
    fireEvent.click(screen.getByRole("button", { name: /^save$/i }));

    expect(await screen.findByText(/profile updated successfully/i)).toBeInTheDocument();
  });

  it("renders Logout and Delete Account buttons", async () => {
    renderWithRouter();

    expect(await screen.findByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete account/i })).toBeInTheDocument();
  });
});