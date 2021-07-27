const counter = (state = 0, action) => {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
};
const { createStore } = Redux;
const store = createStore(counter);

console.log(store.getState());

const Counter = ({ value, onIncrement, onDecrement, ...props }) => {
  return (
    <div
      style={{
        display: "block",
        margin: "auto",
        width: "fit-content",
        textAlign: "center",
      }}
    >
      <h1>{value}</h1>
      <button onClick={onIncrement}>+</button>
      <button onClick={onDecrement}>-</button>
    </div>
  );
};

const render = () => {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={(e) => {
        store.dispatch({ type: "INCREMENT" });
      }}
      onDecrement={(e) => {
        store.dispatch({ type: "DECREMENT" });
      }}
    />,
    document.getElementById("root")
  );
};
render();
store.subscribe(render);
