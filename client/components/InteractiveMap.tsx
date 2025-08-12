import React, { useState } from 'react';
import { MapPin, TrendingUp, Users, DollarSign, BarChart3, Info } from 'lucide-react';

const InteractiveMap = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const countries = {
    mali: {
      name: 'Mali',
      gdp: '17.5B $',
      population: '21.9M',
      growth: '+5.1%',
      capital: 'Bamako',
      color: '#E5DDD5',
      hoverColor: '#D4C7BC',
      position: { x: 45, y: 35 },
      industries: ['Or', 'Coton', 'Agriculture']
    },
    senegal: {
      name: 'Sénégal',
      gdp: '27.7B $',
      population: '17.2M',
      growth: '+6.2%',
      capital: 'Dakar',
      color: '#C5B8AB',
      hoverColor: '#B5A79A',
      position: { x: 25, y: 45 },
      industries: ['Phosphates', 'Pêche', 'Tourisme']
    },
    burkina: {
      name: 'Burkina Faso',
      gdp: '18.9B $',
      population: '22.7M',
      growth: '+4.8%',
      capital: 'Ouagadougou',
      color: '#A69B8E',
      hoverColor: '#968B7E',
      position: { x: 55, y: 42 },
      industries: ['Or', 'Coton', 'Élevage']
    },
    cote: {
      name: 'Côte d\'Ivoire',
      gdp: '71.0B $',
      population: '28.2M',
      growth: '+7.4%',
      capital: 'Abidjan',
      color: '#8B7F72',
      hoverColor: '#7B6F62',
      position: { x: 40, y: 55 },
      industries: ['Cacao', 'Café', 'Pétrole']
    },
    ghana: {
      name: 'Ghana',
      gdp: '75.5B $',
      population: '32.8M',
      growth: '+5.7%',
      capital: 'Accra',
      color: '#6F6356',
      hoverColor: '#5F5346',
      position: { x: 55, y: 58 },
      industries: ['Or', 'Cacao', 'Pétrole']
    }
  };

  const getCountryData = (countryKey: string) => countries[countryKey as keyof typeof countries];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Interactive Map */}
        <div className="relative">
          <h3 className="text-2xl font-bold text-[#373B3A] mb-6 text-center">
            Économie de l'Afrique de l'Ouest
          </h3>
          
          {/* SVG Map Container */}
          <div className="relative bg-white rounded-2xl p-8 shadow-lg">
            <svg viewBox="0 0 100 100" className="w-full h-80">
              {/* Background gradient */}
              <defs>
                <radialGradient id="oceanGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#E0F2FE" />
                  <stop offset="100%" stopColor="#BAE6FD" />
                </radialGradient>
              </defs>
              <rect width="100" height="100" fill="url(#oceanGradient)" rx="8" />
              
              {/* Ocean waves effect */}
              <path
                d="M0,80 Q25,75 50,80 T100,80 L100,100 L0,100 Z"
                fill="#7DD3FC"
                opacity="0.3"
              />
              <path
                d="M0,85 Q25,82 50,85 T100,85 L100,100 L0,100 Z"
                fill="#38BDF8"
                opacity="0.2"
              />

              {/* Countries */}
              {Object.entries(countries).map(([key, country]) => (
                <g key={key}>
                  {/* Country circle */}
                  <circle
                    cx={country.position.x}
                    cy={country.position.y}
                    r={hoveredCountry === key ? "8" : "6"}
                    fill={hoveredCountry === key ? country.hoverColor : country.color}
                    stroke="#373B3A"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-300 drop-shadow-lg"
                    onMouseEnter={() => setHoveredCountry(key)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    onClick={() => setSelectedCountry(key)}
                  />
                  
                  {/* Country pulse animation */}
                  {hoveredCountry === key && (
                    <circle
                      cx={country.position.x}
                      cy={country.position.y}
                      r="12"
                      fill="none"
                      stroke={country.color}
                      strokeWidth="2"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}
                  
                  {/* Country label */}
                  <text
                    x={country.position.x}
                    y={country.position.y - 12}
                    textAnchor="middle"
                    className="text-xs font-semibold fill-[#373B3A]"
                    style={{ fontSize: '3px' }}
                  >
                    {country.name}
                  </text>
                  
                  {/* Capital city */}
                  <text
                    x={country.position.x}
                    y={country.position.y + 20}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                    style={{ fontSize: '2.5px' }}
                  >
                    {country.capital}
                  </text>
                </g>
              ))}

              {/* Legend */}
              <g transform="translate(5, 5)">
                <rect x="0" y="0" width="25" height="15" fill="white" opacity="0.9" rx="2" />
                <circle cx="3" cy="3" r="1.5" fill="#E5DDD5" />
                <text x="6" y="4.5" className="text-xs fill-gray-700" style={{ fontSize: '2px' }}>
                  Pays membre
                </text>
                <circle cx="3" cy="7" r="1" fill="#7DD3FC" />
                <text x="6" y="8.5" className="text-xs fill-gray-700" style={{ fontSize: '2px' }}>
                  Océan Atlantique
                </text>
              </g>
            </svg>
          </div>

          {/* Interactive indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {Object.keys(countries).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedCountry(key)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  selectedCountry === key 
                    ? 'bg-[#373B3A] scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Country Details */}
        <div className="space-y-6">
          {selectedCountry ? (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getCountryData(selectedCountry).color }}
                />
                <h4 className="text-2xl font-bold text-[#373B3A]">
                  {getCountryData(selectedCountry).name}
                </h4>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">PIB</p>
                      <p className="font-bold text-lg">{getCountryData(selectedCountry).gdp}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Population</p>
                      <p className="font-bold text-lg">{getCountryData(selectedCountry).population}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Croissance</p>
                      <p className="font-bold text-lg text-green-600">{getCountryData(selectedCountry).growth}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-600">Capitale</p>
                      <p className="font-bold text-lg">{getCountryData(selectedCountry).capital}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-3">Secteurs clés</p>
                <div className="flex flex-wrap gap-2">
                  {getCountryData(selectedCountry).industries.map((industry, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-[#E5DDD5] text-[#373B3A] rounded-full text-sm font-medium"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-600 mb-2">
                Explorez les économies
              </h4>
              <p className="text-gray-500">
                Cliquez sur un pays de la carte pour découvrir ses indicateurs économiques clés
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold">PIB Total</p>
                  <p className="text-lg font-bold text-[#373B3A]">211B $</p>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold">Population</p>
                  <p className="text-lg font-bold text-[#373B3A]">122M</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
