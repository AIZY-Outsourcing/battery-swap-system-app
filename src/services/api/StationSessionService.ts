import api from "./index";
import { ApiResponse } from "../../types";

// Station Session types
export interface StationSession {
  id: string;
  session_token: string;
  station_id: string;
  user_id: string;
  status: "active" | "inactive";
  expires_at: string;
}

export interface QRAuthenticatePayload {
  session_token: string;
}

export interface QRAuthenticateResponse {
  success: boolean;
  message: string;
  data: StationSession;
}

// 2FA Verification types
export interface Verify2FAPayload {
  type: "pin" | "biometric";
  pin?: string;
}

export interface Verify2FAResponse {
  success: boolean;
  message: string;
  verified: boolean;
}

// End Session types
export interface EndSessionResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: "inactive";
  };
}

class StationSessionService {
  private baseUrl: string = "/station-sessions";

  /**
   * Authenticate user via QR code
   * POST /api/v1/station-sessions/qr/authenticate
   */
  async authenticateQR(
    payload: QRAuthenticatePayload
  ): Promise<ApiResponse<StationSession>> {
    try {
      if (__DEV__) {
        console.log(
          "[StationSessionService] ⇢ POST",
          `${this.baseUrl}/qr/authenticate`,
          {
            session_token: payload.session_token.substring(0, 20) + "...",
          }
        );
      }

      const res = await api.post(`${this.baseUrl}/qr/authenticate`, payload);

      if (__DEV__) {
        console.log(
          "[StationSessionService] ⇠ POST",
          `${this.baseUrl}/qr/authenticate`,
          "→",
          res.status
        );
      }

      // Some backends may return a JSON string inside `res.data` (double-encoded).
      // Normalize to an object so `response.success` is reliably available.
      let responseData: any = res.data;
      if (typeof responseData === "string") {
        try {
          responseData = JSON.parse(responseData);
        } catch (e) {
          if (__DEV__) {
            console.warn(
              "StationSessionService: failed to parse string responseData",
              e
            );
          }
        }
      }

      const response: QRAuthenticateResponse = responseData;

      return {
        success: response?.success,
        data: response?.data,
      };
    } catch (error: any) {
      const status = error?.response?.status;
      const respData = error?.response?.data;
      const message =
        respData?.message || respData?.error || "QR authentication failed";

      // Detect 2FA-required responses and return a specific code so callers
      // can trigger the 2FA flow instead of surfacing an immediate error.
      if (
        status === 401 &&
        typeof message === "string" &&
        /2fa|verify-2fa|2FA/i.test(message)
      ) {
        if (__DEV__) {
          // Log informational only; not an error to be shown to the user yet.
          console.log(
            "[StationSessionService] QR authentication requires 2FA",
            {
              status,
              respData,
            }
          );
        }

        return {
          success: false,
          error: { code: "QR_AUTH_2FA_REQUIRED", message },
        };
      }

      if (__DEV__) {
        console.log("[StationSessionService] QR authentication failed", {
          status,
          respData,
          errorMessage: error?.message,
        });
      }

      let code = "QR_AUTH_FAILED";
      if (status === 400) code = "QR_AUTH_INVALID";
      else if (status === 403) code = "QR_AUTH_ACTIVE_SESSION";
      else if (status === 404) code = "QR_AUTH_NOT_FOUND";

      return {
        success: false,
        error: { code, message },
      };
    }
  }

  /**
   * End active station session
   * POST /api/v1/station-sessions/end/{sessionId}
   */
  async endSession(
    sessionId: string,
    sessionToken?: string
  ): Promise<ApiResponse<{ id: string; status: string }>> {
    try {
      if (__DEV__) {
        console.log(
          "[StationSessionService] ⇢ POST",
          `${this.baseUrl}/end/${sessionId}`
        );
      }

      const headers: any = {};
      if (sessionToken) {
        headers["x-session-token"] = sessionToken;
      }

      const res = await api.post(
        `${this.baseUrl}/end/${sessionId}`,
        {},
        { headers }
      );

      if (__DEV__) {
        console.log(
          "[StationSessionService] ⇠ POST",
          `${this.baseUrl}/end/${sessionId}`,
          "→",
          res.status
        );
      }

      const response: EndSessionResponse = res.data;

      return {
        success: response.success,
        data: response.data,
      };
    } catch (error: any) {
      const status = error?.response?.status;
      const respData = error?.response?.data;
      const message =
        respData?.message || respData?.error || "Failed to end session";

      if (__DEV__) {
        console.log("[StationSessionService] End session failed", {
          status,
          respData,
          errorMessage: error?.message,
        });
      }

      let code = "END_SESSION_FAILED";
      if (status === 404) code = "END_SESSION_NOT_FOUND";

      return {
        success: false,
        error: { code, message },
      };
    }
  }
}

export default new StationSessionService();
