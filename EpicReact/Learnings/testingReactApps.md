<h1>Testing</h1>
<br><br/>
<h2>Simple test with ReactDOM</h2>

- We need to test a Counter component. For that we create a div in the html body. Then we render our component in the div using ReactDOM. Finally we extract the rendered components(increment and decrement buttons) and use "expect" to check if the respective clicks render corrected innerHTML inside the div. Beware though, we should clean up the div("div.remove()") from the HTML body after the test case has been run(To keep tests isolated) or reset the document body before each test is run.

```
beforeEach(() => {
  document.body.innerHTML = ''
})

test('counter increments and decrements when the buttons are clicked', () => {
  const div = document.createElement('div')
  document.body.append(div)

  ReactDOM.render(<Counter />, div)
  const [decrement, increment] = div.querySelectorAll('button')
  const message = div.firstChild.querySelector('div')

  expect(message.textContent).toBe('Current count: 0')
  const incrementClickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    button: 0,
  })
  increment.dispatchEvent(incrementClickEvent)
  expect(message.textContent).toBe('Current count: 1')
  const decrementClickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    button: 0,
  })
  decrement.dispatchEvent(decrementClickEvent)
  expect(message.textContent).toBe('Current count: 0')
})

```

- ( ? ) Also it's suggested to use React.dispatchEvent() to initiate an event instead of firing a click event directly so that we can fire an event that doesn't have a dedicated method (like mouseover) on DOM node. In this case, the code becomes :

```
expect(message.textContent).toBe('Current count: 0')
  const incrementClickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    button: 0,
  })
  increment.dispatchEvent(incrementClickEvent)
  expect(message.textContent).toBe('Current count: 1')
  const decrementClickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    button: 0,
  })
  decrement.dispatchEvent(decrementClickEvent)
  expect(message.textContent).toBe('Current count: 0')
```

- The 'bubbles' ensures that React's event delegation can work correctly. The 'cancelable' ensures that event handlers can use preventDefault() on the event(otherwise calling the preventDefault has no effect). 'button : 0' makes it a left button click.

<h2>Simple test with React Testing Library</h2>

- We can use react testing library which handles the boilerplate for creating of a div(or a custom dom node as we require), mounting our app on the div, unmounting the app, and removing the dom node from the document body when we are done testing. The library provides it's own render function to render the desired component and also returns an object the returns the provided container's dom node(or a div by default) which we used previously to access children and dispatch events.
- We also need not create typical events like the click event and call dispatch event on the events we created. We can use "fireEvents" object provided to us in the react testing library.

```
test('counter increments and decrements when the buttons are clicked', () => {
  const {container} = render(<Counter />)
  const [decrement, increment] = container.querySelectorAll('button')
  const message = container.firstChild.querySelector('div')

  expect(message).toHaveTextContent('Current count: 0')
  fireEvent.click(increment)
  expect(message).toHaveTextContent('Current count: 1')
  fireEvent.click(decrement)
  expect(message).toHaveTextContent('Current count: 0')
})
```

- We can also use jest dom specific assertions to have more context when test expect fails like 'toHaveTextContext' on the dom node.

```
expect(message).toHaveTextContent('Current count: 0')
  fireEvent.click(increment)
  expect(message).toHaveTextContent('Current count: 1')
  fireEvent.click(decrement)
  expect(message).toHaveTextContent('Current count: 0')
```

<h2>Avoid Implementation Details</h2>

- To avoid implementation details such as how buttons are placed, what their text case sensitivity is etc, we can use screen utility from the react testing library :

```
const increment = screen.getByRole('button', {name: /increment/i})
  const decrement = screen.getByRole('button', {name: /decrement/i})
  const message = screen.getByText(/current count/i)
```

- We can also use (https://testing-playground.com/) to get ideas about what query we should use for a particular element when testing.
- In reality, when a button is clicked, an event like onMouseDown, onMouseUp, onClick etc may be fired. Testing for just a single kind of event can lead to failing tests when interaction type changes with the element(button in this case). We can use userEvent from the testing library to handle general user events instead of just a single event while testing our app.

```
expect(message).toHaveTextContent('Current count: 0')
  userEvent.click(increment)
  expect(message).toHaveTextContent('Current count: 1')
  userEvent.click(decrement)
  expect(message).toHaveTextContent('Current count: 0')
```

<h2>Form Testing</h2>

- We can use playground as described previously to get the screen selectors for different elements on the page we want to test.

```
let submittedData
  const handleSubmit = data => {
    submittedData = data
  }
  const username = 'chucknorris'
  const password = 'i need no password'
  render(<Login onSubmit={handleSubmit} />)
  userEvent.type(screen.getByLabelText(/username/i), username)
  userEvent.type(screen.getByLabelText(/password/i), password)
  userEvent.click(screen.getByRole('button', {name: /submit/i}))
  expect(submittedData).toEqual({
    username: username,
    password: password,
  })
  // screen.debug()
```

- Instead of creating local variables for callback functions/onclick handlers, we can mock them using jest mock function. We can also provide Mock Implementation, Mock response etc for the function when it's called.

```
const handleSubmit = jest.fn()
  render(<Login onSubmit={handleSubmit} />)
  const username = 'chucknorris'
  const password = 'i need no password'
  userEvent.type(screen.getByLabelText(/username/i), username)
  userEvent.type(screen.getByLabelText(/password/i), password)
  userEvent.click(screen.getByRole('button', {name: /submit/i}))
  expect(handleSubmit).toHaveBeenCalledWith({
    username,
    password,
  })
  expect(handleSubmit).toHaveBeenCalledTimes(1)
```

- We can also use 'faker' to get fake generated username, passwords and other test/mock data. This has more of contextual relevance while writing tests. Since we re-use a lot of mock data, we can make a function that generates and returns the mock data for us to use.

```
function buildLoginForm() {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
  }
}

test('submitting the form calls onSubmit with username and password', () => {
  const handleSubmit = jest.fn()
  render(<Login onSubmit={handleSubmit} />)
  const {username, password} = buildLoginForm()
```

- We can also add overrides option to the test object factory('buildLoginForm' function here). This helps us to get specific values of certain properties while keeping rest of the properties same.

- We can also use 'Jack Franklin test data bot' in order to build complex test data. Inside the build function, we can pass the properties as a function so that everytime the test factory function derived from the build function is called, the values generated are new.

```
import {build, fake} from '@jackfranklin/test-data-bot'

const buildLoginForm = build({
  fields: {
    username: fake(faker => faker.internet.userName()),
    password: fake(faker => faker.internet.password()),
  },
})
```

<h2>Mock http requests</h2>

- In order to test HTTP request, we can setup a mock server with mock responses depending on the request we receive. We can also provide 'beforeAll()' with 'server.listen()' and 'afterAll()' with 'server.close()' in callbacks. In this case, we hit the mock server using by generating mock click event on the submit button and await the loading screen to go away. When it's gone, we can check if the username we provided is actually present on the screen.

```
const server = setupServer(
  rest.post(
    'https://auth-provider.example.com/api/login',
    async (req, res, ctx) => {
      if (!req.body.password) {
        return res(ctx.status(400), ctx.json({message: 'password required'}))
      }
      if (!req.body.username) {
        return res(ctx.status(400), ctx.json({message: 'username required'}))
      }
      return res(ctx.json({username: req.body.username}))
    },
  ),
)

beforeAll(() => server.listen())
afterAll(() => server.close())

test(`logging in displays the user's username`, async () => {
  render(<Login />)
  const {username, password} = buildLoginForm()

  userEvent.type(screen.getByLabelText(/username/i), username)
  userEvent.type(screen.getByLabelText(/password/i), password)
  userEvent.click(screen.getByRole('button', {name: /submit/i}))

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  expect(screen.getByText(username)).toBeInTheDocument()
})
```

- msw allows server handlers built being re-used as mock server handlers.

```
import {handlers} from 'test/server-handlers'

const server = setupServer(...handlers)
```

- Then we also make a test in the same suite for checking the response of the server when username was provided without password as well as the UI rendered after it.
- When we are sure that our test should pass but the output may change periodically, we can use 'toMatchInlineSnapshot' on 'expect', which lets us update the content to match in the source code of the test itself.(eg. if "password required" changed to "password is required", we might need to change the string at many places). If we fail the test using some old check string, we can press 'u' to update the string being checked in the assertion.

```
test('omitting the password results in an error', async () => {
  render(<Login />)
  const {username} = buildLoginForm()
  userEvent.type(screen.getByLabelText(/username/i), username)
  userEvent.click(screen.getByRole('button', {name: /submit/i}))

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"password required"`,
  )
})
```

- We can even add temporary mock functionality to the server(such as an error) using 'server.use()'. Once we're done testing the functionality, we can then use 'server.resetHandlers()' to reset the server back. However to do this after each test, we can use 'afterEach' function to call this after each test.

```
afterEach(() => {
  server.resetHandlers()
})

////
////
////

test('unknown server error displays the error message', async () => {
  const testErrorMessage = 'Oh no, something bad happened'
  server.use(
    rest.post(
      'https://auth-provider.example.com/api/login',
      async (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({message: testErrorMessage}))
      },
    ),
  )
  render(<Login />)
  userEvent.click(screen.getByRole('button', {name: /submit/i}))

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  expect(screen.getByRole('alert')).toHaveTextContent(testErrorMessage)
})
```

<h2>Mocking browser APIs and Modules</h2>

- The tests are actually run in something called jsdom that is like a fake virtual dom created by jest. In the given example, we retrieve the current user location via 'window.navigator.geolocation.getCurrentPosition()' internally. Since its not supported by js dom, we can mock it using 'jest.fn()' in a 'beforeAll()'. We have 2 states to test : Loading and Presentation states. For loading, we can create a 'fakePosition' and mock the implementation of the getCurrentPosition to call the callback on the fakePosition. However we also want to wait for a while before calling the callback on fakePosition. For that we create a promise that when resolved, calls the callback. So we first test the loading screen, then resolve the promise which in turn calls the callback and sets the data for the position. We can then test if loading is still present or not and whether the text on the screen are the coordinates of the fakePosition.

```
beforeAll(() => {
  window.navigator.geolocation = {
    getCurrentPosition: jest.fn(),
  }
})

function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

test('displays the users current location', async () => {
  const fakePosition = {
    coords: {
      latitude: 35,
      longitude: 139,
    },
  }
  const {promise, resolve} = deferred()
  window.navigator.geolocation.getCurrentPosition.mockImplementation(
    callback => {
      promise.then(() => callback(fakePosition))
    },
  )

  render(<Location />)

  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()

  await act(async () => {
    resolve()
    await promise
  })

  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()

  expect(screen.getByText(/latitude/i)).toHaveTextContent(
    `Latitude: ${fakePosition.coords.latitude}`,
  )
  expect(screen.getByText(/longitude/i)).toHaveTextContent(
    `Longitude: ${fakePosition.coords.longitude}`,
  )
})
```

- Sometimes when calling a function that updates some sort of state, React warns us that there might be a point in time when that state change might not flushed to actual dom and tests would run before it. This can be resolved by act() function from react testing library. Most of the API's in the React testing library use act but sometimes such as in this case, we have to use act ourselves(https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning).

```
//wrap the following 2 calls that cause side effects inside act
await act(async () => {
    resolve()
    await promise
  })
```

- There is another workaround than defining the API not supported by jest. We can mock the hook used in the Location component with a custom hook of ourself. Since we will be changing the data corresponding to the hook's return value, we need to make a state change inside act() so that all the dom updates are applied before moving forward in the test.

```
import {useCurrentPosition} from 'react-use-geolocation'
jest.mock('react-use-geolocation')
test('displays the users current location', async () => {
  const fakePosition = {
    coords: {
      latitude: 35,
      longitude: 139,
    },
  }
  let setReturnValue
  const useMockCurrentPosition = () => {
    const state = React.useState([])
    setReturnValue = state[1]
    return state[0]
  }

  useCurrentPosition.mockImplementation(useMockCurrentPosition)
  // const {promise, resolve, reject} = deferred()
  // window.navigator.geolocation.getCurrentPosition.mockImplementation(
  //   callback => {
  //     promise.then(() => callback(fakePosition))
  //   },
  // )
  render(<Location />)
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()

  act(() => {
    setReturnValue([fakePosition])
  })

  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()
  expect(screen.getByText(/latitude/i)).toHaveTextContent(
    `Latitude: ${fakePosition.coords.latitude}`,
  )
  expect(screen.getByText(/longitude/i)).toHaveTextContent(
    `Longitude: ${fakePosition.coords.longitude}`,
  )

```

<h2>Context and Custom Render Method</h2>

- In order to render components which require a context, we can wrap the component with the ContextProvider they need(duh..). However, react testing library's render method also accepts a wrapper option. Hence we should write our own wrapper that wraps the Component with the ContextProvider(s) we want. This is useful if we want to re-render our component again, we need not write the whole configuration of ContextProviders again and again.

```
test('renders with the light styles for the light theme', () => {
  const Wrapper = ({children}) => (
    <ThemeProvider initialTheme="light">{children}</ThemeProvider>
  )
  render(<EasyButton>Easy</EasyButton>, {wrapper: Wrapper})
  const button = screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
    background-color: white;
    color: black;
  `)
})
```

- Generally in such test suites, we find ourselves duplicating test snippets with different params(theme here : light or dark?). We can make a function that is kind of a wrapper on the render function but accepts the theme to render and wraps the 'ui' we provide with the ContextProvider.

```
function renderWithProviders(ui, {theme = 'light', ...options} = {}) {
  const Wrapper = ({children}) => (
    <ThemeProvider value={[theme, () => {}]}>{children}</ThemeProvider>
  )
  return render(ui, {wrapper: Wrapper, ...options})
}

test('renders with the light styles for the light theme', () => {
  renderWithProviders(<EasyButton>Easy</EasyButton>)
  const button = screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
    background-color: white;
    color: black;
  `)
})

test('renders with the dark styles for the dark theme', () => {
  renderWithProviders(<EasyButton>Easy</EasyButton>, {
    theme: 'dark',
  })
  const button = screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
    background-color: black;
    color: white;
  `)
})
```

- ( ? ) It is also suggested to re-export react testing library from a module named test-utils.js along with any other implementation details like the renderWithTheme function in the last exercise renamed to render function and so on. This helps us collocate implementation details at one place and logic testing to another place.

```
/*test-utils.js*/
import * as React from 'react'
import {render as rtlRender} from '@testing-library/react'
import {ThemeProvider} from 'components/theme'

function render(ui, {theme = 'light', ...options} = {}) {
  const Wrapper = ({children}) => (
    <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>
  )
  return rtlRender(ui, {wrapper: Wrapper, ...options})
}

export * from '@testing-library/react'
// override React Testing Library's render with our own
export {render}

/*07.js*/

import * as React from 'react'
import {render, screen} from '../../test/test-utils'
import {ThemeProvider} from '../../components/theme'
import EasyButton from '../../components/easy-button'

test('renders with the light styles for the light theme', () => {
  render(<EasyButton>Easy</EasyButton>, {theme: 'light'})
  const button = screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
    background-color: white;
    color: black;
  `)
})

/* eslint no-unused-vars:0 */

test('renders with the dark styles for the dark theme', () => {
  render(<EasyButton>Easy</EasyButton>, {theme: 'dark'})
  const button = screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
    background-color: black;
    color: white;
  `)
})

```

<h2>Testing custom hooks</h2>

- In order to test a custom hook, we generally test a component that uses it and the hook is tested as an implementation detail as part of the component.

```
function UseCounterHookExample() {
  const {count, increment, decrement} = useCounter()
  return (
    <div>
      <div>Current count: {count}</div>
      <button onClick={decrement}>Decrement</button>
      <button onClick={increment}>Increment</button>
    </div>
  )
}

test('exposes the count and increment/decrement functions', () => {
  render(<UseCounterHookExample />)
  const increment = screen.getByRole('button', {name: /increment/i})
  const decrement = screen.getByRole('button', {name: /decrement/i})
  const message = screen.getByText(/current count/i)

  expect(message).toHaveTextContent('Current count: 0')
  userEvent.click(increment)
  expect(message).toHaveTextContent('Current count: 1')
  userEvent.click(decrement)
  expect(message).toHaveTextContent('Current count: 0')
})
```

- However, if we want to test a complex hook, it might not be feasible to make a custom example component out of it every time. So we can make a different kind of component that we render on the screen. We can create a test component that renders null but returns the result/return value of the hook to a result variable outside the component, so that the test can test on the hook return values.

```
test('exposes the count and increment/decrement functions', () => {
  let result
  function TestComponent() {
    result = useCounter()
    return null
  }
  render(<TestComponent />)
  expect(result.count).toBe(0)
  act(() => result.increment())
  expect(result.count).toBe(1)
  act(() => result.decrement())
  expect(result.count).toBe(0)
})
```

- Say we want to test a lot of functionalities for a hook, like 'step' and 'initialCount' props in the useCounter hook in the current example. We can abstract away the duplication of code into a function that renders the Component and returns the output of the hook. But if we straight away return the output of the hook, we might end up losing sync with the hook result because change in the variable inside the function might not lead to change outside the function when the component re-renders and re-assigns the result variable inside the function. Hence, we can make result as an object and attach the results of a hook to a property of the result object. This way, the new changes are shallowly merged into the old object and are reflected even outside the function.

```
function setup({initialProps} = {}) {
  const result = {}
  function TestComponent(props) {
    result.current = useCounter(props)
    return null
  }
  render(<TestComponent {...initialProps} />)
  return result
}

test('exposes the count and increment/decrement functions', () => {
  const result = setup()
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(1)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})

test('allows customization of the initial count', () => {
  const result = setup({initialProps: {initialCount: 3}})
  expect(result.current.count).toBe(3)
})

test('allows customization of the step', () => {
  const result = setup({initialProps: {step: 2}})
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(2)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})
```

- Obviously this is largely used boilerplate and hence we have react hooks testing library to test hooks in this way.

```
test('exposes the count and increment/decrement functions', () => {
  const {result} = renderHook(useCounter)
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(1)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})

test('allows customization of the initial count', () => {
  const {result} = renderHook(useCounter, {initialProps: {initialCount: 3}})
  expect(result.current.count).toBe(3)
})

test('allows customization of the step', () => {
  const {result} = renderHook(useCounter, {initialProps: {step: 2}})
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(2)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})

test('the step can be changed', () => {
  const {result, rerender} = renderHook(useCounter, {
    initialProps: {step: 3},
  })
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(3)
  rerender({step: 2})
  act(() => result.current.decrement())
  expect(result.current.count).toBe(1)
})
```
