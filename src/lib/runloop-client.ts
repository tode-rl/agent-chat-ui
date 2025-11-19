import {Runloop} from "@runloop/api-client";

/**
 * Creates and returns a Runloop API client instance
 * Uses RUNLOOP_API_KEY from environment variables
 */
export function createRunloopClient() {
  const apiKey = process.env.RUNLOOP_API_KEY;

  if (!apiKey) {
    throw new Error(
      "RUNLOOP_API_KEY environment variable is required but not set",
    );
  }

  return new Runloop(
    {
      baseURL: "https://api.runloop.pro",
    }
  );
}

