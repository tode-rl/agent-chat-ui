/**
 * TypeScript types for Runloop API integration
 */

export interface LaunchDevboxRequest {
  agentId?: string;
  command?: string;
  port?: number;
  assistantId?: string;
}

export interface LaunchDevboxResponse {
  tunnelUrl: string;
  devboxId: string;
  chatUrl: string;
}

export interface DevboxConfig {
  agentId: string;
  command: string;
  port: number;
  assistantId: string;
}

export interface RunloopError {
  message: string;
  code?: string;
  details?: unknown;
}

