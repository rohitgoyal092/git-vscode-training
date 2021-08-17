// Basic Forms
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'

function UsernameForm({onSubmitUsername}) {
  // 🐨 add a submit event handler here (`handleSubmit`).
  // 💰 Make sure to accept the `event` as an argument and call
  // `event.preventDefault()` to prevent the default behavior of form submit
  // events (which refreshes the page).
  // 📜 https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
  //
  // 🐨 get the value from the username input (using whichever method
  // you prefer from the options mentioned in the instructions)
  // 💰 For example: event.target.elements[0].value
  // 🐨 Call `onSubmitUsername` with the value of the input

  // 🐨 add the onSubmit handler to the <form> below

  // 🐨 make sure to associate the label to the input.
  // to do so, set the value of 'htmlFor' prop of the label to the id of input

  const [error, setError] = React.useState(null)
  const [input, setInput] = React.useState('')

  const inputRef = React.useRef()
  const handleSubmit = event => {
    event.preventDefault()
    onSubmitUsername(inputRef.current.value)
  }

  const handleChange = event => {
    let inputValue = event.target.value
    if (inputValue !== inputValue.toLowerCase()) {
      setError(() => 'Username must be lower case')
    } else {
      setError(() => null)
    }
  }

  const handleChange1 = event => {
    let inputValue = event.target.value
    setInput(inputValue.toLowerCase())
  }
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="usernameInput">Username:</label>
        <input
          id="usernameInput"
          type="text"
          ref={inputRef}
          value={input}
          onChange={handleChange1}
        />
      </div>
      <div style={{color: 'red'}}>{error}</div>
      <button disabled={Boolean(error)} type="submit">
        Submit
      </button>
    </form>
  )

  // return (
  //   <form onSubmit={handleSubmit}>
  //     <div>
  //       <label htmlFor="usernameInput">Username:</label>
  //       <input
  //         id="usernameInput"
  //         type="text"
  //         ref={inputRef}
  //         onChange={handleChange}
  //       />
  //     </div>
  //     <div style={{color: 'red'}}>{error}</div>
  //     <button disabled={Boolean(error)} type="submit">
  //       Submit
  //     </button>
  //   </form>
  // )
}

function App() {
  const onSubmitUsername = username => alert(`You entered: ${username}`)
  return <UsernameForm onSubmitUsername={onSubmitUsername} />
}

export default App
