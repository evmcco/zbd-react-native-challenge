<!-- @format -->

# ZBD Test App - Crypto Prices Tracker

A React Native mobile application built with Expo that displays cryptocurrency prices, charts, and price alerts. Created as a demonstration project for ZBD.

## Features

- **Real-time crypto prices** - View top 10 cryptocurrencies by market cap
- **Interactive price charts** - Multiple time intervals (1D, 7D, 30D, 1Y)
- **Price alerts** - Set alerts for when crypto prices go above or below target values
- **Drawer navigation** - Easy navigation between home, alerts, and crypto detail screens
- **Responsive design** - Clean UI with NativeWind (Tailwind CSS for React Native)

## Tech Stack

- **Framework**: React Native with Expo (~53.0.17)
- **Navigation**: React Navigation with drawer navigation
- **Styling**: NativeWind (Tailwind CSS)
- **Charts**: react-native-skia and react-native-graph
- **Storage**: AsyncStorage for alerts persistence
- **API**: CoinGecko API for cryptocurrency data

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Expo CLI

### Installation

You can download the APK here https://drive.google.com/file/d/16AmU_VBqQ97rNLAAorFm09CAu8ewQxOx/view?usp=sharing or do the following to run it locally:

1. Clone the repository:

```bash
git clone <repository-url>
cd zbd-test-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Run on your preferred platform:

```bash
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web browser
```

### Additional Commands

- `npm run lint` - Run ESLint for code quality checks
- `npm run reset-project` - Reset the project to initial state

## App Structure

- **app/** - Main application screens and layout
- **components/** - Reusable UI components
- **contexts/** - React contexts for state management
- **services/** - API services and utilities
- **assets/** - Images and static files

## Key Limitations & Trade-offs

1. **API Rate Limits**: Uses free CoinGecko API which has rate limiting. Implemented 30-minute caching to mitigate this.

2. **Single Alert Per Crypto**: Each cryptocurrency can only have one active price alert to simplify the implementation.

3. **No Authentication**: No user accounts or cloud sync - all data is stored locally.

4. **Chart Data Limitations**: Chart granularity depends on the time interval selected and CoinGecko's free tier limitations.

5. **Offline Support**: Limited offline functionality - requires internet connection for price data and charts.

## Development Notes

The app uses Expo's new architecture (Fabric) for better performance. All price alerts are stored locally using AsyncStorage and are checked whenever crypto detail pages are viewed.
