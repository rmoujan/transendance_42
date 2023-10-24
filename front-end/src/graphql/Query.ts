import { gql } from '@apollo/client';

export const GET_TOP_CHARACTERS = gql`
  query GetTopCharacters {
    topCharacters {
      mal_id
      name
      image_url
      rank
    }
  }
`;