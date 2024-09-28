import React, { useState, useEffect } from "react";
import ProfileView from "../components/profile-view";
import ProfileEdit from "../components/profile-edit";
import { getUser, updateUser } from "../services/user";
import { TUserData } from "../models/user";

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<TUserData | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    getUser("7LmcgDMPUOOW1Bd5m42h").then((userData) => {
      if (userData) setUserData(userData);
    });
  }, []);

  const handleSave = (userData: TUserData) => {
    updateUser("7LmcgDMPUOOW1Bd5m42h", userData).then((userId) => {
      if (userId) {
        getUser(userId).then((userData) => {
          if (userData) setUserData(userData);
        });
      }
    });
    setEditMode(false);
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
