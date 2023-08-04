const newman = require('newman');
var inquirer = require('inquirer');

console.info('Benvenuto su Rockman!!! ');

inquirer
  .prompt([
    /* Pass your questions in here */
    /*scelta quale operazione vuoi eseguire */
    {
      type: 'list',
      name: 'first-list-questions',
      messagge: 'Che operazione vuoi eseguire ?',
      choices: ['[ACCOUNT] [INT] [STG] - Delete Devices',
                '[ACCOUNT] [STG] - Account password update custom password',
                '[API] [INT] [STG] - API primitive utili',
                '[BONIFICA] [INT] [STG] - Bonifica+Subscribe+CUSTOM mobiles',
                '[BONIFICA] [INT] [STG] - Bonifica+Subscribe+RANDOM mobiles',
                '[BONIFICA] [INT] [STG] - Bonifica',
                '[COMMERCIAL] [INT] - Get account commercial roles Given PIVA',
                '[CONTACT CENTER] [INT] [STG] - Get Access token portale titolari',
                '[CONTACT CENTER] [INT] [STG] - Read user details given CF List',
                '[CONTACT CENTER] [INT] [STG] - Read user details given PAN List',
                '[CONTACT] [INT] [STG] - Get contact subscription details',
                '[INQPAC] [INT] - Check PAN is registered on SIA',
                '[K6] [INT] - Burned K6',
                '[K6] [INT] [STG] - Delete K6',
                '[K6] [INT] [STG] - Set K6',
                '[K6] [INT] [STG] - Lock K6',
                '[MASSIVE] [STG] - Get PAN Alias, ABI, POSI and User details']

    }
  ])
  .then((answers) => {
    // Use user feedback for... whatever!!
  
    console.log(answers);
  })