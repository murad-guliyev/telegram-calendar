import React, { useState, useEffect } from "react";
import ProfileView from "../components/profile-view";
import ProfileEdit from "../components/profile-edit";
import { getUser, updateUser } from "../services/user";
import { TUserData } from "../models/user";
import { useUser } from "../contexts/user";

const Profile: React.FC = () => {
  const { user, setUser } = useUser(); // Access setUser to update context
  const [userData, setUserData] = useState<TUserData | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user?.telegramData?.id && user.firebaseData) {
      const { id, ...firebaseData } = user.firebaseData || {};
      setUserData(firebaseData);
    }
  }, [user]);

  const handleSave = (updatedData: TUserData) => {
    if (user?.telegramData?.id) {
      updateUser(user.telegramData.id.toString(), updatedData).then(
        (userId) => {
          if (userId) {
            // Fetch the updated user data
            getUser(userId).then((fetchedUserData) => {
              if (fetchedUserData) {
                setUserData(fetchedUserData);

                // Update context with the new data
                setUser((prevUser) => ({
                  ...prevUser,
                  firebaseData: { ...fetchedUserData, id: userId },
                  telegramData: prevUser?.telegramData || null,
                }));
              }
            });
          }
        }
      );
      setEditMode(false);
    }
  };

  if (!userData) return null;

  return (
    <>
      {editMode ? (
        <ProfileEdit
          userData={userData}
          onSave={handleSave}
          onCancel={() => setEditMode(false)}
        />
      ) : (
        <ProfileView userData={userData} onEdit={() => setEditMode(true)} />
      )}
    </>
  );
};

export default Profile;
