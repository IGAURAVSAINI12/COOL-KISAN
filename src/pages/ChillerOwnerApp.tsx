import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Edit,
  Trash2,
  Save,
  X,
  Phone,
  Mail,
  Bell,
  Shield,
  CreditCard,
  Wallet
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChillerOwnerApp = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in or not a chiller owner
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.userType !== 'chiller-owner') {
      navigate('/');
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddChillerModal, setShowAddChillerModal] = useState(false);
  const [editingChiller, setEditingChiller] = useState(null);
  const [chillers, setChillers] = useState([]);

  // Fetch chillers for this owner from db.json
  useEffect(() => {
    const fetchChillers = async () => {
      const res = await fetch('/data/db.json');
      const data = await res.json();
      if (user) {
        setChillers((data.chillers || []).filter((c) => c.ownerId === user.id));
      }
    };
    fetchChillers();
  }, [user]);

  const [newChiller, setNewChiller] = useState({
    name: '',
    type: 'Fixed',
    capacity: '',
    rate: '',
    location: '',
    phone: '',
    temperature: '-2'
  });

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: true,
      push: true
    },
    profile: {
      name: 'Ramesh Kumar',
      email: 'ramesh@example.com',
      phone: '+91 98765 43210',
      address: 'Village Center, Main Road'
    },
    business: {
      businessName: 'Kumar Dairy Solutions',
      gst: 'GST123456789',
      bankAccount: 'XXXX-XXXX-1234'
    }
  });

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

  const recentBookings = [
    {
      id: 1,
      farmer: 'Rajesh Patel',
      volume: '50L',
      duration: '8 hours',
      amount: '₹60',
      status: 'Active',
      timeLeft: '3h 45m',
      chillerId: 1
    },
    {
      id: 2,
      farmer: 'Priya Sharma',
      volume: '30L',
      duration: '12 hours',
      amount: '₹54',
      status: 'Completed',
      timeLeft: 'Completed',
      chillerId: 1
    },
    {
      id: 3,
      farmer: 'Kumar Singh',
      volume: '75L',
      duration: '6 hours',
      amount: '₹67.5',
      status: 'Pending',
      timeLeft: 'Awaiting confirmation',
      chillerId: 2
    }
  ];

  // Add Chiller
  const handleAddChiller = async () => {
    if (!newChiller.name || !newChiller.capacity || !newChiller.rate) {
      alert('Please fill in all required fields');
      return;
    }
    const res = await fetch('/data/db.json');
    const data = await res.json();
    const newId = data.chillers && data.chillers.length ? Math.max(...data.chillers.map(c => c.id)) + 1 : 1;
    const chiller = {
      id: newId,
      ownerId: user.id,
      ...newChiller,
      capacity: `${newChiller.capacity}L`,
      rate: `₹${newChiller.rate}/L`,
      temperature: `${newChiller.temperature}°C`,
      used: '0L',
      status: 'Active',
      bookings: 0,
      earnings: '₹0'
    };
    const updatedChillers = [...(data.chillers || []), chiller];
    await fetch('/data/db.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, chillers: updatedChillers })
    });
    setChillers(updatedChillers.filter((c) => c.ownerId === user.id));
    setNewChiller({
      name: '',
      type: 'Fixed',
      capacity: '',
      rate: '',
      location: '',
      phone: '',
      temperature: '-2'
    });
    setShowAddChillerModal(false);
    alert('Chiller added successfully!');
  };

  // Edit Chiller
  const handleEditChiller = (chiller) => {
    setEditingChiller({
      ...chiller,
      capacity: chiller.capacity.replace('L', ''),
      rate: chiller.rate.replace('₹', '').replace('/L', ''),
      temperature: chiller.temperature.replace('°C', '')
    });
  };

  // Update Chiller
  const handleUpdateChiller = async () => {
    const res = await fetch('/data/db.json');
    const data = await res.json();
    const updatedChillers = (data.chillers || []).map((c) =>
      c.id === editingChiller.id
        ? {
            ...editingChiller,
            capacity: `${editingChiller.capacity}L`,
            rate: `₹${editingChiller.rate}/L`,
            temperature: `${editingChiller.temperature}°C`
          }
        : c
    );
    await fetch('/data/db.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, chillers: updatedChillers })
    });
    setChillers(updatedChillers.filter((c) => c.ownerId === user.id));
    setEditingChiller(null);
    alert('Chiller updated successfully!');
  };

  // Delete Chiller
  const handleDeleteChiller = async (id) => {
    if (!window.confirm('Are you sure you want to delete this chiller?')) return;
    const res = await fetch('/data/db.json');
    const data = await res.json();
    const updatedChillers = (data.chillers || []).filter((c) => c.id !== id);
    await fetch('/data/db.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, chillers: updatedChillers })
    });
    setChillers(updatedChillers.filter((c) => c.ownerId === user.id));
    alert('Chiller deleted successfully!');
  };

  const handleBookingAction = (bookingId, action) => {
    alert(`Booking ${action} successfully!`);
  };

  const handleSettingsUpdate = () => {
    alert('Settings updated successfully!');
  };

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
              <button 
                onClick={() => setShowAddChillerModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
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
              <button 
                onClick={() => setShowAddChillerModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
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
                      <p className="text-sm text-gray-500 mt-1">{chiller.location}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditChiller(chiller)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteChiller(chiller.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
                      <div className="grid sm:grid-cols-4 gap-4 text-sm text-gray-600">
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
                        <div>
                          <span className="block font-medium">Chiller:</span>
                          <span>{chillers.find(c => c.id === booking.chillerId)?.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {booking.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleBookingAction(booking.id, 'accepted')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleBookingAction(booking.id, 'declined')}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      {booking.status === 'Active' && (
                        <button 
                          onClick={() => handleBookingAction(booking.id, 'completed')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Profile Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={settings.profile.name}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, name: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, email: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={settings.profile.phone}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, phone: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={settings.profile.address}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, address: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Business Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Settings</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={settings.business.businessName}
                    onChange={(e) => setSettings({
                      ...settings,
                      business: { ...settings.business, businessName: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                  <input
                    type="text"
                    value={settings.business.gst}
                    onChange={(e) => setSettings({
                      ...settings,
                      business: { ...settings.business, gst: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account</label>
                  <input
                    type="text"
                    value={settings.business.bankAccount}
                    onChange={(e) => setSettings({
                      ...settings,
                      business: { ...settings.business, bankAccount: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive booking updates via email</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, email: e.target.checked }
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">SMS Notifications</p>
                      <p className="text-sm text-gray-500">Receive booking updates via SMS</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.sms}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, sms: e.target.checked }
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Push Notifications</p>
                      <p className="text-sm text-gray-500">Receive instant app notifications</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, push: e.target.checked }
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSettingsUpdate}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        )}

        {/* Add Chiller Modal */}
        {showAddChillerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Add New Chiller</h2>
                <button 
                  onClick={() => setShowAddChillerModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chiller Name *</label>
                  <input
                    type="text"
                    value={newChiller.name}
                    onChange={(e) => setNewChiller({...newChiller, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Village Center Chiller"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newChiller.type}
                    onChange={(e) => setNewChiller({...newChiller, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Fixed">Fixed Chiller</option>
                    <option value="Mobile">Mobile Chiller</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacity (L) *</label>
                    <input
                      type="number"
                      value={newChiller.capacity}
                      onChange={(e) => setNewChiller({...newChiller, capacity: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rate (₹/L) *</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newChiller.rate}
                      onChange={(e) => setNewChiller({...newChiller, rate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1.2"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={newChiller.location}
                    onChange={(e) => setNewChiller({...newChiller, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Village Center, Main Road"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={newChiller.phone}
                      onChange={(e) => setNewChiller({...newChiller, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
                    <select
                      value={newChiller.temperature}
                      onChange={(e) => setNewChiller({...newChiller, temperature: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="-4">-4°C (Deep Freeze)</option>
                      <option value="-3">-3°C (Premium)</option>
                      <option value="-2">-2°C (Standard)</option>
                      <option value="-1">-1°C (Basic)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowAddChillerModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddChiller}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Add Chiller
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Chiller Modal */}
        {editingChiller && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Edit Chiller</h2>
                <button 
                  onClick={() => setEditingChiller(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chiller Name</label>
                  <input
                    type="text"
                    value={editingChiller.name}
                    onChange={(e) => setEditingChiller({...editingChiller, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={editingChiller.type}
                    onChange={(e) => setEditingChiller({...editingChiller, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Fixed">Fixed Chiller</option>
                    <option value="Mobile">Mobile Chiller</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacity (L)</label>
                    <input
                      type="number"
                      value={editingChiller.capacity}
                      onChange={(e) => setEditingChiller({...editingChiller, capacity: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rate (₹/L)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingChiller.rate}
                      onChange={(e) => setEditingChiller({...editingChiller, rate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={editingChiller.location}
                    onChange={(e) => setEditingChiller({...editingChiller, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editingChiller.phone}
                      onChange={(e) => setEditingChiller({...editingChiller, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
                    <select
                      value={editingChiller.temperature}
                      onChange={(e) => setEditingChiller({...editingChiller, temperature: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="-4">-4°C (Deep Freeze)</option>
                      <option value="-3">-3°C (Premium)</option>
                      <option value="-2">-2°C (Standard)</option>
                      <option value="-1">-1°C (Basic)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setEditingChiller(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateChiller}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Update Chiller
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChillerOwnerApp;