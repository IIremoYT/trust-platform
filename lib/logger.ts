type LogLevel = "info" | "warn" | "error" | "security";

interface LogPayload {
  message: string;
  context?: Record<string, unknown>;
  error?: unknown;
}

/**
 * Production-grade Structured Logger.
 * Outputs JSON in production for easy parsing by Datadog/Sentry/Vercel Logs.
 * Outputs readable colored logs in local development.
 */
class Logger {
  private log(level: LogLevel, payload: LogPayload) {
    const timestamp = new Date().toISOString();
    const isDev = process.env.NODE_ENV !== "production";

    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message: payload.message,
      context: payload.context,
      error: payload.error instanceof Error ? payload.error.stack : payload.error,
    };

    if (!isDev) {
      // JSON format for production log aggregators
      console.log(JSON.stringify(logEntry));
      return;
    }

    // Pretty format for local development
    const colors = {
      info: "\x1b[34m", // Blue
      warn: "\x1b[33m", // Yellow
      error: "\x1b[31m", // Red
      security: "\x1b[35m", // Magenta
    };
    const reset = "\x1b[0m";

    let consoleMessage = `[${timestamp}] ${colors[level]}[${level.toUpperCase()}]${reset} ${payload.message}`;
    if (payload.context) {
      consoleMessage += `\n  Context: ${JSON.stringify(payload.context)}`;
    }
    if (payload.error) {
      consoleMessage += `\n  Error: ${payload.error}`;
    }

    if (level === "error" || level === "security") {
      console.error(consoleMessage);
    } else if (level === "warn") {
      console.warn(consoleMessage);
    } else {
      console.log(consoleMessage);
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log("info", { message, context });
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log("warn", { message, context });
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    this.log("error", { message, error, context });
  }

  security(message: string, context?: Record<string, unknown>) {
    this.log("security", { message, context });
  }
}

export const logger = new Logger();
