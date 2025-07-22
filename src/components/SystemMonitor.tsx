import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Zap, Wifi } from 'lucide-react';

interface SystemStats {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
}

export const SystemMonitor: React.FC = () => {
  const [stats, setStats] = useState<SystemStats>({
    cpu: 0,
    memory: 0,
    storage: 0,
    network: 0
  });

  useEffect(() => {
    const updateStats = () => {
      // Simulate realistic system stats
      setStats({
        cpu: Math.floor(Math.random() * 30) + 10, // 10-40%
        memory: Math.floor(Math.random() * 40) + 30, // 30-70%
        storage: Math.floor(Math.random() * 20) + 60, // 60-80%
        network: Math.floor(Math.random() * 50) + 20 // 20-70%
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: number;
    unit: string;
    color: string;
  }> = ({ icon, title, value, unit, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${color}`}>
            {icon}
          </div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        <span className="text-2xl font-bold text-gray-900">{value}{unit}</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ${
            color.includes('blue') ? 'bg-blue-500' :
            color.includes('green') ? 'bg-green-500' :
            color.includes('purple') ? 'bg-purple-500' :
            'bg-orange-500'
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
      
      <div className="mt-2 text-sm text-gray-600">
        {value < 30 ? 'Low usage' : value < 70 ? 'Normal usage' : 'High usage'}
      </div>
    </div>
  );

  return (
    <div className="p-6 h-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">System Monitor</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            icon={<Cpu className="w-6 h-6 text-white" />}
            title="CPU Usage"
            value={stats.cpu}
            unit="%"
            color="bg-blue-500"
          />
          <StatCard
            icon={<Zap className="w-6 h-6 text-white" />}
            title="Memory"
            value={stats.memory}
            unit="%"
            color="bg-green-500"
          />
          <StatCard
            icon={<HardDrive className="w-6 h-6 text-white" />}
            title="Storage"
            value={stats.storage}
            unit="%"
            color="bg-purple-500"
          />
          <StatCard
            icon={<Wifi className="w-6 h-6 text-white" />}
            title="Network"
            value={stats.network}
            unit="%"
            color="bg-orange-500"
          />
        </div>

        {/* System Information */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Operating System:</span>
                <span className="font-medium">WebOS 1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Browser:</span>
                <span className="font-medium">{navigator.userAgent.split(' ')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Screen Resolution:</span>
                <span className="font-medium">{window.screen.width} × {window.screen.height}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Uptime:</span>
                <span className="font-medium">{Math.floor(performance.now() / 1000 / 60)} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Language:</span>
                <span className="font-medium">{navigator.language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform:</span>
                <span className="font-medium">{navigator.platform}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};