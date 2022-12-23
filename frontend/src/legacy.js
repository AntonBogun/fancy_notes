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
