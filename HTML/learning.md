- There are 6 kinds of header tags : <h1>, <h2> ….<h6>, h1 being the strongest and h6 being the weakest.
- <p> is used to write a paragraph.
- <b> & <strong> are used to bold the text.
- <em> & <I> are used to italicise the text.
- <code> is used to represent a code section.
- <ul> starts an unordered list, <ol> starts an ordered list, <li> stands for list item
- <dl>, <dt>, <dd> can be used for a description list.
- <nav> can be used to create a horizontal navigation menu.
- <br/> is used to indicate line termination.
- <sub> & <sup> can be used to insert subscript and superscript.
- <pre> is used to start a section where alignment and spacing in the html file matters.
- <span> and <div> are line and block tags respectively, used to start a different context line or block.
- We can use UTF-8 charset as charset property, it consists of nearly all the characters there are. A browser needs to know the charset before hand to properly display the webpage.
- Every HTML file transported over web has :
  - doctype: It is used to show which type of file it is : modern or old.
  - head: It contains all metadata like charset, description, compatibility, title of the page etc (for browser, not user).
    It can also be used to provide theme color, load other assets using <link href = "" rel(type of asset) = "">
    We also place script tag to tell which js files to load
  - body: It contains the main content shown on the page.
    It has :
    main to tell the browser where the main content is
    header and footer that lie at the top and bottom of the site
    article used to define a unit block
    section to divide big chunk of content to smaller pieces
    aside to show side bar content

Links :

- <a href = “Link”> Link Text </a> is used to define a link.

Images :

- <img src = “Link” width = “” height = “” srcset=“”> is used to define images. srcset” is used to define alternate images. ‘w’ is used to provide width descriptor or ‘X’ is used to provide the pixel density descriptor.
- If we want to show different images in context of different screen width ( or have different sourceset for different screen widths ), we can use <picture> tag, followed by the <source media = “” srcset = “”> tag.

Audio :

- We can use <audio> to use an audio clip. It comes with attributes like controls, autoplay, and loop. Controls provides media control options on the audio, loop is used to loop the video.
- <source src = “Link” type = “eg. audio.mpeg”> can be used to provide the options for downloading different audio clips based on bandwidth, format etc.

Video :

- We use <video> to use a video clip. Similar to audio, we can use attributes like controls, autoplay etc. <source…..> is also similar.
- Apart from this, we can use <track/> can be used to insert subtitles. eg. <video> <source …./> <track src = “Link” kind = “captions” label = “English” srclang = “en” default/> </video>. Default is used to specify for a default/auto subtitles. We can cascade more <track…/> to define a set of subtitles for user preference.
- We can use embedded code from sites like YouTube to embed videos into our page.

Forms :

- We can use forms to create labelled entry fields
- We can link label with input either using "for" - "id" in <label> and in <input> tag respectively.
  Or by defining input inside the label.
- We can define type field of each label input("text", "email" etc).
- We can also mandate a field using required attribute.
- We can define placeholders for the boxes to give examples of the fields or we can prefill a box using value attribute.
- We can also define type of a button for a form
- We can take a large input using textarea instead of input element
- We can add files, checkboxes, color and date selection options too.

Tables:

- We can use tables via <tables></tables> tag.
- Row addition by <tr></tr>, inside it either define headers using <th></th> or table data <td></td>.
- We can also any other type of content inside the table cells.
-
