import {
  addDoc,
  collection,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { TUserData } from "../models/user";

export const getUser = async (
  userId: string
): Promise<TUserData | undefined> => {
  try {
    const userDocRef = doc(db, "user", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();

      return {
        username: userData.username,
        phone: userData.phone_number,
        workingDays: userData.work_schedule,
        startTime: userData.start_time,
        endTime: userData.end_time,
      };
    } else {
      console.log("User data not found!");
    }
  } catch (error) {
    console.error("Error fetching user data: ", error);
  }
};

export const createUser = async (
  data: TUserData
): Promise<string | undefined> => {
  const { phone, username, workingDays, startTime, endTime } = data;

  try {
    const docRef = await addDoc(collection(db, "user"), {
      phone_number: phone,
      username,
      work_schedule: workingDays,
      start_time: startTime,
      end_time: endTime,
      created_at: Timestamp.fromDate(new Date()),
    });

    return docRef.id;
  } catch (e) {
    console.error("Error on creating new user: ", e);
  }
};

export const updateUser = async (
  userId: string,
  data: TUserData
): Promise<string | undefined> => {
  const { phone, username, workingDays, startTime, endTime } = data;

  try {
    const userRef = doc(db, "user", userId);

    await updateDoc(userRef, {
      phone_number: phone,
      username,
      work_schedule: workingDays,
      start_time: startTime,
      end_time: endTime,
    });

    return userId;
  } catch (e) {
    console.error("Error on creating new user: ", e);
  }
};
