<h1>Imperative vs Declarative Programming :</h1>
 - Declarative programming is basically abstracting low level details of 'HOW' and only concerned with a 'WHAT' whereas in Imperative Programming, we're concerned with a 'HOW', not just on 'HOW'. Eg. A function abstracts high level details of a logic.
 - React is an example of such an abstraction.
<br/><br/>
<h1>React API :</h1>  
 - Using the react API, we can add multiple children using an array.
 - React API renames some of the keywords used in JS such as class -> className (https://stackoverflow.com/questions/46989454/class-vs-classname-in-react-16)
 <br/><br/>
<h1>JSX:</h1>
 - We use a compiler like Babel to convert JSX code to JS equivalent code.
 - Compiled JSX to JS code is visible inside the header tag of the page.
 - We use '{//JAVASCRIPT EXPRESSION}' to write JS expressions inside JSX tags. We can rapidly switch between JSX-Html and JSX-js using the braces.
 - We can even use React API with JSX.
<br/><br/>
<h1>Custom Components</h1>
 - We can make reusable components that can return different renderable results based on props (arguments). Name of such components starts with a capital letter (So that we can use JSX syntax on them because JSX treats lowercase components as HTML tags). Props are received as objects by default in react.
 - We can add propTypes to custom components. React also has in-built prop types package for type checking of basic types (array, bool, func, number, object, string, symbol) as well as use required property of the same for any prop.
 - <h2>React Fragments:</h2>
    - Sometimes we might need to return multiple items from a function without applying a complementary wrapper like a "div" to the items. We can wrap items around React fragment to do so.
    - React fragments do not require keys attribute in contrast to requirement by the array syntax while returning.
    - Fragments support a shorter syntax using just empty braces.
 -
<br/><br/>
<h1>Forms:</h1>
 - We can get the value inside submit event for the input field: 
   - Via their index: event.target.elements[0].value
   - Via the elements object by their name or id attribute: event.target.elements.usernameInput.value
 - There are 2 types of inputs in forms in react : Controlled Input & Uncontrolled Input.
 - We can use refs on input tag to get value from the dom node of the same.
 - Uncontrolled input : We can use refs to get the value of the input field. 'ref' prop also accept a callback function which is passed the dom node on mounting and null on unmounting as an argument. Refs cannot be used inside functional components because functional components do not have instances (They're just functions, receiving some input and returning some output, not instances.) 
 - Controlled Input : We need to provide an onChange handler and value prop in case of controlled input. Inside onChange handler, we can set the state of the state assigned to the value prop.
 <br/><br/>
<h1>Arrays & Keys:</h1>
 - Use key prop when rendering an array of components to tell react how to uniquely identify elements on re-render(it's by deafult index of the array). (https://epicreact.dev/why-react-needs-a-key-prop/)
