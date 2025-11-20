import type {
  LaunchDevboxRequest,
  LaunchDevboxResponse,
  RunloopError,
} from "@/types/runloop";

/**
 * Launches a Runloop devbox and returns the chat URL
 * @param config Configuration for devbox launch
 * @returns Promise resolving to the chat URL
 * @throws Error if launch fails
 */
export async function launchDevbox(
  config: LaunchDevboxRequest,
): Promise<string> {
  try {
    const response = await fetch("/api/runloop/launch-devbox", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const error: RunloopError = await response.json();
      throw new Error(error.message || "Failed to launch devbox");
    }

    const data: LaunchDevboxResponse = await response.json();
    return data.chatUrl;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while launching devbox");
  }
}

/**
 * Launches a Runloop devbox and returns the full response object
 * @param config Configuration for devbox launch
 * @returns Promise resolving to the full LaunchDevboxResponse
 * @throws Error if launch fails
 */
export async function launchDevboxWithResponse(
  config: LaunchDevboxRequest,
): Promise<LaunchDevboxResponse> {
  try {
    const response = await fetch("/api/runloop/launch-devbox", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const error: RunloopError = await response.json();
      throw new Error(error.message || "Failed to launch devbox");
    }

    const data: LaunchDevboxResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while launching devbox");
  }
}

/**
 * Launches a devbox and opens the chat URL in a new tab/window
 * @param config Configuration for devbox launch
 * @param openInNewTab Whether to open in new tab (default: true)
 * @returns Promise resolving to the chat URL
 */
export async function launchDevboxAndOpen(
  config: LaunchDevboxRequest,
  openInNewTab: boolean = true,
): Promise<string> {
  const chatUrl = await launchDevbox(config);

  if (openInNewTab) {
    window.open(chatUrl, "_blank");
  } else {
    window.location.href = chatUrl;
  }

  return chatUrl;
}

