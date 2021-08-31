<h1>GraphQL</h1>

- To learn, go here :

  - https://graphql.org/learn/
  - https://www.apollographql.com/docs/react/

- To practice, go here :

  - https://rickandmortyapi.com/graphql
  - https://apis.guru/graphql-voyager/
  <br/><br/>
  <h2>Why Graphql:</h2>

- https://graphql.org/faq/#does-graphql-replace-rest
- https://medium.com/devops-dudes/graphql-vs-rest-vs-grpc-411a0a60d18d
- https://engineering.fb.com/2015/09/14/core-data/graphql-a-data-query-language/
- https://www.freecodecamp.org/news/what-is-graphql-the-misconceptions/

- Response of the api nearly mirrors the request format.
- Data is generally hierarchial in nature (graphical relation) and relation. Hence GraphQl pairs well with graph-structured data stores.
- GraphQL is strongly typed, hence static error checking like interfaces in typescript can be done.
- We use GraphQl over REST apis because REST retrieves all the data associated with the request, sometimes using SQL joins leading to multiple network calls over multiple endpoints whereas GraphQL is a single endpoint.
- In GraphQL, we can provide different clients the exact data they need in the requested format(similar hierarchial pattern) without over-fetching or limiting response mappings using just a single endpoint (https://medium.com/devops-dudes/graphql-vs-rest-vs-grpc-411a0a60d18d).
- Beyond that, GraphQL also supports union types (https://graphql.org/learn/queries/#fragments).
- We use Apollo client to manage server side data, whereas redux is mainly meant for local storage state management.
<br/><br/>
<h3>Reasons GraphQL is bad</h3>

- https://blog.logrocket.com/why-you-shouldnt-use-graphql/#1
- Single endpoint has to handle all kinds of queries, so if many big queries are there, load on the server might be large.
- GraphQL might be unnecessary for small scale applications. Eg. For checking if error occurred at the server side, we might need to parse the JSON first whereas REST gives a flag for the same purpose of identification.
- File uploading is also not part of GraphQL spec. So we need to use some other library like Apollo's upload server.
- It is difficult to set up a reverse proxy cache ( which generally works on some url patterns or some identifier). Some tool like "persistengraphql" might provide solution to this problem to some extent which uses query identifiers and parameters to the query to identify repeated requests.

- (Unexplored) GraphQL code-first vs schema-first approaches

<br/><br/>

<h3>Types in GraphQL</h3>

- https://graphql.org/learn/schema/#type-system
- Scalar types(leaf node data types): Int, float, string, boolean, id(used as key for the cache/refetch)
- Object types
- Query & Mutation types
- Enums :

```
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}
```

This means that wherever we use the type Episode in our schema, we expect it to be exactly one of NEWHOPE, EMPIRE, or JEDI.

- Array types
- Non Null modifier (!) - Triggers error if server attempts to return null value for a field.
  PS : Empty array is not null
- Interface - Like an abstract class (implemented/extended)
- Union types - Generally used with inline fragments. Common inherited interfaces can also be extracted once while writing query. We can't do union of interfaces or unions themselves. We do union on object types only.
- Input type - To pass an object as an argument (generally for mutation).

<br/><br/>

<h2>Query</h2>

- useQuery returns a lot of properties, most commonly used ones being 'data', 'loading' and 'error'.
- Whenever graphql fetches query results, it automatically updates corresponding 'id' cache data shallowly (new overlapping field results overwrite old field results).
- We can update cache via server(apart from the first render) via polling or refetching.

  - We can use "networkStatus" property of the useQuery to check if refetch is in progress by setting "notifyOnNetworkStatusChange" to true.

- We can change errorPolicy to get the partial data on error too instead of just getting the error response.
- We can also execute query in response to an event other than component rendering using useLazyQuery callback from the useQuery hook.
- We can set different fetchPolicy and nextFetchPolicy(for all the future cache updates apart from the first fetch).

<br/><br/>

<h2>Mutation</h2>

- Like query, mutation also returns a lot of properties like 'mutate' function, 'data', 'loading', 'error'.

- If you provide options to mutate function and useMutation hook, options in the function take precedence over options from the hook.
- Post a mutation, we can update the local data via :
  - Refetching the affected queries using the 'refetchQueries' array option.
  - GraphQL also updates local cache for the modified object using the 'id' and '\_\_typename' properties. However, other queries using the same object are not modified. To overcome this, we can write the update function for the useMutation hook.
  - Also, it sometimes might be beneficial and necessary to verify the changes made to the local cache by the update function. This is accomplished by another property inside the useMutation hook called "onQueryUpdated" which checks the need to refetch post updating cache via the update function. It targets all the queries affected by the update function as well as "refetchQueries".

<br/><br/>

<h2>Subscription</h2>

- Subscription is not meant to stay up to date with the backend. It is used to provide small incremental changes to the client side, such as in a chat application
- We use websockets type of link in subscription. Hence, the link used here is based on type of query : HTTP link for query and mutations, and WebSockets for Subscriptions.
- useSubscription hook is used for the same. It also returns "loading", "data", "error" properties.
- Generally, subscription is used with a query using "subscribeToMore" callback received from the query. It works with subscription document node, any variables required, and an updateQuery function that combines previous data of the query and subscription data (we define how to do that) and the result replaces the cached query result.

<br/><br/>

<h2>Fragments</h2>

- A GraphQL fragment is a piece of logic that can be shared between multiple queries and mutations.
- Whenever we use fragments as part of GraphQL query or mutation, we need to pass the definition of the same fragment as part of the respective query or mutation.
- Generally, we might colocate the fragment as a property of a component. This allows easier management of fragments. Also parent components can use the fragments defined by the child components.
- To use inline fragments with union and interfaces, we need to define the inherent relationship to the client between the union and interfaces using "possibleTypes" property. We can either hard-code this or generate the relationship mapping by using the results of an introspection query.(https://graphql.org/learn/introspection/).
- Additionally, only define fragments for sets of fields that share a logical semantic relationship. Don't create a fragment just because multiple queries happen to share certain fields

```
# Recommended ✅
fragment NameParts on Person {
  title
  firstName
  middleName
  lastName
}

# Not recommended ❌
fragment SharedFields on Country {
  population
  neighboringCountries {
    capital
    rivers {
      name
    }
  }
}
```

<br/><br/>

<h2>Apollo Client refetchQueries</h2>

- Apart from mutation properties like "refetchQueries" and "onQueryUpdated", apollo client also provides functionality to refetch affected queries post a cache update and similar options.
- We can use "updateCache()" so that any changes made to cache inside the function, the queries that are affected by the changes are refetched.
- If we do not want to update cache with the changes done in the updateCache function, we can pass "optimistic : true", which will not alter the original cache, only make changes while refetchQueries is watching it.
- We can also use onQueryUpdated, which is passed every affected query and we can decide whether to refetch it or not depending on some checks or maybe log the query being refetched.
- The refetch promises are handled via Promises.all(). If we do not wish to hide other success fetches if any one fetch fails, we can also extract the result array from the "client.refetchQueries", and use map function on the same to handle each result separately.

<br/><br/>

<h2>Error handling</h2>

- GraphQL generally has 3 types of errors that can occur on the server side :
  - Syntax errors (e.g., a query was malformed)
  - Validation errors (e.g., a query included a schema field that doesn't exist)
  - Resolver errors (e.g., an error occurred while attempting to populate a query field)
- If a syntax error or validation error occurs, your server doesn't execute the operation at all because it's invalid. If resolver errors occur, your server can still return partial data.

- Then there are network errors - These are errors encountered while attempting to communicate with your GraphQL server, usually resulting in a 4xx or 5xx response status code (and no data. When a network error occurs, Apollo Client adds it to the error.networkError field returned by your useQuery call (or whichever operation hook you used).
- We can toggle 'errorPolicy' property to tell how we want to receive partial data and errors.
- We can also handle different errors using Links passed to the client. This gives us additional capability to initiate retries(generally single retry can only be done).
- We can provide client with a combination of (using "from") HTTP links, onError links("return forward(operation)").
- We can also conditionally ignore the errors by setting the response.errors to null in your onError link.

<br/><br/>

<h2>Caching</h2>

- In order to store data of a query to the cache :
  - The data is first normalized by:
    - Identifying objects
    - Generating cache ids as concatenation of \_\_typename + ids. If cache id cannot be generated, object is referenced through a parent.
    - Objects are replaced by their references as in :
- The data from the server side is shallowly merged with the data on the client side in the cache. Same fields are replaced while new fields are added.

```
{
  "__typename": "Person",
  "id": "cGVvcGxlOjE=",
  "name": "Luke Skywalker",
  "homeworld": {
    "__typename": "Planet",
    "id": "cGxhbmV0czox",
    "name": "Tatooine"
  }
}

```

becomes

```
{
  "__typename": "Person",
  "id": "cGVvcGxlOjE=",
  "name": "Luke Skywalker",
  "homeworld": {
    "__ref": "Planet:cGxhbmV0czox"
  }
}

```

- Cache methods :

  - Write methods trigger refetch of all active queries that depend on the updated query.

  - If a type in your cache uses a custom cache ID (or even if it doesn't), you can use the cache.identify method to obtain the cache ID for an object of that type. This method takes an object and computes its ID based on both its \_\_typename and its identifier field(s). This means you don't have to keep track of which fields make up each type's cache ID.

  1. readQuery - We can get a query's data using this method. If there is any field whose data is not present in the cache, readQuery returns null(in older Apollo versions, "MissingFieldError" was reported), and "NOT" attempted to fetch. Also, the returned object should not be modified. Instead, if a modification is needed, we can create a new object and use writeQuery for changing cache data.
  2. writeQuery - It is similar to readQuery, except it requires 'data' field. Caveats :

     - Any changes made by this are not pushed to the server.
     - Shape is not enforced by GraphQL server schema, hence we can potentially and mistakenly provide previously undefined fields.

  3. readFragment - It is like readQuery, except it requires a cache Id in the id field (eg. "Todo : 5"). It also returns null if any field is missing a value in the cache.
  4. writeFragment - Like writeQuery with readQuery, we have writeFragment with readFragment.
  5. modify - It cannot modify fields that don't already exist in the cache unlike the previous 2 'write' methods. We can also provide a broadcast boolean to inform about query refresh at other places. Syntactically, it is also a bit different to write, as we need to provide an id using "cache.identify" and provide methods to change the respective fields. Caveat :
     - The modifier function receives the previous value in the cache as the argument. If the field data is an object, and we return something different other than the reference to this object, we end up changing the reference to this field rather than modifying the data inside this field.

  - We can also delete, invalidate fields, read fields by passing different options to the respective field function like "DELETE", "INVALIDATE", "readField" etc and in some cases returning their values.
  <br/><br/>
  <h2>Query vs Mutation vs Subscription :</h2>

- https://medium.com/software-insight/graphql-queries-mutations-and-subscriptions-286522b263d9
- https://www.apollographql.com/blog/graphql/basics/mutation-vs-query-when-to-use-graphql-mutation/
- Mutations and queries are different in way that mutation helps modify data present at the server and also returns the same in the same request.
- While query fields are executed in parallel, mutation fields run in series, one after the other.
- While we use queries to fetch data, we use mutations to modify server-side data.
- query could be batched or not batched - https://www.apollographql.com/blog/apollo-client/performance/batching-client-graphql-queries/

<br/><br/>

We can write queries like :

```

# Write your query or mutation here
query getAllCharacters($page : Int, $filter : FilterCharacter){
  characters(page : $page, filter :$filter){
    results {
      name,
      status
    }
  }
}

```

- "\$filter" , "\$page" are variables that are scoped.
- variable initialization :

```
{"page": 34, "filter": : {"name" : "Rick Sanchez"}}
```

<br/><br/>

<h2>Pagination</h2>

- If your data graph includes thousands or millions of books, a simple graphql query probably returns much more data than you need. To resolve this issue, GraphQL servers can paginate their list fields.

- When a client queries a paginated list field, the server returns only a portion (or "page") of the list's elements. The client's query includes arguments that indicate which page the server should return:

- There are many different pagination strategies a server can use for a particular list field: offset-based, cursor-based, page-number-based, forwards, backwards, and so on. Each strategy requires a slightly different set of arguments. Because these strategies can each be useful in different situations, neither Apollo nor the GraphQL specification prescribes a canonical pagination strategy.
- The pagination strategy generally consists of 2 steps :

  - Call the fetchMore function to fetch the next page of results when needed
  - Merge individual pages of results into a single list in the Apollo Client cache

```
const FEED_QUERY = gql`
  query Feed($offset: Int, $limit: Int) {
    feed(offset: $offset, limit: $limit) {
      id
      # ...
    }
  }
`;

const FeedWithData() {
  const { loading, data, fetchMore } = useQuery(FEED_QUERY, {
    variables: {
      offset: 0,
      limit: 10
    },
  });
  // ...continues below...
}
```

- We generally call fetch more based on some event triggered by the user.
- fetchMore can have new value of variables on each execution. Otherwise default variables are used. Also, we can change query shape to avoid any redundant data in the subsequent fetchMore queries.
- Cache keeps the fetchMore data and original data as 2 separate lists. We need to merge them. We need to define a "field Policy" for that. We define our field policy within the typePolicies option we provide the InMemoryCache constructor:

```
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        feed: {
          keyArgs: [],
          merge(existing, incoming, { args: { offset = 0 }}) {
            // Slicing is necessary because the existing data is
            // immutable, and frozen in development.
            const merged = existing ? existing.slice(0) : [];
            for (let i = 0; i < incoming.length; ++i) {
              merged[offset + i] = incoming[i];
            }
            return merged;
          },
        },
      },
    },
  },
});
```

- Field policy is defined for the Query, describing about each of it's fields when and how to merge them and when to keep separate copies.

- keyArgs is the array which defines distinct values which lead to storing a separate instance in the cache for the retrieved
- merge is a merge function to define how existing and incoming values are merged.
- Options as an argument describe the values like offset and limit.
- We can also define 'read' function that can essentially paginate back the stored value, for application usage. So when we access the array, if we use the read function, we get paginated response (or any custom response as programmed inside the read function). If we define custom read function, we need to manage state corresponding to possibly limit and offset so that any fetchMore data is available for reading purpose.

```
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        feed: {
          read(existing, {
            args: {
              // Default to returning the entire cached list,
              // if offset and limit are not provided.
              offset = 0,
              limit = existing?.length,
            } = {},
          }) {
            return existing && existing.slice(offset, offset + limit);
          },
          // ... keyArgs, merge ...
        },
      },
    },
  },
});
```

Component with useState for limit to complete the read function:

```
const FeedData = () => {
  const [limit, setLimit] = useState(10);
  const { loading, data, fetchMore } = useQuery(FEED_QUERY, {
    variables: {
      offset: 0,
      limit,
    },
  });

  if (loading) return <Loading/>;

  return (
    <Feed
      entries={data.feed || []}
      onLoadMore={() => {
        const currentLength = data.feed.length;
        fetchMore({
          variables: {
            offset: currentLength,
            limit: 10,
          },
        }).then(fetchMoreResult => {
          // Update variables.limit for the original query to include
          // the newly added feed items.
          setLimit(currentLength + fetchMoreResult.data.feed.length);
        });
      }}
    />
  );
}
```

- We can use inbuilt offset based paging(it's implemented without read function) => "offsetLimitPagination".
- We can also used cursor based pagination, wherein we :
  - Either use id of a field as a cursor, calculate offset from the id and change content after that offset to the incoming content. But this could be problematic because we could end up modifying some content. Hence, we could also return the data as an object in the merge function. As long as the data is returned in the right format in the read function, we should be good.
  - It might be better to make cursor a field, and separate it from the id field (in cases when list might have duplicates).

```
const MORE_COMMENTS_QUERY = gql`
  query MoreComments($cursor: String, $limit: Int!) {
    moreComments(cursor: $cursor, limit: $limit) {
      cursor
      comments {
        id
        author
        text
      }
    }
  }
`;
```

<br/><br/>

<h2>Best Practices :</h2>

- We should name all operations : for semantic purposes, debugging ease(logging purposes), Apollo inbuilt utilities
- Use variables in arguments instead of hard-coding values into fields. This also provides many benefits like server side caching boost to the queries (automatic persisted queries, that basically parses queries only once and thereafter only works on previously parsed queries with different arguments). Also with variables as arguments, the cache doesn't store some private and sensitive values like keys with the rest of the query string.
- We should query whatever we need, nothing extra. That's one of the main benefits of GraphQL.
- We should use collocated fragments for management and semantic purposes.
- Fragments should have semantically related values. We should also avoid over-using fragments as it can impact readability of code.
- We should query global data and user-specific data separately. This helps keep the cached data for both the types separate.

```
#Some fields return the exact same data regardless of which user queries them:
# Returns all elements of the periodic table
query GetAllElements {
  elements {
    atomicNumber
    name
    symbol
  }
}
#Other fields return different data depending on which user queries them:
# Returns the current user's documents
query GetMyDocuments {
  myDocuments {
    id
    title
    url
    updatedAt
  }
}

```

This also improves server side caching.

- We should, if possible, provide app version and name while initializing client. This helps segregate data for analysis while using Apollo metrics reporting for different versions of the App and names.

```
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  name: 'MarketingSite',
  version: '1.2'
});
```

<br/><br/>

<h1>GraphQL Frontend Masters Course</h1>

<h2>Aliasing</h2>
Used to change client side interpretation of a field on server side.

```
results {
      fullName : name,
    }
```

<br/><br/>

<h2>Mutations</h2>

- Same as query :

```
mutation CreatingACharacter(){
  createCharacter(){

  }
}
```

<br/><br/>

<h2>Apollo API</h2>

- In order to use the API, we have to define a client which consists of a link and a cache.

```
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";

/**
 * Create a new apollo client and export as default
 */

const link = new HttpLink({ uri: `http://localhost:4000/` });
const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
});

const query = gql`
  {
    characters {
      results {
        name
        id
      }
    }
  }
`;

client.query({ query }).then((result) => {
  console.log(result);
});

export default client;

```

- Link points to a server, cache is to cache the query "Operation" results.
- In order to query a server, we can use the useQuery hook which returns

```
{data, loading, error}
```

- We need to pass an operation name in order for caching to work.
- We should mostly pass the same fields in mutation, so that for most of the use cases, the cache also gets updated for the query we want changed with the mutation (We should have the ID beforehand in the cache for automatic updates post mutation).
- In apollo, mutation happens only via function call, whereas useQuery runs on re-render - "Note that this behavior differs from useQuery, which executes its operation as soon as its component renders. This is because mutations are more commonly executed in response to a user action (such as submitting a form in this case)."
- Example of query and mutation :

```
import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import PetsList from "../components/PetsList";
import NewPetModal from "../components/NewPetModal";
import Loader from "../components/Loader";

const ALL_PETS = gql`
  query AllPets {
    pets {
      id
      name
      type
      img
    }
  }
`;

const NEW_PET = gql`
  mutation CreateAPet($newPet: NewPetInput!) {
    addPet(input: $newPet) {
      id
      name
      type
      img
    }
  }
`;

export default function Pets() {
  const [modal, setModal] = useState(false);
  const { data, loading, error } = useQuery(ALL_PETS);
  const [createPet, newPet] = useMutation(NEW_PET);
  const onSubmit = (input) => {
    setModal(false);
    createPet({ variables: { newPet: input } });
  };
  if (loading || newPet.loading) {
    return <Loader />;
  }

  if (error || newPet.error) {
    return <p>{`Error occurred: ${error ? error : newPet.error}`}</p>;
  }

  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />;
  }

  return (
    <div className='page pets-page'>
      <section>
        <div className='row betwee-xs middle-xs'>
          <div className='col-xs-10'>
            <h1>Pets</h1>
          </div>

          <div className='col-xs-2'>
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList pets={data.pets} />
      </section>
    </div>
  );
}

```

<br/><br/>

<h2>Ways to keep mutation in sync with cache : </h2>

- https://www.apollographql.com/docs/react/data/mutations/

1. Refetch query after mutation update.
2. Watch for changes to a query.
3. Use update method on mutation.

- We generally use update method on mutation, although we can pass refetch array to the useMutation hook to refetch particular queries upon mutation :

```
const [createPet, newPet] = useMutation(NEW_PET, {
    update(cache, { data: { addPet } }) {
      const data = cache.readQuery({ query: ALL_PETS });
      cache.writeQuery({
        query: ALL_PETS,
        data: { pets: [addPet, ...data.pets] },
      });
    },
  });
```

- We can use "Optimistic Response" to update the cache when mutation is fired. This is useful when there is guarantee that mutation result will be what is expected. This helps avoid delay between firing mutation and cache update. Optimistic Response object can be used inside created hook as well as while calling the 'mutate' function at a certain point in the code(Basically making it a default feature or only to be used at a particular point in the code or to use certain variables inside the Optimistic Response, we can define it inside mutation function only).

```
const onSubmit = (input) => {
    setModal(false);
    createPet({
      variables: { newPet: input },
      optimisticResponse: {
        __typename: "Mutation",
        addPet: {
          __typename: "Pet",
          id: Math.floor(Math.random() * 10000) + " ",
          name: input.name,
          type: input.type,
          img: "https://via.placeholder.com/300",
        },
      },
    });
  };

```

- To simulate long delays, we can use response interceptors like ApolloLink (like React links) that will catch the network request and handle some part of it by itself(say add delay between when request is fired and dispatched).

```
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
const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
});

export default client;

```

<br/><br/>

<h2>Local State Management using GraphQL</h2>

- We define schema for defining local state, and wire it with GraphQL so local as well as server state is managed by GraphQL.
- To create the schema, we need type definitions as well as resolvers(functions that are responsible for getting values of the fields in the type definitions).
- We can create typeDefs and resolvers for the local state and push the same while initializing the client for local state management.

```
const typeDefs = gql`
  extend type User {
    age: Int
  }
`;

const resolvers = {
  User: {
    age() {
      return 35;
    },
  },
};

//......... Intermediate code

const client = new ApolloClient({
  link,
  cache,
  resolvers,
  typeDefs,
});

```

<br/><br/>

<h2>Fragments</h2>

- We can use fragments to generalize some query type so as to avoid repetition and redefining fields, increase reusability (eg. query and respective mutations generally have the same fields)

```
const PETS_FIELDS = gql`
  fragment PetsFields on Pet {
    id
    name
    type
    img
    vaccinated @client
    owner {
      id
      age @client
    }
  }
`;

const ALL_PETS = gql`
  query AllPets {
    pets {
      ...PetsFields
    }
  }
  ${PETS_FIELDS}
`;

const NEW_PET = gql`
  mutation CreateAPet($newPet: NewPetInput!) {
    addPet(input: $newPet) {
      ...PetsFields
    }
  }
  ${PETS_FIELDS}
`;
```

<br/><br/>
