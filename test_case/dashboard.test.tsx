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
        "http://18.138.130.229:3000/api/search/Tok"
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
      "http://18.138.130.229:3000/api/search/Tok"
    );
  });

  // Your component might handle this by showing no options
  expect(await screen.findByText(/No options/i)).toBeInTheDocument();
});

  it("increments and decrements guest values", async () => {
    renderWithRouter();

    const guestInput = screen.getByPlaceholderText("Add Guest");
    expect(guestInput).toBeInTheDocument();

    // Open guest menu
    fireEvent.click(guestInput);

    // ==== Adults section ====
    const adultsLabel = screen.getByText("Adults");
    const adultsSection = adultsLabel.closest(".item");
    expect(adultsSection).not.toBeNull(); // fail test if missing
    if (!adultsSection) return; // TS narrowing

    const plusButton = adultsSection.querySelector(".plus");
    expect(plusButton).not.toBeNull();
    if (!plusButton) return;

    fireEvent.click(plusButton);
    fireEvent.click(plusButton);

    await waitFor(() => {
      expect((guestInput as HTMLInputElement).value).toContain("2 adults");
    });

    // Adults minus button
    const minusButton = adultsSection.querySelector(".minus");
    expect(minusButton).not.toBeNull();
    if (!minusButton) return;

    fireEvent.click(minusButton);

    await waitFor(() => {
      expect((guestInput as HTMLInputElement).value).toBe("1 adult");
    });

    // ==== Children section ====
    const childLabel = screen.getByText("Children");
    const childSection = childLabel.closest(".item");
    expect(childSection).not.toBeNull();
    if (!childSection) return;

    const cPlusButton = childSection.querySelector(".plus");
    expect(cPlusButton).not.toBeNull();
    if (!cPlusButton) return;

    fireEvent.click(cPlusButton);

    await waitFor(() => {
      expect((guestInput as HTMLInputElement).value).toContain("1 adult, 1 children");
    });
  });
});


   it("increments room count",async () => {
    renderWithRouter();

    const roomselection = screen.getByText('Rooms').closest('.item');
    if (!roomselection) {
      throw new Error("Room selection element not found");
    }
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

describe("DestinationSearch - DateRangePicker", () => {
  it("renders the DateRangePicker and toggles open state", () => {
    renderWithRouter();

    // Get the date picker container by test id (your DateRangePicker div)
    const picker = screen.getByTestId("picker");

    // At initial render, depending on your openDate value the class might not include "open"
    expect(picker.className).not.toContain("open");

    // Find the element that toggles openDate, e.g., the date input wrapper with onClick
    // Assuming your date input wrapper can be found by text or role,
    // or use a test id if you have one on the toggle container (for example "date-toggle")
    const dateToggle = screen.getByPlaceholderText(/Add Dates/i);

    // Simulate click to toggle openDate true
    fireEvent.click(dateToggle);

    // Now expect DateRangePicker to have the "open" class applied
    
  });

  it("allows selecting a new date range and updates displayed value", async () => {
    renderWithRouter();

    // Click to open the date picker
    const dateToggle = screen.getByPlaceholderText(/Add Dates/i);
    fireEvent.click(dateToggle);

    // DateRangePicker renders days as buttons with day numbers, find some day buttons
    // These buttons represent selectable days in the date range component
    const dayButtons = screen.getAllByRole("button", { name: /^\d+$/ });
    expect(dayButtons.length).toBeGreaterThan(0);

    // Simulate same day click twice to set a new range (for simplicity)
    fireEvent.click(dayButtons[0]);
    fireEvent.click(dayButtons[dayButtons.length - 1]);

    // The input value should change to reflect the new range (format: MM/DD/YYYY - MM/DD/YYYY)
    const dateInput = screen.getByPlaceholderText(/Add Dates/i);
    await waitFor(() => {
      expect((dateInput as HTMLInputElement).value).toMatch(
        /^\d{1,2}\/\d{1,2}\/\d{4} - \d{1,2}\/\d{1,2}\/\d{4}$/
      );
    });
  });
});

});