import React, { Component } from 'react'
import Headlines from '../Headlines'
// import PropTypes from 'prop-types'
import './NewsModule.scss'
import axios from 'axios';


let api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

interface Props {
  cnnHighlighted: number;
  foxHighlighted: number;
  nytHighlighted: number;
  reutersHighlighted: number;
  passfocusedterms: (cnnCount: number, foxCount: number, nytCount: number, reutersCount: number) => void;
}

interface State {
  dateToday: string;
  cnnFeed: string[];
  cnnHighlighted: number;
  foxFeed: string[];
  foxHighlighted: number;
  nytFeed: string[];
  nytHighlighted: number;
  reutersFeed: string[];
  reutersHighlighted: number;
  wordHighlightInput: string[];
  wordHighlightSubmit: string[];
  focusedTerms: string[];
}


export default class NewsModule extends Component<Props, State> {
  constructor(props: Props, state: State) {
    super(props);
    this.state = {
      dateToday: '',
      cnnFeed: [],
      cnnHighlighted: 0,
      foxFeed: [],
      foxHighlighted: 0,
      nytFeed: [],
      nytHighlighted: 0,
      reutersFeed: [],
      reutersHighlighted: 0,
      wordHighlightInput: [],
      wordHighlightSubmit: [],
      focusedTerms: [],
    }
  }

  handleWordHighlightChange = (e: any) => {
    let { value } = e.target;
    //Allow only letters, numbers, commas, and spaces and "-"
    let regex = /^[a-zA-Z0-9, -./]*$/;
    if (!regex.test(value)) {
      return;
    }
    //Split the string into an array
    let wordHighlightArray = value.split(',');
    this.setState({ wordHighlightInput: wordHighlightArray });
  }

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.removeHighlights();
    //If target button id is submit 
    if (e.target.id === 'submit-search') {
      let { wordHighlightInput } = this.state;

      //Remove empty strings from array and remove duplicates
      let wordHighlightArray = wordHighlightInput.filter((word) => {
        return word !== '';
      });
      wordHighlightArray = wordHighlightArray.filter((word, index, self) => {
        return self.indexOf(word) === index;
      });

      this.setState({ wordHighlightSubmit: wordHighlightArray },
        () => {
          this.setState({ wordHighlightInput: [] });
          //Highlight all words in .headlines__container
          const headlinesContainer = document.querySelectorAll('.headlines__container h6');

          if (headlinesContainer) {
            let { wordHighlightSubmit } = this.state;
            let cnnCount = 0,
              foxCount = 0,
              nytCount = 0,
              reutersCount = 0,
              source: string = '';
            //Iterate through wordHighlightSubmit array
            for (let i = 0; i < wordHighlightSubmit.length; i++) {
              let word = wordHighlightSubmit[i];
              //Iterate through headlinesContainer array
              for (let j = 0; j < headlinesContainer.length; j++) {
                let headline = headlinesContainer[j];
                // Get source of headline
                source = headline.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.getAttribute('data-source') as string;
                let headlineText = headline.innerHTML;
                //Replace all instances of word with highlighted word
                let newHeadline = headlineText.replace(new RegExp(word, 'gi'), `<span class="user-highlight">${word}</span>`);
                headline.innerHTML = newHeadline;
                // increase count of highlighted words for each news source
                //check to see if an instance was replaced and increase count
                if (headlineText !== newHeadline) {
                  if (source === 'cnn') {
                    cnnCount += 1;
                  } else if (source === 'fox') {
                    foxCount += 1;
                  }
                  else if (source === 'nyt') {
                    nytCount += 1;
                  }
                  else if (source === 'reuters') {
                    reutersCount += 1;
                  }
                }
              }
              this.setState({ focusedTerms: wordHighlightSubmit }, () => {
                this.setState({ wordHighlightSubmit: [] });
              })
            }
            this.countTerms(cnnCount, foxCount, nytCount, reutersCount);
          }
        })
    } else if (e.target.id === 'reset-search') {
      this.removeHighlights();
      this.loadHeadlines();
    } else {
      return null;
    }
  };


  removeHighlights = () => {
    //Remove all highlights and replace with original text
    let headlines = document.querySelectorAll('.headlines__container h6');

    for (let i = 0; i < headlines.length; i++) {
      let headline = headlines[i];
      let headlineText = headline.innerHTML;
      let newHeadline = headlineText.replace(/<span class="user-highlight">/gi, '');
      newHeadline = newHeadline.replace(/<\/span>/gi, '');
      headline.innerHTML = newHeadline;
      this.setState({ focusedTerms: [] });
    }
  };

  countTerms = (cnnCount: number, foxCount: number, nytCount: number, reutersCount: number) => {
    const updateHighlightedState = async () => {
      await this.setState({ cnnHighlighted: cnnCount });
      await this.setState({ foxHighlighted: foxCount });
      await this.setState({ nytHighlighted: nytCount });
      await this.setState({ reutersHighlighted: reutersCount });
      this.props.passfocusedterms(this.state.cnnHighlighted, this.state.foxHighlighted, this.state.nytHighlighted, this.state.reutersHighlighted);
    }
    updateHighlightedState();
  }

  loadHeadlines = () => {
    //Empty CNN, FOX, NYT, and Reuters state arrays asyncronously
    const emptyState = async () => {
      await this.setState({ cnnFeed: [] });
      await this.setState({ foxFeed: [] });
      await this.setState({ nytFeed: [] });
      await this.setState({ reutersFeed: [] });
      await this.setState({ cnnHighlighted: 0 });
      await this.setState({ foxHighlighted: 0 });
      await this.setState({ nytHighlighted: 0 });
      await this.setState({ reutersHighlighted: 0 });
    }
    emptyState();

    //Calculate Today's Date
    let today: any = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    this.setState({ dateToday: today });

    api.get('/api/cnn')
      .then((response) => {
        let { Feed } = response.data;

        // console.log('CNN', response.data.Feed);
        this.setState({ cnnFeed: Feed });
      })
    api.get('/api/fox')
      .then((response) => {
        let { Feed } = response.data;
        // console.log('FOX RSS Request', response.data.Feed);
        this.setState({ foxFeed: Feed });
      })
    api.get('/api/nyt')
      .then((response) => {
        let { Feed } = response.data;
        // console.log('NYT RSS Request', response.data.Feed);
        this.setState({ nytFeed: Feed });
      })
    api.get('/api/reuters')
      .then((response) => {
        let { Feed } = response.data;
        // console.log('Reuters RSS Request', response.data.Feed);
        this.setState({ reutersFeed: Feed });
      })
  }


  componentDidMount = () => {
    this.loadHeadlines();
  }

  render() {
    let { dateToday } = this.state;
    let { cnnFeed } = this.state;
    let { foxFeed } = this.state;
    let { nytFeed } = this.state;
    let { reutersFeed } = this.state;
    let { wordHighlightInput } = this.state;
    let { focusedTerms } = this.state;
    let { cnnHighlighted } = this.state;
    let { foxHighlighted } = this.state;
    let { nytHighlighted } = this.state;
    let { reutersHighlighted } = this.state;
    return (
      <section id="newsModule" className="newsModule__container">

        <div className="newsModule__table-header">
          <h2 className="newsModule__title">Module-Sources</h2>
          <form
            //stop page from refreshing
            onSubmit={this.handleSubmit}
            id="word-highlight"
            action="submit">
            <label htmlFor="word-highlight-input"></label>
            <input
              type="text"
              onChange={this.handleWordHighlightChange}
              value={wordHighlightInput}
              placeholder="Keywords; Comma Seperated"
            ></input>
            <div className="form-buttons-wrapper">
              <button onClick={this.handleSubmit} id="submit-search" type="submit">Search for Keywords</button>
              <button onClick={this.handleSubmit} id="reset-search" type="submit">Refresh</button>
            </div>
          </form>
          <div className="focused-terms">
            <h3>Focused Terms: </h3>
            <p>{focusedTerms}</p>
          </div>
        </div>

        <div className="newsModule__articles-wrapper">
          <article id="cnn" className="newsModule__article">
            <header>
              <h3 className="newsModule__source">
                CNN
              </h3>
              <div className="row-wrapper">
                <h5>{dateToday} Headlines</h5>
                <h6>Articles Count: {cnnFeed.length}</h6>
                <h6>Found Terms: {cnnHighlighted}</h6>
              </div>
            </header>
            <div className="headlines-module-wrapper" data-source="cnn" >
              <Headlines
                headlines={cnnFeed}
              />
            </div>
            <footer>
            </footer>
          </article>
          <article id="foxnews" className="newsModule__article">
            <header>
              <h3 className="newsModule__source">
                Fox News
              </h3>
              <div className="row-wrapper">
                <h5>{dateToday} Headlines</h5>
                <h6>Articles Count: {foxFeed.length}</h6>
                <h6>Found Terms: {foxHighlighted}</h6>
              </div>
            </header>
            <div className="headlines-module-wrapper" data-source="fox" >
              <Headlines
                headlines={foxFeed}
              />
            </div>
            <footer>
            </footer>
          </article>
          <article id="nyt" className="newsModule__article">
            <header>
              <h3 className="newsModule__source">
                New York Times
              </h3>
              <div className="row-wrapper">
                <h5>{dateToday} Headlines</h5>
                <h6>Articles Count: {nytFeed.length}</h6>
                <h6>Found Terms: {nytHighlighted}</h6>
              </div>
            </header>
            <div className="headlines-module-wrapper" data-source="nyt">
              <Headlines
                headlines={nytFeed}
              />
            </div>
            <footer>
            </footer>
          </article>
          <article id="reuters" className="newsModule__article">
            <header>
              <h3 className="newsModule__source">
                Reuters
              </h3>
              <div className="row-wrapper">
                <h5>{dateToday} Headlines</h5>
                <h6>Articles Count: {reutersFeed.length}</h6>
                <h6>Found Terms: {reutersHighlighted}</h6>
              </div>
            </header>
            <div className="headlines-module-wrapper" data-source="reuters">
              <Headlines
                headlines={reutersFeed}
              />
            </div>
            <footer>
            </footer>
          </article>
        </div>
      </section>
    )
  }
}
