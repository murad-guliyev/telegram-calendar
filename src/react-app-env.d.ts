/// <reference types="react-scripts" />

declare module "react-big-calendar" {
  import { ComponentType } from "react";

  interface Event {
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: any;
  }

  interface CalendarProps {
    localizer: any;
    events: Event[];
    startAccessor: string;
    endAccessor: string;
    style?: React.CSSProperties;
    [key: string]: any; // Allow other props
  }

  export const Calendar: ComponentType<CalendarProps>;

  export function dateFnsLocalizer(config: any): any;
}
