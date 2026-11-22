import assert from "node:assert/strict";
import test from "node:test";
import { buildPasswordFlowMetadata } from "./i18n/seo";
import {
  forgotPasswordPath,
  isPasswordResetPath,
  passwordIssue,
  passwordResetRedirectUrl,
  requestOrigin,
  resetPasswordPath,
} from "./passwordReset";

test("password reset URLs stay on the host that asked", () => {
  assert.equal(forgotPasswordPath("de"), "/de/forgot-password");
  assert.equal(forgotPasswordPath("en"), "/en/forgot-password");
  assert.equal(resetPasswordPath("en"), "/en/reset-password");

  assert.equal(
    passwordResetRedirectUrl("https://immo.abowserphoto.com", "de"),
    "https://immo.abowserphoto.com/de/reset-password"
  );
  assert.equal(
    passwordResetRedirectUrl("https://www.aaronbowser-photography.com", "en"),
    "https://www.aaronbowser-photography.com/en/reset-password"
  );
  assert.equal(
    passwordResetRedirectUrl("http://food.localhost:3001", "en"),
    "http://food.localhost:3001/en/reset-password"
  );
  assert.equal(
    passwordResetRedirectUrl("https://studio.abowserphoto.com/", "de"),
    "https://studio.abowserphoto.com/de/reset-password"
  );

  const niche = new URL(passwordResetRedirectUrl("https://wedding.abowserphoto.com", "de"));
  assert.equal(niche.hostname, "wedding.abowserphoto.com");
  assert.equal(niche.pathname, "/de/reset-password");

  assert.equal(requestOrigin("immo.abowserphoto.com"), "https://immo.abowserphoto.com");
  assert.equal(requestOrigin("food.localhost:3001"), "http://food.localhost:3001");
  assert.equal(isPasswordResetPath("/de/reset-password"), true);
  assert.equal(isPasswordResetPath("/auth/callback"), false);
});

test("password confirmation rejects a short or mismatched password", () => {
  assert.equal(passwordIssue("short", "short"), "too-short");
  assert.equal(passwordIssue("longenough", "different"), "mismatch");
  assert.equal(passwordIssue("longenough", "longenough"), null);
});

test("password pages are not indexed and canonicalize to the request host", () => {
  const forgot = buildPasswordFlowMetadata("de", "forgot-password", "immo.abowserphoto.com");
  assert.equal(forgot.title, "Passwort vergessen?");
  assert.equal(forgot.alternates?.canonical, "https://immo.abowserphoto.com/de/forgot-password");
  const forgotRobots = forgot.robots;
  assert.equal(
    forgotRobots && typeof forgotRobots === "object" && "index" in forgotRobots
      ? forgotRobots.index
      : undefined,
    false
  );

  const reset = buildPasswordFlowMetadata("en", "reset-password", "www.aaronbowser-photography.com");
  assert.equal(reset.title, "Choose a new password");
  assert.equal(
    reset.alternates?.canonical,
    "https://www.aaronbowser-photography.com/en/reset-password"
  );

  const local = buildPasswordFlowMetadata("de", "reset-password", "studio.localhost:3001");
  assert.equal(local.alternates?.canonical, "http://studio.localhost:3001/de/reset-password");
});
