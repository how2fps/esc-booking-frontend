import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import HotelListings from "../src/features/pages/hotel-listings/HotelListings";

globalThis.fetch = vi.fn((url) => {
       if (url.includes("/api/hotels?")) {
              const body = JSON.stringify([
                     {
                            id: "hotel1",
                            name: "Hotel One",
                            address: "123 Main St",
                            amenities: { dryCleaning: true, outdoorPool: false },
                            priceRange: { min: 100, max: 200 },
                            latitude: 1.3,
                            longitude: 103.8,
                            rating: 4.5,
                            price: 150,
                     },
                     {
                            id: "hotel2",
                            name: "Hotel Two",
                            address: "456 Side St",
                            amenities: { dryCleaning: false, outdoorPool: true },
                            priceRange: { min: 80, max: 180 },
                            latitude: 1.31,
                            longitude: 103.81,
                            rating: 3.8,
                            price: 120,
                     },
              ]);
              return Promise.resolve(new Response(body, { status: 200 }));
       }
       if (url.includes("/api/hotels/prices?")) {
              const body = JSON.stringify({
                     data: {
                            hotels: [
                                   { id: "hotel1", price: 155 },
                                   { id: "hotel2", price: 125 },
                            ],
                     },
              });
              return Promise.resolve(new Response(body, { status: 200 }));
       }
       return Promise.reject(new Error("Unknown endpoint"));
});

describe("HotelListings Component", () => {
       beforeEach(() => {
              vi.clearAllMocks();
       });

       test("renders loading spinner initially", async () => {
              render(
                     <MemoryRouter initialEntries={["/hotel-listings?location=RsBU&startDate=2025-07-20&endDate=2025-07-27"]}>
                            <HotelListings />
                     </MemoryRouter>
              );
              expect(screen.getByRole("status")).toBeInTheDocument();
       });

       test("renders hotel items after loading", async () => {
              render(
                     <MemoryRouter initialEntries={["/hotel-listings?location=RsBU&startDate=2025-07-20&endDate=2025-07-27"]}>
                            <HotelListings />
                     </MemoryRouter>
              );
              await waitFor(() => {
                     expect(screen.getByText(/Hotel One/i)).toBeInTheDocument();
                     expect(screen.getByText(/Hotel Two/i)).toBeInTheDocument();
              });
       });

       test("filters hotels by search term", async () => {
              render(
                     <MemoryRouter initialEntries={["/hotel-listings?location=RsBU&startDate=2025-07-20&endDate=2025-07-27"]}>
                            <HotelListings />
                     </MemoryRouter>
              );
              await waitFor(() => screen.getByText(/Hotel One/i));
              const searchInput = screen.getByPlaceholderText(/Search hotels/i);
              fireEvent.change(searchInput, { target: { value: "Two" } });
              await waitFor(() => {
                     expect(screen.queryByText(/Hotel One/i)).not.toBeInTheDocument();
                     expect(screen.getByText(/Hotel Two/i)).toBeInTheDocument();
              });
       });

       test("filters hotels by minimum rating", async () => {
              render(
                     <MemoryRouter initialEntries={["/hotel-listings?location=RsBU&startDate=2025-07-20&endDate=2025-07-27"]}>
                            <HotelListings />
                     </MemoryRouter>
              );
              await waitFor(() => screen.getByText(/Hotel One/i));
              const ratingSlider = screen.getAllByRole("slider")[1];
              fireEvent.change(ratingSlider, { target: { value: 4 } });
              await waitFor(() => {
                     expect(screen.getByText(/Hotel One/i)).toBeInTheDocument();
                     expect(screen.queryByText(/Hotel Two/i)).not.toBeInTheDocument();
              });
       });

       test("sorts hotels by price high to low", async () => {
              render(
                     <MemoryRouter initialEntries={["/hotel-listings?location=RsBU&startDate=2025-07-20&endDate=2025-07-27"]}>
                            <HotelListings />
                     </MemoryRouter>
              );
              await waitFor(() => screen.getByText(/Hotel One/i));
              const sortSelect = screen.getByLabelText(/Sort by/i);
              fireEvent.change(sortSelect, { target: { value: "priceHighToLow" } });
              const hotelItems = screen.getAllByText(/Hotel/i);
              expect(hotelItems[0]).toHaveTextContent("Hotel One");
              expect(hotelItems[1]).toHaveTextContent("Hotel Two");
       });

       test("show no results when filter excludes all hotels", async () => {
              render(
                     <MemoryRouter initialEntries={["/hotel-listings?location=RsBU&startDate=2025-07-20&endDate=2025-07-27"]}>
                            <HotelListings />
                     </MemoryRouter>
              );
              await waitFor(() => screen.getByText(/Hotel One/i));
              const searchInput = screen.getByPlaceholderText(/Search hotels/i);
              fireEvent.change(searchInput, { target: { value: "Nonexistent" } });
              await waitFor(() => {
                     expect(screen.getByText(/No results available/i)).toBeInTheDocument();
              });
       });

       test("pagination works", async () => {
              render(
                     <MemoryRouter initialEntries={["/hotel-listings?location=RsBU&startDate=2025-07-20&endDate=2025-07-27"]}>
                            <HotelListings />
                     </MemoryRouter>
              );
              await waitFor(() => screen.getByText(/Hotel One/i));
              const itemsPerPageSelect = screen.getByDisplayValue("8 Per Page");
              fireEvent.change(itemsPerPageSelect, { target: { value: "1" } });
              const hotelItems = screen.getAllByText(/Hotel/i);
              expect(hotelItems.length).toBe(1);
       });
});
