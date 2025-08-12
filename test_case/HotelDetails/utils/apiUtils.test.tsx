import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Test API utilities for HotelDetails and RoomDetails components
describe('Hotel and Room API Utilities', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  // Hotel Details API Functions
  describe('Hotel Details API', () => {
    const fetchHotelDetails = async (id: string, retries = 3, delay = 1000) => {
      let attemptCount = 0;
      const maxRetries = retries;
      
      while (attemptCount < maxRetries) {
        try {
          const response = await fetch(`http://localhost:3000/api/hotels/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const hotelResult = await response.json();
          return hotelResult;
          
        } catch (error) {
          attemptCount++;
          
          if (attemptCount >= maxRetries) {
            throw error;
          } else {
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
    };

    it('fetches hotel details successfully', async () => {
      const mockHotel = {
        id: '4qUA',
        name: 'Test Hotel',
        address: 'Test Address',
        rating: 4.5,
        image_details: {
          prefix: 'https://example.com/images/',
          count: 5,
          suffix: '.jpg'
        }
      };

      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockHotel)
      });
      global.fetch = mockFetch;

      const result = await fetchHotelDetails('4qUA');
      expect(result).toEqual(mockHotel);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/hotels/4qUA', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
    })

    it('retries on network failure and eventually succeed', async () => {
      const mockHotel = { id: '4qUA', name: 'Test Hotel', address: 'Test Address' };

      const mockFetch = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockHotel)
        });
      global.fetch = mockFetch;

      const result = await fetchHotelDetails('4qUA', 3, 10);
      expect(result).toEqual(mockHotel);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    })

    it('throws error after max retries', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      global.fetch = mockFetch;

      await expect(fetchHotelDetails('4qUA', 2, 10)).rejects.toThrow('Network error');
      expect(mockFetch).toHaveBeenCalledTimes(2);
    })

    it('handles HTTP error responses', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404
      });
      global.fetch = mockFetch;

      await expect(fetchHotelDetails('invalid-id')).rejects.toThrow('HTTP error! status: 404');
      expect(mockFetch).toHaveBeenCalledTimes(3); // Should retry 3 times (default retries)
    })
  })

  // Room Details API Functions
  describe('Room Details API', () => {
    const fetchRoomPrices = async (
      hotelId: string,
      destination_id: string,
      checkin: string,
      checkout: string,
      guests: number,
      maxAttempts = 5,
      delay = 1000
    ) => {
      const apiUrl = `http://localhost:3000/api/hotels/${hotelId}/prices?destination_id=${destination_id}&checkin=${checkin}&checkout=${checkout}&lang=en_US&currency=SGD&country_code=SG&guests=${guests}&partner_id=1089&landing_page=wl-acme-earn&product_type=earn`;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const response = await fetch(apiUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          const roomResult = await response.json();
          
          if (roomResult.completed && roomResult.rooms && Array.isArray(roomResult.rooms) && roomResult.rooms.length > 0) {
            return roomResult.rooms.slice(0, 20);
          } else if (roomResult.completed && (!roomResult.rooms || roomResult.rooms.length === 0)) {
            return [];
          } else {
            // Data not ready yet, continue polling
            if (attempt < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, delay));
              continue;
            } else {
              return [];
            }
          }
          
        } catch (error) {
          if (attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            throw error;
          }
        }
      }
      
      return [];
    };

    it('fetches room prices successfully when data is ready', async () => {
      const mockRooms = [
        {
          key: 'room1',
          roomNormalizedDescription: 'Standard Room',
          base_rate: 150,
          base_rate_in_currency: 200,
          rooms_available: 3
        },
        {
          key: 'room2',
          roomNormalizedDescription: 'Deluxe Room',
          base_rate: 200,
          base_rate_in_currency: 270,
          rooms_available: 2
        }
      ];

      const mockResponse = {
        completed: true,
        rooms: mockRooms
      };

      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });
      global.fetch = mockFetch;

      const result = await fetchRoomPrices('4qUA', 'dest123', '2024-03-15', '2024-03-16', 2, 3, 10);
      expect(result).toEqual(mockRooms);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('http://localhost:3000/api/hotels/4qUA/prices'),
        {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        }
      );
    })

    it('polls until data is ready', async () => {
      const mockRooms = [{ key: 'room1', roomNormalizedDescription: 'Standard Room' }];

      const mockFetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ completed: false, rooms: [] })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ completed: false, rooms: [] })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ completed: true, rooms: mockRooms })
        });
      global.fetch = mockFetch;

      const result = await fetchRoomPrices('4qUA', 'dest123', '2024-03-15', '2024-03-16', 2, 3, 10);
      expect(result).toEqual(mockRooms);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    })

    it('returns empty array when no rooms available', async () => {
      const mockResponse = {
        completed: true,
        rooms: []
      };

      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });
      global.fetch = mockFetch;

      const result = await fetchRoomPrices('4qUA', 'dest123', '2024-03-15', '2024-03-16', 2, 3, 10);
      expect(result).toEqual([]);
    })

    it('should handle HTTP error responses', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500
      });
      global.fetch = mockFetch;

      await expect(
        fetchRoomPrices('4qUA', 'dest123', '2024-03-15', '2024-03-16', 2, 2, 10)
      ).rejects.toThrow('HTTP 500');
    })

    it('times out after max attempts', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ completed: false, rooms: [] })
      });
      global.fetch = mockFetch;

      const result = await fetchRoomPrices('4qUA', 'dest123', '2024-03-15', '2024-03-16', 2, 2, 10);
      expect(result).toEqual([]);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    })
  })

  // Room Key Decoding Utilities (from RoomDetails)
  describe('Room Key Utilities', () => {
    const extractRoomNameFromKey = (roomKey: string): string => {
      try {
        const decodedKey = decodeURIComponent(roomKey);
        
        const roomNameMatch = decodedKey.match(/room[_-]?name[_-]?([^&|_-]+)/i) ||
                            decodedKey.match(/([A-Za-z\s]+(?:room|suite|king|queen|double|single|deluxe|standard|premium))/i) ||
                            decodedKey.match(/^([A-Za-z\s]+)/);
        
        if (roomNameMatch && roomNameMatch[1]) {
          const extractedName = roomNameMatch[1]
            .replace(/[_-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          return extractedName;
        } else {
          const cleanedKey = decodedKey
            .replace(/[^A-Za-z\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 50); 
          return cleanedKey || 'Unknown Room';
        }
      } catch (error) {
        return 'Unknown Room';
      }
    };

    it('extracts room name from encoded key', () => {
      expect(extractRoomNameFromKey('deluxe%20room')).toContain('deluxe');
      expect(extractRoomNameFromKey('standard-suite')).toContain('standard');
      expect(extractRoomNameFromKey('king-room-key')).toContain('king');
    })

    it('handles malformed room keys', () => {
      expect(extractRoomNameFromKey('invalid-key-123')).toBe('invalid'); // After cleaning: numbers removed, final result is 'invalid'
      expect(extractRoomNameFromKey('')).toBe('Unknown Room');
      expect(extractRoomNameFromKey('%%%')).toBe('Unknown Room');
    })
  })

  // Price Calculation Utilities (from RoomDetails)
  describe('Price Calculation Utilities', () => {
    const calculateRoomPricing = (roomDetail: any, roomQuantity: number, numberOfNights: number) => {
      if (!roomDetail) return null;

      const baseRateSGD = roomDetail.base_rate_in_currency || 0;
      const baseRateUSD = roomDetail.base_rate || 0;
      const taxesAndFeesSGD = roomDetail.included_taxes_and_fees_total_in_currency || 0;
      const taxesAndFeesUSD = roomDetail.included_taxes_and_fees_total || 0;
      const additionalFeesSGD = roomDetail.excluded_taxes_and_fees_total_in_currency || 0;
      const additionalFeesUSD = roomDetail.excluded_taxes_and_fees_total || 0;
      const perRoomPerNightSGD = baseRateSGD + taxesAndFeesSGD + additionalFeesSGD;
      const perRoomPerNightUSD = baseRateUSD + taxesAndFeesUSD + additionalFeesUSD;

      return {
        baseRateSGD,
        baseRateUSD,
        taxesAndFeesSGD,
        taxesAndFeesUSD,
        additionalFeesSGD,
        additionalFeesUSD,
        perRoomPerNightSGD,
        perRoomPerNightUSD,
        totalSGD: perRoomPerNightSGD * roomQuantity * numberOfNights,
        totalUSD: perRoomPerNightUSD * roomQuantity * numberOfNights
      };
    };

    it('calculates room pricing correctly', () => {
      const roomDetail = {
        base_rate: 100,
        base_rate_in_currency: 135,
        included_taxes_and_fees_total: 15,
        included_taxes_and_fees_total_in_currency: 20,
        excluded_taxes_and_fees_total: 5,
        excluded_taxes_and_fees_total_in_currency: 7
      };

      const result = calculateRoomPricing(roomDetail, 2, 3);
      
      expect(result).toEqual({
        baseRateSGD: 135,
        baseRateUSD: 100,
        taxesAndFeesSGD: 20,
        taxesAndFeesUSD: 15,
        additionalFeesSGD: 7,
        additionalFeesUSD: 5,
        perRoomPerNightSGD: 162, // 135 + 20 + 7
        perRoomPerNightUSD: 120, // 100 + 15 + 5
        totalSGD: 972, // 162 * 2 * 3
        totalUSD: 720  // 120 * 2 * 3
      });
    })

    it('handles missing room detail', () => {
      const result = calculateRoomPricing(null, 1, 1);
      expect(result).toBeNull();
    })

    it('handles missing rate fields with defaults', () => {
      const roomDetail = {};
      const result = calculateRoomPricing(roomDetail, 1, 1);
      
      expect(result).toEqual({
        baseRateSGD: 0,
        baseRateUSD: 0,
        taxesAndFeesSGD: 0,
        taxesAndFeesUSD: 0,
        additionalFeesSGD: 0,
        additionalFeesUSD: 0,
        perRoomPerNightSGD: 0,
        perRoomPerNightUSD: 0,
        totalSGD: 0,
        totalUSD: 0
      });
    })
  })

  // Image Processing Utilities
  describe('Image Processing Utilities', () => {
    const generateHotelImageArray = (hotelDetails: any) => {
      if (!hotelDetails?.image_details?.prefix) {
        return [];
      }
      
      const imageDetails = hotelDetails.image_details;
      const prefix = imageDetails.prefix;
      const count = Math.min(imageDetails.count || 0, 11); 
      const suffix = imageDetails.suffix || '.jpg';
      const images: string[] = [];

      for (let i = 1; i <= count; i++) {
        const imageUrl = `${prefix}${i}${suffix}`;
        images.push(imageUrl);
      }
  
      return images;
    };

    it('generates image array from hotel details', () => {
      const hotelDetails = {
        image_details: {
          prefix: 'https://example.com/hotel-',
          count: 3,
          suffix: '.jpg'
        }
      };

      const result = generateHotelImageArray(hotelDetails);
      expect(result).toEqual([
        'https://example.com/hotel-1.jpg',
        'https://example.com/hotel-2.jpg',
        'https://example.com/hotel-3.jpg'
      ]);
    })

    it('limits images to maximum of 11', () => {
      const hotelDetails = {
        image_details: {
          prefix: 'https://example.com/hotel-',
          count: 15,
          suffix: '.jpg'
        }
      };

      const result = generateHotelImageArray(hotelDetails);
      expect(result).toHaveLength(11);
    })

    it('returns empty array for missing image details', () => {
      expect(generateHotelImageArray({})).toEqual([]);
      expect(generateHotelImageArray(null)).toEqual([]);
      expect(generateHotelImageArray({ image_details: {} })).toEqual([]);
    })
  })
})
