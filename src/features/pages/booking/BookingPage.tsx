/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCurrency = location.state?.currency || 'USD'; // Assuming a default currency, can be dynamic if needed
  const state = location.state || {};

  const [loading, setLoading] = useState(true);

  // Non-editable booking details (from state)
  //const [hotelImage] = useState(state.hotelImage || '');
  const [selectedHotel] = useState(state.hotelName || '');
  const [roomType] = useState(state.roomType || '');
  const [price] = useState(state.price || 0);
  const [startDate] = useState(
    state.startDate ? new Date(state.startDate).toLocaleDateString('en-CA') : ''
  );
  const [endDate] = useState(
    state.endDate ? new Date(state.endDate).toLocaleDateString('en-CA') : ''
  );
  const [numberOfRooms] = useState(state.numberOfRooms || 1);
  const [adults] = useState(state.adults || 0);
  const [children] = useState(state.children || 0);
  
  const [userId, setUserId] = useState<number | null>(null);

  // Editable user info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    fetch('https://api.ascendahotelbackend.com/api/users/session', {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('User not logged in');
        return res.json();
      })
      .then((data) => {
        const user = data.data;
        setUserId(user.id);
        const [first, ...rest] = (user.name || '').split(' ');
        setFirstName(first || '');
        setLastName(rest.join(' ') || '');
        setPhoneNumber(user.phone_number?.toString() || '');
        setEmail(user.email || '');
        setLoading(false);
      })
      .catch((_err) => {
        console.log('Not logged in, redirecting...');
        navigate('/login', { replace: true });
      });
  }, [navigate]);

  const calculateNights = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const validationErrors: string[] = [];
    const nameRegex = /^[A-Za-z]+$/;
    const phoneRegex = /^(?:\+)?(?=(?:.*\d){7,15}$)[\d\s\-()]+$/;
  
    if (!firstName) {
      validationErrors.push('First name is required');
    } else if (!nameRegex.test(firstName)) {
      validationErrors.push('First name must contain only letters');
    }
  
    if (!lastName) {
      validationErrors.push('Last name is required');
    } else if (!nameRegex.test(lastName)) {
      validationErrors.push('Last name must contain only letters');
    }
  
    if (!phoneNumber) {
      validationErrors.push('Phone number is required');
    } else if (!phoneRegex.test(phoneNumber)) {
      validationErrors.push(
        'Phone number must contain only digits and an optional +, and be 7 to 15 digits long'
      );
    }
  
    if (!email) {
      validationErrors.push('Email address is required');
    }
  
    setErrors(validationErrors);
  
    if (validationErrors.length === 0) {
      try {
        const response = await fetch('https://api.ascendahotelbackend.com/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            user_id: userId,
            hotelName: selectedHotel,
            roomType,
            numberOfNights: calculateNights(),
            startDate,
            endDate,
            numAdults: adults,
            numChildren: children,
            price,
            currency: selectedCurrency,
            firstName,
            lastName,
            phoneNumber,
            email,
            specialRequests,
          }),
        });
  
        if (!response.ok) throw new Error('Booking creation failed');
  
        const data = await response.json();
        const bookingId = data.bookingId;
  
        console.log('Booking submitted, navigating to checkout with ID:', bookingId);
        navigate('/checkout', { state: { bookingId } });
      } catch (error) {
        console.error('Error submitting booking:', error);
        alert('There was an error submitting your booking.');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Checking login status...
      </div>
    );
  }

  return (
    <div className="booking-page lg:py-20 md:py-14 py-10 bg-white">
      <div className="container mx-auto px-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row items-start gap-10"
        >
          {/* Sidebar with Booking Info */}
          <div className="w-full lg:w-1/5 lg:max-w-[220px]">
            <h2 className="text-md font-semibold mb-4">Your Selection</h2>
            {/* Small hotel image */}
            {state.hotelImage && (
              <img
                src={state.hotelImage}
                alt="Selected Hotel"
                className="w-full h-auto rounded-md mb-4 shadow-md object-cover"
                style={{ maxHeight: '140px' }}
              />
            )}
            {/* Compact Info List */}
            <dl className="space-y-2 text-sm text-left md:text-center">
              {[
                ['Selected Hotel', selectedHotel],
                ['Room Type', roomType],
                ['Rooms', numberOfRooms],
                ['Nights', calculateNights()],
                ['Start', startDate],
                ['End', endDate],
                ['Adults', adults],
                ['Children', children],
                ['Price', `${selectedCurrency === 'SGD' ? 'S$' : '$'}${price}`],
              ].map(([label, value], i) => (
                <div key={i}>
                  <dt className="font-semibold text-gray-700">{label}</dt>
                  <dd className="text-gray-900">{String(value)}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* User Info Form */}
          <div className="flex-1 max-w-2xl mx-auto w-full">
            <h2 className="text-xl font-semibold mb-6 text-center">Your Details</h2>

            {[
              ['First Name', firstName, setFirstName],
              ['Last Name', lastName, setLastName],
              ['Phone Number', phoneNumber, setPhoneNumber],
              ['Email Address', email, setEmail],
            ].map(([label, value, setter]: any, i) => (
              <div className="mb-5" key={i}>
                <label className="block font-medium mb-1">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  type={label.includes('Email') ? 'email' : 'text'}
                  className="w-full px-4 py-3 rounded-lg bg-[#d1d1d1] text-black"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  required
                />
              </div>
            ))}

            {/* Special Requests */}
            <div className="mb-6">
              <label className="block font-medium mb-1">Special Requests to Hotel</label>
              <textarea
                className="w-full px-4 py-3 rounded-lg bg-[#d1d1d1] text-black"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={4}
              />
            </div>

            {/* Error Messages */}
            {errors.length > 0 && (
              <ul className="text-sm text-red-500 mb-4 list-disc pl-5">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
            >
              Proceed to Checkout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
