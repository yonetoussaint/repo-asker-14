
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Search, Clock, CreditCard, MapPin, Phone, History, Plus, User, Shield, DollarSign, Smartphone, Bell, Users, LogIn, UserPlus, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import HeroBanner from '@/components/home/HeroBanner';
import AliExpressHeader from '@/components/home/AliExpressHeader';

const TransferHomePage: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'send',
      title: 'Send',
      icon: <Send className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      action: () => navigate('/multi-step-transfer')
    },
    {
      id: 'track',
      title: 'Track',
      icon: <Search className="h-6 w-6" />,
      color: 'from-emerald-500 to-emerald-600',
      hoverColor: 'hover:from-emerald-600 hover:to-emerald-700',
      action: () => console.log('Track transfer')
    },
    {
      id: 'rates',
      title: 'Rates',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      action: () => console.log('View exchange rates')
    },
    {
      id: 'fees',
      title: 'Fees',
      icon: <CreditCard className="h-6 w-6" />,
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700',
      action: () => console.log('Fee calculator')
    },
    {
      id: 'history',
      title: 'History',
      icon: <History className="h-6 w-6" />,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      action: () => console.log('Transfer history')
    },
    {
      id: 'add',
      title: 'Add',
      icon: <Plus className="h-6 w-6" />,
      color: 'from-cyan-500 to-cyan-600',
      hoverColor: 'hover:from-cyan-600 hover:to-cyan-700',
      action: () => console.log('Add recipient')
    },
    {
      id: 'manage',
      title: 'Manage',
      icon: <User className="h-6 w-6" />,
      color: 'from-indigo-500 to-indigo-600',
      hoverColor: 'hover:from-indigo-600 hover:to-indigo-700',
      action: () => console.log('Manage recipients')
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: <User className="h-6 w-6" />,
      color: 'from-slate-500 to-slate-600',
      hoverColor: 'hover:from-slate-600 hover:to-slate-700',
      action: () => console.log('User profile')
    },
    {
      id: 'verify',
      title: 'Verify',
      icon: <Shield className="h-6 w-6" />,
      color: 'from-yellow-500 to-yellow-600',
      hoverColor: 'hover:from-yellow-600 hover:to-yellow-700',
      action: () => console.log('Identity verification')
    },
    {
      id: 'secure',
      title: 'Secure',
      icon: <Shield className="h-6 w-6" />,
      color: 'from-red-500 to-red-600',
      hoverColor: 'hover:from-red-600 hover:to-red-700',
      action: () => console.log('Security settings')
    },
    {
      id: 'topup',
      title: 'Topup',
      icon: <Plus className="h-6 w-6" />,
      color: 'from-teal-500 to-teal-600',
      hoverColor: 'hover:from-teal-600 hover:to-teal-700',
      action: () => console.log('Add funds')
    },
    {
      id: 'balance',
      title: 'Balance',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'from-lime-500 to-lime-600',
      hoverColor: 'hover:from-lime-600 hover:to-lime-700',
      action: () => console.log('Check balance')
    },
    {
      id: 'withdraw',
      title: 'Withdraw',
      icon: <DollarSign className="h-6 w-6" />,
      color: 'from-amber-500 to-amber-600',
      hoverColor: 'hover:from-amber-600 hover:to-amber-700',
      action: () => console.log('Withdraw funds')
    },
    {
      id: 'app',
      title: 'App',
      icon: <Smartphone className="h-6 w-6" />,
      color: 'from-violet-500 to-violet-600',
      hoverColor: 'hover:from-violet-600 hover:to-violet-700',
      action: () => console.log('Download app')
    },
    {
      id: 'notify',
      title: 'Notify',
      icon: <Bell className="h-6 w-6" />,
      color: 'from-pink-500 to-pink-600',
      hoverColor: 'hover:from-pink-600 hover:to-pink-700',
      action: () => console.log('Manage notifications')
    },
    {
      id: 'help',
      title: 'Help',
      icon: <Phone className="h-6 w-6" />,
      color: 'from-rose-500 to-rose-600',
      hoverColor: 'hover:from-rose-600 hover:to-rose-700',
      action: () => console.log('Customer support')
    },
    {
      id: 'refer',
      title: 'Refer',
      icon: <Users className="h-6 w-6" />,
      color: 'from-fuchsia-500 to-fuchsia-600',
      hoverColor: 'hover:from-fuchsia-600 hover:to-fuchsia-700',
      action: () => console.log('Refer friends')
    },
    {
      id: 'login',
      title: 'Login',
      icon: <LogIn className="h-6 w-6" />,
      color: 'from-sky-500 to-sky-600',
      hoverColor: 'hover:from-sky-600 hover:to-sky-700',
      action: () => console.log('Sign in')
    },
    {
      id: 'signup',
      title: 'Signup',
      icon: <UserPlus className="h-6 w-6" />,
      color: 'from-emerald-500 to-emerald-600',
      hoverColor: 'hover:from-emerald-600 hover:to-emerald-700',
      action: () => console.log('Create account')
    },
    {
      id: 'lang',
      title: 'Lang',
      icon: <Globe className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      action: () => console.log('Toggle language')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Use AliExpressHeader but without category tabs */}
      <div className="relative">
        <div className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-md mx-auto px-4 py-1">
            <div className="flex items-center justify-between h-10">
              {/* Left: Logo */}
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  <div className="text-orange-500 font-bold text-lg">Ali</div>
                  <div className="text-gray-700 font-bold text-lg">Express</div>
                </div>
              </div>

              {/* Center: Search Bar */}
              <div className="flex flex-1 mx-2">
                <div className="w-full">
                  <div className="relative flex items-center w-full">
                    <div className="absolute left-2">
                      <Search className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-7 pr-11 py-1 h-7 rounded-full text-xs border border-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Search transfers..."
                    />
                  </div>
                </div>
              </div>

              {/* Right: Language and Notifications */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <div className="flex items-center bg-black bg-opacity-40 px-2 py-1 rounded-full space-x-1">
                  <img
                    src="https://flagcdn.com/us.svg"
                    alt="USA"
                    className="h-4 w-4 rounded-full object-cover"
                  />
                  <span className="text-white text-xs font-medium">EN</span>
                </div>
                <div className="cursor-pointer relative hover:bg-black hover:bg-opacity-30 p-1 rounded-full">
                  <div className="h-4 w-4 text-gray-600 relative">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                    </svg>
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] rounded-full h-3.5 w-3.5 flex items-center justify-center">
                      2
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hero Banner */}
      <HeroBanner />
      
      {/* Quick Actions Section - 5.5 icons visible on mobile */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="overflow-x-auto py-6">
          <div className="flex gap-3 px-4" style={{ width: 'max-content' }}>
            {quickActions.map((action, index) => (
              <button
                key={action.id}
                onClick={action.action}
                className="group flex flex-col items-center space-y-2 p-2 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex-shrink-0"
                style={{ width: '60px' }}
              >
                <div className={`
                  relative w-11 h-11 rounded-2xl bg-gradient-to-br ${action.color} ${action.hoverColor}
                  flex items-center justify-center text-white shadow-lg
                  transition-all duration-300 group-hover:shadow-xl
                  before:absolute before:inset-0 before:rounded-2xl before:bg-white before:opacity-0 
                  before:transition-opacity before:duration-300 group-hover:before:opacity-10
                `}>
                  <div className="scale-90">
                    {action.icon}
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300 text-center leading-tight">
                  {action.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-white py-8">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Send Money to Haiti
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            Fast, secure, and reliable money transfers with competitive exchange rates
          </p>
        </div>
      </div>

      {/* Featured Section */}
      <div className="max-w-md mx-auto px-4 pb-20">
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl">
          <h3 className="text-xl font-bold mb-6">Why Choose Our Service?</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
              <span className="text-gray-100">Competitive exchange rates</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
              <span className="text-gray-100">24-48 hour delivery</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              <span className="text-gray-100">Secure & encrypted transfers</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
              <span className="text-gray-100">Multiple pickup locations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferHomePage;