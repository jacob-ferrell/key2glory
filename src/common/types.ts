export interface Stats {
  wpm: number;
  accuracy: number;
  time: number;
  missedCharacters: string[];
  wpmScore: number;
  overallScore: number;
}

export interface GeneralStats {
  averageWPM: number;
  highestWPM: number;
  averageAccuracy: number;
  testsCompleted: number;
  testsContributed: number;
}

type FilterOption = {
  [key: string]: string; // Key-value pairs where the key is the display name and the value is the query parameter value
};

export interface FilterType {
  name: string;
  options: FilterOption;
  queryParam: string;
  allowMultiple?: boolean;
}

export interface TypingTest {
  id: number;
  text: string;
  ratings: number;
  rating: number | null;
  createdBy: string;
  type: string; // You may need to define a TypeScript type for TypingTestType
  currentUserRating: number | null;
  highScore: Score | null;
  currentUserHighScore: Score | null;
  scoresCount: number | null;
  wordsCount: number | null;
};
type Score = {
  id: number | null;
  wpm: number | null;
  accuracy: number | null;
  time: number | null;
  overallScore: number | null;
  missedCharacters: string[] | null;
  username: string | null;
  typingTest: number | null;
  createdAt: string | null;
};