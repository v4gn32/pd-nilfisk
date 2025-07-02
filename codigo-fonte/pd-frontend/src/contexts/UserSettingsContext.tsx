import React, { createContext, useState, useEffect } from "react";

export interface UserSettings {
  theme: "light" | "dark";
  language: "pt-BR" | "en";
  notifications: {
    email: boolean;
    push: boolean;
  };
}

export interface UserSettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: UserSettings = {
  theme: "light",
  language: "pt-BR",
  notifications: {
    email: true,
    push: false,
  },
};

// ✅ Exportação explícita para uso externo (como no useUserSettings.ts)
export const UserSettingsContext = createContext<
  UserSettingsContextType | undefined
>(undefined);

export const UserSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const savedSettings = localStorage.getItem("userSettings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("userSettings", JSON.stringify(settings));

    // Aplicar tema no <html>
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(settings.theme);

    // Aplicar linguagem
    document.documentElement.lang = settings.language;
  }, [settings]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({
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
    <UserSettingsContext.Provider
      value={{ settings, updateSettings, resetSettings }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
};
