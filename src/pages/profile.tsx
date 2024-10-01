import React, { useState, useEffect } from "react";
import ProfileView from "../components/profile-view";
import ProfileEdit from "../components/profile-edit";
import { getUser, updateUser } from "../services/user";
import { TUserData } from "../models/user";
import { useUser } from "../contexts/user";

const Profile: React.FC = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState<TUserData | null>();
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
            getUser(userId).then((userData) => {
              if (userData) setUserData(userData);
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
