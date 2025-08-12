'use client';

import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const ReturnForm = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  // This effect now handles polling for the payment status
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');
    const bookingId = urlParams.get('booking_id'); // Get bookingId from the URL

    if (!sessionId || !bookingId) {
      setStatus('error'); // Set an error state if info is missing
      return;
    }

    // Start polling the status every 2 seconds
    const intervalId = setInterval(() => {
      fetch(`http://localhost:3000/api/stripe/session-status?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          // Only update state if the status has changed
          if (data.status !== status) {
            setStatus(data.status);
            setCustomerEmail(data.customer_email);
          }

          // If the payment is complete, stop polling and finalize the booking
          if (data.status === 'complete') {
            clearInterval(intervalId);

            // Call your backend to update the database
            fetch('http://localhost:3000/api/bookings/confirm-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ bookingId: bookingId, stripeSessionId: sessionId })
            });
          }
        });
    }, 2000); // Poll every 2 seconds

    // Cleanup function to stop polling if the component unmounts
    return () => clearInterval(intervalId);
  }, [status, navigate]); // Rerun if status changes to handle the 'complete' state

  // This effect handles the countdown and redirect, just like before
  useEffect(() => {
    if (status === 'complete') {
      const countdownInterval = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);

      const redirectTimeout = setTimeout(() => {
        navigate('/'); // Redirect to the homepage
      }, 10000);

      return () => {
        clearInterval(countdownInterval);
        clearTimeout(redirectTimeout);
      };
    }
  }, [status, navigate]);

  // --- Your existing JSX for rendering different states ---

  if (status === 'open') {
    return <h2>Processing payment... Please wait.</h2>;
  }

  if (status === 'complete') {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to {customerEmail}.
        </p>
        <p>
          If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
        <hr style={{ margin: '20px 0' }} />
        <p>
          You will be redirected to the homepage in **{countdown}** seconds.
        </p>
      </section>
    );
  }

  if (status === 'error') {
    return <h2>Error: Could not find payment details.</h2>;
  }

  return <h2>Loading payment details...</h2>;
}

export default ReturnForm;