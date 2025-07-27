import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import HeaderOne from '../../components/Header/Header';

const BookingPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [checkinDate, setCheckinDate] = useState('');
  const [checkoutDate, setCheckoutDate] = useState('');
  const [guests, setGuests] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors: string[] = [];
    if (!name) validationErrors.push('Name is required');
    if (!email) validationErrors.push('Email is required');
    if (!checkinDate) validationErrors.push('Check-in date is required');
    if (!checkoutDate) validationErrors.push('Check-out date is required');
    if (!guests || parseInt(guests) <= 0) validationErrors.push('Number of guests must be greater than 0');

    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      // Navigate to the checkout page if no errors
      navigate('/checkout');
    }
  };

  return (
    <>
      <HeaderOne />
      <div className="booking-page lg:py-20 md:py-14 py-10">
        <div className="container">
          <div className="content flex items-center justify-center">
            <div id="form-booking" className="xl:basis-1/3 lg:basis-1/2 sm:basis-2/3 max-sm:w-full">
              <span className="heading3 text-center">Booking Page</span>
              <form className="md:mt-10 mt-6" onSubmit={handleSubmit}>
                {/* Booking Details */}
                <div className="mb-5">
                  <label htmlFor="name">
                    Name<span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2 text-black bg-[#d1d1d1]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="email">
                    Email address<span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2 text-black bg-[#d1d1d1]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="checkinDate">
                    Check-in Date<span className="text-primary">*</span>
                  </label>
                  <input
                    type="date"
                    id="checkinDate"
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2 text-black bg-[#d1d1d1]"
                    value={checkinDate}
                    onChange={(e) => setCheckinDate(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="checkoutDate">
                    Check-out Date<span className="text-primary">*</span>
                  </label>
                  <input
                    type="date"
                    id="checkoutDate"
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2 text-black bg-[#d1d1d1]"
                    value={checkoutDate}
                    onChange={(e) => setCheckoutDate(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="guests">
                    Number of Guests<span className="text-primary">*</span>
                  </label>
                  <input
                    type="number"
                    id="guests"
                    className="border-line px-4 pt-3 pb-3 w-full rounded-lg mt-2 text-black bg-[#d1d1d1]"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    min="1"
                    required
                  />
                </div>

                {/* Error Messages */}
                {errors.length > 0 && (
                  <ul className="text-sm text-red-500 mt-2 list-disc pl-5">
                    {errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}

                {/* Submit Button */}
                <div className="block-button mt-6">
                  <button
                    type="submit"
                    className="w-full text-center rounded-lg px-4 py-3 font-semibold transition duration-300 button-main"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingPage;