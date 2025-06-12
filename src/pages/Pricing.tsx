import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Check, 
  Calculator, 
  Clock, 
  Snowflake, 
  Zap,
  Star,
  Info,
  ArrowRight,
  CreditCard,
  Phone
} from 'lucide-react';

const Pricing = () => {
  const navigate = useNavigate();
  const [volume, setVolume] = useState('100');
  const [duration, setDuration] = useState('8');
  const [chillerType, setChillerType] = useState('standard');

  const pricingTiers = [
    {
      name: 'Standard Cooling',
      icon: <Snowflake className="h-8 w-8 text-blue-600" />,
      baseRate: 1.0,
      temperature: '-2°C to 0°C',
      description: 'Basic milk cooling for regular preservation',
      features: [
        '8-hour cooling cycles',
        'Standard temperature control',
        'Basic quality monitoring',
        'SMS notifications',
        'Standard support'
      ],
      popular: false
    },
    {
      name: 'Premium Cooling',
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      baseRate: 1.5,
      temperature: '-3°C to -1°C',
      description: 'Enhanced cooling with better temperature control',
      features: [
        'Flexible cooling duration',
        'Advanced temperature control',
        'Real-time quality monitoring',
        'App & SMS notifications',
        'Priority support',
        'Quality reports'
      ],
      popular: true
    },
    {
      name: 'Express Cooling',
      icon: <Clock className="h-8 w-8 text-red-600" />,
      baseRate: 2.0,
      temperature: '-4°C to -2°C',
      description: 'Rapid cooling for urgent preservation needs',
      features: [
        'Immediate cooling (< 30 min)',
        'Deep freeze capability',
        'Continuous monitoring',
        'Instant notifications',
        '24/7 priority support',
        'Detailed analytics',
        'Insurance coverage'
      ],
      popular: false
    }
  ];

  const calculatePrice = () => {
    const baseRate = pricingTiers.find(tier => tier.name.toLowerCase().includes(chillerType))?.baseRate || 1.0;
    const volumeNum = parseFloat(volume) || 0;
    const durationNum = parseFloat(duration) || 8;
    
    // Base calculation
    let price = baseRate * volumeNum;
    
    // Duration multiplier
    if (durationNum > 8) {
      price *= (durationNum / 8);
    }
    
    // Volume discounts
    if (volumeNum > 500) {
      price *= 0.85; // 15% discount for bulk
    } else if (volumeNum > 200) {
      price *= 0.9; // 10% discount for medium volume
    }
    
    return price.toFixed(2);
  };

  const subscriptionPlans = [
    {
      name: 'Starter',
      price: '₹299',
      period: '/month',
      volume: '500L',
      description: 'Perfect for small-scale farmers',
      features: [
        'Up to 500L cooling per month',
        'Standard cooling rates',
        'Basic support',
        'Mobile app access'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '₹799',
      period: '/month',
      volume: '1,500L',
      description: 'Ideal for medium-scale operations',
      features: [
        'Up to 1,500L cooling per month',
        'Premium cooling rates',
        'Priority support',
        'Advanced analytics',
        '20% discount on additional volume'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '₹1,999',
      period: '/month',
      volume: '5,000L',
      description: 'For large-scale dairy operations',
      features: [
        'Up to 5,000L cooling per month',
        'All cooling types included',
        'Dedicated account manager',
        'Custom integrations',
        '30% discount on additional volume',
        'Premium insurance coverage'
      ],
      popular: false
    }
  ];

  const handleBookNow = (tierName: string) => {
    // Store selected tier in localStorage for payment page
    localStorage.setItem('selectedTier', JSON.stringify({
      name: tierName,
      volume: volume,
      duration: duration,
      estimatedCost: calculatePrice()
    }));
    navigate('/payment');
  };

  const handleSubscribe = (planName: string, price: string) => {
    // Store selected subscription plan
    localStorage.setItem('selectedSubscription', JSON.stringify({
      name: planName,
      price: price,
      type: 'subscription'
    }));
    navigate('/payment');
  };

  const handleContactSales = () => {
    // Navigate to contact page with sales inquiry pre-filled
    navigate('/contact', { 
      state: { 
        subject: 'Custom Solution Inquiry',
        userType: 'potential-user',
        message: 'I am interested in a custom pricing solution for large-scale operations. Please contact me to discuss my requirements.'
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Transparent, Fair Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the cooling solution that fits your needs. No hidden fees, no surprises.
            Pay only for what you use.
          </p>
        </div>

        {/* Pricing Calculator */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <Calculator className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900">Pricing Calculator</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Milk Volume (Litres)
                </label>
                <input
                  type="number"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter volume"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <option value="48">48 Hours</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cooling Type
                </label>
                <div className="space-y-2">
                  {['standard', 'premium', 'express'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        value={type}
                        checked={chillerType === type}
                        onChange={(e) => setChillerType(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{type} Cooling</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estimated Cost</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Volume:</span>
                  <span className="font-medium">{volume}L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{duration} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{chillerType}</span>
                </div>
                <div className="border-t border-blue-200 pt-3">
                  <div className="flex justify-between text-2xl font-bold text-blue-600">
                    <span>Total:</span>
                    <span>₹{calculatePrice()}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {parseFloat(volume) > 200 && (
                    <div className="flex items-center mt-2">
                      <Info className="h-4 w-4 mr-1" />
                      Volume discount applied!
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleBookNow(chillerType)}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Pay-per-Use Pricing */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pay-per-Use Pricing</h2>
            <p className="text-lg text-gray-600">Flexible rates based on your cooling requirements</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg p-8 relative ${
                  tier.popular ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    {tier.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{tier.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{tier.description}</p>
                  <div className="text-3xl font-bold text-gray-900">
                    ₹{tier.baseRate}
                    <span className="text-lg font-medium text-gray-500">/L</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Base rate for 8 hours</p>
                  <p className="text-sm font-medium text-blue-600 mt-2">{tier.temperature}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleBookNow(tier.name)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                    tier.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Choose {tier.name}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Subscription Plans</h2>
            <p className="text-lg text-gray-600">Save more with monthly subscriptions</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg p-8 relative ${
                  plan.popular ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Best Value
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  <div className="text-4xl font-bold text-gray-900">
                    {plan.price}
                    <span className="text-lg font-medium text-gray-500">{plan.period}</span>
                  </div>
                  <p className="text-sm text-purple-600 font-medium mt-2">
                    Includes {plan.volume} monthly
                  </p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleSubscribe(plan.name, plan.price)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                    plan.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Choose {plan.name}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need a Custom Solution?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            For large-scale operations, bulk requirements, or custom integrations, 
            we offer tailored pricing packages to meet your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleContactSales}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Phone className="h-5 w-5 mr-2" />
              Contact Sales Team
            </button>
            <Link
              to="/contact"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center"
            >
              Get Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;