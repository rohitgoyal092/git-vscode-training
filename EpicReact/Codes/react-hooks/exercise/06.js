// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from "../pokemon";

const FallbackComponent1 = ({ error }) => {
  return <div>{`Error occured : ${error.message}`}</div>;
};

const FallbackComponent = ({ error, resetErrorBoundary }) => {
  return (
    <div>
      <div>{`Error occured : ${error.message}`}</div>
      <button onClick={resetErrorBoundary}>Click to Try Again</button>
    </div>
  );
};

class MyErrorBoundary extends React.Component {
  constructor() {
    super();
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    const { error } = this.state;
    if (error) {
      return <this.props.FallbackComponent error={error} />;
    }
    return this.props.children;
  }
}

function PokemonInfo({ pokemonName }) {
  const [pokemon, setPokemon] = React.useState({
    data: null,
    error: null,
    status: "idle",
  });

  React.useEffect(() => {
    if (!pokemonName) {
      return;
    }
    setPokemon({ data: null, error: null, status: "fetching" });
    fetchPokemon(pokemonName)
      .then((response) => {
        console.log(response);
        setPokemon({ data: response, error: null, status: "resolved" });
      })
      .catch((error) => {
        setPokemon({ data: null, error: error, status: "rejected" });
      });
  }, [pokemonName]);

  if (pokemon.status === "idle") {
    return "Submit a pokemon";
  } else if (pokemon.status === "fetching") {
    return `Fetching...`;
  } else if (pokemon.status === "resolved") {
    return <PokemonDataView pokemon={pokemon.data} />;
  } else {
    throw pokemon.error
      ? pokemon.error
      : new Error("Unexpected error occured!");
  }

  // 🐨 Have state for the pokemon (null)
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => { /* update all the state here */},
  //   )
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  // 💣 remove this
}

function App() {
  const [pokemonName, setPokemonName] = React.useState("");

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName);
  }

  return (
    <div className='pokemon-info-app'>
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className='pokemon-info'>
        <ErrorBoundary
          FallbackComponent={FallbackComponent}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
