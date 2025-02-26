import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export default function CarDetails({ car }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!car) {
    return <div>Car not found</div>
  }

  return (
    <div className="container">
      <Link href="/" className="back-button">
        👈🏿Back to Home
      </Link>
      <div className="car-details">
        <h2>{`${car.make} ${car.model} (${car.year})`}</h2>
        <div className="car-details-content">
          <div className="car-details-carousel">
            <div className="carousel-container">
              <button onClick={() => setCurrentImageIndex(prev => prev === 0 ? car.image.length - 1 : prev - 1)} className="carousel-button prev">
                &#8249;
              </button>
              <img src={car.image[currentImageIndex]} alt={`${car.make} ${car.model}`} />
              <button onClick={() => setCurrentImageIndex(prev => prev === car.image.length - 1 ? 0 : prev + 1)} className="carousel-button next">
                &#8250;
              </button>
            </div>
            <div className="carousel-thumbnails">
              {car.image.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img src={img} alt={`${car.make} ${car.model} - Thumbnail ${index + 1}`} width={80} height={60} />
                </div>
              ))}
            </div>
          </div>
          <div className="car-details-info">
            <p className="price">Price: ${car.price.toLocaleString()}</p>
            <h3>Specifications:</h3>
            <ul className="specifications">
              <li><strong>Make:</strong> {car.make}</li>
              <li><strong>Model:</strong> {car.model}</li>
              <li><strong>Year:</strong> {car.year}</li>
              <li><strong>Color:</strong> {car.color}</li>
              <li><strong>Mileage:</strong> {car.mileage.toLocaleString()} miles</li>
              <li><strong>Fuel Type:</strong> {car.fuelType}</li>
              <li><strong>Transmission:</strong> {car.transmission}</li>
              <li><strong>Engine:</strong> {car.engine}</li>
              <li><strong>Horsepower:</strong> {car.horsepower} hp</li>
              <li><strong>Previous Owners:</strong> {car.owners}</li>
            </ul>
            <h3>Features:</h3>
            <ul className="specifications">
              {car.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps({ params }) {
  try {
    const response = await fetch('https://arpitjoshi.github.io/8e4474f3-d675-44c2-ba12-ccfacfa97c8b.json');
    const data = await response.json();
    const car = data.find((c) => c.id === Number.parseInt(params.id));

    if (!car) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        car,
      }
    }
  } catch (error) {
    console.error("Error fetching car:", error);
    return {
      notFound: true,
    }
  }
}

