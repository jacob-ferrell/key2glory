// Pure typing-test state machine. Kept free of React so it can be unit tested.

export type TypingStatus = "idle" | "running" | "finished";

export interface TypingState {
  text: string;
  input: string;
  // Expected character at every position the user mistyped (can repeat)
  missedCharacters: string[];
  status: TypingStatus;
}

export type TypingAction =
  | { type: "type"; char: string }
  | { type: "backspace"; word?: boolean }
  | { type: "reset"; text?: string };

const TYPOGRAPHIC_REPLACEMENTS: [RegExp, string][] = [
  [/[\u2018\u2019\u201A\u201B\u2032]/g, "'"],
  [/[\u201C\u201D\u201E\u201F\u2033]/g, '"'],
  [/[\u2010-\u2015\u2212]/g, "-"],
  [/[\u00A0\u2007\u202F]/g, " "],
];

/** Length-preserving swap of characters that aren't on a normal keyboard (mirrors the backend). */
export function normalizeText(text: string) {
  return TYPOGRAPHIC_REPLACEMENTS.reduce(
    (result, [pattern, replacement]) => result.replace(pattern, replacement),
    text
  );
}

export function initialTypingState(text = ""): TypingState {
  return { text, input: "", missedCharacters: [], status: "idle" };
}

function isCorrect(state: TypingState, index: number) {
  return state.input[index] === state.text[index];
}

export function typingReducer(state: TypingState, action: TypingAction): TypingState {
  switch (action.type) {
    case "reset":
      return initialTypingState(action.text ?? state.text);

    case "type": {
      if (state.status === "finished" || !state.text || action.char.length !== 1) {
        return state;
      }
      const position = state.input.length;
      const expected = state.text[position];
      const isError = action.char !== expected;
      const missedCharacters = isError
        ? [...state.missedCharacters, expected]
        : state.missedCharacters;
      const previousIsError = position > 0 && !isCorrect(state, position - 1);
      if (isError && previousIsError) {
        // Two mistakes in a row: record the miss but don't advance
        return { ...state, missedCharacters };
      }
      const input = state.input + action.char;
      return {
        ...state,
        input,
        missedCharacters,
        status: input.length === state.text.length ? "finished" : "running",
      };
    }

    case "backspace": {
      if (state.status !== "running" || !state.input) {
        return state;
      }
      let input = state.input.slice(0, -1);
      if (action.word) {
        // Delete back to the start of the current (or previous) word
        input = input.replace(/\S*\s*$/, "");
      }
      if (!input) {
        // Deleting everything restarts the run
        return initialTypingState(state.text);
      }
      return { ...state, input };
    }
  }
}

/** Per-character result: true = correct, false = wrong; untyped positions are absent. */
export function getMatches(state: TypingState) {
  return Array.from(state.input, (char, i) => char === state.text[i]);
}

export function countWords(text: string) {
  return text.trim() ? text.trim().split(" ").length : 0;
}

export interface LocalStats {
  wpm: number;
  accuracy: number;
  overallScore: number;
  timeSeconds: number;
}

const round = (value: number) => Math.round(value * 100) / 100;

/** Same formulas as the backend Score entity, used for signed-out players and live stats. */
export function calculateStats(
  text: string,
  typedLength: number,
  missedCount: number,
  elapsedSeconds: number
): LocalStats {
  if (!text || typedLength === 0 || elapsedSeconds <= 0) {
    return { wpm: 0, accuracy: 100, overallScore: 0, timeSeconds: round(elapsedSeconds) };
  }
  const wordsTyped = (typedLength / text.length) * countWords(text);
  const wpm = wordsTyped / (elapsedSeconds / 60);
  const accuracy = (Math.max(0, typedLength - missedCount) / typedLength) * 100;
  return {
    wpm: round(wpm),
    accuracy: round(accuracy),
    overallScore: round(wpm * (accuracy / 100)),
    timeSeconds: round(elapsedSeconds),
  };
}
