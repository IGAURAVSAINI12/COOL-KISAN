import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Shield, 
  CheckCircle,
  ArrowLeft,
  Clock,
  MapPin,
  Droplets,
  Star,
  Lock,
  QrCode
} from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  // Load booking data from localStorage or use default
  useEffect(() => {
    const selectedTier = localStorage.getItem('selectedTier');
    const selectedSubscription = localStorage.getItem('selectedSubscription');
    const selectedBooking = localStorage.getItem('selectedBooking');
    
    if (selectedBooking) {
      const bookingInfo = JSON.parse(selectedBooking);
      setBookingData(bookingInfo);
    } else if (selectedTier) {
      const tierData = JSON.parse(selectedTier);
      setBookingData({
        type: 'pay-per-use',
        chiller: `${tierData.name} Service`,
        owner: 'CoolKisan Network',
        distance: '2.5 km',
        volume: `${tierData.volume}L`,
        duration: `${tierData.duration} hours`,
        rate: '₹1.2/L',
        subtotal: parseFloat(tierData.estimatedCost),
        platformFee: Math.round(parseFloat(tierData.estimatedCost) * 0.1),
        total: Math.round(parseFloat(tierData.estimatedCost) * 1.1),
        rating: 4.8,
        temperature: '-2°C'
      });
    } else if (selectedSubscription) {
      const subData = JSON.parse(selectedSubscription);
      setBookingData({
        type: 'subscription',
        chiller: `${subData.name} Subscription`,
        owner: 'CoolKisan',
        distance: 'All Locations',
        volume: subData.name === 'Starter' ? '500L' : subData.name === 'Professional' ? '1,500L' : '5,000L',
        duration: 'Monthly Plan',
        rate: 'Subscription',
        subtotal: parseInt(subData.price.replace('₹', '')),
        platformFee: 0,
        total: parseInt(subData.price.replace('₹', '')),
        rating: 4.9,
        temperature: 'All Types'
      });
    } else {
      // Default booking data
      setBookingData({
        type: 'pay-per-use',
        chiller: 'Village Community Chiller',
        owner: 'Ramesh Kumar',
        distance: '1.2 km',
        volume: '50L',
        duration: '8 hours',
        rate: '₹1.2/L',
        subtotal: 60,
        platformFee: 6,
        total: 66,
        rating: 4.8,
        temperature: '-2°C'
      });
    }
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      // Clear stored data after successful payment
      localStorage.removeItem('selectedTier');
      localStorage.removeItem('selectedSubscription');
      localStorage.removeItem('selectedBooking');
    }, 3000);
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              {bookingData?.type === 'subscription' 
                ? 'Your subscription has been activated successfully'
                : 'Your chiller has been booked successfully'
              }
            </p>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <QrCode className="h-12 w-12 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {bookingData?.type === 'subscription' ? 'Your Subscription ID' : 'Your QR Code'}
              </p>
              <p className="font-mono text-lg font-semibold text-gray-900">
                {bookingData?.type === 'subscription' ? 'SUB-2024-001234' : 'CK-2024-001234'}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {bookingData?.type === 'subscription' 
                  ? 'Use this ID for all subscription-related queries'
                  : 'Show this code at the chiller location'
                }
              </p>
            </div>

            <div className="space-y-3 text-sm text-left mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {bookingData?.type === 'subscription' ? 'Subscription ID:' : 'Booking ID:'}
                </span>
                <span className="font-medium">
                  {bookingData?.type === 'subscription' ? '#SUB001234' : '#CK001234'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">{bookingData?.chiller}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {bookingData?.type === 'subscription' ? 'Monthly Allowance:' : 'Volume:'}
                </span>
                <span className="font-medium">{bookingData?.volume}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{bookingData?.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-semibold text-green-600">₹{bookingData?.total}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to={bookingData?.type === 'subscription' ? '/farmer' : '/farmer'}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors block text-center"
              >
                {bookingData?.type === 'subscription' ? 'View My Subscription' : 'View My Bookings'}
              </Link>
              <Link
                to="/"
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors block text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-800" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Payment Method</h2>
              
              <div className="space-y-4">
                {/* UPI Payment */}
                <div
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Smartphone className="h-6 w-6 text-blue-600 mr-3" />
                      <div>
                        <h3 className="font-semibold text-gray-900">UPI Payment</h3>
                        <p className="text-sm text-gray-600">Pay using any UPI app</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                        Instant
                      </span>
                      <input
                        type="radio"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="h-4 w-4 text-blue-600"
                      />
                    </div>
                  </div>
                  
                  {paymentMethod === 'upi' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter UPI ID
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@paytm"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                {/* Wallet Payment */}
                <div
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === 'wallet' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setPaymentMethod('wallet')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Wallet className="h-6 w-6 text-green-600 mr-3" />
                      <div>
                        <h3 className="font-semibold text-gray-900">CoolKisan Wallet</h3>
                        <p className="text-sm text-gray-600">Balance: ₹1,250</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      checked={paymentMethod === 'wallet'}
                      onChange={() => setPaymentMethod('wallet')}
                      className="h-4 w-4 text-blue-600"
                    />
                  </div>
                </div>

                {/* Card Payment */}
                <div
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="h-6 w-6 text-purple-600 mr-3" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Credit/Debit Card</h3>
                        <p className="text-sm text-gray-600">Visa, Mastercard, RuPay</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="h-4 w-4 text-blue-600"
                    />
                  </div>
                  
                  {paymentMethod === 'card' && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                            placeholder="MM/YY"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                            placeholder="123"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                          placeholder="John Doe"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-blue-50 rounded-xl p-4 flex items-start">
              <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Secure Payment</h3>
                <p className="text-sm text-blue-700">
                  Your payment information is encrypted and secure. We never store your card details.
                </p>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {bookingData.type === 'subscription' ? 'Subscription Summary' : 'Booking Summary'}
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="border-b pb-4">
                  <h3 className="font-medium text-gray-900">{bookingData.chiller}</h3>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm text-gray-600">{bookingData.rating} • {bookingData.owner}</span>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {bookingData.distance}
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Droplets className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-gray-600">
                        {bookingData.type === 'subscription' ? 'Monthly Allowance:' : 'Volume:'}
                      </span>
                    </div>
                    <span className="font-medium">{bookingData.volume}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-600">Duration:</span>
                    </div>
                    <span className="font-medium">{bookingData.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate:</span>
                    <span className="font-medium">{bookingData.rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Temperature:</span>
                    <span className="font-medium text-blue-600">{bookingData.temperature}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {bookingData.type === 'subscription' ? 'Monthly fee:' : 'Subtotal:'}
                  </span>
                  <span>₹{bookingData.subtotal}</span>
                </div>
                {bookingData.platformFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform fee:</span>
                    <span>₹{bookingData.platformFee}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-green-600">₹{bookingData.total}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Pay ₹{bookingData.total}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By proceeding, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;