"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";



const CarFilters = ({ onFilterChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label htmlFor="brand">Brand</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="brand"
            placeholder="Search by brand"
            className="pl-10"
            onChange={(e) => onFilterChange("brand", e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Vehicle Type</Label>
        <Select onValueChange={(value) => onFilterChange("type", value)}>
          <SelectTrigger id="type">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sedan">Sedan</SelectItem>
            <SelectItem value="suv">SUV</SelectItem>
            <SelectItem value="coupe">Coupe</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="available">Availability</Label>
        <Select 
          defaultValue="true"
          onValueChange={(value) => onFilterChange("available", value)}
        >
          <SelectTrigger id="available">
            <SelectValue placeholder="Available" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Available</SelectItem>
            <SelectItem value="false">Rented</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CarFilters;