# WebOS Desktop Interface

A modern, interactive desktop operating system interface built with React, TypeScript, and Tailwind CSS.

## Features

- 🖥️ **Desktop Environment**: Complete OS-like interface with taskbar and desktop icons
- 🎨 **Auto Wallpaper Rotation**: Beautiful wallpapers that change every 10 seconds
- 📱 **Window Management**: Draggable, resizable windows with minimize/maximize/close
- 🧮 **Calculator App**: Fully functional calculator with modern design
- 📝 **Text Editor**: Feature-rich notepad with file saving and statistics
- 📊 **System Monitor**: Real-time system statistics and monitoring
- 🐍 **Snake Game**: Classic snake game with smooth controls
- ⚙️ **Settings Panel**: Comprehensive system settings and customization
- 🎯 **Start Menu**: Application launcher with search functionality

## Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icon library

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AshwetKini/WEB-OS-.git
cd WEB-OS
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Adding Your Resume

To enable the Resume download feature:
1. Place your `resume.pdf` file in the `public` folder
2. The Resume icon on the desktop will automatically download your PDF when clicked

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Calculator.tsx   # Calculator application
│   ├── TextEditor.tsx   # Text editor application
│   ├── SystemMonitor.tsx # System monitoring tool
│   └── Games.tsx        # Snake game component
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features in Detail

### Desktop Environment
- Interactive desktop with clickable icons
- Smooth window animations and transitions
- Multi-window support with proper z-index management

### Applications
- **Calculator**: Standard calculator with all basic operations
- **Text Editor**: Word processor with file saving capabilities
- **System Monitor**: Live system statistics with animated charts
- **Snake Game**: Classic arcade game with score tracking

### Customization
- Multiple wallpaper options
- Automatic wallpaper rotation
- Theme settings and preferences
- Window management controls

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



## Acknowledgments

- Wallpaper images from [Pexels](https://www.pexels.com)
- Icons from [Lucide React](https://lucide.dev)
- Built with [Vite](https://vitejs.dev) and [React](https://reactjs.org)
