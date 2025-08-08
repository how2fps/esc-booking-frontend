import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { StarRatingPicker } from "../../src/features/pages/hotel-listings/StarRatingPicker";

describe("StarRatingPicker", () => {
       let mockOnChange: ReturnType<typeof vi.fn>;

       beforeEach(() => {
              mockOnChange = vi.fn();
       });

       it("renders 5 empty stars by default", () => {
              render(
                     <StarRatingPicker
                            value={0}
                            onChange={mockOnChange}
                     />
              );
              const emptyStars = [screen.getByTestId("star-1-empty"), screen.getByTestId("star-2-empty"), screen.getByTestId("star-3-empty"), screen.getByTestId("star-4-empty"), screen.getByTestId("star-5-empty")];
              expect(emptyStars).toHaveLength(5);
              expect(mockOnChange).not.toHaveBeenCalled();
       });

       it("calls onChange with full star value when clicked on right half", () => {
              render(
                     <StarRatingPicker
                            value={0}
                            onChange={mockOnChange}
                     />
              );
              const starDiv = screen.getByTestId("star-3-empty").parentElement!;
              fireEvent.click(starDiv, { clientX: 20 });
              expect(mockOnChange).toHaveBeenCalledWith(3);
       });
       it("calls onChange with half-star value when clicked on left half", () => {
              render(
                     <StarRatingPicker
                            value={0}
                            onChange={mockOnChange}
                     />
              );

              const starDiv = screen.getByTestId("star-2-empty").parentElement!;

              vi.spyOn(starDiv, "getBoundingClientRect").mockReturnValue({
                     width: 20,
                     left: 0,
                     top: 0,
                     bottom: 0,
                     right: 0,
                     height: 0,
                     x: 0,
                     y: 0,
                     toJSON: () => {},
              });

              fireEvent.click(starDiv, { clientX: 5 });
              expect(mockOnChange).toHaveBeenCalledWith(1.5);
       });

       it("renders full/half/empty stars correctly on hover", () => {
              render(
                     <StarRatingPicker
                            value={0}
                            onChange={mockOnChange}
                     />
              );
              const starDiv = screen.getByTestId("star-4-empty").parentElement!;
              fireEvent.mouseMove(starDiv, { clientX: 20 });
              expect(screen.getByTestId("star-4-full")).toBeInTheDocument();

              fireEvent.mouseLeave(starDiv);
              expect(screen.getByTestId("star-4-empty")).toBeInTheDocument();
       });

       it("renders filled stars according to value prop", () => {
              render(
                     <StarRatingPicker
                            value={3.5}
                            onChange={mockOnChange}
                     />
              );
              expect(screen.getByTestId("star-1-full")).toBeInTheDocument();
              expect(screen.getByTestId("star-2-full")).toBeInTheDocument();
              expect(screen.getByTestId("star-3-full")).toBeInTheDocument();
              expect(screen.getByTestId("star-4-half")).toBeInTheDocument();
              expect(screen.getByTestId("star-5-empty")).toBeInTheDocument();
       });
});
