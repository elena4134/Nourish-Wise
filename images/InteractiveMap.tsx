import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Users, Globe, Landmark } from 'lucide-react';
import worldMapSvg from '@worldmap.svg';

interface CountryInfo {
  id: string;
  name: string;
  population: string;
  hungerLevel: 'Critical' | 'Serious' | 'Moderate' | 'Low';
  undernourished: string;
  stunting: string;
  wasting: string;
  foodInsecurity: string;
  description: string;
  position: { x: number; y: number };
}

const countries: CountryInfo[] = [
  {
    id: 'somalia',
    name: 'Somalia',
    population: '17.6 million',
    hungerLevel: 'Critical',
    undernourished: '60%',
    stunting: '25%',
    wasting: '15%',
    foodInsecurity: '3.5 million people',
    description: 'Faces severe food crisis due to prolonged droughts, conflict, and climate change impacts affecting agricultural production.',
    position: { x: 60, y: 50 }
  },
  {
    id: 'yemen',
    name: 'Yemen',
    population: '32.9 million',
    hungerLevel: 'Critical',
    undernourished: '45%',
    stunting: '46%',
    wasting: '16%',
    foodInsecurity: '17.4 million people',
    description: 'Experiencing one of the world\'s worst humanitarian crises with widespread acute malnutrition and food insecurity.',
    position: { x: 58, y: 45 }
  },
  {
    id: 'sudan',
    name: 'Sudan',
    population: '45.7 million',
    hungerLevel: 'Serious',
    undernourished: '25%',
    stunting: '38%',
    wasting: '16%',
    foodInsecurity: '9.6 million people',
    description: 'Faces ongoing food security challenges due to economic instability, conflict, and climate-related shocks.',
    position: { x: 55, y: 43 }
  },
  {
    id: 'madagascar',
    name: 'Madagascar',
    population: '29.6 million',
    hungerLevel: 'Serious',
    undernourished: '44%',
    stunting: '42%',
    wasting: '7%',
    foodInsecurity: '1.3 million people',
    description: 'Struggles with chronic malnutrition and food insecurity, particularly in the southern regions affected by drought.',
    position: { x: 62, y: 75 }
  },
  {
    id: 'afghanistan',
    name: 'Afghanistan',
    population: '40.7 million',
    hungerLevel: 'Critical',
    undernourished: '30%',
    stunting: '38%',
    wasting: '9%',
    foodInsecurity: '22.8 million people',
    description: 'Faces acute food crisis with millions requiring urgent humanitarian assistance due to economic collapse and drought.',
    position: { x: 70, y: 35 }
  },
  {
    id: 'haiti',
    name: 'Haiti',
    population: '11.7 million',
    hungerLevel: 'Serious',
    undernourished: '47%',
    stunting: '22%',
    wasting: '5%',
    foodInsecurity: '4.9 million people',
    description: 'Experiencing severe food insecurity due to political instability, natural disasters, and economic challenges.',
    position: { x: 22, y: 42 }
  }
];

const InteractiveMap = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);

  return (
    <div className="relative w-full h-screen bg-gradient-map overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">World Explorer</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            Click on highlighted countries to explore
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full max-w-6xl">
          <img 
            src={worldMapSvg} 
            alt="World Map" 
            className="w-full h-full object-contain"
          />
          
          {/* Country Markers */}
          {countries.map((country) => (
            <button
              key={country.id}
              onClick={() => setSelectedCountry(country)}
              className="absolute w-6 h-6 bg-map-marker hover:bg-map-marker-hover rounded-full border-2 border-background shadow-marker cursor-pointer transition-all duration-300 hover:scale-110 animate-pulse-marker flex items-center justify-center group"
              style={{
                left: `${country.position.x}%`,
                top: `${country.position.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="w-2 h-2 bg-background rounded-full"></div>
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-card/95 backdrop-blur-sm border border-border rounded px-2 py-1 text-xs text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {country.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Country Info Panel */}
      {selectedCountry && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-96 animate-fade-in-up">
          <Card className="shadow-card-custom border-border bg-card/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-8 rounded-sm flex items-center justify-center ${
                  selectedCountry.hungerLevel === 'Critical' ? 'bg-red-500' :
                  selectedCountry.hungerLevel === 'Serious' ? 'bg-orange-500' :
                  selectedCountry.hungerLevel === 'Moderate' ? 'bg-yellow-500' : 'bg-green-500'
                }`}>
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{selectedCountry.name}</h3>
                  <p className="text-sm text-muted-foreground">Hunger Level: {selectedCountry.hungerLevel}</p>
                </div>
              </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCountry(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedCountry.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">Population</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{selectedCountry.population}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-red-500" />
                      <span className="text-xs font-medium text-muted-foreground">Food Insecurity</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{selectedCountry.foodInsecurity}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-muted-foreground">Undernourished</span>
                      <p className="text-sm font-semibold text-red-600">{selectedCountry.undernourished}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-muted-foreground">Stunting</span>
                      <p className="text-sm font-semibold text-orange-600">{selectedCountry.stunting}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-muted-foreground">Wasting</span>
                      <p className="text-sm font-semibold text-yellow-600">{selectedCountry.wasting}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-20">
        <Card className="shadow-card-custom border-border bg-card/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-map-marker rounded-full animate-pulse-marker"></div>
              <span className="text-sm text-muted-foreground">Click countries to explore</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InteractiveMap;