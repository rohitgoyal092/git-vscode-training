How to handle events :

- onload, onclick, on.... prefixed functions.
- Defining inline function handlers :

  <button onclick="console.log('Thank you');">Please Click</button>

  This treats it like :

  function(event) { with(document) {
  with(this.form || {}) {
  with(this)
  {
  /_ your code here _/
  }
  }
  }
  }

- addEventListener : We can add multiple event listeners even for the same type of event.
- In modern browsers, the event propagation is bubbling up, which means that an action is first registered at the object level, and propagates to it's ancestors one by one. After the event handlers registered on the target element are invoked, most events “bubble” up the DOM tree. The event handlers of the target’s parent are invoked. Then the handlers registered on the target’s grandparent are invoked. This continues up to the Document object, and then beyond to the Window object. We can stop bubbling of one handler using stopPropagation() and all handlers after this handler using stopImmediatePropagation().
- Capturing is the opposite of Bubbling wherein the event propagates downwards into the DOM.
- If both capturing and bubbling types of events are present, capturing types are run before bubbling ones.
  (https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events, Read more about it here).

- Handlers of any type on an object are invoked in the order in which they were defined.

- We can specify removal of event handlers either using .removeEventListener or by defining it's "once" property as false.

  document.addEventListener("click", handleClick, { capture: true,
  once: true,
  passive: true });

- We can define passive as true, event handler cannot call preventDefault()(which makes preventDefault() ineffective) which might disrupt natural behaviour of event handling by the browser such as smooth scrolling.
- Handlers generally do not return a value. A false value means to prevent the normal behaviour of the function. This can be done via preventDefault() method also.
- We can create our own events, eg. to denote whenever we're busy using dispatchEvent().

Manipulating DOM Tree using:

- We can use closest(selector) function on an element to get the closest ancestor that satisfies the given selector condition.
- To go down the DOM tree of the element, we can use querySelector() and querySelectorAll().
- We can use 2 other types of properties, children(ones similar to this don't consider comments and text as children) and childNodes(they consider comments and text as children).
- We can use (get/set/has/remove)Attribute() to configure attributes inside a class (Read property naming convention(camelCase, html prefix, className and classList, onclick, style))
- We can use className to get string of class list of an element. We can also use classList to get a list of classes for the same purpose.
- We can use append() and prepend() instead of + operator to append content to markup of an element. However to add content to text node as well as element node, we need to use before() and after() on the object.
- We can access markup content using element.innerHTML inside element, outerHTML to access element tag + innerHTML. We can also use textContent to access the text inside an element.

CSS inside JS :

- We can use .style of an element object to change the properties of inline styling or using style.cssText.
- We can use computed styles to read the actual(inline + stylesheet) properties of an element (getComputedStyle()).
-
