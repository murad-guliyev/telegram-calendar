import {
  addDoc,
  collection,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { TFirebaseUser, TUserData } from "../models/user";

export const getUser = async (
  userId: string
): Promise<TFirebaseUser | undefined> => {
  try {
    const userCollectionRef = collection(db, "user");

    const q = query(userCollectionRef, where("id", "==", userId));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      return {
        id: userData.id,
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
  data: TUserData,
  userId: string
): Promise<string | undefined> => {
  const { phone, username, workingDays, startTime, endTime } = data;

  try {
    const docRef = await addDoc(collection(db, "user"), {
      id: userId,
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
    console.log(`Attempting to update user with ID: ${userId}`);

    // Step 1: Search for the user document by its ID using a query.
    const userCollection = collection(db, "user"); // Replace with the correct collection if needed
    const userQuery = query(userCollection, where("id", "==", userId));

    // Step 2: Execute the query to find the document.
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      console.error(`No document found with userId: ${userId}`);
      return undefined;
    }

    // Step 3: Extract the document reference for the found user.
    const userDocRef = querySnapshot.docs[0].ref; // Assuming `userId` is unique, use the first match.

    console.log("Found user document at path:", userDocRef.path);

    // Step 4: Update the found user document.
    await updateDoc(userDocRef, {
      id: userId,
      phone_number: phone,
      username,
      work_schedule: workingDays,
      start_time: startTime,
      end_time: endTime,
    });

    console.log("User document updated successfully!");
    return userId;
  } catch (e) {
    console.error("Error updating user document: ", e);
  }
};
