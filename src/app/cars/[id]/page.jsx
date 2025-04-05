"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, Fuel, Users, ArrowLeft } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import api from "@/utils/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CarDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchCar = async () => {
      try {
        const { data } = await api.get(`/cars/${id}`);
        setCar(data);
      } catch (error) {
        console.error("Error fetching car:", error);
      }
    };

    fetchCar();
  }, [id]);

  useEffect(() => {
    if (car) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      setTotalCost(diffDays * car.rentalPricePerDay);
    }
  }, [startDate, endDate, car]);

  const handleRent = async () => {
    try {
      await api.post(`/cars/${id}/rent`, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      alert("Car rented successfully!");
      router.push("/");
    } catch (error) {
      alert(error.response?.data?.message || "Error renting car");
    }
  };

  if (!car) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2" /> Back to cars
          </Link>
        </Button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={car.imageUrl || "/placeholder.svg"}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>

            <div className="p-6 md:w-1/2">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold">
                    {car.brand} {car.model}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="capitalize">
                      {car.type}
                    </Badge>
                    <Badge
                      variant={car.available ? "success" : "destructive"}
                      className="font-medium"
                    >
                      {car.available ? "Available" : "Rented"}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">${car.rentalPricePerDay}</p>
                  <p className="text-sm text-muted-foreground">per day</p>
                </div>
              </div>

              {car.description && (
                <p className="text-gray-600 mb-6">{car.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                {car.year && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Year</p>
                      <p className="text-sm text-muted-foreground">{car.year}</p>
                    </div>
                  </div>
                )}

                {car.transmission && (
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium">Transmission</p>
                      <p className="text-sm text-muted-foreground">
                        {car.transmission}
                      </p>
                    </div>
                  </div>
                )}

                {car.fuelType && (
                  <div className="flex items-center gap-2">
                    <Fuel className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Fuel Type</p>
                      <p className="text-sm text-muted-foreground">
                        {car.fuelType}
                      </p>
                    </div>
                  </div>
                )}

                {car.seats && (
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Seats</p>
                      <p className="text-sm text-muted-foreground">{car.seats}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4 space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Pick-up Date</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    minDate={new Date()}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Return Date</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    minDate={startDate}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="text-xl font-bold">
                  Total Cost: ${totalCost}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleRent}
                disabled={!car.available}
              >
                {car.available ? "Rent Now" : "Currently Unavailable"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
