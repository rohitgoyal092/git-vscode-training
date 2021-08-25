<h1>GraphQL</h1>

- To practice, go here : https://rickandmortyapi.com/graphql
<br><br>
<h2>Why Graphql:</h2>

- https://graphql.org/faq/#does-graphql-replace-rest
- https://engineering.fb.com/2015/09/14/core-data/graphql-a-data-query-language/
- https://medium.com/devops-dudes/graphql-vs-rest-vs-grpc-411a0a60d18d
- https://www.freecodecamp.org/news/what-is-graphql-the-misconceptions/
- https://graphql.org/learn/
- Response of the api nearly mirrors the request format.
- Data is generally hierarchial in nature (graphical relation) and relation. Hence GraphQl pairs well with graph-structured data stores.
- GraphQL is strongly typed, hence static error checking like interfaces in typescript can be done.
- We use GraphQl over REST apis because REST retrieves all the data associated with the request, sometimes using SQL joins leading to multiple network calls over multiple endpoints whereas GraphQL is a single endpoint.
- In GraphQL, we can provide different clients the exact data they need in the requested format(similar hierarchial pattern) without over-fetching or limiting response mappings using just a single endpoint (https://medium.com/devops-dudes/graphql-vs-rest-vs-grpc-411a0a60d18d).
- Beyond that, GraphQL also supports union types (https://graphql.org/learn/queries/#fragments).
- Mutations and queries are different in way that mutation helps modify data present at the server and also returns the same in the same request.
- While query fields are executed in parallel, mutation fields run in series, one after the other.
- We use Apollo client to manage server side data, whereas redux is mainly meant for local storage state management.

<h3>Reasons GraphQL is bad</h3>

- https://blog.logrocket.com/why-you-shouldnt-use-graphql/#1
- Single endpoint has to handle all kinds of queries, so if many big queries are there, load on the server might be large.
- GraphQL might be unnecessary for small scale applications. Eg. For checking if error occurred at the server side, we might need to parse the JSON first whereas REST gives a flag for the same purpose of identification.
- File uploading is also not part of GraphQL spec. So we need to use some other library like Apollo's upload server.
- It is difficult to set up a reverse proxy cache ( which generally works on some url patterns or some identifier). Some tool like "persistengraphql" might provide solution to this problem to some extent which uses query identifiers and parameters to the query to identify repeated requests.

- (Unexplored) GraphQL code-first vs schema-first approaches

<br><br>

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

- This means that wherever we use the type Episode in our schema, we expect it to be exactly one of NEWHOPE, EMPIRE, or JEDI.
- Array types
- Non Null modifier (!) - Triggers error if server attempts to return null value for a field.
- PS : Empty array is not null
- Interface - Like an abstract class (implemented/extended)
- Union types - Generally used with inline fragments. Common inherited interfaces can also be extracted once while writing query. We can't do union of interfaces or unions themselves. We do union on object types only.
- Input type - To pass an object as an argument (generally for mutation).

<br><br>

<h2>Query vs Mutation vs Subscription :</h2>

- https://medium.com/software-insight/graphql-queries-mutations-and-subscriptions-286522b263d9
- https://www.apollographql.com/blog/graphql/basics/mutation-vs-query-when-to-use-graphql-mutation/
- While we use queries to fetch data, we use mutations to modify server-side data.
- query could be batched or not batched - https://www.apollographql.com/blog/apollo-client/performance/batching-client-graphql-queries/

<br><br>

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

<h2>Aliasing</h2>
Used to change client side interpretation of a field on server side.

```
results {
      fullName : name,
    }
```

<br><br>

<h2>Mutations</h2>

- Same as query :

```
mutation CreatingACharacter(){
  createCharacter(){

  }
}
```

- Query is cached, whereas mutation is not(generally).
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

<h2>Ways to keep mutation in sync with cache : </h3>

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
