<h1>Web Performance</h1>
<h2>Render Blocking : </h2>

- Actions like CSS and HTML are render blocking, in order for the construction of the DOM tree and the CSSOM tree(both independent).
- We can use media query fetching, which puts a CSS fetching to low priority, so that it doesn't block the first render.
- JS can also be render blocking. Whenever JS is encountered by a parser, it stops and executes it before continuing parsing.
- To avoid JS overhead, we should include small scripts only to load before initial render. We can also either resort to server side rendering for the first render and for subsequent renders, client side rendering.
  <br/><br/>

<h2>General perception of site experience : </h2>

- Give people some content to start with - This way loading and user activity can be done in parallel.
- Bored waits feel slower - No productive content while the user waits can feel slower.
- Anxious wait feel slower - Eg. bank sites, medical record site that can cause anxiety on loading screen.
- Unexplained wait feel slower - People do not know why the long waiting.
- Uncertain wait feel slower - People don't have idea about waiting duration
- People will wait for value - If the site holds user important information, they are likely to wait longer.
  <br/><br/>

<h2>Performance metrics for a webpage : </h2>

- https://www.sistrix.com/ask-sistrix/onpage-optimisation/google-pagespeed-the-loading-speed-of-a-website/page-loading-performance-what-do-all-the-acronyms-mean/

- <h3>TTFB(Time to first byte):</h3>

  - It is comprised of the time to between sending the first HTTP request, and receiving first byte corresponding to it. It should be ideally less than 100ms, 200-500ms is decent, 500-1000ms is slow.
  - FCB can be improved via making js fetches asynchronous and combining CSS files together.

- <h3>FCP(First Contentful Paint) time:</h3>

  - https://www.acmethemes.com/blog/first-contentful-paint-and-first-meaningful-paint/
  - It is the time when the browser shows first piece of content that is part of the DOM node. Note that first content could be CSS content such as background but DOM content(First Paint vs Contentful Paint). But Contentful Paint is derived from the DOM nodes. It should generally be less than 1 second.
  - It can be optimized by decreasing render-blocking CSS and especially JS because JS loading takes more time (fetch, parse, compile and execute) than CSS. We can also minify assets (eg. remove code comments, unused code, shorter variable and function name etc). We should also optimize JS (Tree Shaking : To remove dead code, Code Splitting : Moving code to chunks and fetching only useful chunks for initial render).

- <h3>FMP(First Meaningful Paint) time:</h3>

  - It is the time when the user starts to see meaningful content. This time should be less than 1 second.
  - We can optimize it by : Rendering thumbnails and placeholders, optimize images for loading.

- <h3>FID(First Input Delay)</h3>

  - It is described by how soon the site responds the first time a user tries to interact by clicking or tapping on a button. Ideally, FID should be below 100ms for at least 75 percent of the users, with between 100-200ms being acceptable
  - To improve FID, we can optimize our JS and reduce the time to get it executed(to quickly apply event handlers). We can also reduce dependence on third party code which might affect our FID.

- <h3>TTI(Time to interactive)</h3>

  - When the page is fully ready and has completed all its functions is the moment when the TTI timing finishes (not just aesthetics but functionality too). This time should be less than 7s, with 4s being a fast bound.
  - Again, this is highly influenced by JS execution (dead, unnecessary and heavy JS)

- <h3>LCP(Largest Contentful Paint)</h3>

  - https://web.dev/lcp/
  - It measures how much time passes before the main content(largest image or text block) of the website is visible to the user in the browser. While in the past attention was paid to the first appearance of content (First Contentful Paint / FCP), people have moved on and now measure how long it takes for the main content to appear.
  - It is used over FCP which is lesser semantic to the main content than LCP.
  - It could be used as an alternate to FMP which is harder explain and often wrong.
  - It should be less than 2.5 seconds.

<br/><br/>

<h2>Measuring Performance : </h2>

<h3>Old metrics : </h3>

- <h4>Page Load time:</h4>

  - How long from the time we clicked something, the page loaded.
  - However this metric is flawed in sense that painting could be deferred after loading

<h3>New Metrics : </h3>

- <h4>FCP (First Contentful Paint):</h4>
  - This is the time the website shows initial meaningful content. The time user sees an indication that the page is loading.
  - How to Improve : 
    - Servers need to be quick : Servers should have appreciable size, server-side processing should be minimal, bandwidth at the servers should be good.
    - Document size is small in size : Content size should small and compression of document to be sent over wire should be good.
    - Number of network hops should be few : We can use CDN like CloudFlare, maxCDN etc. to position our content physically as close to user as possible. They essentially receive the request for data and if it's cached, it's delivered instantly otherwise retrieved from the actual server.
- <h4>LCP (Largest Contentful Paint):</h4>
  - This is the time largest area rendered on the screen(largest area measured in pixels).
  - How to improve : 
    - Improve server side interaction (CDN, caching of static html pages via http cache and reverse proxies, optimizing servers).
    - Defer resources until later : We can defer scripts and unneeded CSS to be fetched and executed later and unneeded images to be downloaded lazily. We can also put script tags at the end of the document so that even the download for the scripts begin towards the end of parsing of html document. However safari doesn't support lazy loading, but this can be implemented with javascript. Intersection observer for each image is just observing when the image comes into view, and whenever it does, it will copy the [data-src] and [data-srcset] attributes to [src] and [srcset] attributes to initiate loading of these images :

```
/**
 * lazyLoader
 * Check for elements in the document to be loaded later when visible to the user.
 * @see https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/
 * @example
 *   <element src="" data-src="/url/" data-srcset="..." />
 */
(function (ready) {
  if (document.readyState === "complete" || document.readyState === "interactive") {
    ready();
  } else {
    document.addEventListener("DOMContentLoaded", ready);
  }
})(function lazyLoader() { /* the document is now ready. */

  var lazyEls = [].slice.call(document.querySelectorAll("[data-src]"));

  function load(el) {
    var src = el.getAttribute("data-src");
    var srcset = el.getAttribute("data-srcset");
    // [NOTE] Todd We shouldn't hit this if data-src was null, but monitoring
    //    says it happens sometimes, so ¯\_(ツ)_/¯
    if (src) { el.setAttribute("src", src); }
    if (srcset) { el.setAttribute("srcset", srcset); }
    el.removeAttribute("data-src");
    el.removeAttribute("data-srcset");
  }

  if ("IntersectionObserver" in window) {
    var lazyObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          load(el);
          lazyObserver.unobserve(el);
        }
      });
    });

    lazyEls.forEach(function(el) {
      if (el.tagName === "SCRIPT") {
        load(el);
      }
      else {
        lazyObserver.observe(el);
      }
    });
  }
  else {
    lazyEls.forEach(load);
  }

});

```

- Optimize images :

  - We can use 'srcset' and 'sizes' attributes for images to download only images that obey our viewport dimensions. The browser checks the 'sizes' attribute to find correct image to load and then loads the same from 'srcset' links.

- Reduce request overhead :

  - HTTP/2 protocol for data transfer can be used to improve the overhead while requesting images such as TCP and SSL connections. Pros : It's fast and reuses connections. Cons : It's setup is difficult and we cannot use HTTP/2 without SSL(because browsers like chrome and firefox mandate SSL to be used with HTTP/2).

  - HTTP caching can be used but this will only benefit the returning users/repeated requests.
  - We can also use 'preconnect' or 'preload' to either do DNS lookup and then establish TCP + SSL handshake or even initiate download of important resources that will definitely be needed with high priority.

- <h4>CLS (Cumulative Layout Shift):</h4>
  - It is the total moving distance and impact of page elements during the entire lifetime of the document the user sees.
  - How to Improve : 
    - We can specify empty div blocks or predefined sizes on tags with a fixed size or aspect ratio so that space is reserved for the content after it's loaded. Eg. For site banners about using cookies, we can position it fixed(remove from the flow of the document) at the bottom instead of relative at the top(which causes layout shift).
- <h4>FID (First Input Delay):</h4>
  - It is the browser time delay between the user's first click and execution of application code (so that scripts cannot be deferred for a long time).
  - How to Improve : 
    - It depends on the overall readiness of the page. Hence one way is to reduce the amount of resources webpage becomes ready for interaction.
    - We can use code splitting for this.
    - We can use web workers to unblock the main thread from computationally expensive calculations for necessary executions and push them to web workers.
    - Pushing a lot of JS to the end can lead to a bad experience because users perceive the site to be ready and its actually not in that case. So the tradeoff is : If the content offers value, no need to push JS to the end to improve LCP. This will offer better user experience, instead of cheating users on readiness of the webpage.

- There are 3 types of lighthouse reports : lab data(from our own computer), synthetic data(which we receive from some test servers we subscribe to), and field data(from actual end users).
- Generally order of signal of data and noise is proportional to the order : lab data < synthetic data < field data.
- Chrome regularly sends website performance data back to google which is then hosted publicly. We can see live cumulated performance reports at : https://crux-compare.netlify.app/.
- Another drawback is chrome only a part of browser market share (So data from other browsers excluding chrome and edge is not accounted for while deciding site performance).
- Another hurdle is which performance aggregation metric to use : google uses P75(median at 75% worst performance). P95 is also a good measurement. There are also other metrics such as P50 and P90.
- App lightestapp.com to compare synthetic data of multiple websites. Websites should be atleast 20% faster than their competitors to have significant impact on user experience (based on metrics we discussed above like LCP etc).
- We can measure detailed user oriented data using Performance API.
- Performance API hosts 2 kinds of tools : Entry timings tool(for events like fetchStart, fetchEnd etc) and Performance observer tool.
- Custom implementation to get core web vitals along with DomLoad and Load times(Although there are API's for this):

```
(function (ready) {
  if (document.readyState === "complete" || document.readyState === "interactive") {
    ready();
  } else {
    document.addEventListener("readystatechange", function() {
      if (document.readyState === "complete") {
        ready();
      }
    });
  }
})(function perf() { /* the document is now complete. */

  var data = {
    url: window.location.href,
    dcl: 0,
    load: 0,
    fcp: 0,
    lcp: 0,
    cls: 0,
    fid: 0
  };

  var fcpObserver = new PerformanceObserver(function handleFCP(entryList) {
    var entries = entryList.getEntries() || [];
    entries.forEach(function(entry) {
      if (entry.name === "first-contentful-paint") {
        data.fcp = entry.startTime;
        console.log("Recorded FCP Performance: " + data.fcp);
      }
    });
  }).observe({ type: "paint", buffered: true });

  var lcpObserver = new PerformanceObserver(function handleLCP(entryList) {
    var entries = entryList.getEntries() || [];
    entries.forEach(function(entry) {
      if (entry.startTime > data.lcp) {
        data.lcp = entry.startTime;
        console.log("Recorded LCP Performance: " + data.lcp);
      }
    });
  }).observe({ type: "largest-contentful-paint", buffered: true });

  var clsObserver = new PerformanceObserver(function handleCLS(entryList) {
    var entries = entryList.getEntries() || [];
    entries.forEach(function(entry) {
      if (!entry.hadRecentInput) {
        data.cls += entry.value;
        console.log("Increased CLS Performance: " + data.cls);
      }
    });
  }).observe({ type: "layout-shift", buffered: true });

  var fidObserver = new PerformanceObserver(function handleFID(entryList) {
    var entries = entryList.getEntries() || [];
    entries.forEach(function(entry) {
      data.fid = entry.processingStart - entry.startTime;
      console.log("Recorded FID Performance: " + data.fid);
    });
  }).observe({ type: "first-input", buffered: true });

  window.addEventListener("beforeunload", function() {
    var navEntry = performance.getEntriesByType("navigation")[0];
    data.dcl = navEntry.domContentLoadedEventStart;
    data.load = navEntry.loadEventStart;

    var payload = JSON.stringify(data);
    navigator.sendBeacon("/api/perf", payload);
    console.log("Sending performance:", payload);
  });

});

```

- A general notion in performance is that its a gradual process, not just to be saved for the last. eg. generate and save lighthouse reports regularly. But meanwhile we also need to prioritize feature > security > quality > performance.
- To identify performance bottlenecks, we should have knowledge about :

  - Who our users are (bandwidth, devices, browsers? etc)
  - How long will they wait?(anxious, willing to wait etc., threshold of waiting)
  - How much fast website would impress them?

<br/><br/>

<h1>React Performance</h1>
<h2>Globe Loading : </h2>

- We lazily loaded the globe so that we can show the 'show globe' button early.
- We used "React.lazy(import "...path")" to load the component. So whenever the component is rendered for the first time, we get the fallback provided to "React.Suspense" till it renders and then the rendered lazily loaded component itself.
- Apart from lazy loading, we can do some preemptive fetching when we get a hint that the user might try to load the globe by defining some event listener to do an import when the event is triggered. The bundler caches the import and whenever React lazy requires that import to be loaded, it's already in the cache and loads fast.

```
const loadGlobe = () => {
  return import('../globe')
}
const Globe = React.lazy(loadGlobe)

function App() {
  const [showGlobe, setShowGlobe] = React.useState(false)

  // 🐨 wrap the code below in a <React.Suspense /> component
  // with a fallback.
  // 💰 try putting it in a few different places and observe how that
  // impacts the user experience.

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        padding: '2rem',
      }}
    >
      <label
        style={{marginBottom: '1rem'}}
        onMouseEnter={loadGlobe}
        onFocus={loadGlobe}
      >
        <input
          type="checkbox"
          checked={showGlobe}
          onChange={e => setShowGlobe(e.target.checked)}
        />
        {' show globe'}
      </label>
      <div style={{width: 400, height: 400}}>
        <React.Suspense fallback={<div>Loading...</div>}>
          {showGlobe ? <Globe /> : null}
        </React.Suspense>
      </div>
    </div>
  )
}
```

- We can also utilize webpack's magic comment "webpackPrefetch : true". Basically the imports with 'magic prefetch' comment are inserted into the html head as pre-fetch and are retrieved once browser is free. This is somewhat an improvement over the event handler approach described previously (although it has its own use cases) so that browser can start to load the script when free and not when there is chance of loading it.

```
const Globe = React.lazy(() => import(/* webpackPrefetch: true */ '../globe'))
```

- We should provide Suspense boundary closer to where the lazy import is because otherwise it will replace the whole component that renders under it when component loading happens. We can use React devtools's 'stop-watch' suspense function to suspend a component under a suspense boundary to see how fallback renders.

- In coverage, lesser unused code and lesser executed code are both good metrics, with the former being a better metric.
- "webpackPrefetch" helps placing/loading modules together in the same chunk to avoid multiple requests by defining a common name for the chunk. Eg. :

```
const DepsIncluded = React.lazy(() =>
  import(/* webpackChunkName: "deps" */ './deps-included'),
)
const One = React.lazy(() =>
  import(/* webpackChunkName: "group" */ './group/one'),
)
const Two = React.lazy(() =>
  import(/* webpackChunkName: "group" */ './group/two'),
)

const Prefetched = React.lazy(() =>
  import(
    /* webpackPrefetch: true */
    /* webpackChunkName: "prefetched" */
    './prefetched'
  ),
)
const Preloaded = React.lazy(() =>
  import(
    /* webpackPreload: true */
    /* webpackChunkName: "preload" */
    './preloaded'
  ),
)
```

<br/><br/>

<h2>useMemo exercise : </h2>

- Here we checked the performance of tab, started profiling, registered a component rerender and then went over the second big chunk of time consumption to see which step in the component render took the most time(It's children). It was the getItems() function consuming most of the time. So we optimized App() component so that getItems is not reCalled if re-render is triggered for the component.
- Also react production build is generally faster than the development build, mostly because of absence of react warnings, minified code, and absence of dev tools utility like performance timing etc.
- We can also use web workers provided by the webpack. They can help us, say execute a callback in another thread without blocking the browser. Obviously, the interaction between the main thread and web worker is asynchronous(https://kentcdodds.com/blog/speed-up-your-app-with-web-workers).

```
import makeFilterCitiesWorker from 'workerize!./filter-cities'

const {getItems} = makeFilterCitiesWorker()

export {getItems}

/*
eslint
  import/no-webpack-loader-syntax: 0,
*/

```

<br/><br/>

<h2>React.memo : </h2>

- https://kentcdodds.com/blog/fix-the-slow-render-before-you-fix-the-re-render/
- It is generally a better idea to improve slow renders instead of improving re-renders.
- We can use React profiler to check how long each component and it's children took in each render.
- In the exercise, we initially try solve the issue that when a parent component re-renders, unless specified by useMemo, the child component also re-renders. This is because React doesn't know if the child component will change or not. If we know that it won't change and only depends on props, we can use React memo to indicate child component depends on props only. That's why since initially 'ListItem' did not change on force re-render, we used memo on ListItem to avoid unnecessary re-renders.
- Later, we also try to avoid getting the whole list re-rendered when one of the items is highlighted (as a result of change in 'highlightedIndex' prop). So, for ListItem memo, we write custom comparator function (like shouldComponentUpdate) that determines if ListItem should re-render based on previous props and current props.

```
// ListItem = React.memo(ListItem)
ListItem = React.memo(ListItem, (prevProps, nextProps) => {
  if (prevProps.getItemProps !== nextProps.getItemProps) {
    return false
  }
  if (prevProps.item !== nextProps.item) {
    return false
  }
  if (prevProps.index !== nextProps.index) {
    return false
  }
  if (prevProps.selectedItem !== nextProps.selectedItem) {
    return false
  }
  if (prevProps.highlightedIndex !== nextProps.highlightedIndex) {
    const wasPreviouslyHighlighted =
      prevProps.highlightedIndex === prevProps.index
    const isNowHighlighted = nextProps.highlightedIndex === nextProps.index
    return wasPreviouslyHighlighted === isNowHighlighted
  }
  return true
})
```

- Finally, we move the logic that dictates the render of highlighted child up in the component tree (in this case, "isSelected" and "isHighlighted") so that we can specifically target the list item that is highlighted by passing primitive values to the children, instead of deriving and checking them at each ListItem.

```
function Menu({
  items,
  getMenuProps,
  getItemProps,
  highlightedIndex,
  selectedItem,
}) {
  return (
    <ul {...getMenuProps()}>
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          getItemProps={getItemProps}
          item={item}
          index={index}
          selectedItem={selectedItem}
          isSelected={selectedItem ? selectedItem.id : undefined === item.id}
          isHighlighted={highlightedIndex === index}
        >
          {item.name}
        </ListItem>
      ))}
    </ul>
  )
}
Menu = React.memo(Menu)
// 🐨 Memoize the Menu here using React.memo

function ListItem({
  getItemProps,
  item,
  index,
  selectedItem,
  isSelected,
  isHighlighted,
  ...props
}) {
  return (
    <li
      {...getItemProps({
        index,
        item,
        style: {
          fontWeight: isSelected ? 'bold' : 'normal',
          backgroundColor: isHighlighted ? 'lightgray' : 'inherit',
        },
        ...props,
      })}
    />
  )
}
// 🐨 Memoize the ListItem here using React.memo
ListItem = React.memo(ListItem)
```

<br/><br/>

<h2>Optimize Context Value : </h2>

- Apart from "React.memo" on functions, if they're using some Context, then they might still re-render as a result of some ancestor component re-render because Context Provider might re-render. So in order to make sure Context Provider dependents don't re-render, we should try to memoize the value provided to the context provider via "value" prop using "React.useMemo()".
- In the second part, we noticed that if we clicked any cell of the grid, the state changes and hence 'Grid' component re-renders, since it depends on the "useAppState" hook which in turns depends on the state. So as soon as state changes, memoized value of the context provider changes, "useAppState" re-executes and hence the re-render of the grid component. To avoid this, we can make another context provider for the dispatch function of the state as the Grid component solely depends on the dispatch function, and use value provided by that context provider.
<br/><br/>
<h2>Fix “perf death by a thousand cuts” : </h2>

- We generally try to keep the state data collocated as close to the component as possible. So, here, on typing something in the dogName state, so that we do not re-render all the cells, we collocate the state to the "DogNameInput()".

```
// Fix "perf death by a thousand cuts"
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  useForceRerender,
  useDebouncedState,
  AppGrid,
  updateGridState,
  updateGridCellState,
} from '../utils'

const AppStateContext = React.createContext()
const AppDispatchContext = React.createContext()

const initialGrid = Array.from({length: 100}, () =>
  Array.from({length: 100}, () => Math.random() * 100),
)

function appReducer(state, action) {
  switch (action.type) {
    // we're no longer managing the dogName state in our reducer
    // 💣 remove this case
    case 'UPDATE_GRID_CELL': {
      return {...state, grid: updateGridCellState(state.grid, action)}
    }
    case 'UPDATE_GRID': {
      return {...state, grid: updateGridState(state.grid)}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function AppProvider({children}) {
  const [state, dispatch] = React.useReducer(appReducer, {
    // 💣 remove the dogName state because we're no longer managing that
    grid: initialGrid,
  })
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

function useAppState() {
  const context = React.useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within the AppProvider')
  }
  return context
}

function useAppDispatch() {
  const context = React.useContext(AppDispatchContext)
  if (!context) {
    throw new Error('useAppDispatch must be used within the AppProvider')
  }
  return context
}

function Grid() {
  const dispatch = useAppDispatch()
  const [rows, setRows] = useDebouncedState(50)
  const [columns, setColumns] = useDebouncedState(50)
  const updateGridData = () => dispatch({type: 'UPDATE_GRID'})
  return (
    <AppGrid
      onUpdateGrid={updateGridData}
      rows={rows}
      handleRowsChange={setRows}
      columns={columns}
      handleColumnsChange={setColumns}
      Cell={Cell}
    />
  )
}
Grid = React.memo(Grid)

function Cell({row, column}) {
  const state = useAppState()
  const cell = state.grid[row][column]
  const dispatch = useAppDispatch()
  const handleClick = () => dispatch({type: 'UPDATE_GRID_CELL', row, column})
  return (
    <button
      className="cell"
      onClick={handleClick}
      style={{
        color: cell > 50 ? 'white' : 'black',
        backgroundColor: `rgba(0, 0, 0, ${cell / 100})`,
      }}
    >
      {Math.floor(cell)}
    </button>
  )
}
Cell = React.memo(Cell)

function DogNameInput() {
  // 🐨 replace the useAppState and useAppDispatch with a normal useState here
  // to manage the dogName locally within this component
  const [dogName, setDogName] = React.useState('')

  function handleChange(event) {
    const newDogName = event.target.value
    // 🐨 change this to call your state setter that you get from useState
    setDogName(newDogName)
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <label htmlFor="dogName">Dog Name</label>
      <input
        value={dogName}
        onChange={handleChange}
        id="dogName"
        placeholder="Toto"
      />
      {dogName ? (
        <div>
          <strong>{dogName}</strong>, I've a feeling we're not in Kansas anymore
        </div>
      ) : null}
    </form>
  )
}
function App() {
  const forceRerender = useForceRerender()
  return (
    <div className="grid-app">
      <button onClick={forceRerender}>force rerender</button>
      <AppProvider>
        <div>
          <DogNameInput />
          <Grid />
        </div>
      </AppProvider>
    </div>
  )
}

export default App

/*
eslint
  no-func-assign: 0,
*/

```

- If for some reason, we have to keep the state global (like dogName), then there is also a choice to maintain the state in a different provider like "DogProvider" and use a different context for the same. This will help us prevent unnecessary re-renders like when all the state was combined into one. Further, even after creating new context, we should try to collocate the context themselves to the components that use them, and not to all the components, which can improve readability of our code.
- If a component accesses a sliced(or part of the state) of a global state, then change to the global state can lead to re-render of all the components utilizing that state. If such a component is big, it can cause a lot of re-render waste of time. We can minimize that by making another component that returns the slice of required state as prop (like an intermediate component). This helps us avoid re-render of the massive component and only re-render of a smaller component.

```
function CellImpl({cell, row, column}) {
  const dispatch = useAppDispatch()
  const handleClick = () => dispatch({type: 'UPDATE_GRID_CELL', row, column})
  return (
    <button
      className="cell"
      onClick={handleClick}
      style={{
        color: cell > 50 ? 'white' : 'black',
        backgroundColor: `rgba(0, 0, 0, ${cell / 100})`,
      }}
    >
      {Math.floor(cell)}
    </button>
  )
}

CellImpl = React.memo(CellImpl)

let Cell = ({row, column}) => {
  const state = useAppState()
  return <CellImpl cell={state.grid[row][column]} row={row} column={column} />
}

Cell = React.memo(Cell)
```

- To avoid writing an intermediate Component over and over again, we can create a Higher Order Component(HOC) that will input a Component and a slice function that will store logic to retrieve data from the state stored(using usAppDispatch hook).

```
const withStateSlice = (Comp, slice) => {
  const MemoComp = React.memo(Comp)
  let Wrapper = (props, ref) => {
    const state = useAppState()
    return <MemoComp state={slice(state, props)} ref={ref} {...props} />
  }
  Wrapper.displayName = `withStateSlice(${Comp.displayName || Comp.name})`
  Wrapper = React.memo(React.forwardRef(Wrapper))
  return Wrapper
}

function Cell({state: cell, row, column}) {
  const dispatch = useAppDispatch()
  const handleClick = () => dispatch({type: 'UPDATE_GRID_CELL', row, column})
  return (
    <button
      className="cell"
      onClick={handleClick}
      style={{
        color: cell > 50 ? 'white' : 'black',
        backgroundColor: `rgba(0, 0, 0, ${cell / 100})`,
      }}
    >
      {Math.floor(cell)}
    </button>
  )
}

Cell = withStateSlice(Cell, (state, {row, column}) => {
  return state.grid[row][column]
})
```

- We also attached ref destructuring to the component as React allows ref to be passed separate to props to a component.
- We can further use Recoil to speed up use cases like these, where we need to manage global data and change chunks at Cellular level.
