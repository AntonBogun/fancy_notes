import logo from './logo.svg';
import './App.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useState, useEffect } from 'react'
import axios from 'axios'
// const cors = require('cors')
// app.use(cors())


window.mobileCheck = function () {
  let check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

//the page will be expected to run in 3 environments: desktop wallpaper (limited interaction), desktop browser, mobile browser

//if the page runs in a desktop wallpaper, it will be interacting with wallpaper engine, window.wallpaperRequestRandomFileForProperty
// will be defined, which can be used for setting the background image. Editing of the notes data is not allowed in this mode.

//if the page runs in a desktop browser, interaction will be allowed by right clicking on a button (which is not possible in wallpaper mode),
// which will bring up "mark as completed", "delete" (will ask for confirmation), and "edit" (will bring up a customizeable area 
// for editing behavior of the note)

//if the page runs in a mobile browser, the layout will be slightly different, but similar to the desktop browser.

//the notes data is stored in mongodb, and is accessed through an api key requested from the user. For desktop browser and mobile browser,
// the api key will be entered in a password field, and stored in local storage. For desktop wallpaper, keyboard input is not allowed, so
// api key will be specified in wallpaper user text field (received through window.wallpaperPropertyListener on load)

//each note is must have a title and a function to evaluate urgency, and whether the note should be hidden or not.
// The function will be called every couple seconds, and all notes will be sorted by urgency.
// Additionally, each note can have any number of extra properties and functions, which are used to
// provide additional functionality to the note. The extra properties and functions are defined by the user and will be displayed
// in the edit menu, where applicable.
// if a note is hidden, it will only be displayed if the user clicks on the "display all" button.


//in the two desktop modes, the urgency will be displayed as a progress bar, and notes will be stacked vertically on the right side of the screen
//in the mobile mode, the bars take the whole screen. Only vertical orientation is supported.


function reload() {
  window.location.reload();
}


function App() {
  const [state, setState] = useState({
    html_log_list: [],
    apikey: null,
    appid: null
  });
  function html_log(obj,state_changes={}) {//delete first element if more than 50 lines
    if (!Array.isArray(obj)) {
      if (state.html_log_list.length > 50) {
        setState({...state, html_log_list: state.html_log_list.slice(1).concat(obj.toString()), ...state_changes})
      } else {
        setState({...state, html_log_list: state.html_log_list.concat(obj.toString()), ...state_changes})
      }
    } else {
      if (state.html_log_list.length + obj.length > 50) {
        setState({...state, html_log_list: state.html_log_list.slice(obj.length).concat(obj.map(x => x.toString())), ...state_changes})
      } else {
        setState({...state, html_log_list: state.html_log_list.concat(obj.map(x => x.toString())), ...state_changes})
      }
    }
  }

  useEffect(() => {
    var apikey, appid;
    if (window.location.search) {
      try {
        apikey = window.location.search.split('&')[0].split('=')[1];
        appid = window.location.search.split('&')[1].split('=')[1];
        //save to local storage
        localStorage.setItem('apikey', apikey);
        localStorage.setItem('appid', appid);
        html_log(['apikey: ' + apikey, 'appid: ' + appid], {apikey: apikey, appid: appid});
      } catch (e) {
        console.log(e);
        html_log(e);
        // throw e; //doesn't matter because the page will be reloaded
      }
    }else{
      //this is quite scary because localstorage does not get cleared even on cache clear
      if(localStorage.getItem('apikey') && localStorage.getItem('appid')){
        apikey = localStorage.getItem('apikey');
        appid = localStorage.getItem('appid');
        html_log(['found local storage apikey and appid',
        'apikey: ' + apikey, 'appid: ' + appid], {apikey: apikey, appid: appid});
      }else{
        html_log('no apikey and appid found, please enter them manually');
      }
    }
  }, [window.location.search]);
  
  // get notes data from mongodb
  // const [notes, set_notes] = useState([]);
  function get_data(){
    if (state.apikey && state.appid) {
      var apikey = state.apikey; var appid = state.appid;
      var data={filter:{interesting: "ello wor"}};
      var config={headers: {'apikey': apikey, 'appid': appid, 'api_action': 'find'}, data: data};
      //send post request to "/cors_avoidance" with data and config
      axios.post('/cors_avoidance', data, config)
      .then(function (response) {
        html_log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        html_log(error);
      });
    } else {
      html_log('no apikey and appid');
    }
  }




  // const barlist = []

  return (
    <div className="App">
      test
      {/* <div className="righthalf"> */}
      <ProgressBar now={45} label={`${45}%`} />
      {/* <header className="App-header">
        <ProgressBar now={45} label={`${45}%`} />
      </header> */}
      <button onClick={reload}>reload</button>
      <button onClick={get_data}>get data</button>
      <Log html_log_list={state.html_log_list} />
    </div>
    // </div>
  );
}




function Log({ html_log_list }) {
  return (
    <div className="log">
      {/* <p> tag takes too much vertical space normally */}
      {html_log_list.map((x, i) => <div key={i}>{x}</div>)}
    </div>
  );
}





export default App;
