import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import Spinner from '../Spinner/Spinner';
import './Headlines.scss';


interface Headline {
  title: string;
  source: string;
  link: string;
  content: string;
  contentSnippet: string;
  guid: string;
  showSnippet: boolean;
}


const Headlines: React.FC<{ headlines: Headline[] }> = memo((props) => {
  const [headlines, setHeadlines] = useState(props.headlines);

  const toggleShowSnippetRef = useRef<(index: number) => void>();

  const toggleShowSnippet = useCallback((index: number) => {
    const newHeadlines = [...headlines];
    newHeadlines[index].showSnippet = !newHeadlines[index].showSnippet;
    setHeadlines(newHeadlines);
  }, [headlines, setHeadlines]);


  useEffect(() => {
    toggleShowSnippetRef.current = toggleShowSnippet;
  }, [toggleShowSnippet]);

  useEffect(() => {
    setHeadlines(
      props.headlines.map((headline: Headline) => ({
        ...headline,
        showSnippet: false,
      }))
    );
  }, [props.headlines]);




  if (headlines && headlines.length > 0) {
    return (
      <div className="headlines__component">
        <ul className="headlines__container">
          {headlines.map((headlines: any, index: number) => (
            <li className="headlines__wrapper" key={index}>
              <div className="headlines__headline" onClick={() => toggleShowSnippetRef.current && toggleShowSnippetRef.current(index)}>
                <h6>
                  &#8250; &nbsp; {`${headlines.title}`}
                </h6>
                <div className={`show-snippet-${headlines.showSnippet}`}>
                  {headlines.contentSnippet !== "" && headlines.contentSnippet !== undefined
                    ?
                    <p>
                      {headlines.contentSnippet}
                      <br />
                      <br />
                      <a href={headlines.link} target="_blank" rel="noopener noreferrer">Read more...</a>
                      <br />
                      <br />
                    </p>
                    :
                    <span>
                      <p>No snippet available</p>
                      <br />
                      <a href={headlines.link} target="_blank" rel="noopener noreferrer">Read more...</a>
                    </span>
                  }
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return (
      <div className="headlines-spinner-wrapper">
        <Spinner />
      </div>
    );
  }
});

export default Headlines;
