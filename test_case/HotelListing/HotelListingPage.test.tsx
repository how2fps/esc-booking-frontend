import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi, type Mock } from "vitest";
import HotelListings from "../../src/features/pages/hotel-listings/HotelListingsPage";
import hotelPricesTestData from "../dummy-hotel-prices.json";
import hotelTestData from "../dummy-hotel.json";

const getFutureDateString = (offset: number): string => {
       const date = new Date();
       date.setDate(date.getDate() + offset);
       return date.toISOString().split("T")[0];
};

globalThis.fetch = vi.fn((url) => {
       if (url.includes("/api/hotels?")) {
              return Promise.resolve(new Response(JSON.stringify(hotelTestData), { status: 200 }));
       }
       if (url.includes("/api/hotels/prices?")) {
              return Promise.resolve(new Response(JSON.stringify(hotelPricesTestData), { status: 200 }));
       }
       return Promise.reject(new Error("Unknown endpoint"));
});

describe("HotelListings Component", () => {
       beforeEach(() => {
              vi.clearAllMocks();
       });

       const renderWithRouter = () => {
              const checkIn = getFutureDateString(3);
              const checkOut = getFutureDateString(7);
              render(
                     <MemoryRouter initialEntries={[`/hotels?location=RsBU&startDate=${checkIn}&endDate=${checkOut}&adult=1&children=1&room=2`]}>
                            <Routes>
                                   <Route
                                          path="/hotels*"
                                          element={<HotelListings />}
                                   />
                            </Routes>
                     </MemoryRouter>
              );
       };

       test("renders loading spinner initially", async () => {
              renderWithRouter();
              const spinners = screen.getAllByRole("status");
              expect(spinners.length).toBeGreaterThanOrEqual(1);
       });

       test("renders hotel items after loading", async () => {
              renderWithRouter();
              await waitFor(() => {
                     const hotelNames = screen.getAllByTestId("hotel-name");
                     const hotel = hotelNames.find((el) => el.textContent?.trim() === "Hotel Example 2");
                     expect(hotel).toBeDefined();
              });
       });

       test("shows empty state if no hotels are returned", async () => {
              (globalThis.fetch as Mock).mockImplementationOnce(() => Promise.resolve(new Response(JSON.stringify([]), { status: 200 })));
              renderWithRouter();
              await waitFor(() => {
                     expect(screen.getByText((t) => t.includes("No hotels match your filters"))).toBeInTheDocument();
              });
       });

       test("filters hotels by search term", async () => {
              renderWithRouter();
              await waitFor(() => {
                     const hotelNames = screen.getAllByTestId("hotel-name");
                     const hotel = hotelNames.find((el) => el.textContent?.trim() === "Hotel Example 2");
                     expect(hotel).toBeDefined();
              });
              const searchInput = screen.getByPlaceholderText(/Search hotels/i);
              fireEvent.change(searchInput, { target: { value: "Hotel Example 1" } });
              await waitFor(() => {
                     const hotelNames = screen.getAllByTestId("hotel-name");
                     const matchingHotel = hotelNames.find((el) => el.textContent?.trim() === "Hotel Example 1");
                     expect(matchingHotel).toBeDefined();
                     const notMatchingHotel = hotelNames.find((el) => el.textContent?.trim() === "Hotel Example 2");
                     expect(notMatchingHotel).not.toBeDefined();
              });
       });

       test("sorts hotels by price high to low", async () => {
              renderWithRouter();
              await waitFor(() => {
                     const hotelNames = screen.getAllByTestId("hotel-name");
                     const hotel = hotelNames.find((el) => el.textContent?.trim() === "Hotel Example 2");
                     expect(hotel).toBeDefined();
              });
              const sortSelect = screen.getByLabelText(/Sort by/i);
              fireEvent.change(sortSelect, { target: { value: "priceHighToLow" } });
              await waitFor(() => {
                     const hotelItems = screen.getAllByText(/Hotel/i);
                     expect(hotelItems[0]).toHaveTextContent("Hotel Example 30");
                     expect(hotelItems[1]).toHaveTextContent("Hotel Example 29");
                     expect(hotelItems[2]).not.toHaveTextContent("Hotel Example 15");
              });
       });

       test("shows no results when search excludes all hotels", async () => {
              renderWithRouter();
              await waitFor(() => {
                     const hotelNames = screen.getAllByTestId("hotel-name");
                     const hotel = hotelNames.find((el) => el.textContent?.trim() === "Hotel Example 2");
                     expect(hotel).toBeDefined();
              });
              const searchInput = screen.getByPlaceholderText(/Search hotels/i);
              fireEvent.change(searchInput, { target: { value: "Nonexistent Hotel" } });
              await waitFor(() => {
                     expect(screen.queryByTestId("hotel-name")).not.toBeInTheDocument();
                     expect(screen.getByText((t) => t.includes("No hotels match your filters"))).toBeInTheDocument();
              });
       });

       test("items per page changes number of visible hotels", async () => {
              renderWithRouter();
              await waitFor(() => {
                     const hotelNames = screen.getAllByTestId("hotel-name");
                     const hotel = hotelNames.find((el) => el.textContent?.trim() === "Hotel Example 2");
                     expect(hotel).toBeDefined();
              });
              const itemsPerPageSelect = screen.getByLabelText(/Items Per Page/i);
              fireEvent.change(itemsPerPageSelect, { target: { value: "16" } });

              await waitFor(() => {
                     const hotelNames = screen.getAllByTestId("hotel-name");
                     expect(hotelNames.length).toBeLessThanOrEqual(16);
              });

              fireEvent.change(itemsPerPageSelect, { target: { value: "9" } });

              await waitFor(() => {
                     const hotelNames = screen.getAllByTestId("hotel-name");
                     expect(hotelNames.length).toBeLessThanOrEqual(9);
              });
       });
});
