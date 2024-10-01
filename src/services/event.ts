import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { TEvent } from "../models/event";

export const getEventsByOwnerId = async (
  ownerId: string
): Promise<TEvent[]> => {
  const eventsRef = collection(db, "event");
  const q = query(eventsRef, where("owner_id", "==", ownerId));

  const querySnapshot = await getDocs(q);
  const events: TEvent[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    // Correctly parse start and end datetime fields
    const start = data.start_datetime.toDate
      ? data.start_datetime.toDate()
      : new Date(data.start_datetime);
    const end = data.end_datetime.toDate
      ? data.end_datetime.toDate()
      : new Date(data.end_datetime);

    events.push({
      id: doc.id,
      title: data.title,
      start,
      end,
      allDay: data.is_whole_day || false,
    });
  });

  return events;
};

export const createEvent = async (
  data: TEvent,
  ownerId: string
): Promise<void> => {
  const { title, allDay, start, end } = data;

  try {
    const docRef = await addDoc(collection(db, "event"), {
      title: title,
      owner_id: ownerId,
      start_datetime: Timestamp.fromDate(new Date(start)),
      end_datetime: Timestamp.fromDate(new Date(end)),
      status: "active",
      whole_day: allDay,
    });
    console.log("New event added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding new event: ", e);
  }
};

export const updateEvent = async (
  eventId: string,
  data: TEvent,
  ownerId: string
): Promise<void> => {
  const { title, start, end, allDay } = data;

  try {
    const eventRef = doc(db, "event", eventId);
    const updatedFields: any = {};

    updatedFields.title = title;
    updatedFields.owner_id = ownerId;
    updatedFields.start_datetime = Timestamp.fromDate(new Date(start));
    updatedFields.end_datetime = Timestamp.fromDate(new Date(end));
    updatedFields.status = "active";
    updatedFields.whole_day = allDay;

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
