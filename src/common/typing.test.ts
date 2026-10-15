import { describe, expect, it } from "vitest";
import {
  calculateStats,
  getMatches,
  initialTypingState,
  normalizeText,
  TypingAction,
  typingReducer,
  TypingState,
} from "./typing";

function run(text: string, ...actions: (string | TypingAction)[]): TypingState {
  return actions.reduce<TypingState>((state, action) => {
    if (typeof action !== "string") return typingReducer(state, action);
    return Array.from(action).reduce(
      (s, char) => typingReducer(s, { type: "type", char }),
      state
    );
  }, initialTypingState(text));
}

const backspace: TypingAction = { type: "backspace" };

describe("typingReducer", () => {
  it("starts running on the first key and finishes at the end of the text", () => {
    expect(run("abc", "a").status).toBe("running");
    const done = run("abc", "abc");
    expect(done.status).toBe("finished");
    expect(done.missedCharacters).toEqual([]);
  });

  it("records the expected character for a mistake and shows it as wrong", () => {
    const state = run("abc", "ax");
    expect(state.input).toBe("ax");
    expect(state.missedCharacters).toEqual(["b"]);
    expect(getMatches(state)).toEqual([true, false]);
  });

  it("does not advance on a second consecutive mistake but still counts it", () => {
    const state = run("abcd", "axy");
    expect(state.input).toBe("ax");
    expect(state.missedCharacters).toEqual(["b", "c"]);
  });

  it("lets the user fix a mistake with backspace", () => {
    const state = run("abc", "ax", backspace, "bc");
    expect(state.status).toBe("finished");
    expect(state.missedCharacters).toEqual(["b"]);
  });

  it("deleting everything restarts the run", () => {
    const state = run("abc", "ax", backspace, backspace);
    expect(state).toEqual(initialTypingState("abc"));
  });

  it("ctrl+backspace deletes the current word", () => {
    const state = run("one two three", "one tw", { type: "backspace", word: true });
    expect(state.input).toBe("one ");
    const previous = run("one two three", "one two ", { type: "backspace", word: true });
    expect(previous.input).toBe("one ");
  });

  it("ignores input when finished or before text loads", () => {
    const done = run("ab", "ab");
    expect(typingReducer(done, { type: "type", char: "c" })).toBe(done);
    const empty = initialTypingState("");
    expect(typingReducer(empty, { type: "type", char: "a" })).toBe(empty);
  });

  it("ignores multi-character keys", () => {
    const state = initialTypingState("abc");
    expect(typingReducer(state, { type: "type", char: "Shift" })).toBe(state);
  });

  it("reset can swap in new text", () => {
    expect(run("abc", "ab", { type: "reset", text: "xyz" })).toEqual(initialTypingState("xyz"));
  });
});

describe("normalizeText", () => {
  it("replaces typographic characters without changing length", () => {
    const text = "We’ll say “hi” – ok now";
    const normalized = normalizeText(text);
    expect(normalized).toBe(`We'll say "hi" - ok now`);
    expect(normalized.length).toBe(text.length);
  });
});

describe("calculateStats", () => {
  // 10 words, 48 characters
  const text = "one two three four five six seven eight nine ten";

  it("matches the backend formulas", () => {
    expect(calculateStats(text, text.length, 3, 6)).toEqual({
      wpm: 100,
      accuracy: 93.75,
      overallScore: 93.75,
      timeSeconds: 6,
    });
  });

  it("never reports negative accuracy", () => {
    expect(calculateStats(text, text.length, 500, 60).accuracy).toBe(0);
  });

  it("handles nothing typed yet", () => {
    expect(calculateStats(text, 0, 0, 0).wpm).toBe(0);
  });
});
