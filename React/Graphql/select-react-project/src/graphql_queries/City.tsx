import gql from "graphql-tag";
const CITY_FIELDS = gql`
  fragment CityFields on City {
    id
    country
    name
    lat
    lng
  }
`;

export const GET_MORE_CITIES = gql`
  query GetCities($input: GetCityInput) {
    getCities(input: $input) {
      ...CityFields
    }
  }
  ${CITY_FIELDS}
`;
