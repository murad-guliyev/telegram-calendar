import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getUser } from "../services/user"; // Import the getUser service to fetch Firebase data
import { TFirebaseUser, TTelegramUser } from "../models/user";

interface CombinedUser {
  telegramData: TTelegramUser | null;
  firebaseData: TFirebaseUser | null;
}

interface UserContextType {
  user: CombinedUser | null; // Store the combined user data
  referrerId: string | null;
  setUser: React.Dispatch<React.SetStateAction<CombinedUser | null>>; // Set the combined user data
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
  const [user, setUser] = useState<CombinedUser | null>(null);
  const [referrerId, setReferrerId] = useState<string | null>(null);

  useEffect(() => {
    const loadTelegramData = async () => {
      if (window.Telegram && window.Telegram.WebApp) {
        const webApp = window.Telegram.WebApp;
        const startParam = webApp.initDataUnsafe?.start_param;
        console.log("webApp.initDataUnsafe", webApp.initDataUnsafe);
        console.log("Telegram WebApp startParam", startParam);
        if (startParam && startParam.startsWith("ref_")) {
          const referrer = startParam.split("ref_")[1];
          setReferrerId(referrer);
          console.log(`Referred by user ID: ${referrer}`);
        } else {
          setReferrerId(null);
          console.log("No referral ID available");
        }

        // Retrieve and set the Telegram user data
        const telegramData: TTelegramUser = webApp.initDataUnsafe?.user;
        if (telegramData) {
          const updatedTelegramData = {
            ...telegramData,
            id: telegramData.id.toString(),
          };
          console.log("User data set:", updatedTelegramData);

          // Fetch the Firebase user data for this Telegram user ID
          const firebaseData = (await getUser(updatedTelegramData.id)) || null;

          // Store both Telegram and Firebase data in context
          setUser({ telegramData: updatedTelegramData, firebaseData });
        } else {
          // For local development, set a default user ID
          const firebaseData = (await getUser("773338374")) || null;
          setUser({
            telegramData: {
              id: "773338374",
              first_name: "Murad",
              last_name: "Guliyev",
              username: "Binturong93",
            },
            firebaseData,
          });
        }
      } else {
        console.warn("Telegram WebApp is not available");
      }
    };

    // Ensure Telegram WebApp is loaded
    if (window.Telegram?.WebApp) {
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
