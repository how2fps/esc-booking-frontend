/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfilePage from "../src/features/pages/profile/ProfilePage";
import { BrowserRouter } from "react-router-dom";

// ---- Mocks ----
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockLogout = jest.fn();
jest.mock("../src/components/context/AuthContext", () => ({
  useAuth: () => ({ logout: mockLogout }),
}));

// ---- Helpers ----
const renderWithRouter = () => {
  render(
    <BrowserRouter>
      <ProfilePage />
    </BrowserRouter>
  );
};

const sessionOk = {
  success: true,
  data: { name: "Alice Tan", email: "alice@example.com", phone_number: "91234567" },
};

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

describe("Profile Page – basic render", () => {
  it("renders profile after session loads", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(sessionOk), { status: 200 })
    );
    renderWithRouter();

    expect(await screen.findByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByText("Alice Tan")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
  });
});

describe("Profile Page – update flow (name)", () => {
  it("updates name successfully and exits edit mode", async () => {
    // 1) session
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(sessionOk), { status: 200 })
    );
    renderWithRouter();
    expect(await screen.findByText(/profile/i)).toBeInTheDocument();

    // enter edit
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "Alice Lim" } });

    // 2) PUT success
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true }), { status: 200 })
    );
    fireEvent.click(screen.getByRole("button", { name: /^save$/i }));

    expect(await screen.findByText(/profile updated successfully/i)).toBeInTheDocument();
    expect(screen.getByText("Alice Lim")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^save$/i })).not.toBeInTheDocument();
  });

  it("shows error and stays in edit mode if update fails", async () => {
    // 1) session
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(sessionOk), { status: 200 })
    );
    renderWithRouter();
    expect(await screen.findByText(/profile/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    // 2) PUT fail
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: false, message: "Failed to update profile." }), {
        status: 400,
      })
    );
    fireEvent.click(screen.getByRole("button", { name: /^save$/i }));

    expect(await screen.findByText(/failed to update profile/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^save$/i })).toBeInTheDocument();
  });
});

describe("Profile Page – update flow (phone number)", () => {
    it("updates phone number successfully and exits edit mode", async () => {
      // 1) mock session fetch
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(sessionOk), { status: 200 })
      );
      renderWithRouter();
      expect(await screen.findByText(/profile/i)).toBeInTheDocument();
  
      // enter edit mode
      fireEvent.click(screen.getByRole("button", { name: /edit/i }));
  
      // change phone number input to a valid number
      const phoneInput = screen.getByLabelText(/phone number/i) as HTMLInputElement;
      fireEvent.change(phoneInput, { target: { value: "+65 9123 4567" } });
  
      // 2) mock successful PUT
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 200 })
      );
  
      // click save
      fireEvent.click(screen.getByRole("button", { name: /^save$/i }));
  
      // wait for success message & updated phone to appear, and edit mode exit
      expect(await screen.findByText(/profile updated successfully/i)).toBeInTheDocument();
      expect(screen.getByText("+65 9123 4567")).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /^save$/i })).not.toBeInTheDocument();
    });
  
    it("shows validation error for invalid phone number and prevents save", async () => {
      // 1) mock session fetch
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify(sessionOk), { status: 200 })
      );
      renderWithRouter();
      expect(await screen.findByText(/profile/i)).toBeInTheDocument();
  
      // enter edit mode
      fireEvent.click(screen.getByRole("button", { name: /edit/i }));
  
      // change phone number to invalid input (e.g., contains letters)
      const phoneInput = screen.getByLabelText(/phone number/i) as HTMLInputElement;
      fireEvent.change(phoneInput, { target: { value: "123ABC" } });
  
      // try clicking save
      fireEvent.click(screen.getByRole("button", { name: /^save$/i }));
  
      // check validation error message shown
      expect(await screen.findByText(/phone number contains invalid characters/i)).toBeInTheDocument();
  
      // save button still present (edit mode not exited)
      expect(screen.getByRole("button", { name: /^save$/i })).toBeInTheDocument();
    });
  });
  

describe("Profile Page – delete flow", () => {
  it("validates empty and mismatched passwords", async () => {
    // 1) session
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(sessionOk), { status: 200 })
    );
    renderWithRouter();
    expect(await screen.findByText(/profile/i)).toBeInTheDocument();

    // open modal
    fireEvent.click(screen.getByRole("button", { name: /delete account/i }));
    expect(await screen.findByText(/confirm account deletion/i)).toBeInTheDocument();

    // empty -> error
    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));
    expect(await screen.findByText(/please enter both password fields/i)).toBeInTheDocument();

    // mismatch -> error
    const inputs = screen.getAllByPlaceholderText(/password/i);
    fireEvent.change(inputs[0], { target: { value: "Secret123!" } });
    fireEvent.change(inputs[1], { target: { value: "Secret999!" } });
    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("deletes successfully and navigates to /login", async () => {
    // 1) session
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(sessionOk), { status: 200 })
    );
    renderWithRouter();
    expect(await screen.findByText(/profile/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /delete account/i }));
    expect(await screen.findByText(/confirm account deletion/i)).toBeInTheDocument();

    const inputs = screen.getAllByPlaceholderText(/password/i);
    fireEvent.change(inputs[0], { target: { value: "Secret123!" } });
    fireEvent.change(inputs[1], { target: { value: "Secret123!" } });

    // 2) DELETE success
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true }), { status: 200 })
    );
    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("shows server error when delete fails", async () => {
    // 1) session
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(sessionOk), { status: 200 })
    );
    renderWithRouter();
    expect(await screen.findByText(/profile/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /delete account/i }));
    expect(await screen.findByText(/confirm account deletion/i)).toBeInTheDocument();

    const inputs = screen.getAllByPlaceholderText(/password/i);
    fireEvent.change(inputs[0], { target: { value: "Secret123!" } });
    fireEvent.change(inputs[1], { target: { value: "Secret123!" } });

    // 2) DELETE fail
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: false, message: "Failed to delete account." }), {
        status: 400,
      })
    );
    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));

    expect(await screen.findByText(/failed to delete account/i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalledWith("/login");
  });
});