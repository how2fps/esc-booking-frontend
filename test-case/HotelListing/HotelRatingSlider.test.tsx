import { render, screen } from "@testing-library/react";
import { HotelRatingSlider } from "../../src/features/pages/hotel-listings/HotelRatingSlider";

describe("PriceRangeSlider", () => {
       it("renders default label", () => {
              render(<HotelRatingSlider setHotelRatingFilter={() => {}} />);
              expect(screen.getByText("Minimum Rating: 0")).toBeInTheDocument();
       });
});
