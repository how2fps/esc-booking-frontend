import { render, screen, fireEvent,waitFor, within   } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import  Slider  from '../src/features/components/Slider/Slider';
import { MemoryRouter } from 'react-router-dom';
import userEvent  from '@testing-library/user-event';
import '@testing-library/jest-dom';


describe("SignupForm", () => {
const renderSldier = () =>
    render(
      <MemoryRouter>
        <Slider />
      </MemoryRouter>
    );
    it('renders AsyncPaginate and allows interaction', async() => {

    renderSldier()
    // Query the AsyncPaginate by data-testid

    const asyncSelect =  await screen.findByTestId('async-select');
    expect(asyncSelect).toBeInTheDocument();


    const input = within(asyncSelect).getByRole('combobox');
      // Assert input is indeed in the document
      expect(input).toBeInTheDocument();

      //check if the input is visible
      expect(input).toBeVisible();

    // Simulate typing to trigger async loadOptions
     userEvent.type(input, 'Rome');

    // Wait for option to appear asynchronously
    const option =  await screen.findByText('Rome, Italy');
    expect(option).toBeInTheDocument();

    // Simulate selecting the option
    userEvent.click(option);})


  it('loads next page of options on scroll', async () => {
    renderSldier()
    const asyncSelect =  await screen.findByTestId('async-select');
    expect(asyncSelect).toBeInTheDocument();


    const input = within(asyncSelect).getByRole('combobox');
    userEvent.type(input, 'Rome');
 
    // Wait for the first page options to appear
    expect(await screen.findByText('Rome, Italy')).toBeInTheDocument();
  
    const dropdownMenu = await screen.findByRole('listbox');

    fireEvent.scroll(dropdownMenu, { target: { scrollTop: dropdownMenu.scrollHeight } });
    // Wait for the second page options to appear
    expect(await screen.findByText('Policlinico, Rome, Italy')).toBeInTheDocument();

    // Ensure all 2 options are visible (not duplicated)
    expect(screen.getAllByRole('option').map(el => el.textContent)).toEqual(
      expect.arrayContaining(['Rome, Italy', 'Policlinico, Rome, Italy'])
    );
  });

  it('ends when no more item available ', async () => {
    renderSldier()
    const asyncSelect =  await screen.findByTestId('async-select');
    expect(asyncSelect).toBeInTheDocument();


    const input = within(asyncSelect).getByRole('combobox');
    userEvent.type(input, 'kiol');
 
    // Wait for the first page options to appear
    expect(await screen.findByText('Park Angiolina, Opatija, Croatia')).toBeInTheDocument();
  
    const dropdownMenu = await screen.findByRole('listbox');
    // Simulate scrolling to bottom to load next page
    fireEvent.scroll(dropdownMenu, { target: { scrollTop: dropdownMenu.scrollHeight } });

    expect(screen.getAllByRole('option').map(el => el.textContent)).toEqual(
      expect.arrayContaining(['Park Angiolina, Opatija, Croatia', 'Bodega Giol, Mendoza, MENDOZA, Argentina'])
    );
  });

it('shows options corresponding only to latest rapid input after debounce', async () => {
  renderSldier()
  const asyncSelect =  await screen.findByTestId('async-select');
  const input = within(asyncSelect).getByRole('combobox');

  // Type 'a' then quickly 'ab', then 'abc' rapidly, all within less than debounce timeout
  await userEvent.type(input, 'a', { delay: 10 });
  await userEvent.type(input, 'b', { delay: 10 }); // input is now 'ab'
  await userEvent.type(input, 'c', { delay: 10 }); // input is now 'abc'
  await userEvent.type(input, 'd', { delay: 10 }); // input is now 'abcd'  

  await waitFor(
    async () => {
      // The options for 'abcd' should be rendered, NOT options for 'abc'
      expect(screen.getByText('Autodromo Miguel E. Abed, Puebla, PUEBLA, Mexico')).toBeInTheDocument();

      // Should NOT find options from previous inputs
      expect(screen.queryByText('Abcoude, Netherlands')).not.toBeInTheDocument();
      expect(screen.queryByText('ABC Stadium, Foz Do Iguacu')).not.toBeInTheDocument();
    },
    { timeout: 100 }
  );
});




  it('shows correct date range in input', () => {
    renderSldier()
    const dateInput = screen.getByPlaceholderText('Add Dates');
    expect(dateInput).toBeInTheDocument();

    const today = new Date();
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);

    const expectedValue = `${today.toLocaleDateString()} - ${sevenDaysLater.toLocaleDateString()}`;
    expect(dateInput).toHaveValue(expectedValue);
  });

  it('increments and decrements guest counts', async () => {
    renderSldier()
    const guestInput = screen.getByPlaceholderText('Add Guest');
    expect(guestInput).toBeInTheDocument();

    // Open guest menu
    fireEvent.click(guestInput);

    // Find and click "Adults" plus button
    const adultsSection = screen.getByText('Adults').closest('.item');
    if (!adultsSection) {
      throw new Error('Adults section not found');
    }
    const plusButton = adultsSection.querySelector('.plus');
    if (!plusButton) {
      throw new Error('Plus button not found in adults section');
    }
    fireEvent.click(plusButton);
    fireEvent.click(plusButton);
    await waitFor(() => {
      expect(guestInput).toHaveValue('2 adults');
    });

    // Find and click "Adults" minus button
    const minusButton = adultsSection.querySelector('.minus');
    if (!minusButton) {
      throw new Error('Minus button not found in adults section');
    }
    fireEvent.click(minusButton);

    await waitFor(() => {
      expect(guestInput).toHaveValue('1 adult');
    });
    const childSection = screen.getByText('Children').closest('.item');
    if (!childSection) {
      throw new Error('Child section not found');
    }
    // Find and click "Child" plus button
    const CplusButton = childSection.querySelector('.plus');
    if (!CplusButton) {
      throw new Error('Child Minus button not found in adults section');
    }
    fireEvent.click(CplusButton);
    await waitFor(() => {
      expect(guestInput).toHaveValue('1 adult, 1 children');
    });

});

  // Add similar tests for children and room if needed

})