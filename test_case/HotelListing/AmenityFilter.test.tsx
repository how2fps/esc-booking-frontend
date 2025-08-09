import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { AmenityFilter } from "../../src/features/pages/hotel-listings/AmenityFilter";

describe("AmenityFilter", () => {
       let mockSetFilters: ReturnType<typeof vi.fn>;

       beforeEach(() => {
              mockSetFilters = vi.fn();
              vi.useFakeTimers();
       });

       afterEach(() => {
              vi.useRealTimers();
       });

       it("renders amenity checkboxes with correct labels", () => {
              render(<AmenityFilter setFilters={mockSetFilters} />);
              const amenities = ["Dry Cleaning", "Outdoor Pool", "Continental Breakfast", "Parking Garage", "Fitness Facility", "In-House Dining", "In-House Bar"];
              amenities.forEach((label) => {
                     expect(screen.getByLabelText(label)).toBeInTheDocument();
              });
       });

       it("calls setFilters with selected amenity after checking amenity box", async () => {
              render(<AmenityFilter setFilters={mockSetFilters} />);
              const checkbox = screen.getByLabelText("Dry Cleaning");
              fireEvent.click(checkbox);
              vi.advanceTimersByTime(500);
              expect(mockSetFilters).toHaveBeenCalledTimes(1);
              const updater = mockSetFilters.mock.calls[0][0];
              const updatedFilter = updater({ amenities: new Set() });
              expect(updatedFilter.amenities.has("dryCleaning")).toBe(true);
       });

       it("check for debounce to work", () => {
              render(<AmenityFilter setFilters={mockSetFilters} />);
              const dryCleaning = screen.getByLabelText("Dry Cleaning");
              const fitnessFacility = screen.getByLabelText("Fitness Facility");
              fireEvent.click(dryCleaning);
              vi.advanceTimersByTime(300);
              fireEvent.click(fitnessFacility);
              vi.advanceTimersByTime(500);
              expect(mockSetFilters).toHaveBeenCalledTimes(1);
              const updater = mockSetFilters.mock.calls[0][0];
              const firstResult = updater({ amenities: new Set() });
              expect([...firstResult.amenities]).toEqual(["dryCleaning", "fitnessFacility"]);
       });

       it("check for debounce to work multiple times", () => {
              render(<AmenityFilter setFilters={mockSetFilters} />);
              const dryCleaning = screen.getByLabelText("Dry Cleaning");
              const fitnessFacility = screen.getByLabelText("Fitness Facility");
              fireEvent.click(dryCleaning);
              vi.advanceTimersByTime(300);
              fireEvent.click(fitnessFacility);
              vi.advanceTimersByTime(500);
              fireEvent.click(fitnessFacility);
              vi.advanceTimersByTime(500);
              fireEvent.click(fitnessFacility);
              vi.advanceTimersByTime(300);
              fireEvent.click(fitnessFacility);
              vi.advanceTimersByTime(500);
              expect(mockSetFilters).toHaveBeenCalledTimes(3);
              const updater = mockSetFilters.mock.calls[2][0];
              const firstResult = updater({ amenities: new Set() });
              expect([...firstResult.amenities]).toEqual(["dryCleaning"]);
       });

       it("toggles amenity off when checkbox is clicked twice", async () => {
              render(<AmenityFilter setFilters={mockSetFilters} />);
              const checkbox = screen.getByLabelText("Outdoor Pool");
              fireEvent.click(checkbox);
              fireEvent.click(checkbox);
              vi.advanceTimersByTime(500);
              expect(mockSetFilters).toHaveBeenCalledTimes(1);
              const updater = mockSetFilters.mock.calls[0][0];
              const updatedFilter = updater({ amenities: new Set(["outdoorPool"]) });
              expect(updatedFilter.amenities.has("outdoorPool")).toBe(false);
       });

       it("allows multiple amenities to be selected", () => {
              render(<AmenityFilter setFilters={mockSetFilters} />);
              const dryCleaning = screen.getByLabelText("Dry Cleaning");
              const fitnessFacility = screen.getByLabelText("Fitness Facility");
              fireEvent.click(dryCleaning);
              vi.advanceTimersByTime(500);
              fireEvent.click(fitnessFacility);
              vi.advanceTimersByTime(500);
              expect(mockSetFilters).toHaveBeenCalledTimes(2);
              const firstUpdater = mockSetFilters.mock.calls[0][0];
              const secondUpdater = mockSetFilters.mock.calls[1][0];
              const firstResult = firstUpdater({ amenities: new Set() });
              const secondResult = secondUpdater(firstResult);
              expect([...firstResult.amenities]).toEqual(["dryCleaning"]);
              expect([...secondResult.amenities]).toEqual(["dryCleaning", "fitnessFacility"]);
       });
});
