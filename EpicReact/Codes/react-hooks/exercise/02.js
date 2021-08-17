// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorageState = ({id}) => {
  const [idVal, setIdVal] = React.useState(() => {
    let tmp = window.localStorage.getItem(id)
    if (!tmp) {
      return ''
    }
    return tmp
  })

  // console.log('inside hook ', idVal)

  React.useEffect(() => {
    // console.log('side effect ', idVal)
    window.localStorage.setItem(id, idVal)
  }, [idVal, id])

  return [idVal, setIdVal]
}

function Greeting({initialName = ''}) {
  // console.log('main rerender')
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') || initialName
  const [name, setName] = useLocalStorageState({id: 'name'})

  // console.log('name now after main rerender ', name)

  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)

  function handleChange(event) {
    // console.log('inside handleChange', name)
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
