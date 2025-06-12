import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Truck, 
  Users, 
  Shield, 
  Smartphone, 
  MapPin, 
  Clock, 
  DollarSign,
  Star,
  ArrowRight,
  Snowflake,
  Droplets,
  BarChart3
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: 'Find Nearby Chillers',
      description: 'Locate and book the closest available chillers in real-time',
      action: () => navigate('/map'),
      buttonText: 'Find Chillers'
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: 'Flexible Timing',
      description: 'Book for hours, days, or ongoing basis based on your needs',
      action: () => navigate('/farmer'),
      buttonText: 'Book Now'
    },
    {
      icon: <Truck className="h-8 w-8 text-purple-600" />,
      title: 'Mobile Chillers',
      description: 'On-demand mobile chilling units that come to your location',
      action: () => navigate('/map'),
      buttonText: 'Request Mobile'
    },
    {
      icon: <DollarSign className="h-8 w-8 text-orange-600" />,
      title: 'Fair Pricing',
      description: 'Transparent pricing starting from ₹1/litre with no hidden fees',
      action: () => navigate('/pricing'),
      buttonText: 'View Pricing'
    },
    {
      icon: <Smartphone className="h-8 w-8 text-red-600" />,
      title: 'Easy QR Check-in',
      description: 'Simple QR code scanning for quick chiller access',
      action: () => navigate('/farmer'),
      buttonText: 'Get QR Code'
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      title: 'Quality Assured',
      description: 'Maintain milk quality and reduce spoilage with proper cooling',
      action: () => navigate('/about'),
      buttonText: 'Learn More'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Farmers Connected' },
    { number: '500+', label: 'Chillers Available' },
    { number: '50L+', label: 'Milk Preserved Daily' },
    { number: '99%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Smart Milk
                <span className="text-blue-600"> Chilling</span>
                <br />
                for Every Farmer
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect with community chillers, preserve milk quality, and maximize your profits. 
                Book chilling space like booking a ride - simple, fast, and reliable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/login?type=farmer"
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
                >
                  Start as Farmer
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login?type=chiller-owner"
                  className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                >
                  List Your Chiller
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Snowflake className="h-6 w-6 text-blue-600" />
                      <span className="font-semibold">Chiller Available</span>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      2.5 km away
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-semibold">200L available</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rate:</span>
                      <span className="font-semibold text-green-600">₹1.5/L per 8hrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 font-semibold">4.8</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/payment"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-4 hover:bg-blue-700 transition-colors block text-center"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Milk Preservation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From finding nearby chillers to mobile cooling units, we've got comprehensive solutions 
              for every farmer's needs.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer"
                onClick={feature.action}
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    feature.action();
                  }}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
                >
                  {feature.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How CoolKisan Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to preserve your milk quality
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Find & Book</h3>
              <p className="text-gray-600">
                Locate nearby chillers on the map and book available slots based on your milk volume and timing needs.
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Droplets className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Drop & Chill</h3>
              <p className="text-gray-600">
                Use QR code to check-in at the chiller location and safely store your milk with optimal temperature control.
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Track & Pay</h3>
              <p className="text-gray-600">
                Monitor your milk status in real-time and pay securely through UPI or digital wallet with automatic invoicing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Milk Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who are already preserving their milk quality and increasing profits with CoolKisan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login?type=farmer"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Get Started Today
            </Link>
            <Link
              to="/about"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;