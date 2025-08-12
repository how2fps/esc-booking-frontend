// DestinationSearch.test.jsx
import { render, screen, within,fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "../src/features/pages/destination-search/DestinationSearch";

// Mock fetch globally
beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
});




const renderWithRouter = () =>
  render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>    
  );
    renderWithRouter();
describe("Dashboard (DestinationSearch) Component", () => {
  it("should render without crashing", () => {

    // Basic sanity check - can find by a known text or role
    expect(screen.getByTestId("Search")).toBeInTheDocument();
  });
 });

describe("DestinationSearch Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Mock fetch for location search
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { uid: "1", term: "Tokyo", lat: 0, lng: 0, type: "city" },
        { uid: "2", term: "Osaka", lat: 0, lng: 0, type: "city" }
      ]
    });
  });

  it("renders main elements", () => {
    renderWithRouter();
    expect(screen.getByTestId("slider")).toBeInTheDocument();
    expect(screen.getByTestId("async-select")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Add Dates/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Add Guest/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Search/i })).toBeInTheDocument();
  });

   it("loads location options when typing search (≥ 3 chars)", async () => {
    renderWithRouter();
      const asyncSelect = screen.getByTestId("async-select");
    const input = within(asyncSelect).getByRole("combobox");

    // Type less than 3 chars -> no fetch
    fireEvent.change(input, { target: { value: "To" } });
    expect(global.fetch).not.toHaveBeenCalled();

    // Type 3 chars or more
    fireEvent.change(input, { target: { value: "Tok" } });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:3000/api/search/Tok"
      );
    });
  });

  it("handles non-ok HTTP response gracefully", async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    json: async () => ({})
  }) as unknown as typeof fetch;

  renderWithRouter();

  const asyncSelect = screen.getByTestId("async-select");
  const input = within(asyncSelect).getByRole("combobox");

  fireEvent.change(input, { target: { value: "Tok" } });

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/search/Tok"
    );
  });

  // Your component might handle this by showing no options
  expect(await screen.findByText(/No options/i)).toBeInTheDocument();
});

  it("increments and decrements guest values",async () => {
    renderWithRouter();

    const guestInput = screen.getByPlaceholderText('Add Guest');
    expect(guestInput).toBeInTheDocument();

    // Open guest menu
    fireEvent.click(guestInput);

    // Adults plus button
     const adultsSection = screen.getByText('Adults').closest('.item');
    const plusButton = adultsSection.querySelector('.plus');
    fireEvent.click(plusButton);
    fireEvent.click(plusButton);
    await waitFor(() => {
      expect(guestInput.value).toContain('2 adults');
    });
    
    // Find and click "Adults" minus button
    const minusButton = adultsSection.querySelector('.minus');
    fireEvent.click(minusButton);

    await waitFor(() => {
      expect(guestInput.value).toBe('1 adult');
    });
    const childSection = screen.getByText('Children').closest('.item');
    const CplusButton = childSection.querySelector('.plus');
    fireEvent.click(CplusButton);
    await waitFor(() => {
      expect(guestInput.value).toContain('1 adult, 1 children');
    });
  });

   it("increments room count",async () => {
    renderWithRouter();

    const roomselection = screen.getByText('Rooms').closest('.item');
    const CplusButton = roomselection.querySelector('.plus');
    if (CplusButton) fireEvent.click(CplusButton);
    expect(screen.getByTestId("room-count")).toHaveTextContent("1");

    const minusB = roomselection.querySelector('.minus');
    if (minusB) fireEvent.click(minusB);
    expect(screen.getByTestId("room-count")).toHaveTextContent("0");
  });

it("updates search link href based on selections", async () => {
    renderWithRouter();
    const asyncSelect = screen.getByTestId("async-select");
    const input = within(asyncSelect).getByRole("combobox");

    //Empty search should have location None
    const searchLink = screen.getByRole("link", { name: /Search/i });
    expect(searchLink.getAttribute("href")).toContain("location=None");
    // Type ≥ 3 chars to load location options
    
    fireEvent.change(input, { target: { value: "Tok" } });
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // Instead of selecting async option from DOM (complex mock),
    // We'll directly simulate selecting location by clicking search
    

    fireEvent.click(screen.getByText("Tokyo"));
    expect(searchLink.getAttribute("href")).toContain("location=1");

    
  });

describe("DestinationSearch - Date Selector", () => {
  it("opens date picker and changes the date range", () => {
    renderWithRouter();

    // Find the date input by placeholder
    const dateInput = screen.getByPlaceholderText(/Add Dates/i);

    // Capture initial value
    const initialValue = dateInput.getAttribute("value");
    expect(initialValue).toMatch(/\d{1,2}\/\d{1,2}\/\d{4} - \d{1,2}\/\d{1,2}\/\d{4}/);

    // Click on input wrapper to open date picker
    fireEvent.click(dateInput);

    // Now the picker should be visible - checking 'open' class
    const picker = screen.getByTestId("picker", { hidden: true }); // react-date-range uses role=application
    expect(picker.parentElement?.className).toContain("open");

    // Simulate date change by calling onChange via fireEvent
    // The simplest way is to directly trigger change through the picker input fields
    const dayButtons = screen.getAllByRole("button", { name: /\d+/ }); // day numbers
    if (dayButtons.length >= 2) {
      fireEvent.click(dayButtons[0]); // new start date
      fireEvent.click(dayButtons[dayButtons.length - 1]); // new end date
    }

    // After selecting dates, the displayed value should change
    const updatedValue = dateInput.getAttribute("value");
    expect(updatedValue).not.toBe(initialValue);
  });
});

});