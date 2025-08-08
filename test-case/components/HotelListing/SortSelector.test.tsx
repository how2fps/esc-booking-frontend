import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { SortSelector } from "../../../src/features/pages/hotel-listings/SortSelector";

describe("SortSelector", () => {
       let mockSetSortOption: ReturnType<typeof vi.fn>;

       beforeEach(() => {
              mockSetSortOption = vi.fn();
       });

       it("renders the select with correct default value", () => {
              render(<SortSelector setSortOption={mockSetSortOption} />);
              const select = screen.getByLabelText("Sort By:") as HTMLSelectElement;
              expect(select.value).toBe("starHighToLow");
       });

       it("calls setSortOption with default value on mount", () => {
              render(<SortSelector setSortOption={mockSetSortOption} />);
              expect(mockSetSortOption).toHaveBeenCalledWith("starHighToLow");
       });

       it("updates the value and calls setSortOption on change", () => {
              render(<SortSelector setSortOption={mockSetSortOption} />);
              const select = screen.getByLabelText("Sort By:") as HTMLSelectElement;
              fireEvent.change(select, { target: { value: "priceLowToHigh" } });
              expect(select.value).toBe("priceLowToHigh");
              expect(mockSetSortOption).toHaveBeenCalledWith("priceLowToHigh");
       });

       it("renders all 6 sort options", () => {
              render(<SortSelector setSortOption={mockSetSortOption} />);
              const options = screen.getAllByRole("option");
              expect(options).toHaveLength(6);
              expect(options.map((opt) => opt.textContent)).toEqual(["Stars Descending", "Stars Ascending", "Price Descending", "Price Ascending", "Rating Descending", "Rating Ascending"]);
       });
});
