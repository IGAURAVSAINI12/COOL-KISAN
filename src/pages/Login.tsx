import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  User,
  Snowflake,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Get user type from URL params or default to farmer
  const userTypeFromUrl = searchParams.get('type') || 'farmer';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: userTypeFromUrl
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate fetching users from db.json (replace with real API in production)
    const response = await fetch('http://localhost:3000/');
    const data = await response.json();
    const users = data.users || [];
    if (isLogin) {
      // Login logic
      const found = users.find(
        (u: any) =>
          u.email === formData.email &&
          u.password === formData.password &&
          u.userType === formData.userType
      );
      if (found) {
        login(found, (document.getElementById('remember-me') as HTMLInputElement)?.checked);
        if (found.userType === 'farmer') navigate('/farmer');
        else if (found.userType === 'chiller-owner') navigate('/chiller-owner');
      } else {
        alert('Invalid credentials');
      }
    } else {
      // Signup logic
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      if (users.some((u: any) => u.email === formData.email)) {
        alert('Email already registered');
        return;
      }
      const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        userType: formData.userType
      };
      users.push(newUser);
      // Save to db.json (simulate, in real app use API)
      await fetch('http://localhost:3000/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users })
      });
      login(newUser, true);
      if (newUser.userType === 'farmer') navigate('/farmer');
      else if (newUser.userType === 'chiller-owner') navigate('/chiller-owner');
    }
  };

  const getUserTypeTitle = () => {
    return formData.userType === 'farmer' ? 'Farmer' : 'Chiller Owner';
  };

  const getUserTypeDescription = () => {
    if (formData.userType === 'farmer') {
      return isLogin 
        ? 'Access your farmer dashboard and book chillers'
        : 'Join thousands of farmers preserving milk quality';
    } else {
      return isLogin
        ? 'Manage your chillers and track earnings'
        : 'Start earning by listing your chiller';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Snowflake className="h-8 w-8 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-800">CoolKisan</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? `Welcome Back, ${getUserTypeTitle()}` : `Join as ${getUserTypeTitle()}`}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {getUserTypeDescription()}
          </p>
        </div>

        {/* User Type Switcher */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setFormData({...formData, userType: 'farmer'})}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                formData.userType === 'farmer'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              I'm a Farmer
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, userType: 'chiller-owner'})}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                formData.userType === 'chiller-owner'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              I own a Chiller
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={!isLogin}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required={!isLogin}
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required={!isLogin}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </a>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              {isLogin ? `Sign In as ${getUserTypeTitle()}` : `Create ${getUserTypeTitle()} Account`}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                <Phone className="h-5 w-5" />
                <span className="ml-2">Phone</span>
              </button>
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                <Mail className="h-5 w-5" />
                <span className="ml-2">Google</span>
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 font-medium text-blue-600 hover:text-blue-500"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            {formData.userType === 'farmer' ? 'For Farmers' : 'For Chiller Owners'}
          </h3>
          <div className="space-y-3">
            {formData.userType === 'farmer' ? (
              <>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Find chillers within 5km radius
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  Save up to 80% on milk spoilage
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                  Secure payments with UPI integration
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Earn money from your chiller
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  Manage bookings easily
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                  Track earnings and analytics
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;