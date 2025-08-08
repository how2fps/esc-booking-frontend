import { render, screen } from "@testing-library/react";
import { PriceRangeSlider } from "../../../src/features/pages/hotel-listings/PriceRangeSlider";

describe("PriceRangeSlider", () => {
       it("renders default label", () => {
              render(<PriceRangeSlider setPriceFilter={() => {}} />);
              expect(screen.getByText("Price Range: $0 – $10000")).toBeInTheDocument();
       });
});
