import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import HotelDetailContent from '../src/features/pages/hotel-detail/HotelDetails'

// Helper to wrap component with router
const renderWithRouter = (id = '4qUA') => {
  return render(
    <MemoryRouter initialEntries={[`/hotel/${id}`]}>
      <Routes>
        <Route path="/hotel/:id" element={<HotelDetailContent />} />ca
      </Routes>
    </MemoryRouter>
  )
}

describe('HotelDetailContent', () => {
  test('renders hotel detail if ID exists', () => {
    renderWithRouter('4qUA')
    expect(screen.getByRole('heading', { name: /RedDoorz Plus @ Little India/i })).toBeInTheDocument()
  })

  test('renders fallback if hotel ID is invalid (server down)', () => {
    renderWithRouter('invalid-id')
    expect(screen.getByText(/Hotel not found!/i)).toBeInTheDocument()
    expect(screen.getByText(/Page has failed to load. Please reload the page/i)).toBeInTheDocument()
  })
  test('shows error if main image fails to load', async () => {
    renderWithRouter('4qUA')
    // Simulate image error
    const mainImage = screen.getByAltText('Main Hotel View')
    fireEvent.error(mainImage)
    await waitFor(() => {
      expect(screen.getByText(/Images\/Content has failed to load/i)).toBeInTheDocument()
    })
  })

  test('displays address and map link', () => {
    renderWithRouter('4qUA')
    expect(screen.getByText(/23 Dickson Road/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Show on map/i })).toHaveAttribute('href', expect.stringContaining('maps.google.com'))
  })

  test('toggles hotel description with view more/less', () => {
    renderWithRouter('4qUA')
    const toggle = screen.getByRole('button', { name: /View More/i })
    fireEvent.click(toggle)
    expect(screen.getByRole('button', { name: /Show less/i })).toBeInTheDocument()
  })

  test('guest count updates correctly', async () => {
    renderWithRouter('4qUA')
    // Open guest dropdown (multiple elements, so use getAllByLabelText)
    const guestDropdowns = screen.getAllByLabelText(/Open guest dropdown/i)
    expect(guestDropdowns.length).toBeGreaterThan(0)
    fireEvent.click(guestDropdowns[0])

    // Find plus button by text or aria-label
    let plusButton = screen.queryByText('+')
    if (!plusButton) {
      const plusButtons = screen.queryAllByLabelText(/plus/i)
      plusButton = plusButtons[0]
    }
    expect(plusButton).toBeTruthy()
    fireEvent.click(plusButton)

    await waitFor(() => {
      expect(screen.getByText(/1 adult/i)).toBeInTheDocument()
    })

    // Find minus button by text or aria-label
    let minusButton = screen.queryByText('-')
    if (!minusButton) {
      const minusButtons = screen.queryAllByLabelText(/minus/i)
      minusButton = minusButtons[0]
    }
    expect(minusButton).toBeTruthy()
    fireEvent.click(minusButton)

    await waitFor(() => {
      expect(screen.getByText(/0 adults/i)).toBeInTheDocument()
    })
  })

  test('room count does not go below 1', () => {
    renderWithRouter('4qUA')
    // Try to find minus button for room count
    let minusButton = screen.queryByText('-')
    if (!minusButton) {
      const minusButtons = screen.queryAllByLabelText(/minus/i)
      minusButton = minusButtons[0]
    }
    expect(minusButton).toBeTruthy()
    fireEvent.click(minusButton)
    fireEvent.click(minusButton)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  test('shows total price and service tax', () => {
    renderWithRouter('4qUA')
    const totalBlock = screen.getByText('Total')
    expect(totalBlock.nextSibling?.textContent).toMatch(/^\$\d+\.\d{2}$/)
  })

  test('opens date picker when check-in clicked', () => {
    renderWithRouter('4qUA')
    fireEvent.click(screen.getByText(/Check In/i))
    expect(document.querySelector('.sidebar-date-dropdown')).toBeInTheDocument()
  })
})
