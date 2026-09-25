import { fireEvent, render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ClusteredHotelMarkers } from "../../src/features/pages/hotel-listings/ClusteredHotelMarkers";
import type { HotelMarker as HotelMarkerType } from "../../src/features/type/HotelType";

// MarkerClusterer talks to the real Google Maps JS API, which jsdom can't
// provide. Track the addMarkers/clearMarkers calls the component makes so we
// can assert the clustering wiring without a live map.
const { addMarkersMock, clearMarkersMock } = vi.hoisted(() => ({
  addMarkersMock: vi.fn(),
  clearMarkersMock: vi.fn(),
}));

vi.mock("@googlemaps/markerclusterer", () => ({
  MarkerClusterer: vi.fn().mockImplementation(() => ({
    addMarkers: addMarkersMock,
    clearMarkers: clearMarkersMock,
  })),
}));

vi.mock("@vis.gl/react-google-maps", () => ({
  useMap: () => ({}),
  InfoWindow: ({
    children,
    onCloseClick,
  }: {
    children: React.ReactNode;
    onCloseClick: () => void;
  }) => (
    <div data-testid="info-window">
      <button aria-label="close info window" onClick={onCloseClick} />
      {children}
    </div>
  ),
}));

// Stand in for the real HotelMarker (an AdvancedMarker wrapper, also
// Maps-API-dependent) with a plain button that still exercises the same
// onClick/setMarkerRef contract ClusteredHotelMarkers relies on.
vi.mock("../../src/features/pages/hotel-listings/HotelMarker", () => ({
  HotelMarker: ({
    hotel,
    onClick,
    setMarkerRef,
  }: {
    hotel: HotelMarkerType;
    onClick: (hotel: HotelMarkerType) => void;
    setMarkerRef: (marker: object | null, key: string) => void;
  }) => {
    useEffect(() => {
      setMarkerRef({}, hotel.key);
      return () => setMarkerRef(null, hotel.key);
    }, [hotel.key, setMarkerRef]);

    return (
      <button onClick={() => onClick(hotel)}>{hotel.name}</button>
    );
  },
}));

const makeHotel = (overrides: Partial<HotelMarkerType> = {}): HotelMarkerType => ({
  id: overrides.key ?? "hotel-1",
  key: "hotel-1",
  name: "Marina Bay Hotel",
  address: "10 Bayfront Ave, Singapore",
  amenities: {},
  priceRange: { min: 100, max: 300 },
  latitude: 1.283,
  longitude: 103.86,
  position: { lat: 1.283, lng: 103.86 },
  rating: 4,
  distance: 1.2,
  description: "",
  imageCount: 0,
  trustyou: {
    id: null,
    score: {
      overall: 0,
      kaligo_overall: 0,
      solo: null,
      couple: null,
      family: null,
      business: null,
    },
  },
  amenities_ratings: [],
  image_details: { suffix: "", count: 0, prefix: "" },
  hires_image_index: "",
  number_of_images: 0,
  default_image_index: 0,
  imgix_url: "",
  cloudflare_image_url: "",
  images: [],
  price: 150,
  currency: "SGD",
  ...overrides,
});

// Reveals the route ClusteredHotelMarkers navigates to when "View Details"
// is clicked, so we can assert on it without a real HotelDetails page.
const NavigationProbe = () => {
  const location = useLocation();
  return <div data-testid="navigation-probe">{location.pathname + location.search}</div>;
};

const renderWithRouter = (hotels: HotelMarkerType[], initialEntry: string) =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/hotels" element={<ClusteredHotelMarkers hotels={hotels} />} />
        <Route path="/hotels/:hotelKey" element={<NavigationProbe />} />
      </Routes>
    </MemoryRouter>
  );

describe("ClusteredHotelMarkers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a marker for every hotel and clusters them", () => {
    const hotels = [
      makeHotel({ key: "a", name: "Hotel A" }),
      makeHotel({ key: "b", name: "Hotel B" }),
    ];
    renderWithRouter(hotels, "/hotels");

    expect(screen.getByText("Hotel A")).toBeInTheDocument();
    expect(screen.getByText("Hotel B")).toBeInTheDocument();

    // Each mocked marker registers itself via setMarkerRef on mount, which
    // should flow into the clusterer.
    expect(clearMarkersMock).toHaveBeenCalled();
    expect(addMarkersMock).toHaveBeenCalled();
    const calls = addMarkersMock.mock.calls;
    const lastCallMarkers = calls[calls.length - 1]?.[0];
    expect(lastCallMarkers).toHaveLength(2);
  });

  it("opens an InfoWindow with the hotel's details when a marker is clicked", () => {
    const hotel = makeHotel({
      key: "a",
      name: "Hotel A",
      address: "1 Test Street",
      rating: 4,
    });
    renderWithRouter([hotel], "/hotels");

    expect(screen.queryByTestId("info-window")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Hotel A"));

    expect(screen.getByTestId("info-window")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Hotel A" })).toBeInTheDocument();
    expect(screen.getByText("1 Test Street")).toBeInTheDocument();
  });

  it("closes the InfoWindow and clears the selection when the close button is clicked", () => {
    const hotel = makeHotel({ key: "a", name: "Hotel A" });
    renderWithRouter([hotel], "/hotels");

    fireEvent.click(screen.getByText("Hotel A"));
    expect(screen.getByTestId("info-window")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /close info window/i }));
    expect(screen.queryByTestId("info-window")).not.toBeInTheDocument();
  });

  it("renders full, partial, and empty stars based on the hotel rating", () => {
    // floor(3.5) = 3 full stars; the 4th star is partial (60% clipped); the
    // 5th is empty.
    const hotel = makeHotel({ key: "a", name: "Hotel A", rating: 3.5 });
    renderWithRouter([hotel], "/hotels");

    fireEvent.click(screen.getByText("Hotel A"));

    const filledStars = document.querySelectorAll(".text-yellow-500");
    expect(filledStars).toHaveLength(4); // 3 full + 1 partial

    const partialStar = filledStars[3] as HTMLElement;
    expect(partialStar.style.clipPath).toBe("inset(0 50% 0 0)");
  });

  it("navigates to the hotel's details page with the search dates on 'View Details'", () => {
    const hotel = makeHotel({ key: "hotel-42", name: "Hotel A" });
    renderWithRouter(
      [hotel],
      "/hotels?location=RsBU&startDate=2026-01-10&endDate=2026-01-15"
    );

    fireEvent.click(screen.getByText("Hotel A"));
    fireEvent.click(screen.getByRole("button", { name: /view details/i }));

    const probe = screen.getByTestId("navigation-probe");
    expect(probe.textContent).toBe(
      "/hotels/hotel-42?destination_id=RsBU&checkin=2026-01-10&checkout=2026-01-15"
    );
  });

  it("defaults check-in/check-out to today when missing from the URL", () => {
    const hotel = makeHotel({ key: "hotel-42", name: "Hotel A" });
    renderWithRouter([hotel], "/hotels?location=RsBU");

    fireEvent.click(screen.getByText("Hotel A"));
    fireEvent.click(screen.getByRole("button", { name: /view details/i }));

    const today = new Date().toISOString().split("T")[0];
    const probe = screen.getByTestId("navigation-probe");
    expect(probe.textContent).toBe(
      `/hotels/hotel-42?destination_id=RsBU&checkin=${today}&checkout=${today}`
    );
  });
});
