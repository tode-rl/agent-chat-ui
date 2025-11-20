import { NextRequest, NextResponse } from "next/server";
import { createRunloopClient } from "@/lib/runloop-client";
import type {
  LaunchDevboxRequest,
  LaunchDevboxResponse,
  RunloopError,
} from "@/types/runloop";

/**
 * POST /api/runloop/launch-devbox
 * Launches a Runloop devbox with an agent mount, runs a command, and creates a tunnel
 */
export async function POST(request: NextRequest) {
  try {
    const body: LaunchDevboxRequest = await request.json();

    // Get agent ID from request body, or fall back to server-side environment variable
    const agentId =
      body.agentId ||
      process.env.RUNLOOP_DEFAULT_AGENT_ID ||
      process.env.NEXT_PUBLIC_RUNLOOP_DEFAULT_AGENT_ID;

    // Validate that we have an agent ID
    if (!agentId) {
      return NextResponse.json<RunloopError>(
        {
          message:
            "agentId is required. Please provide it in the request body or set RUNLOOP_DEFAULT_AGENT_ID environment variable",
          code: "MISSING_AGENT_ID",
        },
        { status: 400 },
      );
    }
    const command =
      body.command ||
      process.env.RUNLOOP_DEFAULT_COMMAND ||
      "CONFIGURABLE_AGENT_LAUNCH_COMMAND";
    const port = body.port || Number(process.env.RUNLOOP_DEFAULT_PORT) || 2024;
    const assistantId = body.assistantId || "agent";

    // Initialize Runloop client
    const client = createRunloopClient();

    // Step 1: Create devbox with agent mount
    const devbox = await client.devboxes.createAndAwaitRunning({
      mounts: [
        {
          type: "agent_mount",
          agent_id: agentId,
          agent_name: null,
          agent_path: '/home/user/agent'
        },
      ],
      secrets: {
        "ANTHROPIC_API_KEY": "ANTHROPIC_API_KEY",
      }
    });

    const devboxId = devbox.id;

    // Step 2: Run server command asynchronously
    await client.devboxes.executions.executeAsync(devboxId, {
      command,
    });

    // Step 3: Create tunnel to specified port
    const tunnel = await client.devboxes.createTunnel(devboxId, {
      port,
    });

    const tunnelUrl = tunnel.url;

    // Step 4: Construct agent chat URL
    const baseUrl =
      process.env.NEXT_PUBLIC_AGENT_CHAT_BASE_URL ||
      "https://agentchat.vercel.app";
    const chatUrl = `${baseUrl}/?apiUrl=${encodeURIComponent(
      tunnelUrl,
    )}&assistantId=${encodeURIComponent(assistantId)}`;

    // Return response
    const response: LaunchDevboxResponse = {
      tunnelUrl,
      devboxId,
      chatUrl,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error launching devbox:", error);

    // Handle different error types
    if (error instanceof Error) {
      return NextResponse.json<RunloopError>(
        {
          message: error.message,
          code: "DEVBOX_LAUNCH_ERROR",
          details: error,
        },
        { status: 500 },
      );
    }

    return NextResponse.json<RunloopError>(
      {
        message: "An unexpected error occurred while launching devbox",
        code: "UNKNOWN_ERROR",
      },
      { status: 500 },
    );
  }
}

