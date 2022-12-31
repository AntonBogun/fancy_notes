import logo from "./logo.svg";
import "./App.css";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useState, useEffect, useRef } from "react";
import * as _React from "react";
import axios from "axios";
import CodeEditor from "@uiw/react-textarea-code-editor";
// import { transform } from "@babel/standalone";
function transform(code, options) {
  return { code: "React.createElement('div', null, 'PLACEHOLDER')" };
}
function transpile(code) {
  return transform(code, { plugins: ["transform-react-jsx"] }).code;
}
const React = _React; //React is not defined in eval

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
// let _settings_open = false; //=prevent updates while settings are open
// // ~assuming that timeout can simply be cleared, therefore "mutexes" are not needed
//~ the mutex is needed to prevent opening settings while data is being requested, but for sorting it is not needed
let _sort_timeout_id = 0;
let _db_timeout_id = 0; //needed to cancel timeout
let _db_cancel_token = null; //needed to cancel axios request
let _db_resolve_func = null;
let _db_reject_func = null; //needed to cancel promise

function App() {
  const [htmlLogList, setHtmlLogList] = useState([]);
  const [state, setState] = useState({
    apikey: "",
    appid: "",
    transparent: false, //transparent background for use with wallpaper engine
    // display_notes: false, //go to api input if false
    last_db_update_date: null, //used for detecting change by other instances
    allow_intervals: false, //allow intervals to run, false until notes loaded
  });
  const [displayNotes, setDisplayNotes] = useState(false);
  // const [updateIntervals, setUpdateIntervals] = useState({
  //   sort: null, //reference to interval for automatic sorting
  //   db_check: null //reference to interval for checking if db has been updated
  // });
  const [notes, setNotes] = useState([]);
  const [dbInterval, setDBInterval] = useState(0);
  const [popupStack, setPopupStack] = useState([]);
  // function updateState(state_changes) {
  //   setState({ ...state, ...state_changes });
  // }
  function html_log(obj, state_changes = {}) {
    //delete first element if more than 50 lines
    setHtmlLogList((prev) => {
      let new_list = Array.isArray(obj) ? prev.concat(obj.map((x) => x.toString())) : prev.concat(obj.toString());
      return new_list.slice(-50); //keep only last 50 lines
    });
  }

  //=load apikey and appid from web search string/local storage
  //=if success, immediately request the data and set display_notes to true
  useEffect(() => {
    //=stateful
    let local_state = { ...state };
    if (window.location.search) {
      try {
        //split search string into dictionary, with = as key-value separator and & as key separator
        let search_dict = {};
        window.location.search
          .slice(1)
          .split("&")
          .forEach((x) => (search_dict[x.split("=")[0]] = x.split("=")[1]));
        // let new_state = { display_notes: true };
        let new_state = { ...state };
        let upd = (key, newkey) => {
          if (search_dict[key]) new_state[newkey] = search_dict[key];
        };
        upd("apikey", "apikey");
        upd("appid", "appid");
        upd("t", "transparent");
        if (new_state["transparent"]) local_state["transparent"] = true;
        if (new_state["apikey"] && new_state["appid"]) {
          //save to local storage
          localStorage.setItem("apikey", new_state["apikey"]);
          localStorage.setItem("appid", new_state["appid"]);
          full_reload(new_state);
          return;
        } else {
          console.log("no apikey and appid found, rolling back to local storage");
        }
      } catch (e) {
        console.log(e);
        html_log(e);
      }
    }
    //~this is quite scary because localstorage does not get cleared even on cache clear
    let apikey = localStorage.getItem("apikey");
    let appid = localStorage.getItem("appid");
    if (apikey && apikey !== "undefined" && appid && appid !== "undefined") {
      //~undefined is a string
      let local_state = { ...state, apikey, appid };
      full_reload(local_state);
    } else {
      html_log("no apikey and appid found, please enter them manually");
    }
  }, []); //window.location.search isn't a valid dependency because mutating it doesn't re-render the component

  // useEffect(() => {
  //   if (state.apikey && state.appid && state.display_notes) {
  //     load_all_data();
  //   }
  // }, [state.display_notes]);

  // get notes data from mongodb
  async function db_request(local_state, action, data, cancel_token = null) {
    //=stateless
    return axios.post("/cors_avoidance", data, {
      headers: {
        apikey: local_state.apikey,
        appid: local_state.appid,
        api_action: action,
      },
      cancelToken: cancel_token ? cancel_token.token : null,
    });
  }
  // note structure:
  // ~{(outer)*not saved*, copied with ... meaning that it can contain unserializeable data, but *should not contain nested objects*}
  // ~note: {(inner)*saved*, also what is loaded from the database. **must be serializable**}
  // }
  // Inner:
  // _id : string, required for MongoDB.
  //   ~NOTE: the id can not be changed or created locally, it is generated by the database and returned to the client
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
  async function request_all_data(local_state, cancel_token = null) {
    //=stateless, *mutates* state, may push date, throws
    try {
      let response = await db_request(local_state, "find", {}, cancel_token);
      let data = JSON.parse(response.data);
      let new_notes = data.documents
        .filter((note) => note.type === "NOTE")
        .map((note) => {
          return new_outer_shell(note);
        });
      let date = data.documents.filter((note) => note.type === "DATE");
      if (date.length === 0) {
        console.log("no date found, creating new one");
        html_log("no date found, creating new one");
        let new_state = await push_current_date(local_state, cancel_token);
        return [new_state, new_notes];
      } else {
        local_state.last_db_update_date = new Date(date[0].date);
        return [local_state, new_notes]; //_do not need to return date, because request_all_data is supposed to update it
      }
    } catch (error) {
      console.error("failed to request notes");
      html_log("failed to request notes");
      throw error;
    }
  }

  async function push_current_date(local_state, cancel_token = null) {
    //=stateless, *mutates* state, pushes date, throws
    let curr_date = new Date();
    try {
      await db_request(
        local_state,
        "replaceOne",
        {
          filter: { type: "DATE" },
          replacement: { type: "DATE", date: { $date: curr_date } },
          upsert: true,
        },
        cancel_token
      );
      console.log("updated date"); //~not needed in production
      local_state.last_db_update_date = curr_date;
      return local_state;
    } catch (error) {
      console.error("failed to update date");
      html_log("failed to update date");
      throw error;
    }
  }

  async function get_last_db_update_date(local_state, cancel_token = null) {
    //=stateless, *mutates* state, may push date, throws
    try {
      console.log("getting last db update date"); //!debug
      let response = await db_request(local_state, "findOne", { filter: { type: "DATE" } }, cancel_token);
      console.log("got last db update date"); //!debug
      let data = JSON.parse(response.data).document;
      if (!data) {
        console.error("no date found, creating new one");
        html_log("no date found, creating new one");
        local_state = await push_current_date(local_state, cancel_token);
        return [local_state, local_state.last_db_update_date];
      }
      return [local_state, new Date(data.date)];
    } catch (error) {
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
  function new_outer_shell(inner = {}) {
    //~im sure an empty default note is fine, right?
    //=trivially stateless
    return {
      failed: false,
      val: 100,
      priority: () => 100,
      settings: () => <></>,
      jsonify: default_jsonify,
      note: inner,
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
    let priority = () => 100;
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
        console.error("failed to construct priority for note " + i + ": ", err);
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
    let val = 100;
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
    let new_notes = local_notes
      .map((outer, i) => {
        let [val, failed, err] = update_priority_val(outer);
        //=clamp
        val = Math.max(0, Math.min(100, val));
        if (failed) {
          console.error("failed to update priority for note " + i + ": ", err);
          html_log("failed to update priority for note " + i + ": " + err);
        }
        return { ...outer, val: val, failed: failed };
      })
      .sort((a, b) => b.val - a.val);
    return new_notes;
  }

  function start_autoupdate() {
    // // ~NOTE: launches the two intervals immediately, meaning update_order and db_check shouldn't be pre-emptively called
    // ~the launch of intervals is not immediate
    //autoupdate order every second
    function sort_interval() {
      _sort_timeout_id = setTimeout(() => {
        //time the execution and if it takes too long, log it
        let start = Date.now();
        setNotes((local_notes) => update_order(local_notes));
        let end = Date.now();
        if (end - start > 500) {
          console.warn("sorting took " + (end - start) / 1000 + "s");
          html_log("sorting took " + (end - start) / 1000 + "s");
        }
        sort_interval();
      }, 1000);
    }

    function db_check_interval() {
      _db_timeout_id = setTimeout(async () => {
        //create promise
        let promise = new Promise((resolve, reject) => {
          _db_resolve_func = resolve; //allows to execute after async function that accesses state
          _db_reject_func = reject;
        });
        setDBInterval((x) => x + 1);
        console.log("updated db interval"); //!debug
        try {
          console.log("waiting"); //!debug
          await promise;
          db_check_interval();
          console.log("launched new interval"); //!debug
        } catch (error) {
          if (axios.isCancel(error)) {
            console.log("db_check_interval canceled");
            html_log("db_check_interval canceled");
          } else {
            console.error("failed to check for updates");
            html_log("failed to check for updates");
            console.error(error);
            html_log(error);
            // db_check_interval();
          }
        }
        _db_resolve_func = null;
        _db_reject_func = null;
      }, 15000);
    }
    sort_interval();
    console.log("initial db_check interval launched"); //!debug
    db_check_interval();
  }
  useEffect(() => {
    if (dbInterval > 0) {
      console.log("db interval updated"); //!debug
      db_check_request(state); //retrieves the newest state
    }
  }, [dbInterval]);

  async function db_check_request(original_state) {
    let local_state = { ...original_state };
    try {
      _db_cancel_token = axios.CancelToken.source();
      let new_date = null;
      console.log("checking for updates"); //!debug
      // await (new Promise((resolve) => setTimeout(resolve, 1000)));//!debug
      [local_state, new_date] = await get_last_db_update_date(local_state, _db_cancel_token);
      _db_cancel_token = null;
      console.log("db update date: ", new_date); //!debug
      console.log("local date: ", original_state.last_db_update_date); //!debug
      console.log("new date > local date: ", new_date > original_state.last_db_update_date); //!debug
      if (new_date > original_state.last_db_update_date) {
        console.log("new updates found, stopped updates, locked settings and reloading"); //!debug
        _is_updating_data = true;
        stop_autoupdate();
        // await (new Promise((resolve) => setTimeout(resolve, 1000)));//!debug
        await full_reload(local_state);
        _is_updating_data = false;
      } else {
        _db_resolve_func();
      }
    } catch (error) {
      _db_reject_func(error);
      _is_updating_data = false;
      _db_cancel_token = null;
    }
  }

  function stop_autoupdate() {
    clearTimeout(_sort_timeout_id);
    clearTimeout(_db_timeout_id);
    if (_db_cancel_token) {
      _db_cancel_token.cancel();
      // _db_cancel_token.cancel();//doesn't seem to do anything
    }
    _sort_timeout_id = 0;
    _db_timeout_id = 0;
    console.log("stopped autoupdate"); //!debug
  }

  async function full_reload(local_state) {
    // =stateful, updates state and notes
    //~NOTE: does not cancel auto-update or lock settings
    // let local_state = { ...state };
    // // stop_autoupdate();//~not sure if it's good to keep it here even if no auto-update is running, but probably is
    //~ the above does not work because it cancels its own token
    let new_notes = [];
    try {
      setDisplayNotes(true);
      [local_state, new_notes] = await request_all_data(local_state);
      new_notes = construct_all_priorities(new_notes);
      new_notes = update_order(new_notes);
      setNotes(new_notes);
      // local_state.display_notes = true;
      // update_state({...local_state, display_notes: true});
      setState(local_state);
      start_autoupdate();
    } catch (e) {
      // setDisplayNotes(false);
      console.error("failed to reload data, rolling back to input");
      html_log("failed to reload data, rolling back to input");
      console.error(e);
      html_log(e);
      rollback_to_input(local_state);
    }
  }
  function rollback_to_input(local_state) {
    //=stateful, updates state and notes
    setDisplayNotes(false);
    stop_autoupdate();
    setNotes([]);
    setState(local_state);
  }

  function f() {
    // html_log("hello world");
    if (_is_updating_data) {
      html_log("Updating data, please wait");
      return;
    }
    stop_autoupdate();
    append_yes_no_popup(
      "hello world",
      "no",
      () => {
        html_log("no");
        start_autoupdate();
      },
      "yes",
      () => {
        console.log("yes");
        start_autoupdate();
      }
    );
  }

  function append_popup(data) {
    setPopupStack((stack) => [...stack, data]);
  }
  function append_yes_no_popup_raw(title, no, onNo, yes, onYes) {
    append_popup({
      content: (index) => <YesNoPopup title={title} no={no} onNo={onNo} yes={yes} onYes={onYes} />,
    });
  }
  //=automatically pops the popup after clicking yes or no
  //~NOTE: does not automatically stop and restart auto-update, or check _is_updating_data
  function append_yes_no_popup(title, no, onNo, yes, onYes) {
    let close_and = (func) => {
      return () => {
        pop_popup();
        func();
      };
    };
    append_yes_no_popup_raw(title, no, close_and(onNo), yes, close_and(onYes));
  }

  function pop_popup() {
    setPopupStack((stack) => {
      return stack.slice(0, stack.length - 1);
    });
  }
  function clear_popups() {
    setPopupStack([]);
  }
  function onNoteClick(pos) {
    if (_is_updating_data) {
      html_log("Cannot edit while updating data");
      return;
    }
    stop_autoupdate();
    append_popup({
      content: (index) => <NoteEditor pos={pos} origin_notes={notes} _public={{//_public passes functions to NoteEditor
        append_yes_no_popup,
      }}
       />,
    });
  }

  return (
    <div className="App" style={state.transparent ? { backgroundColor: "transparent" } : {}}>
      <div className="log_remainder" style={{ flex: 1, overflowY: "auto" }}>
        {displayNotes ? (
          <>
            <Notes
              data={notes}
              func={f}
              resetFunc={() => {
                if (_is_updating_data) {
                  html_log("Cannot reset while updating data");
                  return;
                }
                stop_autoupdate();
                append_yes_no_popup(
                  "Go back to selecting appid and apikey? This will erase all notes.",
                  "No",
                  start_autoupdate,
                  "Yes",
                  () => {
                    rollback_to_input(state);
                  }
                );
              }}
              onNoteClick={(pos) => {
                if (_is_updating_data) {
                  html_log("Cannot change notes while updating data");
                  return;
                }

                console.log("clicked note: (pos, name)", pos, notes[pos].note.name);
              }}
            />
            {popupStack.map((data, index) => (
              <Popup zIndex={index + 1}>{data.content(index)}</Popup>
            ))}
          </>
        ) : (
          <ApiInfoInput
            onChange={(e, key) => {
              localStorage.setItem(key, e.target.value);
              setState({ ...state, [key]: e.target.value });
            }}
            apikey={state.apikey}
            appid={state.appid}
            request={() => {
              // setNotes([]);
              // load_all_data();
              // stop_autoupdate();
              full_reload(state);
            }}
          />
        )}
      </div>
      <Log htmlLogList={htmlLogList} clearFunc={() => setHtmlLogList([])} />
    </div>
    // </div>
  );
}

function Popup({ zIndex, children }) {
  return (
    <div
      className="popup_background"
      style={{
        zIndex: zIndex,
        backgroundColor: "rgba(0,0,0,0.4)",
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="popup"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(3px)",
          borderRadius: "5px",
          padding: "5px",
          margin: "auto",
          width: "90%",
          height: "90%",
          zIndex: zIndex,
          overflowY: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function YesNoPopup({ title, no, onNo, yes, onYes }) {
  return (
    <div
      className="yes_no_popup"
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* center text */}
      <div className="yes_no_title" style={{ maxHeight: "50%", whiteSpace: "normal", overflow: "auto" }}>
        {title}
      </div>
      <div
        className="yes_no_buttons"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          overflow: "auto",
        }}
      >
        <button className="no_button" style={{ flex: 1 }} onClick={onNo}>
          {no}
        </button>
        <button className="yes_button" style={{ flex: 1 }} onClick={onYes}>
          {yes}
        </button>
      </div>
    </div>
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

function Notes({ data, func, resetFunc, onNoteClick }) {
  if (data.length === 0) {
    return <div className="notes">Loading...</div>;
  }
  return (
    <div className="notes">
      {/*  */}
      <table>
        <tr>
          <button onClick={func}>func</button>
          <button onClick={resetFunc}>reset</button>
        </tr>
      </table>
      <br />
      {data.map((outer, i) => (
        // <div key={i}>{JSON.stringify(note)}</div>
        <Note key={i} data={outer} onClick={() => onNoteClick(i)} />
      ))}

      {/* {Array(20).fill().map((_,i) =>
        <p key={i}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dictum leo sit amet commodo pretium. Curabitur venenatis feugiat sollicitudin. Quisque vitae nunc at felis placerat gravida. Curabitur interdum viverra nisi a hendrerit. Donec pharetra libero risus, in semper nulla egestas sed. Aenean ac sapien cursus, euismod mauris vel, volutpat nunc. Nulla rutrum nisi nec tristique maximus. Aliquam malesuada sem bibendum, vulputate sapien vel, venenatis massa. Curabitur est tortor, feugiat at justo et, tincidunt laoreet sem.
        </p>    
      )} */}
    </div>
  );
}

//gradient = sorted array of [i,col] pairs where i is the position in the gradient
function col_at_gradient(t, gradient) {
  if (t <= gradient[0][0]) return gradient[0][1];
  if (t >= gradient[gradient.length - 1][0]) return gradient[gradient.length - 1][1];
  for (let i = 0; i < gradient.length - 1; i++) {
    if (t == gradient[i + 1][0]) return gradient[i + 1][1];
    if (t >= gradient[i][0] && t <= gradient[i + 1][0]) {
      let t0 = gradient[i][0];
      let t1 = gradient[i + 1][0];
      let c0 = gradient[i][1];
      let c1 = gradient[i + 1][1];
      return c0.map((x, i) => x + ((c1[i] - x) * (t - t0)) / (t1 - t0));
    }
  }
}
function split_hex(hex) {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}
function arr_to_rgb(arr) {
  return `rgb(${arr[0]},${arr[1]},${arr[2]})`;
}

function Note({ data, onClick }) {
  try {
    return (
      <div
        className="note"
        style={{ position: "relative", width: "100%", height: "40px", display: "flex", alignItems: "center" }}
        onClick={onClick}
      >
        <div
          className="progress"
          style={{
            position: "absolute",
            top: "10%",
            left: 0,
            width: "100%",
            height: "80%",
            background: "#E9ECEF",
            borderRadius: "12px",
          }}
        >
          <div
            className="bar"
            style={{
              width: `${Math.round(data.val)}%`,
              background: arr_to_rgb(
                col_at_gradient(Math.round(data.val), [
                  [0, split_hex("#2cb7ff")],
                  [22, split_hex("#2cb7ff")],
                  [66, split_hex("#fff400")],
                  [100, split_hex("#ff0000")],
                ])
              ),
            }}
          />
        </div>
        <div style={{ textAlign: "center", textOverflow: "ellipsis", zIndex: 1, width: "100%" }}>
          {data.failed ? `failed - ${data.note.name}` : `${Math.round(data.val)}% - ${data.note.name}`}
        </div>
      </div>
    );
  } catch (e) {
    console.error(e);
    // html_log(e);//~not defined
    return <ProgressBar now={100} variant="danger" label="error" />;
  }
}

function NoteEditor({ pos, origin_notes, _public}) {//public functions
  const [notes, setNotes] = useState([...origin_notes]);
  const [outer, setOuter] = useState({});
  const [viewState, setViewState] = useState(0);
  const [err, setErr] = useState({ hasError: false, error: null, onEval: false });
  const [CustomSettings, setCustomSettings] = useState(() => () => <></>); //two layers because counts as constructor
  const [reloadSettingsState, setReloadSettingsState] = useState(0);
  function reloadSettings() {
    setReloadSettingsState(reloadSettingsState + 1);
  }
  useEffect(() => {
    try {
      let newCustomSettings = eval(transpile(outer.note._settings_c));
      setCustomSettings(() => newCustomSettings);
      setErr({ hasError: false, error: null, onEval: false });
    } catch (e) {
      console.error("failed to eval custom settings");
      console.error(e);
      setErr({ hasError: true, error: e, onEval: true });
    }
  }, [reloadSettingsState]);

  function cycleViewState() {
    setViewState((viewState + 1) % 3);
  }
  function askClose() {

  }
  useEffect(() => {
    try {
      let _note_copy = structuredClone(origin_notes[pos].note);
      setOuter({ ...origin_notes[pos], note: _note_copy });
    } catch (e) {
      console.error("note contains unserializable data");
      console.error("HANDLING NOT IMPLEMENTED");
      console.error(e);
      html_log("note contains unserializable data");
      html_log(e);
      return <div>note contains unserializable data</div>; //!supposed to dump note data
    }
  }, [pos, origin_notes]);
  //bool array, decides what note fields should be copied over and what to save in database
  const [dependencies, setDependencies] = useState(Array(origin_notes[pos].length).fill(false));
  function add_dependency(_in) {
    //if _in is a number, convert to array
    let arr = Array.isArray(_in) ? _in : [_in];
    arr = arr.filter((x) => !dependencies[x]);
    if (!arr.length) return;
    try {
      let _note_copies = arr.map((x) => structuredClone(origin_notes[x].note));
      let _new_notes = [...notes];
      arr.forEach((x, i) => {
        _new_notes[x] = { ...origin_notes[x], note: _note_copies[i] };
      });
      setNotes(_new_notes);
    } catch (e) {
      if (e.name === "DataCloneError") {
        throw "unserializable";
      }
    }
  }

  function full_copy_note(_in = pos) {
    //~may be inefficient if copying something like a database, but it is up to the user to understand what they are doing
    //if array, copy those notes
    try {
      let arr = Array.isArray(_in) ? _in : [_in];
      let _note_copies = arr.map((x) => ({ ...notes[x], note: structuredClone(notes[x].note) }));
      if (!Array.isArray(_in)) return _note_copies[0];
      return _note_copies;
    } catch (e) {
      throw "unserializable";
    }
  }
  function set_note(_in_pos, _in_note) {
    let arr_pos = Array.isArray(_in_pos) ? _in_pos : [_in_pos];
    let arr_note = Array.isArray(_in_note) ? _in_note : [_in_note];
    if (arr_pos.length !== arr_note.length) throw "length mismatch";
    let _new_notes = [...notes];
    arr_pos.forEach((x, i) => {
      _new_notes[x] = arr_note[i];
    });
    setNotes(_new_notes);
  }
  return (
    <div className="note-editor" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {viewState === 1 ? (
        <></>
      ) : (
        <div className="note-editor-header" style={{ maxHeight: viewState === 0 ? "50%" : "100%", width: "100%" }}>
          <NameAndInput
            title="name:"
            value={outer.note.name}
            placeholder="Enter name"
            language=""
            onChange={(e) => setOuter({ ...outer, note: { ...outer.note, name: e.target.value } })}
          />
          <NameAndInput
            title="description:"
            value={outer.note.description}
            placeholder="Enter description"
            language=""
            onChange={(e) => setOuter({ ...outer, note: { ...outer.note, description: e.target.value } })}
          />
          <NameAndInput
            title="priority code:"
            value={outer.note._priority_c}
            placeholder="() => 100;"
            language="js"
            onChange={(e) => setOuter({ ...outer, note: { ...outer.note, _priority_c: e.target.value } })}
          />
          <PriorityTest priority_code={outer.note._priority_c} />
          <NameAndInput
            title="settings code:"
            value={outer.note._settings_c}
            placeholder="() => <></>;"
            language="jsx"
            onChange={(e) => setOuter({ ...outer, note: { ...outer.note, _settings_c: e.target.value } })}
          />
          <button onClick={reloadSettings}>Reload settings</button>//!not implemented
          <NameAndInput
            title="json-ify code:"
            value={outer.note._jsonify_c}
            placeholder="(outer) => default_jsonify(outer);//only change if you know what you are doing"
            language="js"
            onChange={(e) => setOuter({ ...outer, note: { ...outer.note, _jsonify_c: e.target.value } })}
          />
        </div>
      )}
      {viewState === 2 ? (
        <></>
      ) : (
        <div
          className="note-editor-remainder"
          style={{ flex: 1, width: "100%", outline: `1px solid ${err.hasError ? "red" : "aqua"}` }}
        >
          <ErrorBoundary err={err} setErr={setErr}>
            <CustomSettings notes={notes} outer={outer} />
          </ErrorBoundary>
        </div>
      )}
      <div
        className="note-editor-footer"
        style={{ maxHeight: "15%", width: "100%", display: "flex", flexDirection: "row" }}
      >
        {/* close button (request to save or discard), toggle button through normal/hidden top/hidden bottom */}
        <button onClick={askClose} style={{ flex: 1 }}>
          Close
        </button>
        <button onClick={cycleViewState} style={{ flex: 1 }}>
          Toggle view
        </button>
      </div>
    </div>
  );
}

function PriorityTest({ priority_code }) {
  const [updatePriorityState, setUpdatePriorityState] = useState(0);
  function updatePriority() {
    setUpdatePriorityState(updatePriorityState + 1);
  }
  const [priority, setPriority] = useState(0);
  const [err, setErr] = useState({ hasError: false, error: null, onEval: false });
  useEffect(() => {
    let _priority = () => 100;
    try {
      let _priority = eval(priority_code);
      if (typeof _priority !== "function") throw "not a function";
    } catch (e) {
      console.error("error in priority code eval", e);
      setErr({ hasError: true, error: e, onEval: true });
    }
    try {
      let _priority_val = _priority();
      if (typeof _priority_val !== "number") throw "not a number";
      setPriority(_priority_val);
      setErr({ hasError: false, error: null, onEval: false });
    } catch (e) {
      console.error("error in priority value calculation", e);
      setErr({ hasError: true, error: e, onEval: false });
    }
  }, [updatePriorityState]);
  return (
    <>
      <button onClick={updatePriority}>Update priority</button>
      {err.hasError ? (
        <div style={{ color: "red" }}>
          ERROR{err.onEval ? " (on eval of function)" : ""}: {err.error.toString()}
        </div>
      ) : (
        <div style={
          priority<0||priority>100?{color:"yellow"}:{}}
        >
          Priority{priority<0||priority>100?" (out of range)":""}: {priority}
        </div>
      )}
    </>
  );
}





class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, onEval: false };
  }
  static getDerivedStateFromError(error) {
    console.error("error in render", error);
    return { hasError: true, error: error, onEval: false };
  }
  render() {
    if (this.state.hasError && !this.props.err.hasError) {
      this.props.setErr({ hasError: true, error: this.state.error, onEval: false });
      return (
        <>
          <button onClick={() => this.setState({ hasError: false, error: null, onEval: false })}>Retry</button>
          <div style={{ color: "red" }}>
            ERROR{this.state.onEval ? " (on eval)" : ""}:{" "}
            {this.state.error.stack ? this.state.error.stack : this.state.error}
          </div>
        </>
      );
    }
    if (this.props.err.hasError) {
      this.state = { hasError: false, error: null, onEval: false };
      return (
        <>
          <button onClick={() => this.props.setErr({ hasError: false, error: null, onEval: false })}>Retry</button>
          <div style={{ color: "red" }}>
            ERROR{this.props.err.onEval ? " (on eval)" : ""}:{" "}
            {this.props.err.error.stack ? this.props.err.error.stack : this.props.err.error}
          </div>
        </>
      );
    }
    return this.props.children;
  }
}

// const Log= ({ htmlLogList }) => {
//   console.log("this", this);
//   return (
//     <div className="log">
//       {/* <p> tag takes too much vertical space normally */}
//       {htmlLogList.map((x, i) => <div key={i}>{x}</div>)}
//     </div>
//   );
// }

function Log({ htmlLogList, clearFunc }) {
  const loggerRef = useRef(null);
  const [scroll_to_bottom, setScrollToBottom] = useState(true);

  useEffect(() => {
    if (loggerRef.current) {
      if (scroll_to_bottom) {
        // Scroll to the bottom of the logger
        loggerRef.current.scrollTop = loggerRef.current.scrollHeight;
      }
    }
  }, [htmlLogList, scroll_to_bottom]);

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
  return htmlLogList.length > 0 ? (
    <div
      className="log"
      style={{
        position: "relative",
        padding: "10px",
        maxHeight: "20vh+5px",
        outline: "1px solid red",
      }}
    >
      <button onClick={clearFunc} style={{ position: "absolute", top: 0, right: 10 }}>
        Clear
      </button>
      <div
        ref={loggerRef}
        onScroll={handleScroll}
        style={{ overflow: "auto", maxHeight: "20vh", height: "auto" }}
        className="log_scroll"
      >
        {htmlLogList.map((x, i) => (
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
  //     outline: htmlLogList.length > 0 ? '1px solid red' : 'none' }}
  //   onScroll={handleScroll}
  // >
  //   <button onClick={clearFunc} style={{position: 'absolute', top: 0, right: 0}}>Clear</button>
  //   {htmlLogList.map((x, i) => <div key={i}>{x}</div>)}
  // </div>
}
// useEffect(() => {
//   // Set the height to 0 if there are no logs, and to 'auto' if there are logs
//   setHeight(htmlLogList.length > 0 ? 'auto' : 0);
// }, [htmlLogList]);

export default App;
