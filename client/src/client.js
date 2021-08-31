import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link-context/node_modules/apollo-link";
import { setContext } from "apollo-link-context";
import gql from "graphql-tag";

/**
 * Create a new apollo client and export as default
 */

const http = new HttpLink({ uri: `http://localhost:4000/` });
const delay = setContext(
  (request) =>
    new Promise((success, fail) => {
      setTimeout(() => {
        success();
      }, 800);
    })
);

const link = ApolloLink.from([delay, http]);
export const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
});

// const query = gql`
//   {
//     characters {
//       results {
//         fame: name
//         id
//       }
//     }
//   }
// `;

// client.query({ query }).then((result) => {
//   console.log(result);
// });

// import { ApolloLink } from 'apollo-link'

export default client;
