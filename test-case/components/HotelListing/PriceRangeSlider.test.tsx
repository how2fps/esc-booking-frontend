import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { PriceRangeSlider } from "../../../src/features/pages/hotel-listings/PriceRangeSlider";

describe("PriceRangeSlider", () => {
       it("renders default label", () => {
              render(<PriceRangeSlider setPriceFilter={() => {}} />);
              expect(screen.getByText("Price Range: $0 – $10000")).toBeInTheDocument();
       });

       it("calls setPriceFilter when onChangeComplete is triggered manually", () => {
              const mockSetPriceFilter = vi.fn();
              render(<PriceRangeSlider setPriceFilter={mockSetPriceFilter} />);

              const sliderWrapper = screen.getByTestId("price-slider");

              const reactKey = Object.keys(sliderWrapper!).find((k) => k.startsWith("__reactProps$"));
              const props = (sliderWrapper as any)[reactKey!];
              props.onChangeComplete([3000, 9000]);

              expect(mockSetPriceFilter).toHaveBeenCalledWith({ min: 3000, max: 9000 });
       });
});
