import { describe, it, expect } from 'vitest'

// Test utility functions that would be extracted from HotelDetails
describe('Date Utility Functions', () => {
  // Test the formatDate function that's inline in HotelDetails
  const formatDate = (dateString: string): string => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return '';
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  describe('formatDate function', () => {
    it('returns the same string if already in YYYY-MM-DD format', () => {
      expect(formatDate('2023-12-25')).toBe('2023-12-25')
      expect(formatDate('2024-01-01')).toBe('2024-01-01')
    })

    it('formats valid date strings to YYYY-MM-DD', () => {
      expect(formatDate('December 25, 2023')).toBe('2023-12-25')
      expect(formatDate('2023/12/25')).toBe('2023-12-25')
      expect(formatDate('12-25-2023')).toBe('2023-12-25')
    })

    it('handles ISO date strings', () => {
      expect(formatDate('2023-12-25T10:30:00Z')).toBe('2023-12-25')
      expect(formatDate('2023-12-25T00:00:00.000Z')).toBe('2023-12-25')
    })

    it('returns empty string for invalid dates', () => {
      expect(formatDate('invalid-date')).toBe('') // Completely invalid string
      expect(formatDate('')).toBe('') // Empty string
      expect(formatDate('not-a-date')).toBe('') // Non-date string
      expect(formatDate('2023/13/45')).toBe('') // Invalid date format that gets rejected by Date constructor
    })

    it('handles edge cases', () => {
      expect(formatDate('2023-02-28')).toBe('2023-02-28') // Valid date in YYYY-MM-DD format
      expect(formatDate('2024-02-29')).toBe('2024-02-29') // Valid leap year date in YYYY-MM-DD format
      expect(formatDate('2023-12-31')).toBe('2023-12-31') // End of year date
      expect(formatDate('2024-01-01')).toBe('2024-01-01') // Start of year date
    })
  })

  describe('Date validation utilities', () => {
    const isValidDateString = (dateString: string): boolean => {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    }

    it('validates date strings correctly', () => {
      expect(isValidDateString('2023-12-25')).toBe(true)
      expect(isValidDateString('December 25, 2023')).toBe(true)
      expect(isValidDateString('invalid-date')).toBe(false)
      expect(isValidDateString('')).toBe(false)
    })
  })
})
