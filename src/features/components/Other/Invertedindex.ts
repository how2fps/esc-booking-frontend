

export type InvertedIndex = { [word: string]: Set<number> };

type DestinationType = {
  term: string;
  uid: string;
  lat: number;
  lng: number;
  type: string;
  state?: string;
};
export default function buildInvertedIndex(data: DestinationType[]): InvertedIndex {
  const index: InvertedIndex = {};

  data.forEach((item, i) => {
    // Gather searchable fields
    const values = [item.term, item.state, item.type]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    // Tokenize the string
    const tokens = values.split(/[\s,().-]+/).filter(Boolean);

    tokens.forEach((token) => {
      if (!index[token]) {
        index[token] = new Set();
      }
      index[token].add(i);
    });
  });

  return index;
}

