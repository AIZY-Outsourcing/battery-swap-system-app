export type AnalyticsEvent =
  | { name: "app_launch" }
  | { name: "auth_state_checked"; result: "logged_in" | "logged_out" }
  | { name: "login_success" }
  | { name: "signup_initiated" }
  | { name: "otp_verified" }
  | { name: "otp_resend" }
  // Station discovery & detail
  | { name: "station_view"; stationId: string | number }
  | { name: "station_directions"; stationId: string | number }
  | { name: "station_qr_open"; stationId: string | number }
  // Reservation
  | { name: "station_reserve_open"; stationId: string | number }
  | {
      name: "station_reserve_success";
      stationId: string | number;
      reservationId: string | number;
    }
  | {
      name: "station_reserve_fail";
      stationId: string | number;
      error?: string;
    };

export function track(event: AnalyticsEvent) {
  // TODO: integrate with Segment/Firebase/etc.
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log("[analytics]", event);
  }
}
