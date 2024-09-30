import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the shape of the Telegram user data
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface UserContextType {
  user: TelegramUser | null;
  referrerId: string | null;
  setUser: React.Dispatch<React.SetStateAction<TelegramUser | null>>;
  setReferrerId: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create the UserContext
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Define the provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [referrerId, setReferrerId] = useState<string | null>(null);

  useEffect(() => {
    const loadTelegramData = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        const webApp = window.Telegram.WebApp;

        // Log the initData for debugging
        console.log("Telegram WebApp Init Data:", webApp.initData);
        console.log("Telegram WebApp Init Data Unsafe:", webApp.initDataUnsafe);

        // Extract URL parameters directly from the browser window location
        const url = new URL(window.location.href);
        const startParam = url.searchParams.get("start");

        if (startParam && startParam.startsWith("ref_")) {
          const referrer = startParam.split("ref_")[1];
          setReferrerId(referrer);
          console.log(`Referred by user ID: ${referrer}`);
        } else {
          setReferrerId(null);
          console.log("No referral ID available");
        }

        // Extract and set the user data
        const userData: TelegramUser = webApp.initDataUnsafe?.user;
        if (userData) {
          console.log("User data set:", userData);
          setUser(userData);
        } else {
          console.warn("User data is empty");
        }
      } else {
        console.warn("Telegram WebApp is not available");
      }
    };

    // Ensure that the data is only fetched when Telegram WebApp is available
    if (window.Telegram && window.Telegram.WebApp) {
      loadTelegramData();
    } else {
      console.log("Waiting for Telegram WebApp to load...");
      const interval = setInterval(() => {
        if (window.Telegram && window.Telegram.WebApp) {
          clearInterval(interval);
          loadTelegramData();
        }
      }, 100); // Check every 100ms until Telegram is ready
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, referrerId, setUser, setReferrerId }}>
      {children}
    </UserContext.Provider>
  );
};
