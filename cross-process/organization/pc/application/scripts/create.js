/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access CopNet network
 * 4. Construct request to create vdx paper
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const VdxPaper = require('../../contract/lib/paper.js');

// Main program function
async function main() {

    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet('../../identity/user/appUser/wallet');

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        // const userName = 'app.user@cristal.ca';
        const userName = 'appUser';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../../gateway/connection-org3.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('****Connect to Fabric gateway.****');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('****Use network channel: mychannel.****');

        const network = await gateway.getNetwork('mychannel');

        // Get addressability to vdx paper contract
        console.log('Use org.copnet.vdxpaper smart contract.');

        const contract = await network.getContract('papervdx');

        // issue vdx paper
        console.log('Submit vdx paper create transaction.');

        const createResponse = await contract.submitTransaction('create', 'PC', '00001', '2022-11-21', '35464646', '2', 'John Doe', 
        'Ford,Escape,2014,AAAAA1AA1AA111111,Z3CXJR|Nissan,Altima,2010,BBBBB1BB1BB111111,Y2RTH4');

        // process response
        console.log('Process create transaction response.'+createResponse);

        let paper = VdxPaper.fromBuffer(createResponse);

        console.log(`${paper.issuer} vdx paper : ${paper.paperNumber} successfully create for user ${paper.fullname}`);
        console.log('Transaction complete.');

    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}
main().then(() => {

    console.log('Create program complete.');

}).catch((e) => {

    console.log('Create program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});
