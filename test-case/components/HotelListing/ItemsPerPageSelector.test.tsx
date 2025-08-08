import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { ItemsPerPageSelector } from "../../../src/features/pages/hotel-listings/ItemsPerPageSelector";

describe("ItemsPerPageSelector", () => {
       let mockSetItemsPerPage: ReturnType<typeof vi.fn>;
       let mockSetCurrentPage: ReturnType<typeof vi.fn>;

       beforeEach(() => {
              mockSetItemsPerPage = vi.fn();
              mockSetCurrentPage = vi.fn();
       });

       it("renders the select with correct default value", () => {
              render(
                     <ItemsPerPageSelector
                            setCurrentPage={mockSetCurrentPage}
                            setItemsPerPage={mockSetItemsPerPage}
                     />
              );
              const select = screen.getByLabelText("Items Per Page:") as HTMLSelectElement;
              expect(select.value).toBe("8");
       });

       it("calls setItemsPerPage with default value on mount", () => {
              render(
                     <ItemsPerPageSelector
                            setCurrentPage={mockSetCurrentPage}
                            setItemsPerPage={mockSetItemsPerPage}
                     />
              );
              expect(mockSetItemsPerPage).toHaveBeenCalledWith(8);
       });

       it("updates the value and calls setItemsPerPage and setCurrentPage on change", () => {
              render(
                     <ItemsPerPageSelector
                            setCurrentPage={mockSetCurrentPage}
                            setItemsPerPage={mockSetItemsPerPage}
                     />
              );
              const select = screen.getByLabelText("Items Per Page:") as HTMLSelectElement;
              fireEvent.change(select, { target: { value: "12" } });
              expect(select.value).toBe("12");
              expect(mockSetItemsPerPage).toHaveBeenCalledWith(12);
              expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
       });

       it("renders all 4 options", () => {
              render(
                     <ItemsPerPageSelector
                            setCurrentPage={mockSetCurrentPage}
                            setItemsPerPage={mockSetItemsPerPage}
                     />
              );
              const options = screen.getAllByRole("option");
              expect(options).toHaveLength(4);
              expect(options.map((opt) => opt.textContent)).toEqual(["8", "9", "12", "16"]);
       });
});
