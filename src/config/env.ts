// Centralized environment configuration & feature flags
// Values come from Expo public env vars (EXPO_PUBLIC_*) so they are available at runtime in the bundle.
// Provide sane defaults for local development.

export const ENV = {
  API_BASE_URL:
    process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.bss-app.com/api/v1",
};

export type EnvShape = typeof ENV;
