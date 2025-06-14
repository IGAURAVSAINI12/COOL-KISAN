import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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

  // Handle booking a chiller
  const handleBookChiller = (chiller) => {
    if (chiller.status === 'Full') {
      alert('This chiller is currently full. Please try another chiller or wait for availability.');
      return;
    }

    // Store selected chiller data for booking
    const bookingData = {
      type: 'pay-per-use',
      chiller: chiller.name,
      owner: chiller.owner,
      distance: chiller.distance,
      volume: '50L', // Default volume, user can change in farmer app
      duration: '8 hours',
      rate: chiller.rate,
      subtotal: 60, // Will be calculated based on actual volume
      platformFee: 6,
      total: 66,
      rating: chiller.rating,
      temperature: chiller.temperature,
      address: chiller.address,
      phone: chiller.phone,
      features: chiller.features,
      chillerId: chiller.id
    };

    localStorage.setItem('selectedBooking', JSON.stringify(bookingData));
    
    // Navigate to farmer app for detailed booking
    navigate('/farmer', { 
      state: { 
        preSelectedChiller: chiller,
        fromMap: true 
      }
    });
  };

  // Handle calling chiller owner
  const handleCallChiller = (chiller) => {
    if (chiller.phone) {
      window.open(`tel:${chiller.phone}`, '_self');
    } else {
      alert('Phone number not available for this chiller');
    }
  };

  // Handle viewing chiller details
  const handleViewDetails = (chiller) => {
    const details = `
🏢 ${chiller.name}
👤 Owner: ${chiller.owner}
📍 Location: ${chiller.address}
📞 Phone: ${chiller.phone}
🌡️ Temperature: ${chiller.temperature}
💧 Available: ${chiller.available} of ${chiller.capacity}
💰 Rate: ${chiller.rate} per 8 hours
⭐ Rating: ${chiller.rating}/5 (${chiller.reviews} reviews)
🚚 Type: ${chiller.type} Chiller
⏰ Next Available: ${chiller.nextAvailable}

Features:
${chiller.features.map(f => `• ${f}`).join('\n')}

Status: ${chiller.status}
    `;
    
    alert(details);
  };

  // Handle quick booking with default values
  const handleQuickBook = (chiller) => {
    if (chiller.status === 'Full') {
      alert('This chiller is currently full. Please try another chiller.');
      return;
    }

    // Quick booking with default 50L for 8 hours
    const rate = parseFloat(chiller.rate.replace('₹', '').replace('/L', ''));
    const volume = 50;
    const subtotal = rate * volume;
    const platformFee = Math.round(subtotal * 0.1);
    const total = subtotal + platformFee;

    const bookingData = {
      type: 'quick-book',
      chiller: chiller.name,
      owner: chiller.owner,
      distance: chiller.distance,
      volume: `${volume}L`,
      duration: '8 hours',
      rate: chiller.rate,
      subtotal: subtotal,
      platformFee: platformFee,
      total: total,
      rating: chiller.rating,
      temperature: chiller.temperature,
      address: chiller.address,
      phone: chiller.phone,
      chillerId: chiller.id
    };

    localStorage.setItem('selectedBooking', JSON.stringify(bookingData));
    navigate('/payment');
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
            {/* Enhanced Interactive Lucknow Map */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-96 relative bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
                {/* Lucknow Map Background with better visualization */}
                <div className="absolute inset-0">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full" style={{
                      backgroundImage: `
                        radial-gradient(circle at 25% 25%, #3B82F6 2px, transparent 2px),
                        radial-gradient(circle at 75% 75%, #10B981 2px, transparent 2px),
                        linear-gradient(45deg, transparent 40%, rgba(59, 130, 246, 0.1) 50%, transparent 60%)
                      `,
                      backgroundSize: '50px 50px, 50px 50px, 100px 100px'
                    }}></div>
                  </div>
                  
                  {/* Gomti River representation */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                    <defs>
                      <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{stopColor:'#3B82F6', stopOpacity:0.6}} />
                        <stop offset="50%" style={{stopColor:'#06B6D4', stopOpacity:0.8}} />
                        <stop offset="100%" style={{stopColor:'#3B82F6', stopOpacity:0.6}} />
                      </linearGradient>
                    </defs>
                    
                    {/* Gomti River */}
                    <path
                      d="M50 150 Q150 120 250 140 Q300 150 350 160"
                      stroke="url(#riverGradient)"
                      strokeWidth="8"
                      fill="none"
                      opacity="0.8"
                    />
                    
                    {/* Major roads */}
                    <line x1="0" y1="150" x2="400" y2="150" stroke="#6B7280" strokeWidth="3" opacity="0.5" />
                    <line x1="200" y1="0" x2="200" y2="300" stroke="#6B7280" strokeWidth="3" opacity="0.5" />
                    <line x1="100" y1="50" x2="300" y2="250" stroke="#6B7280" strokeWidth="2" opacity="0.4" />
                    <line x1="300" y1="50" x2="100" y2="250" stroke="#6B7280" strokeWidth="2" opacity="0.4" />
                    
                    {/* Area labels */}
                    <text x="120" y="100" fill="#374151" fontSize="12" fontWeight="bold" opacity="0.7">Hazratganj</text>
                    <text x="280" y="80" fill="#374151" fontSize="12" fontWeight="bold" opacity="0.7">Gomti Nagar</text>
                    <text x="80" y="180" fill="#374151" fontSize="12" fontWeight="bold" opacity="0.7">Aminabad</text>
                    <text x="60" y="250" fill="#374151" fontSize="12" fontWeight="bold" opacity="0.7">Alambagh</text>
                    <text x="160" y="200" fill="#374151" fontSize="12" fontWeight="bold" opacity="0.7">Charbagh</text>
                    <text x="300" y="200" fill="#374151" fontSize="12" fontWeight="bold" opacity="0.7">Indira Nagar</text>
                  </svg>
                </div>

                {/* Map Title */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
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
                    className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    <Plus className="h-5 w-5 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => setMapZoom(Math.max(mapZoom - 1, 8))}
                    className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    <Minus className="h-5 w-5 text-gray-600" />
                  </button>
                  <button 
                    onClick={getUserLocation}
                    className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    title="Get my location"
                  >
                    <Navigation className="h-5 w-5 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    <RefreshCw className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Chiller Markers on Map */}
                {filteredChillers.map((chiller, index) => {
                  // Calculate position based on coordinates (improved mapping)
                  const x = ((chiller.coordinates.lng - 80.85) * 1800) + 200;
                  const y = ((26.87 - chiller.coordinates.lat) * 1800) + 150;
                  
                  return (
                    <div
                      key={chiller.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-125 ${
                        selectedChiller?.id === chiller.id ? 'scale-150 z-30' : 'z-20'
                      }`}
                      style={{ 
                        left: `${Math.max(5, Math.min(95, (x / 400) * 100))}%`, 
                        top: `${Math.max(5, Math.min(95, (y / 300) * 100))}%` 
                      }}
                      onClick={() => setSelectedChiller(selectedChiller?.id === chiller.id ? null : chiller)}
                    >
                      <div className={`${getChillerColor(chiller)} text-white p-3 rounded-full shadow-xl border-2 border-white ${
                        chiller.status === 'Available' ? 'animate-pulse' : ''
                      }`}>
                        {getChillerIcon(chiller)}
                      </div>
                      
                      {/* Enhanced popup */}
                      {selectedChiller?.id === chiller.id && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 bg-white rounded-xl shadow-2xl p-4 min-w-64 z-40 border border-gray-200">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm">{chiller.name}</h4>
                              <p className="text-xs text-gray-600">{chiller.area} • {chiller.distance}</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedChiller(null);
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Plus className="h-4 w-4 rotate-45" />
                            </button>
                          </div>
                          
                          <div className="space-y-2 mb-3">
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(chiller.status)}`}>
                                {chiller.status}
                              </span>
                              <span className="text-sm font-medium text-green-600">{chiller.rate}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <Droplets className="h-3 w-3 mr-1" />
                              {chiller.available} available
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <Thermometer className="h-3 w-3 mr-1" />
                              {chiller.temperature}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBookChiller(chiller);
                              }}
                              disabled={chiller.status === 'Full'}
                              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {chiller.status === 'Full' ? 'Full' : 'Book'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCallChiller(chiller);
                              }}
                              className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                            >
                              <Phone className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* User Location Marker */}
                {userLocation && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="relative">
                      <div className="bg-red-500 text-white p-3 rounded-full shadow-xl animate-ping opacity-75">
                        <Target className="h-4 w-4" />
                      </div>
                      <div className="absolute top-0 left-0 bg-red-600 text-white p-3 rounded-full shadow-xl border-2 border-white">
                        <Target className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Legend */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <h4 className="font-semibold text-gray-900 text-sm mb-2">Legend</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2 border border-white"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2 border border-white"></div>
                      <span>Limited</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 border border-white"></div>
                      <span>Mobile/En Route</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2 border border-white"></div>
                      <span>Full/Your Location</span>
                    </div>
                  </div>
                </div>

                {/* Zoom Level Indicator */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
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
                  onClick={() => setSelectedChiller(selectedChiller?.id === chiller.id ? null : chiller)}
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
                        handleCallChiller(chiller);
                      }}
                      className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(chiller);
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