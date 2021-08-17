<h1>Lifting states and Colocating states</h1>

- While lifting state comes naturally, colocating states when needed can also have performance improvements.(https://kentcdodds.com/blog/state-colocation-will-make-your-react-app-faster)
<br/><br/>
 <h1>Managed and Derived State</h1>

- Sometimes it's easier to derive state than manage same state or it's substates in different handlers.
  <br/><br/>

<h1>ErrorBoundary</h1>

- (https://github.com/bvaughn/react-error-boundary/blob/master/README.md)
- ErrorBoundary has 'resetKeys' prop to reset on prop change without re-mounting children.
- We can use key attribute with a customized value that can help us mimim resetKeys in custom error boundary or even in react-error-boundary.
- We can define 'FallbackComponent' prop with value equal to the fallback function (args : {error, resetErrorBoundary}) to provide onClick reset handlers and provide fallback UI.
- We can define 'onReset' to do an action post reset.
- For class component custom Error Boundary, we need to define 'componentDidCatch'(renders after painting, mainly for logging purposes) or 'getDerivedStateFromError' (renders before painting, mainly to define fallback UI).
<br/><br/>
  <h1>useState</h1>

- Returns a pair of values [state, setState function].
- We can use lazy initialization, so that any useless expensive computation is not done on re-render by providing a function as argument to the useState hook.
- React batches multiple setState calls if the calls are inside a synchronous function. In an asynchronous function, it doesn't batch the calls (https://stackoverflow.com/questions/56885037/react-batch-updates-for-multiple-setstate-calls-inside-useeffect-hook).
  (class components : https://medium.com/swlh/react-state-batch-update-b1b61bd28cd2)
- The setState function can receive a callback function which has an argument as the previous state. This is preferable because the way react batches setState updates.
- useReducer is a superset of useState.
- Unlike setState in class components, the setState in hooks doesn't shallowly add on the previous object. It straighaway assigns the value to the state.
- Update to state triggers re-render in useState unlike in useRef.
<br/><br/>
<h1>useRef</h1>

- Sometimes we need direct access to some DOM node that is created by our component. We use 'useRef' for that case. 'ref.current' points to the DOM node if 'ref' is assigned to the ref prop of the component.
- Changes to useRef does not trigger a re-render.
- useRef is assigned.
- It is often used to make safeDispatch functions, to store information about whether the component has been unmounted or not.

```
import React from "react";
export const useSafeDispatch = (dispatch: Function): Function => {
  const safeToUse = React.useRef<boolean>(false);
  React.useLayoutEffect(() => {
    safeToUse.current = true;
    return () => {
      safeToUse.current = false;
    };
  }, []);
  return React.useCallback(
    (...args: any[]) => {
      return safeToUse.current ? dispatch(...args) : void 0;
    },
    [dispatch]
  );
};

```

<br/><br/>

<h1>useReducer</h1>

- It needs a reducer function which accepts previous state and action, and returns a new state.
- It is a superset of useState, except that it encapsulates all transition logic based on action type.
- When it's just an independent element of state you're managing: useState
  When one element of your state relies on the value of another element of your state in order to update: useReducer. (https://kentcdodds.com/blog/should-i-usestate-or-usereducer)
- Like useState, we can have lazy initialization (to avoid useless recomputation of expesive values or to get a complex object initial value).
<br/><br/>
<h1>useCallback</h1>

- https://kentcdodds.com/blog/usememo-and-usecallback
- We can use it to provide the same function(ie, same referenced function) on subsequent re-renders based on a dependency list. This is often useful something else(Like a useeffect hook) has a dependency on this function or uses this function but doesn't know when to call it.

```
///OLD
const updateLocalStorage = () => window.localStorage.setItem('count', count)
React.useEffect(() => {
  updateLocalStorage()
}, []) // <-- what goes in that dependency list?

///NEW
const updateLocalStorage = React.useCallback(
  () => window.localStorage.setItem('count', count),
  [count], // <-- yup! That's a dependency list!
)
React.useEffect(() => {
  updateLocalStorage()
}, [updateLocalStorage])

```

We essentially do the following 4 things in the course :

- Make a custom hook out 'useAsync' to abstract management of data returned by an async callback, initially passing the 'dependencies' as an array to the same.
- Now to remove the 'dependencies' array as an argument, we can memoize the callback or the async function to change only when a different fetch request arrives. Then we can pass the async callback as the dependency to the useEffect part of the 'useAsync' hook.
- Further, we can't depend on user to provide us with a memoized async function, so we subtend the async functionality through a 'run' function which handles the state based on promise status.
- Finally, in case of cancelled requests, we would not want 'dispatch' function to be called as promise resolves or rejects. So we get a 'safeDispatch' memoized function which manages a useRef boolean value to denote if the hook has unmounted.
<br/><br/>
<h1>useContext</h1>

- We can use useContext inside functional components and createContext inside class components, not in any other way.
- We can avoid prop drilling with useContext, by making a global state.
- We could use the context with a Provider component :

```
function CountProvider(props) {
  const [count, setCount] = React.useState(0)
  const value = [count, setCount]
  // could also do it like this:
  // const value = React.useState(0)
  return <CountContext.Provider value={value} {...props} />
}

```

- We should also use a Consumer hook to allow usage of context value inside a provider ancestor only :

```
function useCount() {
  const context = React.useContext(CountContext)
  if (!context) {
    throw new Error('useCount must be used within a CountProvider')
  }
  return context
}
```

- We can also use context to provide a cache down the React DOM tree, as down in the course exercise 2.

Summarizing, in course :

1. We created a Provider component to provide context value down the tree.
2. We created a Consumer hook to provide context value only if it's accesed with a Provider ancestor.
3. Used useContext to pass a cache down the DOM tree.
<br/><br/>
<h1>useEffect vs useLayoutEffect</h1>

- Both return cleanup function in the callback accepted. We can access orignal props inside cleanup function. (https://blog.logrocket.com/lifecycle-methods-with-the-useeffect-hook/)
- Both take a dependency array that helps them re-render only if any one of the dependencies change. It behaves on the basis of reference equality.(https://www.benmvp.com/blog/object-array-dependencies-react-useEffect-hook/).
- useEffect runs after the screen is painted
- useLayoutEffect runs before the screen is painted
  (https://kentcdodds.com/blog/useeffect-vs-uselayouteffect)
- useLayout effect is used when we need to make some DOM measurements before making mutations or if we need to keep a value like that of 'ref' up-to-date.
<br/><br/>
<h1>useDebugValue</h1>

- We can use it to label hooks.
- We can pass a format function that executes only when react dev tools is opened.

```
const formatCountDebugValue = ({initialCount, step}) =>
  `init: ${initialCount}; step: ${step}`

function useCount({initialCount = 0, step = 1} = {}) {
  React.useDebugValue({initialCount, step}, formatCountDebugValue)
  const [count, setCount] = React.useState(0)
  const increment = () => setCount(c => c + step)
  return [count, increment]
}
```
