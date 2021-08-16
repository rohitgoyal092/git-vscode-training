<h1>useReducer</h1>
 - It needs a reducer function which accepts previous state and action, and returns a new state.
 - It is a superset of useState, except that it encapsulates all transition logic based on action type.
 - When it's just an independent element of state you're managing: useState
When one element of your state relies on the value of another element of your state in order to update: useReducer. (https://kentcdodds.com/blog/should-i-usestate-or-usereducer)
 - Like useState, we can have lazy initialization (to avoid useless recomputation of expesive values or to get a complex object initial value).
<br/><br/>
<h1>useCallback</h1>
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
