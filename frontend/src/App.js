import logo from './logo.svg';
import './App.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useState, useEffect, useRef } from 'react'
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

//each note has a title, description and a function to evaluate urgency, and whether the note should be hidden or not.
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
    apikey: "",
    appid: "",
    transparent: false,
    predefined: false
  });
  const [notes, setNotes] = useState([]);
  function update_state(state_changes) {
    setState({...state, ...state_changes})
  }
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
    if (window.location.search) {
      try {
        //split search string into dictionary, with = as key-value separator and & as key separator
        let search_dict = {};
        window.location.search.slice(1).split('&').forEach(x => search_dict[x.split('=')[0]] = x.split('=')[1]);
        // apikey = window.location.search.split('&')[0].split('=')[1];
        // appid = window.location.search.split('&')[1].split('=')[1];
        let new_state = {predefined: true};
        let upd=(key,newkey)=>{
          if(search_dict[key]){
            new_state[newkey]=search_dict[key];
          }
        }
        upd('apikey','apikey');
        upd('appid','appid');
        upd('t','transparent');
        if(!(new_state['apikey']&&new_state['appid'])){
          throw "apikey and appid must be specified";
        }
        if(!new_state['transparent']){
          new_state['transparent']=false;
        }
        //save to local storage
        localStorage.setItem('apikey', new_state['apikey']);
        localStorage.setItem('appid', new_state['appid']);
        // html_log(['apikey: ' + apikey, 'appid: ' + appid], {apikey: apikey, appid: appid, transparent: transparent, predefined: true});
        update_state(new_state);
      } catch (e) {
        console.log(e);
        html_log(e);
        // throw e; //doesn't matter because the page will be reloaded
      }
    }else{
      // console.log(undefined&&undefined?"ee":"no")
      //this is quite scary because localstorage does not get cleared even on cache clear
      let apikey = localStorage.getItem('apikey');
      let appid = localStorage.getItem('appid');
      if(apikey&&(apikey!=="undefined")&&appid&&(appid!=="undefined")){
        // console.log(localStorage.getItem('apikey') && localStorage.getItem('appid'))//undefined?? oh right it's a string
        // html_log(['found local storage apikey and appid',
        // 'apikey: ' + apikey, 'appid: ' + appid], {apikey: apikey, appid: appid});

        // console.log("found")
        // html_log("found local storage apikey and appid: " + apikey + ", " + appid);
        update_state({apikey: apikey, appid: appid, predefined: true});
      }else{
        html_log('no apikey and appid found, please enter them manually');
      }
    }
  }, [window.location.search]);
  
  useEffect(() => {
    if (state.apikey && state.appid && state.predefined) {
      load_all_data();
    }
  }, [state.predefined]);
  
  // get notes data from mongodb
  // const [notes, set_notes] = useState([]);
  function db_request(action, data, response, error) {
    axios.post('/cors_avoidance', data, {headers: {'apikey': state.apikey, 'appid': state.appid, 'api_action': action}}).
    then(response).
    catch(error);
  }
// console.log(Object.keys({a:1,b:2}))
  function load_all_data(){
    update_state({predefined: true});
    db_request('find', {}, function (response) {
      let data = JSON.parse(response.data);
      if(Object.keys(data).length!==1){
        console.error("there isn't just the 'documents': ",data)
        html_log("there isn't just the 'documents': "+JSON.stringify(data));
      }
      setNotes(data.documents);
    }, function (error) {
      html_log(error, {predefined: false});
    });
  }
  // Name : string (with a limit?)
  // Description : arbitrary string
  // Data : contains all the custom data + code
  // Data._priority_c : code for the priority function (default = ()=>1, represented as "")
  // Data._settings_c : code for any custom settings components and the related functionality (default = ()=></>, represented as "", will be transpiled)
  // Data._jsonify_c : code for creating a new dict that will be assembled together with other notes and 
  //   JSON.stringify()-ed into update to database (default = ()=>{name,desc,data._priority_c,_settings_c,_jsonify_c,_auto},
  //   represented as "", will also need to provide this as a helper func to be able to build upon, i.e. _NOTE_INCLUDE_DEFAULT())
  // Data._auto : arbitrary, automatically included by _jsonify_c by default
  // Data.* : arbitrary

  function construct_priorities(){
    let priorities = [];
    let errors = [];
    let default_priority = ()=>1;
    notes.forEach((note,i)=>{
      let priority = default_priority;
      try{
        if(note.data._priority_c){
          priority = eval(note.data._priority_c);
        }
      }catch(e){
        console.error(e);
        html_log(e);
        errors.push(i);
      }
      priorities.push(priority);
    });
    return [priorities,errors];
  }
  //adds/updates {key:[vals]} in data of each note, setNotes afterwards
  function update_datakeys_notes(keymap){
    //no sanity checks for length of each key array
    let new_notes = [];
    for(let i=0;i<notes.length;i++){
      let new_note = {...notes[i]};
      




  // const barlist = []
  // Object.keys(window).forEach(function(key) {console.log(key);});
  // console.log(Object.keys(this));

  // Object.keys(this).forEach(function(key) {
  //   try{
  //     console.log(key);
  //   }catch(e){
  //     console.log(e);
  //   }
  // });
  function f(){
    html_log('hello world');
  }
  return (
    <div className="App" style={state.transparent?{backgroundColor: 'transparent'}:{}}>
      <div className="log_remainder" style={{flex: 1,overflowY: "scroll"}}>
        {state.predefined ?
          <Notes 
            data={notes} 
            func={f} 
            reset_func={() => {
              // setNotes([]);
              // load_all_data();
              update_state({predefined: false});
            }}
          />
          :<ApiInfoInput 
            onChange={(e, key) => {
              localStorage.setItem(key, e.target.value);
              setState({...state, [key]: e.target.value});
            }}
            apikey={state.apikey}
            appid={state.appid}
            request={() =>{
              setNotes([]);
              load_all_data();
            }}
          />
        }
      </div>
      <Log html_log_list={state.html_log_list} clear_func={() => setState({...state, html_log_list: []})} />
    </div>
    // </div>
  );
}

function ApiInfoInput({onChange, apikey, appid, request}){
  return(
    <div className="api_info_input">
      <p>
        ApiKey:
        <input type="password" placeholder="apikey" value={apikey} onChange={(e) => onChange(e, 'apikey')} />
      </p>
      <p>
        AppId:
        <input type="password" placeholder="appid" value={appid} onChange={(e) => onChange(e, 'appid')} />
      </p>
      <button onClick={request}>request</button>
    </div>
  )
}


function Notes({data, func, reset_func}){
  if (data.length === 0) {
    return (
      <div className="notes">
        Loading...
      </div>
    );
  }
  return(
    <div className="notes">
      <button onClick={func}>func</button>
      <br/>
      <button onClick={reset_func}>reset</button>
      <br/>
      {data.map((note, i) => <div key={i}>{JSON.stringify(note)}</div>)}

      {/* {Array(20).fill().map((_,i) =>
        <p key={i}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum leo sit amet commodo pretium. Curabitur venenatis feugiat sollicitudin. Quisque vitae nunc at felis placerat gravida. Curabitur interdum viverra nisi a hendrerit. Donec pharetra libero risus, in semper nulla egestas sed. Aenean ac sapien cursus, euismod mauris vel, volutpat nunc. Nulla rutrum nisi nec tristique maximus. Aliquam malesuada sem bibendum, vulputate sapien vel, venenatis massa. Curabitur est tortor, feugiat at justo et, tincidunt laoreet sem.
        </p>    
      )} */}
    </div>
  )
}

// const Log= ({ html_log_list }) => {
//   console.log("this", this);
//   return (
//     <div className="log">
//       {/* <p> tag takes too much vertical space normally */}
//       {html_log_list.map((x, i) => <div key={i}>{x}</div>)}
//     </div>
//   );
// }

function Log({ html_log_list, clear_func }) {
  const loggerRef = useRef(null);
  const [scroll_to_bottom, setScrollToBottom] = useState(true);

  useEffect(() => {
    if (loggerRef.current) {
      if (scroll_to_bottom) {
        // Scroll to the bottom of the logger
        loggerRef.current.scrollTop = loggerRef.current.scrollHeight;
      }
    }
  }, [html_log_list, scroll_to_bottom]);

  const handleScroll = () => {
    // Check if the logger is scrolled to the bottom
    const isScrolledToBottom =
      // loggerRef.current.scrollTop + loggerRef.current.clientHeight ===
      // loggerRef.current.scrollHeight;//this MISBEHAVES when the screen is resized, i.e. dragged to be smaller
      Math.abs(loggerRef.current.scrollTop + loggerRef.current.clientHeight - loggerRef.current.scrollHeight) < 4;
    //specifically: scrollTop 124.80000305175781
    // console.log("scrollTop", loggerRef.current.scrollTop);
    // console.log("clientHeight", loggerRef.current.clientHeight);
    // console.log("scrollHeight", loggerRef.current.scrollHeight);
    // Update the scroll_to_bottom state variable
    setScrollToBottom(isScrolledToBottom);
  };//after a long battle of many words, chatgpt figured it out
  //"Clear" button in the top right corner of the logger
  return (
    html_log_list.length > 0 ?
    <div
      className="log"
      style={{
        maxHeight: '20vh',
        position: 'relative',
        padding: '10px',
        maxHeight: '20vh+5px',
        outline: '1px solid red'}}
    >
      <button onClick={clear_func} style={{position: 'absolute', top: 0, right: 10}}>Clear</button>
      <div ref={loggerRef}
      onScroll={handleScroll}
      style={{overflow: 'auto', maxHeight: '20vh', height:'auto',}} 
      className="log_scroll">
      {html_log_list.map((x, i) => <div key={i}>{x}</div>)}
      </div>
    </div>
    :
    <div className ="log"/>
    // <div
    //   ref={loggerRef}
    //   className="log"
    //   style={{
    //     maxHeight: '20vh',
    //     overflow: 'auto',
    //     height:'auto',
    //     position: 'relative',
    //     outline: html_log_list.length > 0 ? '1px solid red' : 'none' }}
    //   onScroll={handleScroll}
    // >
    //   <button onClick={clear_func} style={{position: 'absolute', top: 0, right: 0}}>Clear</button>
    //   {html_log_list.map((x, i) => <div key={i}>{x}</div>)}
    // </div>
  );
}
  // useEffect(() => {
  //   // Set the height to 0 if there are no logs, and to 'auto' if there are logs
  //   setHeight(html_log_list.length > 0 ? 'auto' : 0);
  // }, [html_log_list]);








export default App;
