import { render, screen, fireEvent,waitFor  } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import  SliderOne  from '../src/features/components/Slider/Slider';
import { MemoryRouter } from 'react-router-dom';
import userEvent  from '@testing-library/user-event';
// Mock react-select/async for predictable testing
// Example mock for AsyncSelect in your test
vi.mock('react-select/async', () => ({
  __esModule: true,
  default: ({ onChange, value, ...props }) => (
    <input
      data-testid="async-select"
      value={value?.label || ''}
      onChange={e => {
        // Simulate selecting "Italy" with its real ID
        if (e.target.value === 'Italy') {
          onChange({ value: 'A6Dz', label: 'Italy' });
        } else {
          onChange({ value: e.target.value, label: e.target.value });
        }
      }}
      {...props}
    />
  ),
}));


describe('SliderOne Component', () => {
  it('updates location via AsyncSelect', async () => {
    render(
      <MemoryRouter>
        <SliderOne />
      </MemoryRouter>
    );
    const asyncSelect = screen.getByTestId('async-select');
    expect(asyncSelect).toBeInTheDocument();

    await userEvent.type(asyncSelect, 'Italy');
    // Simulate the change event
    fireEvent.change(asyncSelect, { target: { value: 'Italy' } });
    fireEvent.keyDown(asyncSelect, { key: 'Enter', code: 'Enter', keyCode: 13 });

    // Optionally, check the "Selected" text updates
    expect(screen.getByTestId('uid')).toHaveTextContent('Selected: A6Dz');
  });

  it('shows correct date range in input', () => {
    render(
      <MemoryRouter>
        <SliderOne />
      </MemoryRouter>
    );
    const dateInput = screen.getByPlaceholderText('Add Dates');
    expect(dateInput).toBeInTheDocument();

    const today = new Date();
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);

    const expectedValue = `${today.toLocaleDateString()} - ${sevenDaysLater.toLocaleDateString()}`;
    expect(dateInput).toHaveValue(expectedValue);
  });

  it('increments and decrements guest counts', async () => {
    render(
      <MemoryRouter>
        <SliderOne />
      </MemoryRouter>
    );
    const guestInput = screen.getByPlaceholderText('Add Guest');
    expect(guestInput).toBeInTheDocument();

    // Open guest menu
    fireEvent.click(guestInput);

    // Find and click "Adults" plus button
    const adultsSection = screen.getByText('Adults').closest('.item');
    const plusButton = adultsSection.querySelector('.plus');
    fireEvent.click(plusButton);
    fireEvent.click(plusButton);
    await waitFor(() => {
      expect(guestInput.value).toContain('2 adults');
    });

    // Find and click "Adults" minus button
    const minusButton = adultsSection.querySelector('.minus');
    fireEvent.click(minusButton);

    await waitFor(() => {
      expect(guestInput.value).toBe('1 adult');
    });
    const childSection = screen.getByText('Children').closest('.item');
    const CplusButton = childSection.querySelector('.plus');
    fireEvent.click(CplusButton);
    await waitFor(() => {
      expect(guestInput.value).toContain('1 adult, 1 children');
    });

});

  // Add similar tests for children and room if needed
});
