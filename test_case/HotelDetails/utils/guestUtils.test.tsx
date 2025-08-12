import { describe, it, expect } from 'vitest'

// Test guest management utilities
describe('Guest Management Utilities', () => {
  interface GuestType {
    adult: number;
    children: number;
  }

  // Utility functions that would be extracted from HotelDetails
  const increaseGuest = (guest: GuestType, type: keyof GuestType): GuestType => {
    return {
      ...guest,
      [type]: guest[type] + 1
    };
  };

  const decreaseGuest = (guest: GuestType, type: keyof GuestType): GuestType => {
    if (guest[type] > 0) {
      return {
        ...guest,
        [type]: guest[type] - 1
      };
    }
    return guest;
  };

  const calculateTotalGuests = (guest: GuestType): number => {
    return guest.adult + guest.children;
  };

  const validateGuestCount = (guest: GuestType): boolean => {
    return guest.adult >= 0 && guest.children >= 0;
  };

  describe('increaseGuest function', () => {
    it('increases adult count correctly', () => {
      const guest: GuestType = { adult: 2, children: 1 };
      const result = increaseGuest(guest, 'adult');
      expect(result).toEqual({ adult: 3, children: 1 });
    })

    it('increases children count correctly', () => {
      const guest: GuestType = { adult: 2, children: 1 };
      const result = increaseGuest(guest, 'children');
      expect(result).toEqual({ adult: 2, children: 2 });
    })

    it('does not mutate original guest object', () => {
      const guest: GuestType = { adult: 2, children: 1 };
      const result = increaseGuest(guest, 'adult');
      expect(guest).toEqual({ adult: 2, children: 1 }); // Original unchanged
      expect(result).not.toBe(guest); // Different object reference
    })

    it('handles zero values', () => {
      const guest: GuestType = { adult: 0, children: 0 };
      const result = increaseGuest(guest, 'adult');
      expect(result).toEqual({ adult: 1, children: 0 });
    })
  })

  describe('decreaseGuest function', () => {
    it('decreases adult count correctly', () => {
      const guest: GuestType = { adult: 2, children: 1 };
      const result = decreaseGuest(guest, 'adult');
      expect(result).toEqual({ adult: 1, children: 1 });
    })

    it('decreases children count correctly', () => {
      const guest: GuestType = { adult: 2, children: 1 };
      const result = decreaseGuest(guest, 'children');
      expect(result).toEqual({ adult: 2, children: 0 });
    })

    it('does not decrease below zero', () => {
      const guest: GuestType = { adult: 0, children: 0 };
      const result = decreaseGuest(guest, 'adult');
      expect(result).toEqual({ adult: 0, children: 0 });
    })

    it('does not mutate original guest object', () => {
      const guest: GuestType = { adult: 2, children: 1 };
      const result = decreaseGuest(guest, 'adult');
      expect(guest).toEqual({ adult: 2, children: 1 }); // Original unchanged
      expect(result).not.toBe(guest); // Different object reference
    })
  })

  describe('calculateTotalGuests function', () => {
    it('calculates total guests correctly', () => {
      expect(calculateTotalGuests({ adult: 2, children: 1 })).toBe(3);
      expect(calculateTotalGuests({ adult: 1, children: 0 })).toBe(1);
      expect(calculateTotalGuests({ adult: 0, children: 2 })).toBe(2);
      expect(calculateTotalGuests({ adult: 0, children: 0 })).toBe(0);
    })

    it('should handle large numbers', () => {
      expect(calculateTotalGuests({ adult: 100, children: 50 })).toBe(150);
    })
  })

  describe('validateGuestCount function', () => {
    it('validates positive guest counts', () => {
      expect(validateGuestCount({ adult: 2, children: 1 })).toBe(true);
      expect(validateGuestCount({ adult: 0, children: 0 })).toBe(true);
      expect(validateGuestCount({ adult: 1, children: 0 })).toBe(true);
    })

    it('rejects negative guest counts', () => {
      expect(validateGuestCount({ adult: -1, children: 1 })).toBe(false);
      expect(validateGuestCount({ adult: 1, children: -1 })).toBe(false);
      expect(validateGuestCount({ adult: -1, children: -1 })).toBe(false);
    })
  })
})
