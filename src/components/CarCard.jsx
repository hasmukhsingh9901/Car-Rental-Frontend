import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check, XCircleIcon } from "lucide-react";
import Link from "next/link";




const CarCard = ({ car }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={car.imageUrl || '/placeholder.svg'} 
          alt={`${car.brand} ${car.model}`} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge 
          variant={car.available ? "success" : "destructive"} 
          className="absolute top-3 right-3 font-medium"
        >
          {car.available ? "Available" : "Rented"}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">{car.brand} {car.model}</h3>
          <Badge variant="outline" className="capitalize">{car.type}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            {car.available ? 
              <Check className="h-4 w-4 text-green-500" /> : 
              <X className="h-4 w-4 text-red-500" />
            }
            <span className="text-sm text-muted-foreground">
              {car.available ? "Ready to rent" : "Currently rented"}
            </span>
          </div>
          <span className="text-lg font-bold">${car.rentalPricePerDay}<span className="text-sm font-normal text-muted-foreground">/day</span></span>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/cars/${car._id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CarCard;