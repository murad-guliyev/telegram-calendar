export type TUserData = {
  username: string;
  phone: string;
  workingDays: string[];
  startTime: string;
  endTime: string;
};

export interface IUser {
  username: string;
  phone_number: string;
  work_schedule: Array<string>;
  start_time: string;
  end_time: string;
  created_at: string;
  service_duration: number;
}
