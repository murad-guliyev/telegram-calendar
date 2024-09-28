import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export const addEvent = async (
  title: string,
  owner_id: string,
  start_datetime: string,
  end_datetime: string,
  status: "pending" | "completed" | "cancelled",
  whole_day: boolean = false
): Promise<void> => {
  try {
    const docRef = await addDoc(collection(db, "event"), {
      title: title,
      owner_id: owner_id,
      start_datetime: Timestamp.fromDate(new Date(start_datetime)),
      end_datetime: Timestamp.fromDate(new Date(end_datetime)),
      status: status,
      whole_day: whole_day,
    });
    console.log("New event added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding new event: ", e);
  }
};

export const updateEvent = async (
  eventId: string,
  title?: string,
  owner_id?: string,
  start_datetime?: string,
  end_datetime?: string,
  status?: "pending" | "completed" | "cancelled",
  whole_day?: boolean
): Promise<void> => {
  try {
    const eventRef = doc(db, "event", eventId);
    const updatedFields: any = {};

    if (title !== undefined) updatedFields.title = title;
    if (owner_id !== undefined) updatedFields.owner_id = owner_id;
    if (start_datetime !== undefined)
      updatedFields.start_datetime = Timestamp.fromDate(
        new Date(start_datetime)
      );
    if (end_datetime !== undefined)
      updatedFields.end_datetime = Timestamp.fromDate(new Date(end_datetime));
    if (status !== undefined) updatedFields.status = status;
    if (whole_day !== undefined) updatedFields.whole_day = whole_day;

    await updateDoc(eventRef, updatedFields);
    console.log("Event updated successfully!");
  } catch (e) {
    console.error("Error updating event: ", e);
  }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const eventRef = doc(db, "event", eventId);
    await deleteDoc(eventRef);
    console.log("Event deleted successfully!");
  } catch (e) {
    console.error("Error deleting event: ", e);
  }
};
