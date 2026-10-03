import test from "node:test";
import assert from "node:assert/strict";

import {
  checkRequest,
  resetAntiBotState,
} from "../lib/antibot";

import {
  addQueueEntry,
  allocateTicket,
  hasQueueEntry,
  hasAllocation,
  resetFairnessState,
} from "../lib/fairness";

test.beforeEach(() => {
  resetAntiBotState();
  resetFairnessState();
});

test("first request from a user is allowed", () => {
  const result = checkRequest("human-1");

  assert.equal(result.allowed, true);
  assert.equal(result.state, "NORMAL");
});

test("duplicate queue entry is rejected", () => {
  const first = addQueueEntry("user-1");
  const second = addQueueEntry("user-1");

  assert.equal(first, true);
  assert.equal(second, false);
  assert.equal(hasQueueEntry("user-1"), true);
});

test("same user cannot receive two tickets", () => {
  const first = allocateTicket("user-1", "ticket-1");
  const second = allocateTicket("user-1", "ticket-2");

  assert.equal(first, true);
  assert.equal(second, false);
  assert.equal(hasAllocation("user-1"), true);
});

test("same ticket cannot be allocated twice", () => {
  const first = allocateTicket("user-1", "ticket-1");
  const second = allocateTicket("user-2", "ticket-1");

  assert.equal(first, true);
  assert.equal(second, false);
});

test("repeated requests eventually become throttled", () => {
  let result;

  for (let i = 0; i < 10; i++) {
    result = checkRequest("bot-1");
  }

  assert.equal(result?.allowed, false);
  assert.equal(result?.state, "THROTTLED");
  assert.equal(result?.statusCode, 429);
});

test("excessive requests eventually block the user", () => {
  let result;

  for (let i = 0; i < 20; i++) {
    result = checkRequest("bot-2");
  }

  assert.equal(result?.allowed, false);
  assert.equal(result?.state, "BLOCKED");
  assert.equal(result?.statusCode, 403);
});