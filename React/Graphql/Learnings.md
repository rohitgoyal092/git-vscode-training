<h1>GraphQL</h1>

- To practice, go here : https://rickandmortyapi.com/graphql

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
-
