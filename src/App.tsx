import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Download, 
  Settings, 
  Monitor,
  Minimize,
  Maximize,
  X,
  Clock,
  Search,
  Grid3X3,
  Palette,
  Calculator,
  FileText,
  Activity,
  Gamepad2
} from 'lucide-react';
import { Calculator as CalculatorApp } from './components/Calculator';
import { TextEditor } from './components/TextEditor';
import { SystemMonitor } from './components/SystemMonitor';
import { SnakeGame } from './components/Games';

interface Window {
  id: string;
  title: string;
  content: React.ReactNode;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface DesktopIcon {
  id: string;
  name: string;
  icon: React.ReactNode;
  action: () => void;
}

const wallpapers = [
  'https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  'https://images.pexels.com/photos/956981/milky-way-starry-sky-night-sky-star-956981.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  'https://images.pexels.com/photos/1906658/pexels-photo-1906658.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
];

function App() {
  const [windows, setWindows] = useState<Window[]>([]);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showWallpaperMenu, setShowWallpaperMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentWallpaper, setCurrentWallpaper] = useState(wallpapers[0]);
  const [autoWallpaper, setAutoWallpaper] = useState(true);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [dragging, setDragging] = useState<{ windowId: string; offset: { x: number; y: number } } | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let wallpaperTimer: NodeJS.Timeout;
    
    if (autoWallpaper) {
      wallpaperTimer = setInterval(() => {
        setWallpaperIndex(prev => {
          const nextIndex = (prev + 1) % wallpapers.length;
          setCurrentWallpaper(wallpapers[nextIndex]);
          return nextIndex;
        });
      }, 10000); // Change every 10 seconds
    }
    
    return () => {
      if (wallpaperTimer) {
        clearInterval(wallpaperTimer);
      }
    };
  }, [autoWallpaper]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        setWindows(prev => prev.map(window => 
          window.id === dragging.windowId 
            ? { 
                ...window, 
                position: { 
                  x: e.clientX - dragging.offset.x, 
                  y: e.clientY - dragging.offset.y 
                } 
              }
            : window
        ));
      }
    };

    const handleMouseUp = () => {
      setDragging(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  const openWindow = (id: string, title: string, content: React.ReactNode) => {
    const newWindow: Window = {
      id,
      title,
      content,
      isMinimized: false,
      isMaximized: false,
      position: { x: 100 + windows.length * 50, y: 100 + windows.length * 50 },
      size: { width: 1000, height: 700 }
    };
    setWindows(prev => [...prev.filter(w => w.id !== id), newWindow]);
  };

  const closeWindow = (windowId: string) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
  };

  const minimizeWindow = (windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: true } : w
    ));
  };

  const maximizeWindow = (windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId 
        ? { 
            ...w, 
            isMaximized: !w.isMaximized,
            position: w.isMaximized ? w.position : { x: 0, y: 0 },
            size: w.isMaximized ? w.size : { width: window.innerWidth, height: window.innerHeight - 60 }
          }
        : w
    ));
  };

  const restoreWindow = (windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: false } : w
    ));
  };

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'resume.pdf';
    link.click();
  };

  const desktopIcons: DesktopIcon[] = [
    {
      id: 'portfolio',
      name: 'Portfolio',
      icon: <User className="w-8 h-8" />,
      action: () => openWindow(
        'portfolio',
        'Portfolio',
        <iframe 
          src="https://ashwetkini-portfolio.netlify.app/" 
          className="w-full h-full border-none"
          title="Portfolio"
        />
      )
    },
    {
      id: 'resume',
      name: 'Resume',
      icon: <Download className="w-8 h-8" />,
      action: downloadResume
    },
    {
      id: 'calculator',
      name: 'Calculator',
      icon: <Calculator className="w-8 h-8" />,
      action: () => openWindow('calculator', 'Calculator', <CalculatorApp />)
    },
    {
      id: 'notepad',
      name: 'Text Editor',
      icon: <FileText className="w-8 h-8" />,
      action: () => openWindow('notepad', 'Text Editor', <TextEditor />)
    }
  ];

  const handleMouseDown = (e: React.MouseEvent, windowId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDragging({
      windowId,
      offset: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    });
  };

  return (
    <div 
      className="h-screen w-screen bg-cover bg-center bg-no-repeat transition-all duration-1000 relative overflow-hidden"
      style={{ backgroundImage: `url(${currentWallpaper})` }}
      onClick={() => {
        setShowStartMenu(false);
        setShowWallpaperMenu(false);
      }}
    >
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col space-y-6">
        {desktopIcons.map((icon) => (
          <div
            key={icon.id}
            className="flex flex-col items-center cursor-pointer group"
            onClick={(e) => {
              e.stopPropagation();
              icon.action();
            }}
          >
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110 shadow-lg">
              {icon.icon}
            </div>
            <span className="text-white text-sm mt-2 font-medium drop-shadow-lg">
              {icon.name}
            </span>
          </div>
        ))}
      </div>

      {/* Windows */}
      {windows.map((window) => (
        !window.isMinimized && (
          <div
            key={window.id}
            className="absolute bg-white/95 backdrop-blur-lg rounded-lg shadow-2xl border border-white/30 overflow-hidden"
            style={{
              left: window.position.x,
              top: window.position.y,
              width: window.size.width,
              height: window.size.height,
              zIndex: 1000
            }}
          >
            {/* Window Header */}
            <div
              className="bg-gradient-to-r from-blue-500/80 to-purple-600/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between cursor-move border-b border-white/20"
              onMouseDown={(e) => handleMouseDown(e, window.id)}
              ref={dragRef}
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white font-medium ml-2">{window.title}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    minimizeWindow(window.id);
                  }}
                  className="text-white hover:bg-white/20 p-1 rounded transition-colors"
                >
                  <Minimize className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    maximizeWindow(window.id);
                  }}
                  className="text-white hover:bg-white/20 p-1 rounded transition-colors"
                >
                  <Maximize className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeWindow(window.id);
                  }}
                  className="text-white hover:bg-red-500 p-1 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Window Content */}
            <div className="h-full pb-12">
              {window.content}
            </div>
          </div>
        )
      ))}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-lg border-t border-white/20 px-4 py-2 flex items-center justify-between">
        {/* Start Menu */}
        <div className="relative">
          <button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              setShowStartMenu(!showStartMenu);
            }}
          >
            <Grid3X3 className="w-5 h-5" />
            <span className="font-medium">Start</span>
          </button>
          
          {showStartMenu && (
            <div className="absolute bottom-full left-0 mb-2 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/30 p-4 w-80">
              <div className="space-y-3">
                <div 
                  className="flex items-center space-x-3 p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    openWindow('system-monitor', 'System Monitor', <SystemMonitor />);
                    setShowStartMenu(false);
                  }}
                >
                  <Activity className="w-6 h-6 text-gray-600" />
                  <span className="font-medium">System Monitor</span>
                </div>
                <div 
                  className="flex items-center space-x-3 p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    openWindow('snake-game', 'Snake Game', <SnakeGame />);
                    setShowStartMenu(false);
                  }}
                >
                  <Gamepad2 className="w-6 h-6 text-gray-600" />
                  <span className="font-medium">Games</span>
                </div>
                <div 
                  className="flex items-center space-x-3 p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    openWindow(
                      'settings',
                      'Settings',
                      <div className="p-6 h-full overflow-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">System Settings</h2>
                        
                        <div className="space-y-6">
                          {/* Wallpaper Settings */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                              <Palette className="w-5 h-5 mr-2" />
                              Wallpaper Settings
                            </h3>
                            
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Auto-rotate wallpaper</label>
                                  <p className="text-xs text-gray-500">Change wallpaper every 10 seconds</p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAutoWallpaper(!autoWallpaper);
                                  }}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    autoWallpaper ? 'bg-blue-600' : 'bg-gray-300'
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      autoWallpaper ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Manual wallpaper selection</label>
                                <div className="grid grid-cols-3 gap-2">
                                  {wallpapers.map((wallpaper, index) => (
                                    <div
                                      key={index}
                                      className="relative cursor-pointer group"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentWallpaper(wallpaper);
                                        setWallpaperIndex(index);
                                        if (autoWallpaper) {
                                          setAutoWallpaper(false);
                                        }
                                      }}
                                    >
                                      <img
                                        src={wallpaper}
                                        alt={`Wallpaper ${index + 1}`}
                                        className="w-full h-16 object-cover rounded border-2 border-transparent group-hover:border-blue-500 transition-all duration-300"
                                      />
                                      {currentWallpaper === wallpaper && (
                                        <div className="absolute inset-0 bg-blue-500/30 rounded flex items-center justify-center">
                                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {autoWallpaper && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                  <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm text-blue-800 font-medium">
                                      Auto-rotation is active - wallpaper changes every 10 seconds
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* System Info */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                              <Monitor className="w-5 h-5 mr-2" />
                              System Information
                            </h3>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex justify-between">
                                <span>OS Version:</span>
                                <span className="font-medium">WebOS 1.0</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Screen Resolution:</span>
                                <span className="font-medium">{window.innerWidth} × {window.innerHeight}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Active Windows:</span>
                                <span className="font-medium">{windows.length}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                    setShowStartMenu(false);
                  }}
                >
                  <Settings className="w-6 h-6 text-gray-600" />
                  <span className="font-medium">Settings</span>
                </div>
                <div 
                  className="flex items-center space-x-3 p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowWallpaperMenu(true);
                    setShowStartMenu(false);
                  }}
                >
                  <Palette className="w-6 h-6 text-gray-600" />
                  <span className="font-medium">Change Wallpaper</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Taskbar Items */}
        <div className="flex items-center space-x-2">
          {windows.filter(w => w.isMinimized).map(window => (
            <button
              key={window.id}
              className="bg-white/20 text-white px-3 py-2 rounded-lg hover:bg-white/30 transition-colors"
              onClick={() => restoreWindow(window.id)}
            >
              {window.title}
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className="flex items-center space-x-4 text-white">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="text-sm">
            {currentTime.toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Wallpaper Selection Menu */}
      {showWallpaperMenu && (
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowWallpaperMenu(false)}
        >
          <div 
            className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 w-96 shadow-2xl border border-white/30"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Choose Wallpaper</h3>
            <div className="grid grid-cols-2 gap-4">
              {wallpapers.map((wallpaper, index) => (
                <div
                  key={index}
                  className="relative cursor-pointer group"
                  onClick={() => {
                    setCurrentWallpaper(wallpaper);
                    setShowWallpaperMenu(false);
                  }}
                >
                  <img
                    src={wallpaper}
                    alt={`Wallpaper ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border-2 border-transparent group-hover:border-blue-500 transition-all duration-300 group-hover:scale-105"
                  />
                  {currentWallpaper === wallpaper && (
                    <div className="absolute inset-0 bg-blue-500/30 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;