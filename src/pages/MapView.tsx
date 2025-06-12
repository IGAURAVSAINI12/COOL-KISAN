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
  Info
} from 'lucide-react';

const MapView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedChiller, setSelectedChiller] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock chiller data with coordinates
  const chillers = [
    {
      id: 1,
      name: 'Village Community Chiller',
      type: 'Fixed',
      owner: 'Ramesh Kumar',
      distance: '1.2 km',
      coordinates: { lat: 28.6139, lng: 77.2090 },
      capacity: '500L',
      available: '350L',
      rate: '₹1.2/L',
      rating: 4.8,
      reviews: 124,
      temperature: '-2°C',
      status: 'Available',
      phone: '+91 98765 43210',
      address: 'Village Road, Sector 12',
      features: ['24/7 Access', 'Quality Monitoring', 'SMS Alerts'],
      nextAvailable: 'Now'
    },
    {
      id: 2,
      name: 'Mobile Chiller Express',
      type: 'Mobile',
      owner: 'CoolTruck Services',
      distance: '2.5 km',
      coordinates: { lat: 28.6289, lng: 77.2065 },
      capacity: '200L',
      available: '200L',
      rate: '₹1.5/L',
      rating: 4.9,
      reviews: 89,
      temperature: '-3°C',
      status: 'En Route',
      phone: '+91 98765 43211',
      address: 'Mobile Unit - Current Location',
      features: ['Door-to-Door', 'Rapid Cooling', 'GPS Tracking'],
      nextAvailable: '15 mins'
    },
    {
      id: 3,
      name: 'Cooperative Dairy Chiller',
      type: 'Fixed',
      owner: 'Milk Cooperative',
      distance: '3.8 km',
      coordinates: { lat: 28.5989, lng: 77.2295 },
      capacity: '800L',
      available: '120L',
      rate: '₹1.0/L',
      rating: 4.7,
      reviews: 256,
      temperature: '-2°C',
      status: 'Limited',
      phone: '+91 98765 43212',
      address: 'Cooperative Society, Main Market',
      features: ['Bulk Capacity', 'Member Discounts', 'Quality Reports'],
      nextAvailable: 'Now'
    },
    {
      id: 4,
      name: 'Premium Cold Storage',
      type: 'Fixed',
      owner: 'FreshKeep Solutions',
      distance: '4.2 km',
      coordinates: { lat: 28.6339, lng: 77.1910 },
      capacity: '1000L',
      available: '750L',
      rate: '₹2.0/L',
      rating: 4.9,
      reviews: 178,
      temperature: '-4°C',
      status: 'Available',
      phone: '+91 98765 43213',
      address: 'Industrial Area, Phase 2',
      features: ['Deep Freeze', 'Premium Service', 'Insurance Coverage'],
      nextAvailable: 'Now'
    },
    {
      id: 5,
      name: 'Quick Chill Station',
      type: 'Fixed',
      owner: 'Rajesh Patel',
      distance: '5.1 km',
      coordinates: { lat: 28.5839, lng: 77.2190 },
      capacity: '300L',
      available: '0L',
      rate: '₹1.3/L',
      rating: 4.6,
      reviews: 92,
      temperature: '-2°C',
      status: 'Full',
      phone: '+91 98765 43214',
      address: 'Highway Junction, Near Petrol Pump',
      features: ['Quick Access', 'Highway Location', 'Truck Parking'],
      nextAvailable: '2 hours'
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
                         chiller.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'available' && chiller.status === 'Available') ||
                         (selectedFilter === 'mobile' && chiller.type === 'Mobile') ||
                         (selectedFilter === 'nearby' && parseFloat(chiller.distance) <= 3);
    
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    // Simulate loading user location
    setTimeout(() => {
      setUserLocation({ lat: 28.6139, lng: 77.2090 });
      setIsLoading(false);
    }, 1500);
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
    // Navigate to booking page with chiller data
    console.log('Booking chiller:', chiller);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding nearby chillers...</p>
        </div>
      </div>
    );
  }

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
                <h1 className="text-xl font-semibold text-gray-900">Find Nearby Chillers</h1>
                <p className="text-sm text-gray-600">{filteredChillers.length} chillers found</p>
              </div>
            </div>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Target className="h-4 w-4" />
              <span>Use My Location</span>
            </button>
          </div>
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
                  placeholder="Search by name, owner, or location..."
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
                  <span className="font-medium">2.8K L</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map and Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interactive Map */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-80 bg-gradient-to-br from-blue-100 to-green-100 relative">
                {/* Mock Map Interface */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">Interactive Map</p>
                    <p className="text-sm text-gray-500">Showing {filteredChillers.length} nearby chillers</p>
                  </div>
                </div>
                
                {/* Map Controls */}
                <div className="absolute top-4 right-4 space-y-2">
                  <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <RefreshCw className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <Navigation className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Mock Map Markers */}
                <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-green-500 text-white p-2 rounded-full shadow-lg animate-pulse">
                    <Snowflake className="h-4 w-4" />
                  </div>
                </div>
                <div className="absolute top-1/2 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-blue-500 text-white p-2 rounded-full shadow-lg">
                    <Truck className="h-4 w-4" />
                  </div>
                </div>
                <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-purple-500 text-white p-2 rounded-full shadow-lg">
                    <Snowflake className="h-4 w-4" />
                  </div>
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
                  Try adjusting your search criteria or filters to find more options.
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