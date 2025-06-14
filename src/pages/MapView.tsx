import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  MapPin, 
  Navigation, 
  Thermometer,
  Clock,
  Star,
  Droplets,
  DollarSign,
  Truck,
  Snowflake,
  RefreshCw,
  Target,
  Phone,
  Info,
  Zap,
  Plus,
  Minus,
  Loader
} from 'lucide-react';

const MapView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedChiller, setSelectedChiller] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapZoom, setMapZoom] = useState(12);
  const [locationError, setLocationError] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Lucknow-specific chiller data with real area coordinates
  const chillers = [
    {
      id: 1,
      name: 'Hazratganj Community Chiller',
      type: 'Fixed',
      owner: 'Ramesh Kumar',
      distance: '1.2 km',
      coordinates: { lat: 26.8467, lng: 80.9462 }, // Hazratganj area
      capacity: '500L',
      available: '350L',
      rate: '₹1.2/L',
      rating: 4.8,
      reviews: 124,
      temperature: '-2°C',
      status: 'Available',
      phone: '+91 98765 43210',
      address: 'Hazratganj Market, Near GPO',
      features: ['24/7 Access', 'Quality Monitoring', 'SMS Alerts'],
      nextAvailable: 'Now',
      area: 'Hazratganj'
    },
    {
      id: 2,
      name: 'Gomti Nagar Mobile Chiller',
      type: 'Mobile',
      owner: 'CoolTruck Services',
      distance: '2.5 km',
      coordinates: { lat: 26.8512, lng: 81.0036 }, // Gomti Nagar
      capacity: '200L',
      available: '200L',
      rate: '₹1.5/L',
      rating: 4.9,
      reviews: 89,
      temperature: '-3°C',
      status: 'En Route',
      phone: '+91 98765 43211',
      address: 'Gomti Nagar Extension, Sector 12',
      features: ['Door-to-Door', 'Rapid Cooling', 'GPS Tracking'],
      nextAvailable: '15 mins',
      area: 'Gomti Nagar'
    },
    {
      id: 3,
      name: 'Aminabad Dairy Cooperative',
      type: 'Fixed',
      owner: 'Milk Cooperative Society',
      distance: '3.8 km',
      coordinates: { lat: 26.8506, lng: 80.9214 }, // Aminabad
      capacity: '800L',
      available: '120L',
      rate: '₹1.0/L',
      rating: 4.7,
      reviews: 256,
      temperature: '-2°C',
      status: 'Limited',
      phone: '+91 98765 43212',
      address: 'Aminabad Market, Main Road',
      features: ['Bulk Capacity', 'Member Discounts', 'Quality Reports'],
      nextAvailable: 'Now',
      area: 'Aminabad'
    },
    {
      id: 4,
      name: 'Alambagh Premium Storage',
      type: 'Fixed',
      owner: 'FreshKeep Solutions',
      distance: '4.2 km',
      coordinates: { lat: 26.8206, lng: 80.8856 }, // Alambagh
      capacity: '1000L',
      available: '750L',
      rate: '₹2.0/L',
      rating: 4.9,
      reviews: 178,
      temperature: '-4°C',
      status: 'Available',
      phone: '+91 98765 43213',
      address: 'Alambagh Bus Station Area',
      features: ['Deep Freeze', 'Premium Service', 'Insurance Coverage'],
      nextAvailable: 'Now',
      area: 'Alambagh'
    },
    {
      id: 5,
      name: 'Charbagh Railway Chiller',
      type: 'Fixed',
      owner: 'Railway Dairy Services',
      distance: '5.1 km',
      coordinates: { lat: 26.8393, lng: 80.9231 }, // Charbagh
      capacity: '300L',
      available: '0L',
      rate: '₹1.3/L',
      rating: 4.6,
      reviews: 92,
      temperature: '-2°C',
      status: 'Full',
      phone: '+91 98765 43214',
      address: 'Charbagh Railway Station Complex',
      features: ['Quick Access', 'Railway Location', 'Transport Hub'],
      nextAvailable: '2 hours',
      area: 'Charbagh'
    },
    {
      id: 6,
      name: 'Indira Nagar Express Chiller',
      type: 'Fixed',
      owner: 'Quick Cool Solutions',
      distance: '3.5 km',
      coordinates: { lat: 26.8769, lng: 80.9739 }, // Indira Nagar
      capacity: '400L',
      available: '280L',
      rate: '₹1.4/L',
      rating: 4.5,
      reviews: 67,
      temperature: '-3°C',
      status: 'Available',
      phone: '+91 98765 43215',
      address: 'Indira Nagar, Faizabad Road',
      features: ['Express Service', 'Quality Assured', 'Digital Monitoring'],
      nextAvailable: 'Now',
      area: 'Indira Nagar'
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Chillers', count: chillers.length },
    { value: 'available', label: 'Available Now', count: chillers.filter(c => c.status === 'Available').length },
    { value: 'mobile', label: 'Mobile Units', count: chillers.filter(c => c.type === 'Mobile').length },
    { value: 'nearby', label: 'Within 3km', count: chillers.filter(c => parseFloat(c.distance) <= 3).length }
  ];

  const filteredChillers = chillers.filter(chiller => {
    const matchesSearch = chiller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chiller.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chiller.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chiller.area.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'available' && chiller.status === 'Available') ||
                         (selectedFilter === 'mobile' && chiller.type === 'Mobile') ||
                         (selectedFilter === 'nearby' && parseFloat(chiller.distance) <= 3);
    
    return matchesSearch && matchesFilter;
  });

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  // Update chiller distances based on user location
  const updateChillerDistances = (userLat, userLng) => {
    return chillers.map(chiller => {
      const distance = calculateDistance(
        userLat, 
        userLng, 
        chiller.coordinates.lat, 
        chiller.coordinates.lng
      );
      return {
        ...chiller,
        distance: `${distance.toFixed(1)} km`,
        actualDistance: distance
      };
    }).sort((a, b) => a.actualDistance - b.actualDistance);
  };

  // Get user's current location
  const getUserLocation = () => {
    setIsGettingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        // Update chiller distances based on actual user location
        const updatedChillers = updateChillerDistances(latitude, longitude);
        
        setIsGettingLocation(false);
        console.log('Location updated:', { latitude, longitude });
        
        // Show success message
        alert(`Location found! Showing chillers near your current position (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
      },
      (error) => {
        let errorMessage = '';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred';
            break;
        }
        setLocationError(errorMessage);
        setIsGettingLocation(false);
        
        // Fallback to Lucknow center
        setUserLocation({ lat: 26.8467, lng: 80.9462 });
        alert(`Could not get your location: ${errorMessage}. Showing default Lucknow location.`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  useEffect(() => {
    // Set default location to Lucknow center
    setUserLocation({ lat: 26.8467, lng: 80.9462 });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Limited': return 'bg-yellow-100 text-yellow-800';
      case 'En Route': return 'bg-blue-100 text-blue-800';
      case 'Full': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBookChiller = (chiller) => {
    console.log('Booking chiller:', chiller);
  };

  const getChillerIcon = (chiller) => {
    if (chiller.type === 'Mobile') {
      return <Truck className="h-4 w-4" />;
    }
    return <Snowflake className="h-4 w-4" />;
  };

  const getChillerColor = (chiller) => {
    if (chiller.status === 'Available') return 'bg-green-500';
    if (chiller.status === 'Limited') return 'bg-yellow-500';
    if (chiller.status === 'En Route') return 'bg-blue-500';
    if (chiller.status === 'Full') return 'bg-red-500';
    return 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
                <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-800" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Chillers in Lucknow</h1>
                <p className="text-sm text-gray-600">{filteredChillers.length} chillers found</p>
              </div>
            </div>
            <button 
              onClick={getUserLocation}
              disabled={isGettingLocation}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGettingLocation ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Target className="h-4 w-4" />
              )}
              <span>{isGettingLocation ? 'Getting Location...' : 'Use My Location'}</span>
            </button>
          </div>
          {locationError && (
            <div className="pb-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{locationError}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Search and Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by area, name, or owner..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center mb-4">
                <Filter className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Filters</h3>
              </div>
              <div className="space-y-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedFilter(option.value)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      selectedFilter === option.value
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span>{option.label}</span>
                    <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {option.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lucknow Areas */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Popular Areas</h3>
              <div className="space-y-2">
                {['Hazratganj', 'Gomti Nagar', 'Aminabad', 'Alambagh', 'Indira Nagar', 'Charbagh'].map((area) => (
                  <button
                    key={area}
                    onClick={() => setSearchQuery(area)}
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-50 text-sm text-gray-600 hover:text-gray-800"
                  >
                    📍 {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Available Now:</span>
                  <span className="font-medium text-green-600">
                    {chillers.filter(c => c.status === 'Available').length} units
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Rate:</span>
                  <span className="font-medium">₹1.4/L</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Capacity:</span>
                  <span className="font-medium">3.2K L</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map and Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interactive Lucknow Map */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-80 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 relative">
                {/* Lucknow Map Background */}
                <div className="absolute inset-0 opacity-20">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    {/* Gomti River representation */}
                    <path
                      d="M50 150 Q150 120 250 140 Q300 150 350 160"
                      stroke="#3B82F6"
                      strokeWidth="3"
                      fill="none"
                      opacity="0.6"
                    />
                    {/* Major roads */}
                    <line x1="0" y1="150" x2="400" y2="150" stroke="#6B7280" strokeWidth="2" opacity="0.4" />
                    <line x1="200" y1="0" x2="200" y2="300" stroke="#6B7280" strokeWidth="2" opacity="0.4" />
                    <line x1="100" y1="50" x2="300" y2="250" stroke="#6B7280" strokeWidth="1" opacity="0.3" />
                  </svg>
                </div>

                {/* Map Title */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                    Lucknow Chiller Network
                  </h3>
                  <p className="text-sm text-gray-600">Real-time availability</p>
                  {userLocation && (
                    <p className="text-xs text-green-600 mt-1">
                      📍 Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                    </p>
                  )}
                </div>
                
                {/* Map Controls */}
                <div className="absolute top-4 right-4 space-y-2">
                  <button 
                    onClick={() => setMapZoom(Math.min(mapZoom + 1, 16))}
                    className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Plus className="h-5 w-5 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => setMapZoom(Math.max(mapZoom - 1, 8))}
                    className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Minus className="h-5 w-5 text-gray-600" />
                  </button>
                  <button 
                    onClick={getUserLocation}
                    className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    title="Get my location"
                  >
                    <Navigation className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <RefreshCw className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Chiller Markers on Map */}
                {filteredChillers.map((chiller, index) => {
                  // Calculate position based on coordinates (simplified mapping)
                  const x = ((chiller.coordinates.lng - 80.85) * 2000) + 200;
                  const y = ((26.87 - chiller.coordinates.lat) * 2000) + 150;
                  
                  return (
                    <div
                      key={chiller.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${
                        selectedChiller?.id === chiller.id ? 'scale-125 z-20' : 'z-10'
                      }`}
                      style={{ 
                        left: `${Math.max(10, Math.min(90, (x / 400) * 100))}%`, 
                        top: `${Math.max(10, Math.min(90, (y / 300) * 100))}%` 
                      }}
                      onClick={() => setSelectedChiller(chiller)}
                    >
                      <div className={`${getChillerColor(chiller)} text-white p-2 rounded-full shadow-lg ${
                        chiller.status === 'Available' ? 'animate-pulse' : ''
                      }`}>
                        {getChillerIcon(chiller)}
                      </div>
                      {selectedChiller?.id === chiller.id && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg p-3 min-w-48 z-30">
                          <h4 className="font-semibold text-gray-900 text-sm">{chiller.name}</h4>
                          <p className="text-xs text-gray-600">{chiller.area}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(chiller.status)}`}>
                              {chiller.status}
                            </span>
                            <span className="text-sm font-medium text-green-600">{chiller.rate}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* User Location Marker */}
                {userLocation && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-red-500 text-white p-3 rounded-full shadow-lg animate-ping">
                      <Target className="h-4 w-4" />
                    </div>
                    <div className="absolute top-0 left-0 bg-red-600 text-white p-3 rounded-full shadow-lg">
                      <Target className="h-4 w-4" />
                    </div>
                  </div>
                )}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                  <h4 className="font-semibold text-gray-900 text-sm mb-2">Legend</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span>Limited</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span>Mobile/En Route</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span>Full/Your Location</span>
                    </div>
                  </div>
                </div>

                {/* Zoom Level Indicator */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-xs text-gray-600">Zoom: {mapZoom}</span>
                </div>
              </div>
            </div>

            {/* Chiller List */}
            <div className="space-y-4">
              {filteredChillers.map((chiller) => (
                <div
                  key={chiller.id}
                  className={`bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md cursor-pointer ${
                    selectedChiller?.id === chiller.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedChiller(chiller)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{chiller.name}</h3>
                        {chiller.type === 'Mobile' && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                            Mobile
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(chiller.status)}`}>
                          {chiller.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{chiller.address}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Navigation className="h-4 w-4 mr-1 text-blue-500" />
                          {chiller.distance}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                          {chiller.rating} ({chiller.reviews})
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-green-500" />
                          {chiller.nextAvailable}
                        </div>
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          {chiller.area}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600 mb-1">{chiller.rate}</div>
                      <div className="text-sm text-gray-500">per 8 hours</div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center">
                      <Droplets className="h-4 w-4 text-blue-500 mr-2" />
                      <div>
                        <div className="text-sm font-medium">{chiller.available} available</div>
                        <div className="text-xs text-gray-500">of {chiller.capacity}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Thermometer className="h-4 w-4 text-red-500 mr-2" />
                      <div>
                        <div className="text-sm font-medium">{chiller.temperature}</div>
                        <div className="text-xs text-gray-500">Temperature</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 mr-2" />
                      <div>
                        <div className="text-sm font-medium">{chiller.owner}</div>
                        <div className="text-xs text-gray-500">Owner</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {chiller.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookChiller(chiller);
                      }}
                      disabled={chiller.status === 'Full'}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {chiller.status === 'Full' ? 'Currently Full' : 'Book Now'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`tel:${chiller.phone}`);
                      }}
                      className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedChiller(selectedChiller?.id === chiller.id ? null : chiller);
                      }}
                      className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredChillers.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No chillers found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters to find more options in Lucknow.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFilter('all');
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;