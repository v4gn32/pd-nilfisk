// ✅ Novo arquivo: src/hooks/useUserSettings.ts
import { useContext } from "react";
import { UserSettingsContext } from "../contexts/UserSettingsContext";

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error(
      "useUserSettings must be used within a UserSettingsProvider"
    );
  }
  return context;
};
