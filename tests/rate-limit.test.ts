import { describe, it, expect } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("Rate Limiter Utility", () => {
  it("should allow initial request under rate limit", () => {
    const res = checkRateLimit("test-key-1", 5, 60000);
    expect(res.success).toBe(true);
    expect(res.remaining).toBe(4);
  });

  it("should block requests once rate limit is exceeded", () => {
    const apiKey = "test-key-spam";
    for (let i = 0; i < 5; i++) {
      checkRateLimit(apiKey, 5, 60000);
    }
    const overflowRes = checkRateLimit(apiKey, 5, 60000);
    expect(overflowRes.success).toBe(false);
    expect(overflowRes.remaining).toBe(0);
  });
});
