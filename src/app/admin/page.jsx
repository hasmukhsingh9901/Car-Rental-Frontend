"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("list");
  const [cars, setCars] = useState([]);
  const [editingCarId, setEditingCarId] = useState(null);
  const router = useRouter();

  const fetchCars = async () => {
    try {
      const res = await api.get("/cars");
      setCars(res.data.cars);
    } catch (err) {
      alert("Failed to fetch cars");
    }
  };

  const deleteCar = async (id) => {
    if (!confirm("Are you sure you want to delete this car?")) return;
    try {
      await api.delete(`/cars/${id}`);
      fetchCars();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: 2025,
    type: "Sedan",
    rentalPricePerDay: 50,
    imageUrl: "",
  });

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      if (editingCarId) {
        // UPDATE
        await api.put(`/cars/${editingCarId}`, formData);
        alert("Car updated successfully!");
      } else {
        // ADD
        await api.post("/cars", formData);
        alert("Car added successfully!");
      }

      // Reset
      setFormData({
        brand: "",
        model: "",
        year: 2025,
        type: "Sedan",
        rentalPricePerDay: 50,
        imageUrl: "",
      });
      setEditingCarId(null);
      setActiveTab("list");
      fetchCars();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving car");
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => {
                setActiveTab("list");
                setEditingCarId(null);
              }}
              className={`w-full text-left p-2 rounded ${
                activeTab === "list" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              Car Listings
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setFormData({
                  brand: "",
                  model: "",
                  year: 2025,
                  type: "Sedan",
                  rentalPricePerDay: 50,
                  imageUrl: "",
                });
                setEditingCarId(null);
                setActiveTab("add");
              }}
              className={`w-full text-left p-2 rounded ${
                activeTab === "add" ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              Add New Car
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        {activeTab === "list" ? (
          <div>
            <h1 className="text-2xl font-bold mb-6">All Cars</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cars.map((car) => (
                <div key={car._id} className="bg-white shadow-md rounded-lg p-4">
                  <img
                    src={car.imageUrl}
                    alt={car.model}
                    className="h-40 w-full object-cover mb-3 rounded"
                  />
                  <h2 className="text-lg font-semibold">
                    {car.brand} - {car.model}
                  </h2>
                  <p>Year: {car.year}</p>
                  <p>Type: {car.type}</p>
                  <p>Price/Day: ${car.rentalPricePerDay}</p>
                  <p>Status: {car.available ? "Available" : "Rented"}</p>
                  <div className="mt-4 flex space-x-2">
                    <button
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                      onClick={() => deleteCar(car._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                      onClick={() => {
                        setFormData({
                          brand: car.brand,
                          model: car.model,
                          year: car.year,
                          type: car.type,
                          rentalPricePerDay: car.rentalPricePerDay,
                          imageUrl: car.imageUrl,
                        });
                        setEditingCarId(car._id);
                        setActiveTab("add");
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">
              {editingCarId ? "Edit Car" : "Add New Car"}
            </h1>
            <form onSubmit={handleAddCar} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Brand</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Model</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Year</label>
                <input
                  type="number"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Type</label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Coupe">Coupe</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Price/Day ($)</label>
                <input
                  type="number"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.rentalPricePerDay}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rentalPricePerDay: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Image URL</label>
                <input
                  type="url"
                  className="w-full p-2 border rounded"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                {editingCarId ? "Update Car" : "Add Car"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
