import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, ChevronRight, X, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import GlowCard from '../components/GlowCard';
import { Button } from '../components/ui/moving-border';

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
  const [activeTab, setActiveTab] = useState('buttons');
  
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
          {['buttons', 'hero', 'glow', 'cards', 'notifications', 'alerts'].map((tab) => (
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
            {activeTab === 'buttons' && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Default Button */}
                  <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5">
                    <Button className="bg-slate-900 text-white border-neutral-800">
                      Default Button
                    </Button>
                    <p className="mt-4 text-sm text-gray-400">Default style with moving border</p>
                  </div>

                  {/* Purple Glow Button */}
                  <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5">
                    <Button 
                      className="bg-purple-900/80 text-white border-purple-800"
                      borderClassName="bg-[radial-gradient(var(--purple-500)_40%,transparent_60%)]"
                    >
                      Purple Glow
                    </Button>
                    <p className="mt-4 text-sm text-gray-400">Purple variant with custom glow</p>
                  </div>

                  {/* Green Success Button */}
                  <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5">
                    <Button 
                      className="bg-green-900/80 text-white border-green-800"
                      borderClassName="bg-[radial-gradient(var(--green-500)_40%,transparent_60%)]"
                      duration={3000}
                    >
                      Success Action
                    </Button>
                    <p className="mt-4 text-sm text-gray-400">Success variant with slower animation</p>
                  </div>

                  {/* Wide Button */}
                  <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5">
                    <Button 
                      className="bg-slate-900 text-white border-neutral-800 !w-64"
                      containerClassName="!w-64"
                    >
                      Wide Button
                    </Button>
                    <p className="mt-4 text-sm text-gray-400">Custom width variant</p>
                  </div>

                  {/* Rounded Button */}
                  <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5">
                    <Button 
                      borderRadius="9999px"
                      className="bg-pink-900/80 text-white border-pink-800"
                      borderClassName="bg-[radial-gradient(var(--pink-500)_40%,transparent_60%)]"
                    >
                      Rounded Style
                    </Button>
                    <p className="mt-4 text-sm text-gray-400">Fully rounded variant</p>
                  </div>

                  {/* Fast Animation */}
                  <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5">
                    <Button 
                      className="bg-blue-900/80 text-white border-blue-800"
                      borderClassName="bg-[radial-gradient(var(--blue-500)_40%,transparent_60%)]"
                      duration={1000}
                    >
                      Fast Border
                    </Button>
                    <p className="mt-4 text-sm text-gray-400">Faster animation speed</p>
                  </div>
                </div>

                {/* Code Example */}
                <div className="mt-12 p-6 rounded-xl bg-white/5">
                  <h3 className="text-xl font-semibold mb-4">Usage Example</h3>
                  <pre className="p-4 rounded-lg bg-black/30 overflow-x-auto">
                    <code className="text-sm text-gray-300">
{`<Button
  className="bg-slate-900 text-white"
  borderClassName="bg-[radial-gradient(var(--purple-500)_40%,transparent_60%)]"
  duration={2000}
>
  Custom Button
</Button>`}
                    </code>
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'hero' && (
              <>
                <div className="relative overflow-hidden rounded-2xl">
                  {/* Animated Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800 opacity-20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800 opacity-40 animate-[gradientMove_8s_ease-in-out_infinite]" 
                    style={{
                      '--tw-gradient-from': '#4F1C48',
                      '--tw-gradient-via': '#2C0633',
                      '--tw-gradient-to': '#1B0421',
                      backgroundSize: '200% 200%',
                      animation: 'gradientMove 8s ease-in-out infinite',
                    }}
                  />
                  
                  {/* Content */}
                  <div className="relative px-6 py-24 sm:px-12 sm:py-32 lg:px-16">
                    <div className="mx-auto max-w-2xl text-center">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h2 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                          İK süreçlerini dert etmeyin
                        </h2>
                        <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                          minİK halleder.
                        </h2>
                      </motion.div>
                      
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 text-lg leading-8 text-gray-300"
                      >
                        Zamanınızı bordrolarla, izin takibiyle ya da işe alım stresleriyle harcamayın.
                      </motion.p>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-10 flex items-center justify-center gap-x-6"
                      >
                        <a
                          href="#"
                          className="rounded-full px-8 py-4 text-lg font-semibold text-white shadow-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 transition-all duration-300 hover:scale-105"
                        >
                          Hemen Başla
                        </a>
                        <a
                          href="#"
                          className="rounded-full px-8 py-4 text-lg font-semibold text-white/90 ring-1 ring-white/20 hover:ring-white/40 hover:bg-white/5 transition-all duration-300"
                        >
                          Tanıtımı İzleyin
                        </a>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Updated Card with Rotating Border */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-12"
                >
                  <div className="animated-border">
                    <div className="inner-card">
                      <h2 className="text-3xl font-bold mb-8">
                        İK Süreçlerinizi Kolaylaştırın
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-8">
                          <div>
                            <div className="text-5xl font-bold text-white mb-2">85%</div>
                            <div className="text-gray-400">Zaman Tasarrufu</div>
                          </div>
                          
                          <div>
                            <div className="text-5xl font-bold text-pink-500">24/7</div>
                            <div className="text-gray-400">Kesintisiz Hizmet</div>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/20">
                              <Check className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                              <h3 className="font-medium text-white">Otomatik Bordro Hesaplama</h3>
                              <p className="text-sm text-gray-400 mt-1">
                                Dakikalar içinde bordro işlemlerinizi tamamlayın
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/20">
                              <Check className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                              <h3 className="font-medium text-white">İzin Yönetimi</h3>
                              <p className="text-sm text-gray-400 mt-1">
                                Tek tıklama talepleri ve onay süreci
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}

            {activeTab === 'glow' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlowCard />
              </motion.div>
            )}

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