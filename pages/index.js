import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

const isValidUrl = (urlString) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

export default function Home({ serverCars }) {
  const [filteredCars, setFilteredCars] = useState(serverCars)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMake, setSelectedMake] = useState("")
  const [sortOption, setSortOption] = useState("")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  
  const carsPerPage = 8

  useEffect(() => {
    let result = serverCars ? [...serverCars] : [];
    
    if (searchTerm) {
      result = result.filter(car => 
        `${car.make} ${car.model} ${car.year}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

  
    if (selectedMake) {
      result = result.filter(car => car.make === selectedMake);
    }

  
    if (priceRange.min) {
      result = result.filter(car => car.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      result = result.filter(car => car.price <= Number(priceRange.max));
    }


    if (sortOption) {
      result = [...result].sort((a, b) => {
        switch (sortOption) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'year-desc':
            return b.year - a.year;
          case 'year-asc':
            return a.year - b.year;
          default:
            return 0;
        }
      });
    }

    setFilteredCars(result);
    setCurrentPage(1);
  }, [searchTerm, selectedMake, sortOption, priceRange, serverCars]);


  const uniqueMakes = [...new Set(serverCars ? serverCars.map(car => car.make) : [])];

  
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars ? filteredCars.slice(indexOfFirstCar, indexOfLastCar) : [];
  const totalPages = Math.ceil(filteredCars ? filteredCars.length / carsPerPage : 0);

  return (
    <div>
      <header className="header">
        <h1>Car Listing App</h1>
      </header>
      <main className="container">
        <div className="search-filters">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search by make, model, or year"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-options">
            <select 
              value={selectedMake} 
              onChange={(e) => setSelectedMake(e.target.value)}
            >
              <option value="">All Makes</option>
              {uniqueMakes.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>

            <div className="price-range">
              <input
                type="number"
                placeholder="Min Price"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              />
              <input
                type="number"
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              />
            </div>

            <select 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="year-desc">Year: Newest</option>
              <option value="year-asc">Year: Oldest</option>
            </select>
          </div>
        </div>

        <div className="car-list">
          {currentCars.map((car) => (
            <Link href={`/car/${car.id}`} key={car.id}>
              <div className="car-card">
                <div className="car-image">
                  <img src={car.image[0]} alt={`${car.make} ${car.model}`} />
                  <div className="car-badge">{car.year}</div>
                </div>
                <div className="car-card-content">
                  <h3>{`${car.make} ${car.model}`}</h3>
                  <p className="car-price">${car.price.toLocaleString('en-US')}</p>
                  <div className="car-specs">
                    <span>{car.mileage.toLocaleString()} mi</span>
                    <span>{car.transmission}</span>
                    <span>{car.fuelType}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>{currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export async function getServerSideProps() {
  try {
    const response = await fetch('https://arpitjoshi.github.io/8e4474f3-d675-44c2-ba12-ccfacfa97c8b.json');
    const data = await response.json();
    
    return {
      props: {
        serverCars: data,
      },
    }
  } catch (error) {
    console.error("Error fetching cars:", error);
    return {
      props: {
        serverCars: [],
      }
    }
  }
}

