import { describe, expect, it } from "vitest";
import { decryptText, encryptText } from "./crypto";

describe("client-side encryption helpers", () => {
  it("round-trips a journal paragraph", async () => {
    const original = "Dear diary, today I felt a little braver.";
    const encrypted = await encryptText(original, "a-long-demo-passphrase-123");
    expect(encrypted.ciphertext).not.toContain(original);
    await expect(decryptText(encrypted, "a-long-demo-passphrase-123")).resolves.toBe(original);
  });

  it("rejects a wrong passphrase", async () => {
    const encrypted = await encryptText("private words", "a-long-demo-passphrase-123");
    await expect(decryptText(encrypted, "a-different-passphrase-456")).rejects.toThrow();
  });

  it("requires a longer passphrase", async () => {
    await expect(encryptText("hello", "short")).rejects.toThrow(/12 characters/);
  });
});
