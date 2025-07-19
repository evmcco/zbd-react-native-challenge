import { AlertsBellIcon } from '@/components/AlertsBellIcon';
import CustomDrawerContent from '@/components/CustomDrawer';
import { AlertsProvider } from '@/contexts/AlertsContext';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <AlertsProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
            <Drawer.Screen
              name="index"
              options={{
                drawerLabel: 'Home',
                title: 'Overview',
                headerRight: () => <AlertsBellIcon />,
              }}
            />
            <Drawer.Screen
              name="alerts"
              options={{
                drawerItemStyle: { display: 'none' },
                drawerLabel: 'Alerts',
                title: 'Alerts',
              }}
            />
            <Drawer.Screen
              name="crypto/[id]"
              options={{
                drawerItemStyle: { display: 'none' },
                title: 'Details',
                headerRight: () => <AlertsBellIcon />,
              }}
            />
          </Drawer>
        </GestureHandlerRootView>
      </AlertsProvider>
    </ThemeProvider>
  );
}
