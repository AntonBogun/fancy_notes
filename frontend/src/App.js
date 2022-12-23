import logo from "./logo.svg";
import "./App.css";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
// const cors = require('cors')
// app.use(cors())

window.mobileCheck = function () {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
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
let _is_updating_data = false; //=prevent settings from opening while updating
let _settings_open = false; //=prevent updates while settings are open

function App() {
  const [htmlLogList, setHtmlLogList] = useState([]);
  const [state, setState] = useState({
    apikey: "",
    appid: "",
    transparent: false, //transparent background for use with wallpaper engine
    display_notes: false, //go to api input if false
    last_db_update: null, //used for detecting change by other instances
    allow_intervals: false, //allow intervals to run, false until notes loaded
  });
  const [updateIntervals, setUpdateIntervals] = useState({
    sort: null, //reference to interval for automatic sorting
    db_check: null //reference to interval for checking if db has been updated
  });
  const [notes, setNotes] = useState([]);
  // function updateState(state_changes) {
  //   setState({ ...state, ...state_changes });
  // }
  function html_log(obj, state_changes = {}) {
    //delete first element if more than 50 lines
    // if (!Array.isArray(obj)) {
    //   if (state.html_log_list.length > 50) {
    //     // setState({ ...state, html_log_list: state.html_log_list.slice(1).concat(obj.toString()), ...state_changes });
    //     setHtmlLogList((prev) => prev.slice(1).concat(obj.toString()));
    //   } else {
    //     // setState({ ...state, html_log_list: state.html_log_list.concat(obj.toString()), ...state_changes });
    //     setHtmlLogList((prev) => prev.concat(obj.toString()));
    //   }
    // } else {
    //   if (state.html_log_list.length + obj.length > 50) {
    //     // setState({
    //     //   ...state,
    //     //   html_log_list: state.html_log_list.slice(obj.length).concat(obj.map((x) => x.toString())),
    //     //   ...state_changes,
    //     // });
    //     setHtmlLogList((prev) => prev.slice(obj.length).concat(obj.map((x) => x.toString())));
    //   } else {
    //     // setState({
    //     //   ...state,
    //     //   html_log_list: state.html_log_list.concat(obj.map((x) => x.toString())),
    //     //   ...state_changes,
    //     // });
    //     setHtmlLogList((prev) => prev.concat(obj.map((x) => x.toString())));
    //   }
    // }
    setHtmlLogList((prev) => {
      let new_list = Array.isArray(obj) ? prev.concat(obj.map((x) => x.toString())) : prev.concat(obj.toString());
      return new_list.slice(-50); //keep only last 50 lines
    });
  }

  //=load apikey and appid from web search string/local storage
  //=if success, immediately request the data and set display_notes to true
  useEffect(() => {
    //=stateful
    if (window.location.search) {
      try {
        //split search string into dictionary, with = as key-value separator and & as key separator
        let search_dict = {};
        window.location.search
          .slice(1)
          .split("&")
          .forEach((x) => (search_dict[x.split("=")[0]] = x.split("=")[1]));
        let new_state = { display_notes: true };
        let upd = (key, newkey) => {
          if (search_dict[key]) new_state[newkey] = search_dict[key];
        };
        upd("apikey", "apikey");
        upd("appid", "appid");
        upd("t", "transparent");
        if (!(new_state["apikey"] && new_state["appid"])) throw "apikey and appid must be specified";
        if (!new_state["transparent"]) new_state["transparent"] = false;
        //save to local storage
        localStorage.setItem("apikey", new_state["apikey"]);
        localStorage.setItem("appid", new_state["appid"]);
        //!NOT IMPLEMENTED
        // update_state(new_state);//full reload only after setting local storage
      } catch (e) {
        console.log(e);
        html_log(e);
      }
    } else {
      //~this is quite scary because localstorage does not get cleared even on cache clear
      let apikey = localStorage.getItem("apikey");
      let appid = localStorage.getItem("appid");
      if (apikey && apikey !== "undefined" && appid && appid !== "undefined") {
        //~undefined is a string
        // update_state({ apikey: apikey, appid: appid}, full_reload);
        //!NOT IMPLEMENTED
      } else {
        html_log("no apikey and appid found, please enter them manually");
      }
    }
  }, [window.location.search]);

  // useEffect(() => {
  //   if (state.apikey && state.appid && state.display_notes) {
  //     load_all_data();
  //   }
  // }, [state.display_notes]);

  // get notes data from mongodb
  async function db_request(local_state, action, data) {
    //=stateless
    return axios.post("/cors_avoidance", data, {
      headers: {
        apikey: local_state.apikey,
        appid: local_state.appid,
        api_action: action,
      },
    });
  }
  // note structure:
  // {(outer)*not saved*,
  // note: {(inner)*saved, also what is loaded from the database*}
  // }
  // Inner:
  // _id : string, required for MongoDB.
  //   !NOTE: the id can not be changed or created locally, it is generated by the database and returned to the client
  // type : "NOTE" for all notes, "DATE" for last update
  // Name : string (with a limit?)
  // Description : arbitrary string
  // Data : contains all the custom data + code
  // Data._priority_c : code for the priority function (default = ()=>1, represented as "")
  // Data._settings_c : code for any custom settings components and the related functionality (default = ()=></>, represented as "", will be transpiled)
  // Data._jsonify_c : code for creating a new dict that will be assembled together with other notes and
  //   JSON.stringify()-ed into update to database (default = default_jsonify)
  //   represented as "", will also need to provide this as a helper func to be able to build upon, i.e. _NOTE_INCLUDE_DEFAULT())
  // Data._auto : arbitrary, automatically included by _jsonify_c by default
  // Data.* : arbitrary
  function default_jsonify(outer) {
    //=trivially stateless
    //inner note,
    return {
      _id: { $oid: outer.note._id }, //$oid is required by mongodb
      type: "NOTE",
      name: outer.note.name,
      desc: outer.note.desc,
      _priority_c: outer.note.data._priority_c,
      _settings_c: outer.note.data._settings_c,
      _jsonify_c: outer.note.data._jsonify_c,
      _auto: outer.note.data._auto,
    };
  }
  async function request_all_data(local_state) {
    //=stateless, *mutates* state, may push date, throws
    try {
      let response = await db_request(local_state, "find", {});
      let data = JSON.parse(response.data);
      let new_notes = data.documents
        .filter((note) => note.type === "NOTE")
        .map((note) => {
          return new_outer_shell(note);
        });
      let date = new data.documents.filter((note) => note.type === "DATE");
      if (date.length === 0) {
        console.log("no date found, creating new one");
        html_log("no date found, creating new one");
        let new_state = await push_current_date(local_state);
        return [new_state, new_notes];
      } else {
        local_state.last_db_update = date[0].date;
        return [local_state, new_notes];//_do not need to return date, because request_all_data is supposed to update it
      }
    } catch (error) {
      console.error("failed to request notes");
      html_log("failed to request notes");
      throw error;
    }
  }
  // console.log(new Date(JSON.parse("{\"a\":\"2022-12-21T20:05:04.723Z\"}").a).getTime())
  // console.log(new Date("2022-12-21T20:05:04.723Z").getTime());
  async function push_current_date(local_state) {
    //=stateless, *mutates* state, pushes date, throws
    let curr_date = new Date();
    try {
      let response = await db_request(local_state, "replaceOne", {
        filter: { type: "DATE" },
        replacement: { type: "DATE", date: { $date: curr_date } },
        upsert: true,
      });
      console.log("updated date");
      local_state.last_db_update = curr_date;
      return local_state;
    } catch (error) {
      console.error("failed to update date");
      html_log("failed to update date");
      throw error;
    }
  }

  async function get_last_db_update_date(local_state) {
    //=stateless, *mutates* state, may push date, throws
    try{
      let response = await db_request(local_state, "findOne", { filter: { type: "DATE" } });
      let data = JSON.parse(response.data).document;
      if (!data) {
        console.error("no date found, creating new one");
        html_log("no date found, creating new one");
        local_state=await push_current_date(local_state);
        return [local_state, local_state.last_db_update];
      }
      return [local_state, new Date(data.date)];
    }catch(error){
      console.error("failed to get last db update date");
      html_log("failed to get last db update date");
      throw error;
    }
  }

  async function save_all_data(local_state, local_notes) {
    //=stateless, *mutates* state, pushes notes and date, throws
    let to_save = local_notes.map((outer) => outer.jsonify(outer.note));
    try {
      await db_request(local_state, "deleteMany", { filter: { _id: { $in: to_save.map((x) => x._id) } } });
      try {
        await db_request(local_state, "insertMany", { documents: to_save });
        console.log("saved data");
        // html_log("saved data");
        return push_current_date(local_state);
      } catch (error) {
        console.error("!!!!!!!failed to save data!!!!!!!");
        html_log("!!!!!!!failed to save data, something is *very* wrong!!!!!!!");
        throw error;
      }
    } catch (error) {
      console.error("!failed to delete old data!");
      html_log("!failed to delete old data, something is very wrong!");
      throw error;
    }
  }

  function new_inner_note() {
    //=trivially stateless
    return {
      // _id: "", //cannot be set, must be received from database
      type: "NOTE",
      name: "",
      desc: "",
      data: {
        _priority_c: "",
        _settings_c: "",
        _jsonify_c: "",
        _auto: {},
      },
    };
  }
  function new_outer_shell(inner={}) {//~im sure an empty default note is fine, right?
    //=trivially stateless
    return {
      failed: false,
      val: 1,
      priority: () => 1,
      settings: () => <></>,
      jsonify: default_jsonify,
      note: inner
    };
  }
  function new_note() {
    //=trivially stateless
    return new_outer_shell(new_inner_note());
  }

  // console.log(new Date().toLocaleString())
  // Outer:
  // val : produced with priority(), sorting based on
  // priority() : after evaluating _priority_c
  // failed : true is used to make the progress bar red
  // settings() : after transpiling and evaluating _settings_c
  // jsonify() : after evaluating _jsonify_c
  // note : *actual note data*
  function construct_priority(note) {
    //=stateless
    let priority = () => 1;
    let failed = false;
    let err = null;
    try {
      if (note.data._priority_c && note.data._priority_c.trim()) {
        priority = eval(note.data._priority_c);
      }
    } catch (error) {
      failed = true;
      err = error;
    }
    return [priority, failed, err];
  }
  function construct_all_priorities(local_notes) {
    //=stateless
    return local_notes.map((note, i) => {
      let [priority, failed, err] = construct_priority(note.note);
      if (failed) {
        console.error("failed to construct priority for note " + i + ": ",err);
        html_log("failed to construct priority for note " + i + ": " + err);
      }
      return { ...note, priority: priority, failed: failed };
    });
  }
  // re-evaluate priorities every second, and sort based on resulting values
  // if a note's settings are being accessed, prevent update
  //   simple "is used" check in update
  // if a note's settings are being accessed while an update is happening, delay access until after update
  //   detect "is updating" as true
  //   immediately set "is used" to true
  //   while(is_updating)
  //     await new Promise(resolve => setTimeout(resolve,20))

  function update_priority_val(outer) {
    //=stateless
    let val = 1;
    let failed = false;
    let err = null;
    try {
      val = outer.priority();
    } catch (e) {
      failed = true;
      err = e;
    }
    return [val, failed, err];
  }
  function update_order(local_notes) {
    //=stateless
    let new_notes = local_notes.map((outer, i) => {
      let [val, failed, err] = update_priority_val(outer);
      if (failed) {
        console.error("failed to update priority for note " + i + ": ",err);
        html_log("failed to update priority for note " + i + ": " + err);
      }
      return { ...outer, val: val, failed: failed };
    }).sort((a, b) => b.val - a.val);
    return new_notes;
  }

  function start_autoupdate() {
    //=stateful
    //~NOTE: launches the two intervals immediately, meaning update_order and db_check shouldn't be pre-emptively called
    //autoupdate order every second
    let sort = setInterval(() => {
      _is_updating_data = true;
      if (_settings_open) {
        _is_updating_data = false;
        return;
      }
      // update_state({is_updating: true});//!cannot actually use setState because it is async
      console.log("updating order");
      console.time("update_order");
      setNotes(update_order(notes));
      console.timeEnd("update_order");
      _is_updating_data = false;
    }, 1000);
    //automatically check for changes upstream every 15 seconds, if date upstream is ahead of local date, ask for a reload
    let db_check = setInterval(() => {
      if (_settings_open) {
        return;
      }
      console.log("checking for updates");
      // console.time("check_for_updates");
      console.error("not implemented");
      // console.timeEnd("check_for_updates");
    }, 15000);
    setUpdateIntervals({ sort, db_check });
  }


  async function full_reload() {
    //=stateful
    let local_state = { ...state };
    let new_notes=[];
    // request_all_data()
    // construct_all_priorities();
    [local_state, new_notes] = await request_all_data(local_state);
    new_notes = construct_all_priorities(new_notes);
    // update_order(); //automatic in start_autoupdate
    start_autoupdate();
  }
  function rollback_to_input() {
    save_all_data();
    setNotes([]);
    update_state({ display_notes: false });
  }

  function f() {
    html_log("hello world");
  }

  return (
    <div className="App" style={state.transparent ? { backgroundColor: "transparent" } : {}}>
      <div className="log_remainder" style={{ flex: 1, overflowY: "scroll" }}>
        {state.display_notes ? (
          <Notes
            data={notes}
            func={f}
            reset_func={() => {
              // setNotes([]);
              // load_all_data();
              update_state({ display_notes: false });
            }}
          />
        ) : (
          <ApiInfoInput
            onChange={(e, key) => {
              localStorage.setItem(key, e.target.value);
              setState({ ...state, [key]: e.target.value });
            }}
            apikey={state.apikey}
            appid={state.appid}
            request={() => {
              setNotes([]);
              load_all_data();
            }}
          />
        )}
      </div>
      <Log html_log_list={state.html_log_list} clear_func={() => setState({ ...state, html_log_list: [] })} />
    </div>
    // </div>
  );
}

function ApiInfoInput({ onChange, apikey, appid, request }) {
  return (
    <div className="api_info_input">
      <p>
        ApiKey:
        <input type="password" placeholder="apikey" value={apikey} onChange={(e) => onChange(e, "apikey")} />
      </p>
      <p>
        AppId:
        <input type="password" placeholder="appid" value={appid} onChange={(e) => onChange(e, "appid")} />
      </p>
      <button onClick={request}>request</button>
    </div>
  );
}

function Notes({ data, func, reset_func }) {
  if (data.length === 0) {
    return <div className="notes">Loading...</div>;
  }
  return (
    <div className="notes">
      <button onClick={func}>func</button>
      <br />
      <button onClick={reset_func}>reset</button>
      <br />
      {data.map((note, i) => (
        <div key={i}>{JSON.stringify(note)}</div>
      ))}

      {/* {Array(20).fill().map((_,i) =>
        <p key={i}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum leo sit amet commodo pretium. Curabitur venenatis feugiat sollicitudin. Quisque vitae nunc at felis placerat gravida. Curabitur interdum viverra nisi a hendrerit. Donec pharetra libero risus, in semper nulla egestas sed. Aenean ac sapien cursus, euismod mauris vel, volutpat nunc. Nulla rutrum nisi nec tristique maximus. Aliquam malesuada sem bibendum, vulputate sapien vel, venenatis massa. Curabitur est tortor, feugiat at justo et, tincidunt laoreet sem.
        </p>    
      )} */}
    </div>
  );
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
  }; //after a long battle of many words, chatgpt figured it out
  //"Clear" button in the top right corner of the logger
  return html_log_list.length > 0 ? (
    <div
      className="log"
      style={{
        maxHeight: "20vh",
        position: "relative",
        padding: "10px",
        maxHeight: "20vh+5px",
        outline: "1px solid red",
      }}
    >
      <button onClick={clear_func} style={{ position: "absolute", top: 0, right: 10 }}>
        Clear
      </button>
      <div
        ref={loggerRef}
        onScroll={handleScroll}
        style={{ overflow: "auto", maxHeight: "20vh", height: "auto" }}
        className="log_scroll"
      >
        {html_log_list.map((x, i) => (
          <div key={i}>{x}</div>
        ))}
      </div>
    </div>
  ) : (
    <div className="log" />
  );
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
}
// useEffect(() => {
//   // Set the height to 0 if there are no logs, and to 'auto' if there are logs
//   setHeight(html_log_list.length > 0 ? 'auto' : 0);
// }, [html_log_list]);

export default App;
