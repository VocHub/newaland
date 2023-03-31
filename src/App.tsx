import React, { useState, useEffect, useCallback } from 'react';
import NewsModule from './Components/NewsModule';
import DataCanvas from './Components/DataCanvas';
import Navbar from './Components/Navbar';
import { gsap } from 'gsap';
import newsFromLogo from './Assets/news-from-logo.png';
import './App.scss';





function App() {

  const [toggleSwitch, setToggleSwitch] = useState(false);
  let tl = gsap.timeline();

  const handleToggleSwitch = (e: any) => {
    e.preventDefault();

    //Get the height of #newsModule and #dataCanvas-component
    let newsModuleHeight = (document.getElementById('newsModule')?.clientHeight ?? + 0);
    let dataCanvasHeight = (document.getElementById('dataCanvas-component')?.clientHeight ?? + 0) + 100;



    setToggleSwitch(!toggleSwitch);

    if (!toggleSwitch) {
      tl.to('#dataCanvas-component',
        { duration: .5, x: "-30vw", ease: 'power4.out' }, 0);
      tl.to('#dataCanvas-component',
        { duration: .5, y: "-" + newsModuleHeight, ease: 'power4.out' }, .5);
      tl.to('#dataCanvas-component',
        { duration: .5, x: 0, ease: 'power4.out' }, 1);
      tl.to('#newsModule',
        { duration: 1, x: "30vw", ease: 'power4.out' }, 0);
      tl.to('#newsModule',
        { duration: 1, y: dataCanvasHeight, ease: 'power4.out' }, .5);
      tl.to('#newsModule',
        { duration: 1, x: 0, ease: 'power4.out' }, 1);
    } else {
      tl.to('#dataCanvas-component',
        { duration: .5, x: "-30vw", ease: 'power4.out' }, 0);
      tl.to('#dataCanvas-component',
        { duration: .5, y: 0, ease: 'power4.out' }, .5);
      tl.to('#dataCanvas-component',
        { duration: .5, x: 0, ease: 'power4.out' }, 1);
      tl.to('#newsModule',
        { duration: 1, x: "30vw", ease: 'power4.out' }, 0);
      tl.to('#newsModule',
        { duration: 1, y: 0, ease: 'power4.out' }, .5);
      tl.to('#newsModule',
        { duration: 1, x: 0, ease: 'power4.out' }, 1);
    }
  }

  const [counts, setCounts] = useState({
    cnnCount: 0,
    foxCount: 0,
    nytCount: 0,
    reutersCount: 0
  })
  const [initialized, setInitialized] = useState(false);

  const toggleInitialized = useCallback(() => {
    console.log("counts: ", counts);

    if (counts.cnnCount > 0 || counts.foxCount > 0 || counts.nytCount > 0 || counts.reutersCount > 0) {
      return setInitialized(true);
    } else {
      return setInitialized(false);
    }
  }, [counts])

  useEffect(() => {
    toggleInitialized();
  }, [toggleInitialized])

  const passFocusedTerms = (cnnCount: number, foxCount: number, nytCount: number, reutersCount: number) => {
    //update set counts then call setInitialized only after counts have been updated
    setCounts({
      cnnCount: cnnCount,
      foxCount: foxCount,
      nytCount: nytCount,
      reutersCount: reutersCount
    });
  }


  return (

    <div className="app">
      <Navbar
        toggleSwitch={(e: any) => handleToggleSwitch(e)}
        toggleSwitchState={toggleSwitch}
      />
      <header className="app__header">
        <h1>News-From</h1>
        <div className="logo-wrapper">
          <img src={newsFromLogo} alt="news-from-logo" />
        </div>
      </header>
      <main>
        <NewsModule
          passfocusedterms={passFocusedTerms}
          counts={counts}
        />
        <DataCanvas
          counts={counts}
          initialized={initialized}
        />
      </main>
      <footer className="App-footer">
      </footer>
    </div>
  );
}

export default App;
