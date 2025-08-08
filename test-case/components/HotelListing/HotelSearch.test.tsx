import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { HotelSearch } from "../../../src/features/pages/hotel-listings/HotelSearch";

describe("HotelSearch", () => {
       it("renders input with correct placeholder", () => {
              render(<HotelSearch setSearchTerm={() => {}} />);
              const input = screen.getByPlaceholderText("Search hotels...");
              expect(input).toBeInTheDocument();
       });

       it("updates input value on change", () => {
              render(<HotelSearch setSearchTerm={() => {}} />);
              const input = screen.getByPlaceholderText("Search hotels...");
              fireEvent.change(input, { target: { value: "Hilton" } });
              expect((input as HTMLInputElement).value).toBe("Hilton");
       });

       it("calls setSearchTerm after 300ms debounce", async () => {
              vi.useFakeTimers();
              const mockSetSearchTerm = vi.fn();
              render(<HotelSearch setSearchTerm={mockSetSearchTerm} />);
              const input = screen.getByPlaceholderText("Search hotels...");
              fireEvent.change(input, { target: { value: "Marina" } });
              vi.advanceTimersByTime(300);
              expect(mockSetSearchTerm).toHaveBeenCalledWith("Marina");
              vi.useRealTimers();
       });

       it("clears previous debounce if typing again", () => {
              vi.useFakeTimers();
              const mockSetSearchTerm = vi.fn();
              render(<HotelSearch setSearchTerm={mockSetSearchTerm} />);
              const input = screen.getByPlaceholderText("Search hotels...");
              fireEvent.change(input, { target: { value: "Dede" } });
              vi.advanceTimersByTime(100);
              fireEvent.change(input, { target: { value: "Hotel" } });
              vi.advanceTimersByTime(300);
              expect(mockSetSearchTerm).toHaveBeenCalledTimes(1);
              expect(mockSetSearchTerm).toHaveBeenCalledWith("Hotel");

              vi.useRealTimers();
       });
});
