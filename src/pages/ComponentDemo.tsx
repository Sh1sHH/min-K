import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, ChevronRight, X, AlertTriangle, Info } from 'lucide-react';

interface Card {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  time: string;
}

const ComponentDemo = () => {
  const [activeTab, setActiveTab] = useState('cards');
  
  const cards: Card[] = [
    {
      id: 1,
      title: "Modern Card Design",
      description: "Glass morphism effect with hover animations",
      icon: <Bell className="w-6 h-6" />,
      color: "from-purple-500/20 to-blue-500/20"
    },
    {
      id: 2,
      title: "Interactive Elements",
      description: "Smooth transitions and micro-interactions",
      icon: <Check className="w-6 h-6" />,
      color: "from-green-500/20 to-teal-500/20"
    },
    {
      id: 3,
      title: "Responsive Layout",
      description: "Adapts perfectly to all screen sizes",
      icon: <ChevronRight className="w-6 h-6" />,
      color: "from-orange-500/20 to-red-500/20"
    }
  ];

  const notifications: Notification[] = [
    {
      id: 1,
      title: "Success",
      message: "Your changes have been saved successfully!",
      type: "success",
      time: "Just now"
    },
    {
      id: 2,
      title: "Error",
      message: "Failed to connect to the server.",
      type: "error",
      time: "5m ago"
    },
    {
      id: 3,
      title: "Warning",
      message: "Your session will expire in 5 minutes.",
      type: "warning",
      time: "10m ago"
    },
    {
      id: 4,
      title: "Info",
      message: "New features are available.",
      type: "info",
      time: "1h ago"
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'error':
        return <X className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Component Demo
        </h1>
        <p className="text-gray-400 mb-8">Modern UI components with animations</p>

        {/* Navigation */}
        <div className="flex space-x-4 mb-8">
          {['cards', 'notifications', 'alerts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card) => (
                  <motion.div
                    key={card.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 rounded-xl backdrop-blur-xl bg-gradient-to-br ${card.color} border border-white/10`}
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-white/10 rounded-lg">
                        {card.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                    <p className="text-gray-400">{card.description}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4 max-w-2xl">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <span className="text-xs text-gray-400">{notification.time}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-400">{notification.message}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="space-y-4 max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-green-500/10 border border-green-500/20"
                >
                  <div className="flex">
                    <Check className="w-5 h-5 text-green-500" />
                    <div className="ml-3">
                      <h3 className="text-green-500 font-medium">Success Alert</h3>
                      <div className="mt-2 text-sm text-green-400">
                        Everything worked as expected.
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-red-500/10 border border-red-500/20"
                >
                  <div className="flex">
                    <X className="w-5 h-5 text-red-500" />
                    <div className="ml-3">
                      <h3 className="text-red-500 font-medium">Error Alert</h3>
                      <div className="mt-2 text-sm text-red-400">
                        There was an error processing your request.
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                >
                  <div className="flex">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <div className="ml-3">
                      <h3 className="text-yellow-500 font-medium">Warning Alert</h3>
                      <div className="mt-2 text-sm text-yellow-400">
                        Please be careful with this action.
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20"
                >
                  <div className="flex">
                    <Info className="w-5 h-5 text-blue-500" />
                    <div className="ml-3">
                      <h3 className="text-blue-500 font-medium">Info Alert</h3>
                      <div className="mt-2 text-sm text-blue-400">
                        Here's some helpful information.
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ComponentDemo; 