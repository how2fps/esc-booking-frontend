/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import BookingPage from "../src/features/pages/booking/BookingPage";

const sessionUser = {
  id: 1,
  name: "Ian Varella",
  email: "ian@example.com",
  phone_number: "98765432",
};

const locationState = {
  hotelName: "Test Hotel",
  roomType: "Deluxe",
  startDate: "2025-08-20",
  endDate: "2025-08-22", // 2 nights
  numberOfRooms: 1,
  adults: 2,
  children: 0,
  price: 123,
  hotelImage: "",
};

const renderWithRouter = () =>
  render(
    <MemoryRouter initialEntries={[{ pathname: "/booking", state: locationState }]}>
      <Routes>
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/checkout" element={<div>Checkout Page</div>} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  vi.spyOn(global as any, "fetch").mockImplementation((input: any) => {
    const url = typeof input === "string" ? input : input?.url ?? "";
    if (url.includes("/api/users/session")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ data: sessionUser }),
      }) as any;
    }
    if (url.includes("/api/bookings")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ bookingId: 999 }),
      }) as any;
    }
    return Promise.reject(new Error(`Unexpected fetch to ${url}`));
  });
});

afterEach(() => {
  (global.fetch as any).mockRestore?.();
});

describe("BookingPage - Primitive Tests", () => {
  it("can find at least 4 editable text inputs (user info)", async () => {
    renderWithRouter();
    await screen.findByText(/your details/i);
    const allInputs = screen.getAllByRole("textbox");
    const editableInputs = allInputs.filter((el) => !(el as HTMLInputElement).readOnly);
    expect(editableInputs.length).toBeGreaterThanOrEqual(4);
  });

  it("can type into all user input fields", async () => {
    renderWithRouter();
    await screen.findByText(/your details/i);

    const inputs = screen
      .getAllByRole("textbox")
      .filter((el) => el.tagName === "INPUT" && !(el as HTMLInputElement).readOnly);

    fireEvent.change(inputs[0], { target: { value: "Joe" } });
    fireEvent.change(inputs[1], { target: { value: "Mama" } });
    fireEvent.change(inputs[2], { target: { value: "98765432" } });
    fireEvent.change(inputs[3], { target: { value: "joe@example.com" } });

    expect(inputs[0]).toHaveValue("Joe");
    expect(inputs[1]).toHaveValue("Mama");
    expect(inputs[2]).toHaveValue("98765432");
    expect(inputs[3]).toHaveValue("joe@example.com");
  });

  it("can type into Special Requests textarea", async () => {
    renderWithRouter();
    await screen.findByText(/your details/i);

    const textarea = screen
      .getAllByRole("textbox")
      .find((el) => el.tagName === "TEXTAREA") as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: "pls gimme a sea view" } });
    expect(textarea).toHaveValue("pls gimme a sea view");
  });

  it("submits form without crashing", async () => {
    renderWithRouter();
    await screen.findByText(/your details/i);

    const inputs = screen
      .getAllByRole("textbox")
      .filter((el) => el.tagName === "INPUT" && !(el as HTMLInputElement).readOnly);

    fireEvent.change(inputs[0], { target: { value: "Ian" } });
    fireEvent.change(inputs[1], { target: { value: "Varella" } });
    fireEvent.change(inputs[2], { target: { value: "98765432" } });
    fireEvent.change(inputs[3], { target: { value: "ian@example.com" } });

    const button = screen.getByRole("button", { name: /checkout/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2); // session + booking
      const call = (global.fetch as any).mock.calls[1];
      expect(call[0]).toContain("/api/bookings");
      const body = JSON.parse(call[1].body);
      expect(body.user_id).toBe(sessionUser.id);
      expect(body.numberOfNights).toBe(2);
      expect(call[1].credentials).toBe("include");
    });
  });
});

describe("BookingPage - unhappy paths", () => {
  it("redirects to /login when session fails", async () => {
    (global.fetch as any).mockImplementationOnce(() =>
      Promise.resolve({ ok: false })
    );

    render(
      <MemoryRouter initialEntries={[{ pathname: "/booking" }]}>
        <Routes>
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText(/login page/i);
  });

  it("shows validation errors and does NOT POST when inputs are invalid", async () => {
    renderWithRouter();
    await screen.findByText(/your details/i);

    // Disable native HTML5 validation so the component's onSubmit runs
    const form = document.querySelector("form") as HTMLFormElement;
    form.setAttribute("novalidate", "");

    const [first, last, phone, email] = screen
      .getAllByRole("textbox")
      .filter((el) => el.tagName === "INPUT" && !(el as HTMLInputElement).readOnly);

    // Intentionally invalid
    fireEvent.change(first, { target: { value: "" } });            // required
    fireEvent.change(last,  { target: { value: "V4rella" } });     // invalid chars
    fireEvent.change(phone, { target: { value: "abc" } });         // invalid phone
    fireEvent.change(email, { target: { value: "" } });            // required

    fireEvent.click(screen.getByRole("button", { name: /checkout/i }));

    // Assert the component's specific error messages render
    expect(await screen.findByText(/First name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Last name must contain only letters/i)).toBeInTheDocument();
    expect(await screen.findByText(/Phone number must contain only/i)).toBeInTheDocument();
    expect(await screen.findByText(/Email address is required/i)).toBeInTheDocument();

    // No booking POST should have happened
    const bookingCalls = (global.fetch as any).mock.calls.filter((c: any[]) =>
      String(c[0]).includes("/api/bookings")
    );
    expect(bookingCalls.length).toBe(0);
  });
});

describe("BookingPage - navigation & payload", () => {
  it("navigates to /checkout and passes bookingId in state", async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/booking", state: locationState }]}>
        <Routes>
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/checkout" element={<CheckoutProbe />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByText(/your details/i);

    const inputs = screen
      .getAllByRole("textbox")
      .filter((el) => el.tagName === "INPUT" && !(el as HTMLInputElement).readOnly);

    fireEvent.change(inputs[0], { target: { value: "Ian" } });
    fireEvent.change(inputs[1], { target: { value: "Varella" } });
    fireEvent.change(inputs[2], { target: { value: "98765432" } });
    fireEvent.change(inputs[3], { target: { value: "ian@example.com" } });

    fireEvent.click(screen.getByRole("button", { name: /checkout/i }));

    await screen.findByText(/at checkout/i);
    await screen.findByText(/booking id:\s*999/i);
  });
});

// Helper shown at /checkout to read location.state
function CheckoutProbe() {
  const { state } = useLocation() as { state: { bookingId?: number } };
  return (
    <div>
      <h1>At checkout</h1>
      <div>Booking ID: {state?.bookingId}</div>
    </div>
  );
}
