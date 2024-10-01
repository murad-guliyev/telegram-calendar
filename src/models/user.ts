export type TUserData = {
  username: string;
  phone: string;
  workingDays: string[];
  startTime: string;
  endTime: string;
};

export type TTelegramUser = {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
};

export type TFirebaseUser = TUserData & {
  id: string;
};

export interface IUser {
  id: string;
  username: string;
  phone_number: string;
  work_schedule: Array<string>;
  start_time: string;
  end_time: string;
  created_at: string;
  service_duration: number;
}
