import { describe, it, expect } from "vitest";
import {
  BUDGET_OPTIONS,
  BUDGET_RANGES,
  isAllowedBudgetRange,
  validateEmail,
  validateLeadPayload,
  validatePhone,
} from "./lead-validation";

// Regression guard for the class of bug that silently broke every commission
// enquiry: the UI sent a value the leads CHECK constraint rejected, so every
// insert failed with Postgres 23514 and nothing was saved. These assertions
// fail mechanically — no browser, no network — if that ever recurs.

describe("lead budget_range matches the DB CHECK constraint", () => {
  // Mirror of leads_budget_range_check as it exists in Postgres. If the DB
  // constraint changes, update BOTH this literal and BUDGET_RANGES.
  const DB_ALLOWED = ["under-1000", "1000-5000", "5000-10000", "10000-25000", "25000+"];

  it("declares exactly the codes the database allows", () => {
    expect([...BUDGET_RANGES]).toEqual(DB_ALLOWED);
  });

  it("every UI budget option submits a DB-allowed code, not a display label", () => {
    expect(BUDGET_OPTIONS.length).toBeGreaterThan(0);
    for (const opt of BUDGET_OPTIONS) {
      expect(DB_ALLOWED).toContain(opt.value);
      // The label is for humans; it must never be what we submit.
      expect(DB_ALLOWED).not.toContain(opt.label);
    }
  });

  it("rejects the display label that caused the original outage", () => {
    expect(isAllowedBudgetRange("₹2,500–5,000")).toBe(false);
    expect(
      validateLeadPayload({ name: "A", phone: "9876500011", budgetRange: "₹2,500–5,000" }),
    ).toMatch(/not an allowed value/);
  });
});

describe("phone validation", () => {
  it("accepts a 10-digit Indian mobile", () => {
    expect(validatePhone("9876500011")).toBeNull();
    expect(validatePhone("98765 00011")).toBeNull();
  });

  it("rejects 11-12 digit numbers entered without a + country code", () => {
    expect(validatePhone("98765000112")).not.toBeNull();
    expect(validatePhone("987650001123")).not.toBeNull();
  });

  it("rejects too-short numbers and empty input", () => {
    expect(validatePhone("98765")).not.toBeNull();
    expect(validatePhone("")).not.toBeNull();
  });

  it("accepts international numbers with a + country code", () => {
    expect(validatePhone("+1 415 555 0100")).toBeNull();
    expect(validatePhone("+971 50 123 4567")).toBeNull();
    expect(validatePhone("+44 20 7946 0958")).toBeNull();
  });
});

describe("email validation", () => {
  it("treats a blank email as valid (optional field)", () => {
    expect(validateEmail("")).toBeNull();
    expect(validateEmail(undefined)).toBeNull();
  });

  it("rejects an address with no @ or no domain", () => {
    expect(validateEmail("notanemail")).not.toBeNull();
    expect(validateEmail("missing@domain")).not.toBeNull();
    expect(validateEmail("@nolocal.com")).not.toBeNull();
  });

  it("accepts a well-formed address", () => {
    expect(validateEmail("himangi@theartspire.com")).toBeNull();
  });
});

describe("validateLeadPayload mirrors the server guard", () => {
  it("requires name and phone", () => {
    expect(validateLeadPayload({ name: "", phone: "9876500011" })).toMatch(/name/i);
    expect(validateLeadPayload({ name: "A", phone: "" })).toMatch(/phone/i);
  });

  it("passes a realistic commission submission", () => {
    expect(
      validateLeadPayload({
        name: "Test User",
        phone: "9876500011",
        email: "test@example.com",
        budgetRange: "5000-10000",
      }),
    ).toBeNull();
  });

  it("passes with no optional fields at all", () => {
    expect(validateLeadPayload({ name: "Test User", phone: "9876500011" })).toBeNull();
  });
});
