// Returns the last index in the input that is safe to render (i.e., not splitting inside a tag, comment, or entity).
// If nothing is safe to flush yet, returns -1.
export const findSafeFlushIndex = (input: string): number => {
  let insideTag = false;
  let insideComment = false;
  let insideEntity = false;
  let quote: '"' | "'" | null = null;
  let safeIndex = -1;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (insideComment) {
      // Detect end of comment -->
      if (ch === '>' && input[i - 1] === '-' && input[i - 2] === '-') {
        insideComment = false;
        safeIndex = i; // up to and including '>' is safe
      }
      continue;
    }

    if (insideTag) {
      if (quote) {
        if (ch === quote) quote = null;
      } else {
        if (ch === '"' || ch === "'") {
          quote = ch as '"' | "'";
        } else if (ch === '>') {
          insideTag = false;
          safeIndex = i;
        }
      }
      continue;
    }

    if (insideEntity) {
      if (ch === ';') {
        insideEntity = false;
        safeIndex = i;
      }
      continue;
    }

    // Not inside anything special
    if (ch === '<') {
      if (input.slice(i, i + 4) === '<!--') {
        insideComment = true;
      } else {
        insideTag = true;
      }
      // Do not advance safeIndex here; we don't want to include the '<' yet
      continue;
    }

    if (ch === '&') {
      insideEntity = true;
      continue;
    }

    // Regular text character; safe to render through here
    safeIndex = i;
  }

  return safeIndex;
};
