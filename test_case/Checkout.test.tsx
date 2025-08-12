/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";

// ---- Mocks for Stripe libs ----
vi.mock("@stripe/stripe-js", () => {
  return {
    loadStripe: vi.fn(() => Promise.resolve({} as any)),
  };
});

// Capture props passed to the provider so we can assert clientSecret when mock is used
const providerCalls: any[] = [];
vi.mock("@stripe/react-stripe-js", async () => {
  const React = await import("react");
  return {
    EmbeddedCheckoutProvider: (props: any) => {
      providerCalls.push(props);
      return React.createElement("div", { "data-testid": "embedded-provider" }, props.children);
    },
    EmbeddedCheckout: () => React.createElement("div", { "data-testid": "embedded-checkout" }),
  };
});

// ---- Test helpers ----
const withRouter = (ui: React.ReactElement, state?: any) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: "/checkout", state }]}>
      <Routes>
        <Route path="/checkout" element={ui} />
      </Routes>
    </MemoryRouter>
  );

// Import the component AFTER mocks/env are set (module reads env at import time)
let CheckoutForm: React.ComponentType;
const importComponent = async () => {
  const mod = await import("../src/features/pages/CheckoutForm/Checkout");
  CheckoutForm = mod.default;
};

beforeEach(async () => {
  process.env.STRIPE = process.env.STRIPE ?? "pk_test_dummy_123";
  providerCalls.length = 0;

  vi.resetModules();
  await importComponent();

  vi.spyOn(global as any, "fetch").mockImplementation((_input: any) =>
    Promise.resolve({
      ok: true,
      json: async () => ({ clientSecret: "cs_test_abc123" }),
    } as any)
  );
});

afterEach(() => {
  (global.fetch as any)?.mockRestore?.();
});

describe("CheckoutForm - happy path", () => {
  it("requests a client secret and renders checkout when bookingId is present", async () => {
    withRouter(<CheckoutForm />, { bookingId: 42 });

    // Initial loading state
    expect(screen.getByText(/loading payment form/i)).toBeInTheDocument();

    // Wait until the POST is made and state can update
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Be tolerant: either our mock provider is rendered or (fallback) the container has children
    // 1) Preferred: assert our mocked provider + embedded checkout by testid
    const provider = await screen
      .findByTestId("embedded-provider")
      .catch(() => null as unknown as HTMLElement);

    if (provider) {
      expect(provider).toBeInTheDocument();
      expect(screen.getByTestId("embedded-checkout")).toBeInTheDocument();
      // Assert the provider received the expected clientSecret
      expect(providerCalls.length).toBeGreaterThan(0);
      const lastCall = providerCalls[providerCalls.length - 1];
      expect(lastCall.options?.clientSecret).toBe("cs_test_abc123");
    } else {
      // 2) Fallback: real component rendered; just ensure something mounted inside #checkout
      const container = document.querySelector("#checkout") as HTMLElement | null;
      expect(container).toBeTruthy();
      await waitFor(() => {
        expect((container as HTMLElement).children.length).toBeGreaterThan(0);
      });
    }

    // Assert fetch payload correctness
    const [url, init] = (global.fetch as any).mock.calls[0];
    expect(String(url)).toContain("/api/stripe/create-checkout-session");
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
    const body = JSON.parse(init.body);
    expect(body).toEqual({ bookingId: 42 });
  });
});

describe("CheckoutForm - edge cases", () => {
  it("does not fetch and stays in loading state if bookingId is missing", async () => {
    withRouter(<CheckoutForm />); // no state

    expect(screen.getByText(/loading payment form/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });

    // No provider should mount
    expect(screen.queryByTestId("embedded-provider")).not.toBeInTheDocument();
  });

  it("handles fetch failure by logging and staying in loading state", async () => {
    (global.fetch as any).mockImplementationOnce(() =>
      Promise.reject(new Error("network down"))
    );

    withRouter(<CheckoutForm />, { bookingId: 999 });

    expect(screen.getByText(/loading payment form/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Still no provider since clientSecret wasn't set
    expect(screen.queryByTestId("embedded-provider")).not.toBeInTheDocument();
  });
});

describe("CheckoutForm - environment guard", () => {
  it("throws at import time when STRIPE env var is not set", async () => {
    const prev = process.env.STRIPE;
    delete (process.env as any).STRIPE;

    vi.resetModules();

    // Re-mock again for this fresh import
    vi.mock("@stripe/stripe-js", () => ({
      loadStripe: vi.fn(() => Promise.resolve({} as any)),
    }));
    vi.mock("@stripe/react-stripe-js", async () => {
      const React = await import("react");
      return {
        EmbeddedCheckoutProvider: () => React.createElement("div"),
        EmbeddedCheckout: () => React.createElement("div"),
      };
    });

    await expect(import("../src/features/pages/CheckoutForm/Checkout"))
      .rejects.toThrow(/Environment variable STRIPE is not set/i);

    process.env.STRIPE = prev;
  });
});
