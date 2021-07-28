let idCounter = 1;

const convertActionToState = (state, action) => {
  switch (action.type) {
    case "ADD TODO":
      return {
        id: action.id,
        description: action.id + ". " + action.description,
        completed: action.completed,
      };
    case "TOGGLE TODO":
      if (state.id != action.id) {
        return state;
      }
      return {
        ...state,
        completed: !state.completed,
      };
    case "REMOVE TODO":
      if (state.completed) {
        return false;
      }
      return true;
    default:
      return state;
  }
};

const ToDosReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD TODO":
      return [...state, convertActionToState({}, action)];
    case "TOGGLE TODO":
      return state.map((eleState) => {
        return convertActionToState(eleState, action);
      });
    case "REMOVE TODO":
      return state
        .map((e) => e)
        .filter((eleState) => {
          return convertActionToState(eleState, action);
        });
    default:
      return state;
  }
};

const { createStore } = Redux;
const store = createStore(ToDosReducer);

const ToDos = ({ values, onAddition, onRemoval, onSelection, ...props }) => {
  const [description, setDescription] = React.useState("");
  console.log("rerender ", description);
  const handleChange = (e) => {
    console.log("current = ", description);
    setDescription(e.target.value);
  };
  const handleClickAddition = (e) => {
    onAddition(description);
  };
  return (
    <div className='ContentContainer'>
      <div className='TaskClass'>
        {values.map((element) => {
          return (
            <h2
              key={element.id}
              className={
                "LabelClass " + (element.completed ? "StrikeClass" : "")
              }
              onClick={(e) => {
                onSelection(element.id);
              }}
            >
              {element.description}
            </h2>
          );
        })}
      </div>
      <div className='FormClass'>
        <label className='FormTextBoxClass'>
          <div className='InputField'>Input a Task</div>
          <input
            className='TextBox'
            onChange={handleChange}
            value={description}
          />
        </label>
        <button className='ButtonClass' onClick={handleClickAddition}>
          Addition Button
        </button>
        <button className='ButtonClass' onClick={onRemoval}>
          Removal Button
        </button>
      </div>
    </div>
  );
};

const render = () => {
  ReactDOM.render(
    <ToDos
      values={store.getState()}
      onAddition={(desc) => {
        if (!desc) {
          return;
        }
        store.dispatch({
          type: "ADD TODO",
          id: idCounter++,
          description: desc,
          completed: false,
        });
      }}
      onRemoval={() => {
        store.dispatch({
          type: "REMOVE TODO",
        });
      }}
      onSelection={(currId) => {
        store.dispatch({
          type: "TOGGLE TODO",
          id: currId,
        });
      }}
    />,
    document.getElementById("root")
  );
};

render();
store.subscribe(render);
