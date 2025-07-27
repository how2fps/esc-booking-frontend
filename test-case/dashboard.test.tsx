import React from 'react';
import { render, screen } from '@testing-library/react';
import DestinationSearch from '../src/features/pages/destination-search/DestinationSearch'; // adjust the import path accordingly
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from "react-router-dom";

// Optionally, mock imported components if you want to isolate the test
// Or just rely on their output if they render DOM

describe('DestinationSearch', () => {
  it('renders all child components', () => {
    render(    
    <BrowserRouter>
      <DestinationSearch />
    </BrowserRouter>);

    // Check if HeaderOne is rendered
    expect(screen.getByTestId('header')).toBeInTheDocument(); 

    // Check if Slider rendered 
    expect(screen.getByTestId('slider')).toBeInTheDocument();

    // Check if RecommendOne rendered correctly:
    expect(screen.getByText(/PARKROYAL Serviced Suites Singapore/i)).toBeInTheDocument();

    // Check Footer render
    expect(screen.getByTestId('footer')).toBeInTheDocument(); 
  });
});
