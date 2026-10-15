export type TestType = "GENERAL" | "NUMBERS" | "SPECIAL_CHARACTERS" | "CUSTOM";

export interface Score {
  id: number;
  wpm: number;
  accuracy: number;
  // Milliseconds
  time: number;
  overallScore: number;
  missedCharacters: string[] | null;
  username: string | null;
  typingTest: number;
  createdAt: string | null;
}

/** Result of a finished run, either scored by the server or calculated locally. */
export interface RunResult {
  wpm: number;
  accuracy: number;
  overallScore: number;
  timeSeconds: number;
  missedCharacters: string[];
  saved: boolean;
  saveError?: string;
}

export interface GeneralStats {
  averageWPM: number;
  highestWPM: number;
  averageAccuracy: number;
  testsCompleted: number;
  testsContributed: number;
}

export interface LeaderboardEntry {
  username: string;
  averageWpm: number;
  bestWpm: number;
  averageAccuracy: number;
  testsCompleted: number;
}

type FilterOption = {
  [key: string]: string; // Key-value pairs where the key is the display name and the value is the query parameter value
};

export interface FilterType {
  name: string;
  options: FilterOption;
  queryParam: string;
  allowMultiple?: boolean;
  requiresAuth?: boolean;
  // Option value the server applies when the param is absent
  defaultValue?: string;
}

export interface TypingTest {
  id: number;
  text: string;
  ratings: number;
  rating: number | null;
  createdBy: string;
  type: TestType;
  createdAt: string | null;
  currentUserRating: number | null;
  highScore: Score | null;
  currentUserHighScore: Score | null;
  favorited: boolean | null;
  scoresCount: number | null;
  wordsCount: number | null;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
