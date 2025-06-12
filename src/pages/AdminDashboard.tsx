import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Truck, 
  DollarSign,
  TrendingUp,
  MapPin,
  Shield,
  AlertTriangle,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const metrics = [
    {
      title: 'Total Farmers',
      value: '12,450',
      change: '+15.3%',
      icon: <Users className="h-8 w-8 text-blue-600" />,
      trend: 'up'
    },
    {
      title: 'Active Chillers',
      value: '1,280',
      change: '+8.7%',
      icon: <Truck className="h-8 w-8 text-green-600" />,
      trend: 'up'
    },
    {
      title: 'Milk Preserved (L)',
      value: '2.5M',
      change: '+23.1%',
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      trend: 'up'
    },
    {
      title: 'Platform Revenue',
      value: '₹4.2L',
      change: '+18.9%',
      icon: <DollarSign className="h-8 w-8 text-orange-600" />,
      trend: 'up'
    }
  ];

  const regionalData = [
    { state: 'Punjab', farmers: 3200, chillers: 450, volume: '850K L', revenue: '₹1.2L' },
    { state: 'Haryana', farmers: 2800, chillers: 380, volume: '720K L', revenue: '₹98K' },
    { state: 'Uttar Pradesh', farmers: 2100, chillers: 290, volume: '560K L', revenue: '₹84K' },
    { state: 'Rajasthan', farmers: 1800, chillers: 220, volume: '480K L', revenue: '₹72K' },
    { state: 'Gujarat', farmers: 1550, chillers: 180, volume: '420K L', revenue: '₹61K' }
  ];

  const alerts = [
    {
      type: 'warning',
      message: 'High spoilage rate reported in Jaipur region',
      time: '2 hours ago',
      action: 'Review chiller availability'
    },
    {
      type: 'info',
      message: 'New mobile chiller service launched in Amritsar',
      time: '4 hours ago',
      action: 'Monitor adoption rates'
    },
    {
      type: 'error',
      message: 'Payment gateway issues in Bihar region',
      time: '6 hours ago',
      action: 'Contact technical team'
    }
  ];

  const subsidyPrograms = [
    {
      name: 'Solar Chiller Subsidy',
      allocated: '₹50L',
      used: '₹32L',
      beneficiaries: 450,
      status: 'Active'
    },
    {
      name: 'Farmer Training Program',
      allocated: '₹25L',
      used: '₹18L',
      beneficiaries: 1200,
      status: 'Active'
    },
    {
      name: 'Mobile Chiller Initiative',
      allocated: '₹75L',
      used: '₹41L',
      beneficiaries: 280,
      status: 'Active'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CoolKisan Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Platform analytics and management</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="3m">Last 3 Months</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                  <div className={`flex items-center mt-2 text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {metric.change}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  {metric.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Regional Performance & Alerts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Regional Performance</h2>
              <button className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium">
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </button>
            </div>
            <div className="space-y-4">
              {regionalData.map((region, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      {region.state}
                    </h3>
                    <span className="text-sm font-medium text-green-600">{region.revenue}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="block font-medium">Farmers:</span>
                      <span>{region.farmers.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block font-medium">Chillers:</span>
                      <span>{region.chillers}</span>
                    </div>
                    <div>
                      <span className="block font-medium">Volume:</span>
                      <span>{region.volume}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">System Alerts</h2>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className={`border-l-4 p-4 rounded-r-lg ${
                  alert.type === 'error' ? 'border-red-500 bg-red-50' :
                  alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {alert.type === 'error' ? (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      ) : alert.type === 'warning' ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <Shield className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-600 mt-1">{alert.time}</p>
                      <button className={`text-xs font-medium mt-2 ${
                        alert.type === 'error' ? 'text-red-700 hover:text-red-800' :
                        alert.type === 'warning' ? 'text-yellow-700 hover:text-yellow-800' :
                        'text-blue-700 hover:text-blue-800'
                      }`}>
                        {alert.action} →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subsidy Programs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Government Subsidy Programs</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {subsidyPrograms.map((program, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{program.name}</h3>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {program.status}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Allocated:</span>
                    <span className="font-medium">{program.allocated}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Used:</span>
                    <span className="font-medium text-blue-600">{program.used}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Beneficiaries:</span>
                    <span className="font-medium">{program.beneficiaries.toLocaleString()}</span>
                  </div>
                  <div className="pt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(parseInt(program.used.replace('₹', '').replace('L', '')) / 
                                   parseInt(program.allocated.replace('₹', '').replace('L', ''))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round((parseInt(program.used.replace('₹', '').replace('L', '')) / 
                                  parseInt(program.allocated.replace('₹', '').replace('L', ''))) * 100)}% utilized
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group">
              <div className="text-center">
                <Users className="h-8 w-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Manage Users</p>
              </div>
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group">
              <div className="text-center">
                <Truck className="h-8 w-8 text-gray-400 group-hover:text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600 group-hover:text-green-600">Add Chillers</p>
              </div>
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group">
              <div className="text-center">
                <Shield className="h-8 w-8 text-gray-400 group-hover:text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600 group-hover:text-purple-600">Update Policies</p>
              </div>
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors group">
              <div className="text-center">
                <Calendar className="h-8 w-8 text-gray-400 group-hover:text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600 group-hover:text-orange-600">Schedule Reports</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;