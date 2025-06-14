import React, { useState, useEffect } from 'react';
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
  Bell,
  Receipt,
  Plus,
  CreditCard,
  Smartphone,
  History,
  Eye,
  Download,
  Minus,
  X,
  Check,
  Calendar,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const FarmerApp = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // Redirect if not logged in or not a farmer
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.userType !== 'farmer') {
      navigate('/');
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState('book');
  const [milkVolume, setMilkVolume] = useState('');
  const [duration, setDuration] = useState('8');
  const [selectedChiller, setSelectedChiller] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showDeductMoneyModal, setShowDeductMoneyModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [addAmount, setAddAmount] = useState('');
  const [deductAmount, setDeductAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [deductReason, setDeductReason] = useState('');
  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Fetch wallet, bookings, and transactions for this farmer from db.json
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:3000/');
      const data = await res.json();
      if (user) {
        setWalletBalance(
          (data.wallets || []).find((w) => w.farmerId === user.id)?.balance || 0
        );
        setBookings((data.bookings || []).filter((b) => b.farmerId === user.id));
        setTransactions((data.transactions || []).filter((t) => t.farmerId === user.id));
      }
    };
    fetchData();
  }, [user]);

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

  // Add Booking
  const handleBooking = async () => {
    // Validate inputs
    if (!milkVolume || parseFloat(milkVolume) <= 0) {
      alert('Please enter a valid milk volume');
      return;
    }
    
    if (!selectedChiller) {
      alert('Please select a chiller');
      return;
    }

    const totalCost = Math.round(parseFloat(calculateCost()) * 1.1);
    // Check wallet balance
    if (walletBalance < totalCost) {
      alert(`Insufficient wallet balance. You need ₹${totalCost} but have ₹${walletBalance}. Please add money to your wallet.`);
      setShowAddMoneyModal(true);
      return;
    }
    const res = await fetch('http://localhost:3000/');
    const data = await res.json();
    const newBooking = {
      id: `CK-2024-${String(Date.now()).slice(-6)}`,
      farmerId: user.id,
      chiller: selectedChiller.name,
      owner: selectedChiller.owner,
      ownerPhone: '+91 98765 43210',
      ownerEmail: 'owner@example.com',
      volume: `${milkVolume}L`,
      duration: `${duration} hours`,
      amount: totalCost,
      status: 'Active',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      qrCode: `CK-2024-${String(Date.now()).slice(-6)}`,
      timeLeft: `${duration}h 0m`,
      location: 'Village Center, Main Road',
      temperature: selectedChiller.temperature,
      paymentMethod: 'Wallet',
      transactionId: `TXN${Date.now()}`
    };
    const updatedBookings = [newBooking, ...(data.bookings || [])];
    // Add transaction
    const newTransaction = {
      id: newBooking.transactionId,
      farmerId: user.id,
      type: 'debit',
      amount: totalCost,
      description: `Chiller booking - ${selectedChiller.name}`,
      date: newBooking.date,
      time: newBooking.time,
      bookingId: newBooking.id
    };
    const updatedTransactions = [newTransaction, ...(data.transactions || [])];
    // Update wallet
    const updatedWallets = (data.wallets || []).map((w) =>
      w.farmerId === user.id ? { ...w, balance: w.balance - totalCost } : w
    );
    await fetch('http://localhost:3000/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, bookings: updatedBookings, transactions: updatedTransactions, wallets: updatedWallets })
    });
    setBookings(updatedBookings.filter((b) => b.farmerId === user.id));
    setTransactions(updatedTransactions.filter((t) => t.farmerId === user.id));
    setWalletBalance(updatedWallets.find((w) => w.farmerId === user.id)?.balance || 0);
    setMilkVolume('');
    setSelectedChiller(null);
    alert(`Booking successful! ₹${totalCost} deducted from wallet. Your QR code: ${newBooking.qrCode}`);
    setActiveTab('bookings');
  };

  // Add Money
  const handleAddMoney = async () => {
    if (!addAmount || parseFloat(addAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    const amount = parseFloat(addAmount);
    const res = await fetch('http://localhost:3000/');
    const data = await res.json();
    // Add transaction
    const newTransaction = {
      id: `TXN${Date.now()}`,
      farmerId: user.id,
      type: 'credit',
      amount: amount,
      description: `Wallet top-up via ${paymentMethod.toUpperCase()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      bookingId: null
    };
    const updatedTransactions = [newTransaction, ...(data.transactions || [])];
    // Update wallet
    let updatedWallets = data.wallets || [];
    if (updatedWallets.some((w) => w.farmerId === user.id)) {
      updatedWallets = updatedWallets.map((w) =>
        w.farmerId === user.id ? { ...w, balance: w.balance + amount } : w
      );
    } else {
      updatedWallets.push({ farmerId: user.id, balance: amount });
    }
    await fetch('http://localhost:3000/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, transactions: updatedTransactions, wallets: updatedWallets })
    });
    setTransactions(updatedTransactions.filter((t) => t.farmerId === user.id));
    setWalletBalance(updatedWallets.find((w) => w.farmerId === user.id)?.balance || 0);
    setAddAmount('');
    setShowAddMoneyModal(false);
    alert(`₹${amount} added to your wallet successfully!`);
  };

  // Deduct Money
  const handleDeductMoney = async () => {
    if (!deductAmount || parseFloat(deductAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!deductReason.trim()) {
      alert('Please provide a reason for deduction');
      return;
    }

    const amount = parseFloat(deductAmount);
    
    if (amount > walletBalance) {
      alert('Insufficient wallet balance for this deduction');
      return;
    }
    const res = await fetch('http://localhost:3000/');
    const data = await res.json();
    // Add transaction
    const newTransaction = {
      id: `TXN${Date.now()}`,
      farmerId: user.id,
      type: 'debit',
      amount: amount,
      description: `Manual deduction - ${deductReason}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      bookingId: null
    };
    const updatedTransactions = [newTransaction, ...(data.transactions || [])];
    // Update wallet
    const updatedWallets = (data.wallets || []).map((w) =>
      w.farmerId === user.id ? { ...w, balance: w.balance - amount } : w
    );
    await fetch('http://localhost:3000/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, transactions: updatedTransactions, wallets: updatedWallets })
    });
    setTransactions(updatedTransactions.filter((t) => t.farmerId === user.id));
    setWalletBalance(updatedWallets.find((w) => w.farmerId === user.id)?.balance || 0);
    setDeductAmount('');
    setDeductReason('');
    setShowDeductMoneyModal(false);
    alert(`₹${amount} deducted from your wallet successfully!`);
  };

  const viewBookingDetails = (booking) => {
    alert(`Booking Details:
ID: ${booking.id}
Chiller: ${booking.chiller}
Owner: ${booking.owner}
Volume: ${booking.volume}
Duration: ${booking.duration}
Amount: ₹${booking.amount}
Status: ${booking.status}
QR Code: ${booking.qrCode}
Date: ${booking.date}`);
  };

  const downloadReceipt = (booking) => {
    setSelectedReceipt(booking);
    setShowReceiptModal(true);
  };

  const generateReceiptPDF = () => {
    // In a real app, this would generate and download a PDF
    alert('Receipt downloaded successfully!');
    setShowReceiptModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
              <p className="text-gray-600 mt-1">Book chillers and manage your milk preservation</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium flex items-center">
                <Wallet className="h-4 w-4 mr-1" />
                ₹{walletBalance}
              </div>
              <button
                onClick={() => setShowAddMoneyModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Money
              </button>
              <button
                onClick={() => setShowDeductMoneyModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center"
              >
                <Minus className="h-4 w-4 mr-2" />
                Deduct
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <nav className="flex space-x-8 p-6">
            {[
              { id: 'book', label: 'Book Chiller', icon: <QrCode className="h-4 w-4" /> },
              { id: 'bookings', label: 'My Bookings', icon: <History className="h-4 w-4" /> },
              { id: 'wallet', label: 'Wallet', icon: <Wallet className="h-4 w-4" /> }
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

        {/* Book Chiller Tab */}
        {activeTab === 'book' && (
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
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">₹{calculateCost()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Platform fee:</span>
                        <span className="font-medium">₹{Math.round(parseFloat(calculateCost() || 0) * 0.1)}</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                        <span>Total Cost:</span>
                        <span className="text-green-600">₹{Math.round(parseFloat(calculateCost() || 0) * 1.1)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Wallet Balance:</span>
                        <span className={`font-medium ${walletBalance >= Math.round(parseFloat(calculateCost() || 0) * 1.1) ? 'text-green-600' : 'text-red-600'}`}>
                          ₹{walletBalance}
                        </span>
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
                      Amount will be deducted from wallet
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select a chiller to see booking details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* My Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">My Bookings</h2>
            
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.chiller}</h3>
                      <p className="text-sm text-gray-600">by {booking.owner}</p>
                      <p className="text-xs text-gray-500">Booking ID: {booking.id}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'Active' ? 'bg-green-100 text-green-800' :
                        booking.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">{booking.date}</p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="block text-gray-600">Volume:</span>
                      <span className="font-medium">{booking.volume}</span>
                    </div>
                    <div>
                      <span className="block text-gray-600">Duration:</span>
                      <span className="font-medium">{booking.duration}</span>
                    </div>
                    <div>
                      <span className="block text-gray-600">Amount:</span>
                      <span className="font-medium text-green-600">₹{booking.amount}</span>
                    </div>
                    <div>
                      <span className="block text-gray-600">Time Left:</span>
                      <span className="font-medium">{booking.timeLeft}</span>
                    </div>
                  </div>
                  
                  {booking.status === 'Active' && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-blue-900">QR Code for Access</p>
                          <p className="text-sm text-blue-700">Show this code at the chiller location</p>
                        </div>
                        <div className="text-right">
                          <QrCode className="h-8 w-8 text-blue-600 mx-auto mb-1" />
                          <p className="font-mono text-sm font-semibold text-blue-900">{booking.qrCode}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => viewBookingDetails(booking)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                    <button
                      onClick={() => downloadReceipt(booking)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Receipt className="h-4 w-4 mr-2" />
                      Download Receipt
                    </button>
                  </div>
                </div>
              ))}
              
              {bookings.length === 0 && (
                <div className="text-center py-12">
                  <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No bookings yet</p>
                  <button
                    onClick={() => setActiveTab('book')}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Book Your First Chiller
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wallet Tab */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Wallet Balance</h2>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAddMoneyModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Money
                  </button>
                  <button
                    onClick={() => setShowDeductMoneyModal(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center"
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Deduct Money
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 mb-2">Available Balance</p>
                    <p className="text-3xl font-bold">₹{walletBalance}</p>
                  </div>
                  <Wallet className="h-12 w-12 text-blue-200" />
                </div>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-xl font-semibold text-gray-900">₹{transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0)}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-xl font-semibold text-gray-900">{bookings.length}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Active Bookings</p>
                  <p className="text-xl font-semibold text-gray-900">{bookings.filter(b => b.status === 'Active').length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-600">{transaction.date} • {transaction.time}</p>
                      {transaction.bookingId && (
                        <p className="text-xs text-gray-500">Booking: {transaction.bookingId}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{transaction.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Money Modal */}
        {showAddMoneyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Add Money to Wallet</h2>
                <button 
                  onClick={() => setShowAddMoneyModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter amount"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {[100, 500, 1000].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setAddAmount(amount.toString())}
                      className="py-2 px-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <div className="space-y-2">
                    {[
                      { id: 'upi', label: 'UPI Payment', icon: <Smartphone className="h-4 w-4" /> },
                      { id: 'card', label: 'Demo Card', icon: <CreditCard className="h-4 w-4" /> },
                      { id: 'paytm', label: 'Paytm Wallet', icon: <Wallet className="h-4 w-4" /> }
                    ].map(method => (
                      <label key={method.id} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <div className="ml-3 flex items-center">
                          {method.icon}
                          <span className="ml-2 text-sm font-medium text-gray-900">{method.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowAddMoneyModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMoney}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Add Money
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Deduct Money Modal */}
        {showDeductMoneyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Deduct Money from Wallet</h2>
                <button 
                  onClick={() => setShowDeductMoneyModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    value={deductAmount}
                    onChange={(e) => setDeductAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter amount to deduct"
                    max={walletBalance}
                  />
                  <p className="text-sm text-gray-500 mt-1">Available balance: ₹{walletBalance}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Deduction</label>
                  <textarea
                    value={deductReason}
                    onChange={(e) => setDeductReason(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter reason for deduction..."
                    rows={3}
                  />
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Bell className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Important Notice</h3>
                      <p className="text-sm text-red-700 mt-1">
                        This action will permanently deduct money from your wallet. Please ensure the amount and reason are correct.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowDeductMoneyModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeductMoney}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Deduct Money
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Receipt Modal */}
        {showReceiptModal && selectedReceipt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Booking Receipt</h2>
                <button 
                  onClick={() => setShowReceiptModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center border-b pb-4">
                  <h3 className="text-lg font-bold text-gray-900">CoolKisan</h3>
                  <p className="text-sm text-gray-600">Smart Milk Chilling Platform</p>
                  <p className="text-xs text-gray-500">Receipt #{selectedReceipt.id}</p>
                </div>

                {/* Booking Details */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Booking ID:</span>
                    <span className="text-sm font-medium">{selectedReceipt.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Date & Time:</span>
                    <span className="text-sm font-medium">{selectedReceipt.date} {selectedReceipt.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`text-sm font-medium ${
                      selectedReceipt.status === 'Active' ? 'text-green-600' :
                      selectedReceipt.status === 'Completed' ? 'text-blue-600' :
                      'text-yellow-600'
                    }`}>
                      {selectedReceipt.status}
                    </span>
                  </div>
                </div>

                {/* Service Details */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Service Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Chiller:</span>
                      <span className="text-sm font-medium">{selectedReceipt.chiller}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Owner:</span>
                      <span className="text-sm font-medium">{selectedReceipt.owner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Location:</span>
                      <span className="text-sm font-medium">{selectedReceipt.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Volume:</span>
                      <span className="text-sm font-medium">{selectedReceipt.volume}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Duration:</span>
                      <span className="text-sm font-medium">{selectedReceipt.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Temperature:</span>
                      <span className="text-sm font-medium">{selectedReceipt.temperature}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Payment Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Payment Method:</span>
                      <span className="text-sm font-medium">{selectedReceipt.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Transaction ID:</span>
                      <span className="text-sm font-medium font-mono">{selectedReceipt.transactionId}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                      <span>Total Amount:</span>
                      <span className="text-green-600">₹{selectedReceipt.amount}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm">{selectedReceipt.ownerPhone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm">{selectedReceipt.ownerEmail}</span>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                {selectedReceipt.status === 'Active' && (
                  <div className="border-t pt-4 text-center">
                    <h4 className="font-semibold text-gray-900 mb-3">Access QR Code</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <QrCode className="h-16 w-16 text-blue-600 mx-auto mb-2" />
                      <p className="font-mono text-lg font-semibold text-gray-900">{selectedReceipt.qrCode}</p>
                      <p className="text-xs text-gray-500 mt-1">Show this code at chiller location</p>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="border-t pt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Thank you for using CoolKisan!
                  </p>
                  <p className="text-xs text-gray-500">
                    For support: support@coolkisan.com | +91 98765 43210
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={generateReceiptPDF}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerApp;