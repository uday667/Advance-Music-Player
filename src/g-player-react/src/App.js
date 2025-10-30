import './App.css';
import './Components/main.scss';
import { Home } from './Components/Home';

import { Provider } from 'react-redux';
import store from './Components/redux/store';
import { AppHeader } from './Components/AppHeading';
import { HashRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

function App() {
  // useEffect(()=>{
  //   const getMP3 = async () =>{
  //     var audio = new Audio('http://localhost:8080/gp/gp');
  //     audio.addEventListener("canplaythrough", event => {
  //       /* the audio is now playable; play it if permissions allow */
  //       audio.play();
  //     });
  //   }
  //   getMP3()
  // },[])
  return (
    <div className="App app-container">
      <Provider store={store}>
        <CookiesProvider>
          <AppHeader />
          <Router>
            <Home />
          </Router>
        </CookiesProvider>
      </Provider>
    </div>
  );
}

export default App;
