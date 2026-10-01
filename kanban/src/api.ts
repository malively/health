import type { Character } from './types';

const ENDPOINT = 'https://rickandmortyapi.com/graphql';

const CHARACTERS_QUERY = `
  query Characters($page: Int!) {
    characters(page: $page) {
      info { next }
      results {
        id
        name
        image
        species
        status
      }
    }
  }
`;

interface CharactersResponse {
  data?: {
    characters?: {
      info: { next: number | null };
      results: Character[] | null;
    };
  };
  errors?: { message: string }[];
}

/**
 * Fetches several pages of characters from the Rick and Morty GraphQL API
 * so the assignment dropdown has a healthy roster to choose from.
 */
export async function fetchCharacters(pages = 3): Promise<Character[]> {
  const all: Character[] = [];
  let page = 1;

  for (let i = 0; i < pages; i++) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: CHARACTERS_QUERY, variables: { page } }),
    });

    if (!res.ok) {
      throw new Error(`GraphQL request failed (${res.status})`);
    }

    const json: CharactersResponse = await res.json();
    if (json.errors?.length) {
      throw new Error(json.errors[0]?.message ?? 'GraphQL query failed');
    }

    const characters = json.data?.characters;
    if (characters?.results) {
      all.push(...characters.results);
    }

    const next = characters?.info.next;
    if (!next) break;
    page = next;
  }

  if (all.length === 0) {
    throw new Error('No characters came through the portal');
  }

  return all;
}
