import type { HotelType } from '../../type/HotelType'

export default async function fetchHotels(): Promise<HotelType[]> {
  const response = await fetch('/api/hotels?destination_id=RsBU')
  .then(res => res.json())
  .then(data => {
    // Use data as usual
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  // Use .json() and type assertion
  const data = (await response.json()) as HotelType[];
  return data;
}


 fetchHotels()
  .then(hotels => {
    hotels.forEach(hotel => {
      console.log(hotel.id, hotel.name, hotel.address, hotel.rating, hotel.image_details, hotel.description, hotel.categories);
    });
  })
  .catch(error => {
    console.error('Error fetching hotels:', error);
  });
   