"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import api from "@/utils/api";
import Link from "next/link";

export default function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    brand: "",
    type: "",
    available: "true",
    page: 1,
    limit: 9,
    sortBy: "rentalPricePerDay:asc",
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/cars", { params: filters });
        setCars(data.cars);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Available Cars</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by brand"
            value={filters.brand}
            onChange={(e) => handleFilterChange("brand", e.target.value)}
          />

          {/* <Select onValueChange={(value) => handleFilterChange("type", value)} defaultValue="">
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="coupe">Coupe</SelectItem>
            </SelectContent>
          </Select> */}

          <Select onValueChange={(value) => handleFilterChange("available", value)} defaultValue="true">
            <SelectTrigger>
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Available</SelectItem>
              <SelectItem value="false">Rented</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white h-60 animate-pulse rounded-xl shadow-md"
              ></div>
            ))
          ) : (
            cars.map((car) => (
              <div key={car._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <img
                  src={car.imageUrl || "/car-placeholder.png"}
                  alt={car.model}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">
                    {car.brand} {car.model}
                  </h2>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">
                      ${car.rentalPricePerDay}/day
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        car.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {car.available ? "Available" : "Rented"}
                    </span>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/cars/${car._id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={filters.page === i + 1 ? "default" : "outline"}
                onClick={() => handleFilterChange("page", i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
