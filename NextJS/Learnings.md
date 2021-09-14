<h1>Next.js</h1>

<h2>Why Next.js?</h2>
- Next.js helps in server side rendering of react applications.
<h3>Pros of SSR:</h3>

- Social media friendly
- SEO friendly
- Fast FCP and FP
- Up-to-date content
<h3>Cons of SSR:</h3>

- Slow TTFB
- Server-intensive workloads
- Can’t be cached by traditional CDNs
- Navigating across a site is slow without universal rendering
- TTI is longer than FTP with universal rendering

<br/><br/>

<h2>Features of Next.js</h2>
<ul><h3>Easier Routing:</h3>
<li><a>https://hendrixer.github.io/nextjs-course/pages</a></li>
<li>Next.js allows easier routing using just the directory structure.</li>
<li>We can also catch all routes using directory structure like "[...params].jsx" and then access params object to access the suffix route. Eg. for notes/1/2/3, params becomes an array : ["1", "2", "3"]</li>
<li>With optional catch all params, we can even allow empty suffix on top of optional catch params</li>
<li>We can also use Link component to render an anchor tag (without href, href is handled in the link component) to create a link to a matching url like in React Link. Href assumes value corresponding to the router file structure. Here we can also specify 'as' prop to define/resolve the value to interpret id parameter from and also the link that is shown on hover over the link tag in the browser. Hence we only need it for dynamic routes.</li>
</ul>
<ul><h3>Config:</h3>
<li><a>https://hendrixer.github.io/nextjs-course/styling</a></li>
<li>Next.js also allows global css imports only inside __app file inside pages folder.</li>
<li>However CSS modules can be imported anywhere inside the pages and must have identifier for the file as "name.module.css" with the "module.css" suffix</li>
<li>We can also use the "theme-ui" library in order to do styling</li>
<li> In the code below, @jsx line is a javascript pragma. It is there to instruct the compiler how to compile the corresponding js file(Hence import of React in every react file so that compiler knows it's going to be compiling JSX). "sx" acts like inline style but it's not completely like inline styles. It's more like CSS modules, </li>

        /** @jsx jsx */

        import { jsx } from "theme-ui";
        import Link from "next/link";

        const Nav = () => (

          <header
            sx={{
              height: "60px",
              width: "100vw",
              bg: "primary",
              borderBottom: "1px solid",
              borderColor: "primary",
            }}
          >
            <nav
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                variant: "containers.page",
                height: "100%",
              }}
            >
              <Link href='/'>
                <a sx={{ fontWeight: "bold",        fontSize: 4, cursor: "pointer" }}       >
                  Note App
                </a>
              </Link>

              <Link href='/notes'>
                <a sx={{ color: "text",         fontSize: 3, cursor: "pointer" }}       >notes</a>
              </Link>
            </nav>

          </header>
        );

        export default Nav;

<li>If you want to change the build system's behavior, extend Next.js's features, or add ENV variables, you can do this easily in the next-config.js file.</li>

</ul>
