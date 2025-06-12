import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Droplets, 
  DollarSign, 
  QrCode, 
  Star,
  Navigation,
  Thermometer,
  Wallet,
  Bell
} from 'lucide-react';

const FarmerApp = () => {
  const navigate = useNavigate();
  const [milkVolume, setMilkVolume] = useState('');
  const [duration, setDuration] = useState('8');
  const [selectedChiller, setSelectedChiller] = useState(null);

  const nearbyChillers = [
    {
      id: 1,
      name: 'Village Community Chiller',
      distance: '1.2 km',
      capacity: '150L available',
      rate: '₹1.2/L',
      rating: 4.8,
      owner: 'Ramesh Kumar',
      type: 'Fixed',
      temperature: '-2°C',
      available: true
    },
    {
      id: 2,
      name: 'Mobile Chiller Express',
      distance: '2.5 km',
      capacity: '200L available',
      rate: '₹1.5/L',
      rating: 4.9,
      owner: 'CoolTruck Services',
      type: 'Mobile',
      temperature: '-3°C',
      available: true
    },
    {
      id: 3,
      name: 'Cooperative Dairy Chiller',
      distance: '3.8 km',
      capacity: '300L available',
      rate: '₹1.0/L',
      rating: 4.7,
      owner: 'Milk Cooperative',
      type: 'Fixed',
      temperature: '-2°C',
      available: false
    }
  ];

  const calculateCost = () => {
    if (!milkVolume || !selectedChiller) return 0;
    const baseRate = parseFloat(selectedChiller.rate.replace('₹', '').replace('/L', ''));
    return (baseRate * parseFloat(milkVolume)).toFixed(2);
  };

  const handleBooking = () => {
    // Validate inputs
    if (!milkVolume || parseFloat(milkVolume) <= 0) {
      alert('Please enter a valid milk volume');
      return;
    }
    
    if (!selectedChiller) {
      alert('Please select a chiller');
      return;
    }

    // Store booking data for payment page
    const bookingData = {
      type: 'pay-per-use',
      chiller: selectedChiller.name,
      owner: selectedChiller.owner,
      distance: selectedChiller.distance,
      volume: `${milkVolume}L`,
      duration: `${duration} hours`,
      rate: selectedChiller.rate,
      subtotal: parseFloat(calculateCost()),
      platformFee: Math.round(parseFloat(calculateCost()) * 0.1),
      total: Math.round(parseFloat(calculateCost()) * 1.1),
      rating: selectedChiller.rating,
      temperature: selectedChiller.temperature
    };

    // Store in localStorage for payment page
    localStorage.setItem('selectedBooking', JSON.stringify(bookingData));
    
    // Navigate to payment page
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Book a Chiller</h1>
              <p className="text-gray-600 mt-1">Find and reserve cooling space for your milk</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium">
                <Bell className="h-4 w-4 inline mr-1" />
                3 Available Nearby
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Volume and Duration */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Milk Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Droplets className="h-4 w-4 inline mr-1" />
                    Milk Volume (Litres)
                  </label>
                  <input
                    type="number"
                    value={milkVolume}
                    onChange={(e) => setMilkVolume(e.target.value)}
                    placeholder="Enter volume"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Duration (Hours)
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="4">4 Hours</option>
                    <option value="8">8 Hours</option>
                    <option value="12">12 Hours</option>
                    <option value="24">24 Hours</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Available Chillers */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                <MapPin className="h-5 w-5 inline mr-2" />
                Nearby Chillers
              </h2>
              <div className="space-y-4">
                {nearbyChillers.map((chiller) => (
                  <div
                    key={chiller.id}
                    className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                      selectedChiller?.id === chiller.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${!chiller.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => chiller.available && setSelectedChiller(chiller)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{chiller.name}</h3>
                          <div className="flex items-center space-x-2">
                            {chiller.type === 'Mobile' && (
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                                Mobile
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              chiller.available 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {chiller.available ? 'Available' : 'Full'}
                            </span>
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Navigation className="h-4 w-4 mr-2 text-blue-500" />
                            {chiller.distance}
                          </div>
                          <div className="flex items-center">
                            <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                            {chiller.capacity}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                            {chiller.rate} per 8hrs
                          </div>
                          <div className="flex items-center">
                            <Thermometer className="h-4 w-4 mr-2 text-red-500" />
                            {chiller.temperature}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-medium">{chiller.rating}</span>
                            <span className="text-sm text-gray-500 ml-2">by {chiller.owner}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
              
              {selectedChiller ? (
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="font-medium text-gray-900">{selectedChiller.name}</h3>
                    <p className="text-sm text-gray-600">{selectedChiller.distance} away</p>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Volume:</span>
                      <span className="font-medium">{milkVolume || '0'}L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{duration} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rate:</span>
                      <span className="font-medium">{selectedChiller.rate}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                      <span>Total Cost:</span>
                      <span className="text-green-600">₹{calculateCost()}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!milkVolume || parseFloat(milkVolume) <= 0}
                  >
                    <QrCode className="h-5 w-5 inline mr-2" />
                    Book & Get QR Code
                  </button>

                  <div className="text-xs text-gray-500 text-center">
                    Payment will be processed after confirmation
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a chiller to see booking details</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Wallet className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">My Wallet</p>
                    <p className="text-sm text-gray-500">Balance: ₹1,250</p>
                  </div>
                </button>
                <button className="w-full flex items-center px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Clock className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Active Bookings</p>
                    <p className="text-sm text-gray-500">2 chillers in use</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerApp;