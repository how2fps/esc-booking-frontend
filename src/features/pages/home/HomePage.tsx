import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import HeaderOne from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const images = [
  '/images/home/mountainhero.jpg',
  '/images/home/riverhero.jpg',
  '/images/home/sandhero.jpg',
];

const HomePage = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <HeaderOne />
      <div className="relative h-[calc(100vh-160px)] overflow-hidden bg-black">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Slide ${i}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
        ))}

        {/* Overlayed Call-To-Action */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-4">
              <h1 className="text-white font-extrabold text-4xl md:text-5xl drop-shadow-lg">
              Unlock Unique Stays at Exclusive Prices
              </h1>
              <Link href="/dashboard" passHref>
                     <button className="mt-6 px-8 py-3 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition duration-300">
                     Get Started
                     </button>
              </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;