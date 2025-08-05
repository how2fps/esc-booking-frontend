'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';

const BookingPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedHotel] = useState('Grand Hotel');
  const [roomType] = useState('Double Room');
  const [adults] = useState(2);
  const [children] = useState(0);
  const [startDate] = useState('2023-12-01');
  const [endDate] = useState('2023-12-05');
  const [price] = useState(500);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const calculateNights = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors: string[] = [];
    if (!firstName) validationErrors.push('First name is required');
    if (!lastName) validationErrors.push('Last name is required');
    if (!phoneNumber) validationErrors.push('Phone number is required');
    if (!email) validationErrors.push('Email address is required');

    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      const payload = {
        hotelName: selectedHotel,
        roomType,
        numberOfNights: calculateNights(),
        startDate,
        endDate,
        numAdults: adults,
        numChildren: children,
        price,
        firstName,
        lastName,
        phoneNumber,
        email,
        specialRequests,
      };
      

      fetch('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(async (res) => {
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Booking failed');
          }
          return res.json();
        })
        .then((data) => {
          alert('Booking submitted successfully!');
          navigate('/checkout');
        })
        .catch((err) => {
          console.error(err);
          alert('Something went wrong while booking.');
        });
    }
  };

  return (
    <>
      <div className="booking-page lg:py-20 md:py-14 py-10 bg-white">
        <div className="container mx-auto px-4">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col lg:flex-row items-start gap-10"
          >
            <div className="w-full lg:w-1/5 max-w-[220px]">
              <h2 className="text-md font-semibold mb-4">Your Selection</h2>
              {[
                ['Selected Hotel', selectedHotel],
                ['Room Type', roomType],
                ['Number of Nights', calculateNights()],
                ['Start Date', startDate],
                ['End Date', endDate],
                ['Adults', adults],
                ['Children', children],
                ['Price', `$${price}`],
              ].map(([label, value], i) => (
                <div className="mb-4" key={i}>
                  <label className="block text-sm font-medium text-gray-600">{label}</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 mt-1 rounded-md bg-white text-black text-sm text-center"
                    value={value as string | number}
                    readOnly
                  />
                </div>
              ))}
            </div>

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

              <div className="mb-6">
                <label className="block font-medium mb-1">Special Requests to Hotel</label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg bg-[#d1d1d1] text-black"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={4}
                />
              </div>

              {errors.length > 0 && (
                <ul className="text-sm text-red-500 mb-4 list-disc pl-5">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}

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
      <Footer />
    </>
  );
};

export default BookingPage;
