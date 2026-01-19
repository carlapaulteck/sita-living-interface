import { useEffect, useState } from 'react';

type TimeOfDay = 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';

interface TimeTheme {
  timeOfDay: TimeOfDay;
  colorTemperature: number; // 0-100, 0 = warm, 100 = cool
  brightness: number; // 0-100
  greeting: string;
  ambientHue: string;
}

export function useTimeOfDayTheme() {
  const [theme, setTheme] = useState<TimeTheme>(() => getTimeTheme());

  useEffect(() => {
    // Update theme every minute
    const interval = setInterval(() => {
      setTheme(getTimeTheme());
    }, 60000);

    // Apply CSS variables for the current time theme
    applyThemeToDOM(getTimeTheme());

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  return theme;
}

function getTimeTheme(): TimeTheme {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 7) {
    return {
      timeOfDay: 'dawn',
      colorTemperature: 20,
      brightness: 60,
      greeting: 'Good morning, early riser',
      ambientHue: '25', // Warm orange-pink
    };
  }
  
  if (hour >= 7 && hour < 12) {
    return {
      timeOfDay: 'morning',
      colorTemperature: 40,
      brightness: 85,
      greeting: 'Good morning',
      ambientHue: '40', // Golden yellow
    };
  }
  
  if (hour >= 12 && hour < 17) {
    return {
      timeOfDay: 'afternoon',
      colorTemperature: 60,
      brightness: 100,
      greeting: 'Good afternoon',
      ambientHue: '200', // Bright blue
    };
  }
  
  if (hour >= 17 && hour < 20) {
    return {
      timeOfDay: 'evening',
      colorTemperature: 30,
      brightness: 70,
      greeting: 'Good evening',
      ambientHue: '280', // Warm purple
    };
  }
  
  // Night (20:00 - 5:00)
  return {
    timeOfDay: 'night',
    colorTemperature: 10,
    brightness: 40,
    greeting: hour < 4 ? 'Working late?' : 'Good night',
    ambientHue: '265', // Deep purple
  };
}

function applyThemeToDOM(theme: TimeTheme) {
  const root = document.documentElement;
  
  // Adjust brightness (reduce opacity of bright elements at night)
  root.style.setProperty('--time-brightness', `${theme.brightness}%`);
  
  // Adjust color temperature (shift toward warmer colors at night)
  const warmthShift = (100 - theme.colorTemperature) / 100;
  root.style.setProperty('--time-warmth', `${warmthShift}`);
  
  // Set ambient hue for dynamic gradients
  root.style.setProperty('--time-ambient-hue', theme.ambientHue);
  
  // Apply blue light filter at night
  if (theme.timeOfDay === 'night' || theme.timeOfDay === 'evening') {
    root.style.setProperty('--blue-light-filter', 'saturate(0.9) sepia(0.1)');
  } else {
    root.style.setProperty('--blue-light-filter', 'none');
  }
}

// Hook for greeting message
export function useGreeting() {
  const { greeting, timeOfDay } = useTimeOfDayTheme();
  return { greeting, timeOfDay };
}
