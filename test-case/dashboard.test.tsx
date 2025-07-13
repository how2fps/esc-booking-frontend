import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import SliderOne from "../src/features/components/DestinationSearch/DestinationSearch";

vi.mock("react-select/async", () => ({
       __esModule: true,
       default: ({ onChange, value, ...props }) => (
              <input
                     data-testid="async-select"
                     value={value?.label || ""}
                     onChange={(e) => {
                            if (e.target.value === "Italy") {
                                   onChange({ value: "A6Dz", label: "Italy" });
                            } else {
                                   onChange({ value: e.target.value, label: e.target.value });
                            }
                     }}
                     {...props}
              />
       ),
}));

describe("SliderOne Component", () => {
       it("updates location via AsyncSelect", async () => {
              render(
                     <MemoryRouter>
                            <SliderOne />
                     </MemoryRouter>
              );
              const asyncSelect = screen.getByTestId("async-select");
              expect(asyncSelect).toBeInTheDocument();
              await userEvent.type(asyncSelect, "Italy");
              fireEvent.change(asyncSelect, { target: { value: "Italy" } });
              fireEvent.keyDown(asyncSelect, { key: "Enter", code: "Enter", keyCode: 13 });
              expect(screen.getByTestId("uid")).toHaveTextContent("Selected: A6Dz");
       });

       it("shows correct date range in input", () => {
              render(
                     <MemoryRouter>
                            <SliderOne />
                     </MemoryRouter>
              );
              const dateInput = screen.getByPlaceholderText("Add Dates");
              expect(dateInput).toBeInTheDocument();

              const today = new Date();
              const sevenDaysLater = new Date(today);
              sevenDaysLater.setDate(today.getDate() + 7);

              const expectedValue = `${today.toLocaleDateString()} - ${sevenDaysLater.toLocaleDateString()}`;
              expect(dateInput).toHaveValue(expectedValue);
       });

       it("increments and decrements guest counts", async () => {
              render(
                     <MemoryRouter>
                            <SliderOne />
                     </MemoryRouter>
              );
              const guestInput = screen.getByPlaceholderText("Add Guest");
              expect(guestInput).toBeInTheDocument();

              fireEvent.click(guestInput);

              const adultsSection = screen.getByText("Adults").closest(".item");
              const plusButton = adultsSection.querySelector(".plus");
              fireEvent.click(plusButton);
              fireEvent.click(plusButton);
              await waitFor(() => {
                     expect(guestInput.value).toContain("2 adults");
              });

              const minusButton = adultsSection.querySelector(".minus");
              fireEvent.click(minusButton);

              await waitFor(() => {
                     expect(guestInput.value).toBe("1 adult");
              });
              const childSection = screen.getByText("Children").closest(".item");
              const CplusButton = childSection.querySelector(".plus");
              fireEvent.click(CplusButton);
              await waitFor(() => {
                     expect(guestInput.value).toContain("1 adult, 1 children");
              });
       });
});
