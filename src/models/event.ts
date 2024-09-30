export type TEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  status?: "active";
};

export interface IEvent {
  event_id: string;
  title: string;
  owner_id: string;
  start_datetime: string;
  end_datetime: string;
  is_whole_day: boolean;
  status: "active";
}
