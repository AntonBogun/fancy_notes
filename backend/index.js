const express = require('express')
var bodyParser = require('body-parser')//why is this not default?
const app = express()
const cors = require('cors')
const axios = require('axios')
app.use(cors())
app.use(express.static('build'))

var jsonParser = bodyParser.json()

app.post('/cors_avoidance', jsonParser, (request, response) => {
    //read apikey and appid from request in appropriate headers
    var apikey = request.headers.apikey;
    var appid = request.headers.appid;
    var api_action = request.headers.api_action;
    //merge data with collection, database, and dataSource
    var data=JSON.stringify({"collection":"notes","database":"notes", "dataSource":"Cluster0", ...request.body});
    // console.log(request.body);
    var config={headers: {'Content-Type': 'application/json', 'Access-Control-Request-Headers': '*', 'api-key': apikey}};
    axios.post(`https://data.mongodb-api.com/app/${appid}/endpoint/data/v1/action/${api_action}`,data,config)
    .then(function (response2) {
    console.log(JSON.stringify(response2.data));
    response.json(JSON.stringify(response2.data));
    })
    .catch(function (error) {
    console.log(error.code)
    console.log(error.data)
    response.json(JSON.stringify(error));
    });
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})