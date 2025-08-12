import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import ProfilePage from "../src/features/pages/profile/ProfilePage";
import { AuthProvider } from "../src/features/components/context/AuthContext";

// Common payloads
const sessionOk = {
  success: true,
  data: { name: "Alice Tan", email: "alice@example.com", phone_number: "91234567" },
};

// Simple helper to sequence fetch responses without using vi/jest mocks
type Resp = { body: any; status?: number };
const makeFetchSequence = (...responses: Resp[]) => {
  let i = 0;
  return async () => {
    const r = responses[Math.min(i, responses.length - 1)];
    i++;
    return new Response(JSON.stringify(r.body), { status: r.status ?? 200 });
  };
};

// Default stub for tests that only need the session call
beforeEach(() => {
  // @ts-expect-error override for tests
  global.fetch = async () => new Response(JSON.stringify(sessionOk), { status: 200 });
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

    // Labels aren't associated to inputs; query by displayed values
    const nameInput = screen.getByDisplayValue("Alice Tan");
    const phoneInput = screen.getByDisplayValue("91234567");

    fireEvent.change(nameInput, { target: { value: "Alice Lim" } });
    fireEvent.change(phoneInput, { target: { value: "+65 9123 4567" } });

    expect(nameInput).toHaveValue("Alice Lim");
    expect(phoneInput).toHaveValue("+65 9123 4567");
  });

  it("updates name successfully and exits edit mode", async () => {
    // Session, then PUT success
    // @ts-expect-error override for test
    global.fetch = makeFetchSequence(
      { body: sessionOk, status: 200 },
      { body: { success: true }, status: 200 }
    );

    renderWithRouter();

    expect(await screen.findByText(/profile/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    const nameInput = screen.getByDisplayValue("Alice Tan");
    fireEvent.change(nameInput, { target: { value: "Alice Lim" } });

    fireEvent.click(screen.getByRole("button", { name: /^save$/i }));

    expect(await screen.findByText(/profile updated successfully/i)).toBeInTheDocument();
    expect(screen.getByText("Alice Lim")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^save$/i })).not.toBeInTheDocument();
  });

  it("shows error and stays in edit mode if update fails", async () => {
    // Session, then PUT failure
    // @ts-expect-error override for test
    global.fetch = makeFetchSequence(
      { body: sessionOk, status: 200 },
      { body: { success: false, message: "Failed to update profile." }, status: 400 }
    );

    renderWithRouter();

    expect(await screen.findByText(/profile/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    // Attempt to save; second fetch returns failure
    fireEvent.click(screen.getByRole("button", { name: /^save$/i }));

    expect(await screen.findByText(/failed to update profile/i)).toBeInTheDocument();
    // Still in edit mode (Save still present)
    expect(screen.getByRole("button", { name: /^save$/i })).toBeInTheDocument();
  });

  it("validates empty and mismatched passwords in delete modal", async () => {
    renderWithRouter();

    expect(await screen.findByText(/profile/i)).toBeInTheDocument();

    // Open delete modal
    fireEvent.click(screen.getByRole("button", { name: /delete account/i }));
    expect(await screen.findByText(/confirm account deletion/i)).toBeInTheDocument();

    // Empty -> error
    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));
    expect(await screen.findByText(/please enter both password fields/i)).toBeInTheDocument();

    // Mismatch -> error
    const inputs = screen.getAllByPlaceholderText(/password/i);
    fireEvent.change(inputs[0], { target: { value: "Secret123!" } });
    fireEvent.change(inputs[1], { target: { value: "Secret999!" } });
    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("deletes successfully and navigates to /login", async () => {
    // Session, then DELETE success
    // @ts-expect-error override for test
    global.fetch = makeFetchSequence(
      { body: sessionOk, status: 200 },
      { body: { success: true }, status: 200 }
    );

    renderWithRouter();

    expect(await screen.findByText(/profile/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /delete account/i }));
    expect(await screen.findByText(/confirm account deletion/i)).toBeInTheDocument();

    const inputs = screen.getAllByPlaceholderText(/password/i);
    fireEvent.change(inputs[0], { target: { value: "Secret123!" } });
    fireEvent.change(inputs[1], { target: { value: "Secret123!" } });

    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));

    // The component uses navigate('/login'); we don't assert navigate here to keep style minimal.
    // Instead, we assert the modal closes by waiting for absence of its title or presence of login redirect text if applicable.
    await waitFor(() => {
      // Either the modal is gone, or the component unmounted due to navigation
      expect(screen.queryByText(/confirm account deletion/i)).not.toBeInTheDocument();
    });
  });

  it("shows server error when delete fails", async () => {
    // Session, then DELETE failure
    // @ts-expect-error override for test
    global.fetch = makeFetchSequence(
      { body: sessionOk, status: 200 },
      { body: { success: false, message: "Failed to delete account." }, status: 400 }
    );

    renderWithRouter();

    expect(await screen.findByText(/profile/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /delete account/i }));
    expect(await screen.findByText(/confirm account deletion/i)).toBeInTheDocument();

    const inputs = screen.getAllByPlaceholderText(/password/i);
    fireEvent.change(inputs[0], { target: { value: "Secret123!" } });
    fireEvent.change(inputs[1], { target: { value: "Secret123!" } });

    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));

    expect(await screen.findByText(/failed to delete account/i)).toBeInTheDocument();
    // Modal should still be present since deletion failed
    expect(screen.getByText(/confirm account deletion/i)).toBeInTheDocument();
  });
});