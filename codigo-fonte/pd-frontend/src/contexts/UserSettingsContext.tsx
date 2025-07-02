import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

// Tipos de configurações do usuário
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

// Configuração padrão
const defaultSettings: UserSettings = {
  theme: "light",
  language: "pt-BR",
  notifications: {
    email: true,
    push: false,
  },
};

// Criação do contexto
export const UserSettingsContext = createContext<
  UserSettingsContextType | undefined
>(undefined);

// Provider
export const UserSettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const savedSettings = localStorage.getItem("userSettings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    // Salva as configurações no localStorage
    localStorage.setItem("userSettings", JSON.stringify(settings));

    // Aplica tema
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(settings.theme);

    // Aplica linguagem
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

// Hook personalizado
export const useUserSettings = (): UserSettingsContextType => {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error(
      "useUserSettings deve ser usado dentro de um UserSettingsProvider"
    );
  }
  return context;
};
