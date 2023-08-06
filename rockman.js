const newman = require('newman');


//definisco la funzione che prende come parametri la collection e le variabili
function runCollectionWithEnvVariables(collectionPath, environment) {

//memorizziamo i parametri in un oggetto options

 let options = {
    "collection": collectionPath,

    "environment": environment,

    "insecure": true
 }   
newman.run(

    options

).on('start', function (err, args) { // on start of run, log to console
    console.log('running a collection...');
  
}).on('request', function (error, data) {
   /* 
    console.log("/n");
    console.log(" ** ON REQUEST ERROR **");
    if (error || data.response.code === 401 || data.response.code === 404 || data.response.code === 500) {
    console.error(error);
    }
    else {
    console.log("/n");
    console.log(" ** ** ON REQUEST **");
    console.log(data.response);

    if(data.response.code===200)
    var responseBody = data.response.stream;
    var responseStr = responseBody.toString();
    console.info(responseStr);
    }    
    */
}).on('done', function (err, summary) {
    if (err || summary.error) {
        console.error(' collection run encountered an error.');
    }
    else {
      
        console.log(summary.environment.name);    
       // recupero variabile RESULT in STG
      // console.info('SUCCESS :' + summary.environment.values.members[26].value);
        //recupero variabile RESULT in INT
      console.info('SUCCESS :' + summary.environment.values.members[26].value);
     //  console.info('ERRORS: '+ JSON.stringify(summary.run.failures));

       summary.run.failures.forEach((err, index) => {
        console.error('****** ERROR ****** ' + index + ': ' + JSON.stringify(err.error.message) + '  IN  '+ JSON.stringify(err.parent.name));
      });
      
        
        console.log('Collection run completed.');
    }
})


};


//chiama la funzione
const basePathcoll='./collections/';
const prostfixcoll='.postman_collection.json';
const baseEnv='./environment/';
const postEnv='.postman_environment.json';
const name_coll='[INQPAC] [INT] - Check PAN is registered on SIA.postman_collection';
const name_Env='INT_NEXI';


collectionPath=basePathcoll + name_coll + prostfixcoll;
environment=baseEnv + name_Env +  postEnv;
runCollectionWithEnvVariables(collectionPath, environment);