  //adds/updates {key:[vals]} in data of each note, setNotes afterwards
  // function update_datakeys_notes(keymap){
  //   //no sanity checks for length of each key array
  //   let new_notes = [];
  //   for(let i=0;i<notes.length;i++){
  //     let new_note = {...notes[i],data:{...notes[i].data}};
  //     for(let key in keymap){
  //       new_note.data[key] = keymap[key][i];
  //     }
  //     new_notes.push(new_note);
  //   }
  //   setNotes(new_notes);
  // }

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



  //~ localStorage load
    // console.log(localStorage.getItem('apikey') && localStorage.getItem('appid'))//undefined?? oh right it's a string
    // html_log(['found local storage apikey and appid',
    // 'apikey: ' + apikey, 'appid: ' + appid], {apikey: apikey, appid: appid});
    // console.log("found")
    // html_log("found local storage apikey and appid: " + apikey + ", " + appid);


  //~ request_all_data
        // if (Object.keys(data).length !== 1) {
        //   throw "there isn't just the 'documents': " + JSON.stringify(data);
        // }
        // setNotes(
        //   data.documents
        //     .filter((note) => note.type === "NOTE")
        //     .map((note) => {
        //       return { ...new_outer_shell(), note: note };
        //     })
        // );
  //~
          // return { ...new_outer_shell(), note: note };

  //~ start autoupdate
    // let sort = setInterval(() => {
    //   // _is_updating_data = true;
    //   // if (_settings_open) {
    //   //   _is_updating_data = false;
    //   //   return;
    //   // }
    //   // update_state({is_updating: true});//!cannot actually use setState because it is async
    //   console.log("updating order");
    //   console.time("update_order");
    //   setNotes(update_order(notes));
    //   console.timeEnd("update_order");
    //   // _is_updating_data = false;
    // }, 1000);
    //automatically check for changes upstream every 15 seconds, if date upstream is ahead of local date, ask for a reload
    // let db_check = setInterval(() => {
    //   if (_settings_open) {
    //     return;
    //   }
    //   console.log("checking for updates");
    //   // console.time("check_for_updates");
    //   console.error("not implemented");
    //   // console.timeEnd("check_for_updates");
    // }, 15000);
    // setUpdateIntervals({ sort, db_check });
  
  //~ html_log
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