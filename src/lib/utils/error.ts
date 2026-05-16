/**
 * Parses a tRPC client error message (which contains a stringified Zod array)
 * and returns an object mapping field names to error messages.
 * Returns null if the error message is not a valid Zod JSON array.
 */
export function parseTRPCClientErrorMessage(err: any): Record<string, string> | null {
  if (!err || typeof err.message !== "string") return null;
  try {
    const parsed = JSON.parse(err.message);
    if (Array.isArray(parsed)) {
      const errors: Record<string, string> = {};
      parsed.forEach((e: any) => {
        if (e.path && e.path.length > 0) {
          errors[e.path[0]] = e.message;
        }
      });
      return Object.keys(errors).length > 0 ? errors : null;
    }
  } catch {
    return null;
  }
  return null;
}
