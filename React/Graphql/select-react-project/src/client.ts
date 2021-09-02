import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  getCitiesTypePoliciesMerge,
  getCitiesTypePoliciesRead,
} from "./utils/getCitiesTypePolicies";

const httpLink = new HttpLink({ uri: "http://localhost:4000/" });

const delay = setContext(
  (request) =>
    new Promise((success: Function, fail: Function) => {
      setTimeout(() => {
        success();
      }, 600);
    })
);

const link = ApolloLink.from([delay, httpLink]);

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getCities: {
          keyArgs: false,
          merge: getCitiesTypePoliciesMerge,
          read: getCitiesTypePoliciesRead,
        },
      },
    },
  },
});
export const client = new ApolloClient({ link, cache });
