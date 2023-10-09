export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function createRange(min: number, max: number) {
  return {
    min,
    max,
    includes(n: number) {
      return n >= min && n < max;
    }
  };
}

export function getCurrentTime() {
  return new Date().getTime();
}

export function countWords(text: string) {
  return text.split(" ").length;
}
