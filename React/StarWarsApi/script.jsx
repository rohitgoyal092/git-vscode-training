const baseUrl = "http://swapi.dev/api/films/";

const FilmCharacterComponent = ({
  url,
  typeOfComponent,
  className,
  childClassName,
  ...props
}) => {
  const [urlData, setUrlData] = React.useState({});
  const [errorData, setError] = React.useState(null);
  const [fetched, setFetched] = React.useState(true);

  React.useLayoutEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let isRunning = true;
    if (url) {
      setFetched(false);
      setError(null);
      setUrlData({});
      fetch(url, { signal })
        .then((response) => {
          if (!isRunning) {
            return;
          }
          if (!response.ok) {
            throw new Error(
              `Error hitting the url : "${url}". ErrorCode ${response.status}`
            );
          }
          return response.json();
        })
        .then((response) => {
          if (isRunning) {
            setUrlData(response);
            setFetched(true);
          }
        })
        .catch((error) => {
          if (isRunning) {
            setError(error);
            setFetched(true);
          }
        });
    }
    return () => {
      isRunning = false;
      if (fetched) {
        return;
      }
      controller.abort();
      setFetched(true);
    };
  }, [url]);
  if (!url) {
    return <div className={`${className} NoBorderClass`}>{""}</div>;
  }
  if (!fetched) {
    return (
      <div className={`${className} NoBorderClass`}>{`Retrieving...`}</div>
    );
  }
  if (errorData) {
    return (
      <div className={`${className} NoBorderClass`}>{errorData.message}</div>
    );
  }
  if (Object.keys(urlData).length === 0) {
    return <div className={`${className} NoBorderClass`}>{""}</div>;
  }
  try {
    if (typeOfComponent === "FILM") {
      return (
        <div className={className}>
          {urlData["characters"].map((characterUrl) => {
            return (
              <FilmCharacterComponent
                key={`${url}${characterUrl}`}
                url={characterUrl}
                typeOfComponent={"CHARACTER"}
                className={childClassName}
              />
            );
          })}
        </div>
      );
    } else {
      return <div className={className}>{urlData["name"]}</div>;
    }
  } catch (error) {
    console.log(error);
    setError(
      new Error(
        `Error occured while parsing data from url : "${url}". Please see the console for more details`
      )
    );
    return (
      <div className={`${className} NoBorderClass`}>{errorData.message}</div>
    );
  }
};
const MainComponent = () => {
  const [url, setUrl] = React.useState("");
  const [inputIdNumber, setidNumber] = React.useState("");
  return (
    <div className='ContainingClass'>
      <form
        className='FormClass'
        onSubmit={(e) => {
          e.preventDefault();
          if (inputIdNumber) {
            setUrl(baseUrl + inputIdNumber);
          }
        }}
      >
        <input
          className='InputBoxClass'
          onChange={(e) => {
            setidNumber(e.target.value);
          }}
          placeholder='Please input film id'
        />

        <button className='ButtonClass' type='submit'>
          Retrieve
        </button>
      </form>
      <FilmCharacterComponent
        className='FilmClass'
        childClassName='CharacterClass'
        url={url}
        typeOfComponent='FILM'
      />
    </div>
  );
};

ReactDOM.render(<MainComponent />, document.getElementById("root"));
