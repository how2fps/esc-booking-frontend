import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi, type Mock } from "vitest";
import HotelListings from "../src/features/pages/hotel-listings/HotelListingsPage";
import hotelTestData from "./test-hotel.json";

globalThis.fetch = vi.fn((url) => {
       if (url.includes("/api/hotels?")) {
              return Promise.resolve(new Response(JSON.stringify(hotelTestData.hotels), { status: 200 }));
       }
       if (url.includes("/api/hotels/prices?")) {
              return Promise.resolve(new Response(JSON.stringify({ data: { hotels: hotelTestData.prices } }), { status: 200 }));
       }
       return Promise.reject(new Error("Unknown endpoint"));
});

describe("HotelListings Component", () => {
       beforeEach(() => {
              vi.clearAllMocks();
       });
       const renderWithRouter = () =>
              render(
                     <MemoryRouter initialEntries={["/hotels?location=RsBU&startDate=2025-07-20&endDate=2025-07-27"]}>
                            <Routes>
                                   <Route
                                          path="/hotels*"
                                          element={<HotelListings />}
                                   />
                            </Routes>
                     </MemoryRouter>
              );
       test("renders loading spinner initially", async () => {
              renderWithRouter();
              const spinners = screen.getAllByRole("status");
              expect(spinners.length).toBeGreaterThanOrEqual(1);
       });

       test("renders hotel items after loading", async () => {
              renderWithRouter();
              await waitFor(() => {
                     expect(screen.getByText(/Hotel Election 1/i)).toBeInTheDocument();
                     expect(screen.getByText(/Hotel Senior 2/i)).toBeInTheDocument();
              });
       });

       test("shows empty state if no hotels are returned", async () => {
              (globalThis.fetch as Mock).mockImplementationOnce(() => Promise.resolve(new Response(JSON.stringify([]), { status: 200 })));
              renderWithRouter();
              await waitFor(() => {
                     expect(screen.getByText(/No results available/i)).toBeInTheDocument();
              });
       });

       test("filters hotels by search term", async () => {
              renderWithRouter();
              await waitFor(() => screen.getByText(/Hotel Election 1/i));
              const searchInput = screen.getByPlaceholderText(/Search hotels/i);
              fireEvent.change(searchInput, { target: { value: "Hotel Through" } });
              await waitFor(() => {
                     expect(screen.queryByText(/Hotel Election 1/i)).not.toBeInTheDocument();
                     expect(screen.getByText(/Hotel Through 3/i)).toBeInTheDocument();
              });
       });

       test("sorts hotels by price high to low", async () => {
              renderWithRouter();
              await waitFor(() => screen.getByText(/Hotel Election 1/i));
              const sortSelect = screen.getByLabelText(/Sort by/i);
              fireEvent.change(sortSelect, { target: { value: "priceHighToLow" } });
              const hotelItems = screen.getAllByText((_, node) => {
                     if (!node) return false;
                     return node.textContent?.includes("Hotel") === true;
              });
              expect(hotelItems[0]).toHaveTextContent("Hotel Anything 12");
       });

       test("show no results when filter excludes all hotels", async () => {
              renderWithRouter();
              await waitFor(() => screen.getByText(/Hotel Election 1/i));
              const searchInput = screen.getByPlaceholderText(/Search hotels/i);
              fireEvent.change(searchInput, { target: { value: "Nonexistent" } });
              await waitFor(() => {
                     expect(screen.getByText(/No results available/i)).toBeInTheDocument();
              });
       });

       test("filters exclude all hotels with impossible combination", async () => {
              renderWithRouter();
              await waitFor(() => screen.getByText(/Hotel Election 1/i));

              const searchInput = screen.getByPlaceholderText(/Search hotels/i);
              fireEvent.change(searchInput, { target: { value: "asdkjfhskdjfh" } });

              await waitFor(() => {
                     expect(screen.getByText(/No results available/i)).toBeInTheDocument();
              });
       });

       test("pagination works", async () => {
              renderWithRouter();

              await waitFor(() => screen.getByText(/Hotel Election 1/i));

              const itemsPerPageSelect = screen.getByLabelText(/Items Per Page/i);
              fireEvent.change(itemsPerPageSelect, { target: { value: "16" } });

              await waitFor(() => {
                     const hotelItems = document.querySelectorAll(".hotel-item");
                     expect(hotelItems.length).toBe(16);
              });
       });
});
