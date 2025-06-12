import React, { useState } from 'react';
import { 
  Plus, 
  Settings, 
  BarChart3, 
  Calendar, 
  DollarSign,
  Users,
  Thermometer,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const ChillerOwnerApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { 
      label: 'Total Earnings', 
      value: '₹12,450', 
      change: '+18%', 
      icon: <DollarSign className="h-6 w-6 text-green-600" />,
      trend: 'up'
    },
    { 
      label: 'Active Bookings', 
      value: '8', 
      change: '+2', 
      icon: <Users className="h-6 w-6 text-blue-600" />,
      trend: 'up'
    },
    { 
      label: 'Capacity Used', 
      value: '67%', 
      change: '+12%', 
      icon: <BarChart3 className="h-6 w-6 text-purple-600" />,
      trend: 'up'
    },
    { 
      label: 'Avg Rating', 
      value: '4.8', 
      change: '+0.2', 
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      trend: 'up'
    }
  ];

  const chillers = [
    {
      id: 1,
      name: 'Main Village Chiller',
      type: 'Fixed',
      capacity: '500L',
      used: '340L',
      temperature: '-2°C',
      status: 'Active',
      rate: '₹1.2/L',
      bookings: 12,
      earnings: '₹4,080'
    },
    {
      id: 2,
      name: 'Mobile Unit #1',
      type: 'Mobile',
      capacity: '200L',
      used: '150L',
      temperature: '-3°C',
      status: 'En Route',
      rate: '₹1.5/L',
      bookings: 5,
      earnings: '₹1,125'
    }
  ];

  const recentBookings = [
    {
      id: 1,
      farmer: 'Rajesh Patel',
      volume: '50L',
      duration: '8 hours',
      amount: '₹60',
      status: 'Active',
      timeLeft: '3h 45m'
    },
    {
      id: 2,
      farmer: 'Priya Sharma',
      volume: '30L',
      duration: '12 hours',
      amount: '₹54',
      status: 'Completed',
      timeLeft: 'Completed'
    },
    {
      id: 3,
      farmer: 'Kumar Singh',
      volume: '75L',
      duration: '6 hours',
      amount: '₹67.5',
      status: 'Pending',
      timeLeft: 'Awaiting confirmation'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chiller Owner Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your chillers and track earnings</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Chiller
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <nav className="flex space-x-8 p-6">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="h-4 w-4" /> },
              { id: 'chillers', label: 'My Chillers', icon: <Thermometer className="h-4 w-4" /> },
              { id: 'bookings', label: 'Bookings', icon: <Calendar className="h-4 w-4" /> },
              { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      {stat.icon}
                      <div className={`flex items-center mt-2 text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {stat.change}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{booking.farmer}</p>
                        <p className="text-sm text-gray-600">{booking.volume} • {booking.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{booking.amount}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'Active' ? 'bg-green-100 text-green-800' :
                          booking.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Chiller Performance</h3>
                <div className="space-y-4">
                  {chillers.map((chiller) => (
                    <div key={chiller.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{chiller.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          chiller.status === 'Active' ? 'bg-green-100 text-green-800' :
                          chiller.status === 'En Route' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {chiller.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="block">Capacity Used:</span>
                          <span className="font-medium text-gray-900">{chiller.used}/{chiller.capacity}</span>
                        </div>
                        <div>
                          <span className="block">Today's Earnings:</span>
                          <span className="font-medium text-green-600">{chiller.earnings}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chillers Tab */}
        {activeTab === 'chillers' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Chillers</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add New Chiller
              </button>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {chillers.map((chiller) => (
                <div key={chiller.id} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{chiller.name}</h3>
                      <p className="text-sm text-gray-600">{chiller.type} Chiller</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Settings className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Capacity:</span>
                      <span className="font-medium">{chiller.capacity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Currently Used:</span>
                      <span className="font-medium">{chiller.used}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Temperature:</span>
                      <span className="font-medium text-blue-600">{chiller.temperature}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rate:</span>
                      <span className="font-medium text-green-600">{chiller.rate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active Bookings:</span>
                      <span className="font-medium">{chiller.bookings}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Today's Earnings:</span>
                      <span className="font-semibold text-green-600">{chiller.earnings}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Requests</h2>
            
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-semibold text-gray-900">{booking.farmer}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'Active' ? 'bg-green-100 text-green-800' :
                          booking.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="block font-medium">Volume:</span>
                          <span>{booking.volume}</span>
                        </div>
                        <div>
                          <span className="block font-medium">Duration:</span>
                          <span>{booking.duration}</span>
                        </div>
                        <div>
                          <span className="block font-medium">Amount:</span>
                          <span className="text-green-600 font-semibold">{booking.amount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {booking.status === 'Pending' && (
                        <>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                            Accept
                          </button>
                          <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                            Decline
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChillerOwnerApp;