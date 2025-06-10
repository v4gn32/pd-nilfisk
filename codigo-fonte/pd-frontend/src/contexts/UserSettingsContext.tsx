import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserSettings {
  theme: 'light' | 'dark';
  language: 'pt-BR' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
  };
}

interface UserSettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: UserSettings = {
  theme: 'light',
  language: 'pt-BR',
  notifications: {
    email: true,
    push: false,
  },
};

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export const UserSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const savedSettings = localStorage.getItem('userSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    // Apply theme
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(settings.theme);
    
    // Apply language
    document.documentElement.lang = settings.language;
  }, [settings]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
      notifications: {
        ...prev.notifications,
        ...(newSettings.notifications || {}),
      },
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <UserSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (context === undefined) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
};