const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const yaml = require('js-yaml');

const app = express();
app.use(bodyParser.json());

// Setting for Hyperledger Fabric
const { Wallets, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
// const ccpPath = path.resolve(__dirname, '.',  'connection-org3.json');
const ccpPath = '../gateway/connection-org3.yaml'
const userName = 'appUser';
const walletPath = '../identity/user/appUser/wallet';



app.post('/api/create', async function (req, res) {
    try {

        //1. Connection Using Wallet and Access to the Gateway

        // 1.1. Loading of Wallet Identity
        // A wallet stores a collection of identities for use
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        //1.2. Check to see if we've already enrolled the user.
        // The user have to be created au prealable
        const identity = await wallet.get(userName);
        if (!identity) {
            console.log(`An identity for the user "${userName}" does not exist in the wallet`);
            console.log('Ask Admin to Run the EnrollUser application before retrying');
            return;
        }
        //1.3. Load info from connection-orgX.yaml (see ccpPath)
        let connectionProfile = yaml.safeLoad(fs.readFileSync(ccpPath, 'utf8'));
        
        //1.4 Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };
        // Connect to gateway using application specified parameters
        console.log('****Connect to Fabric gateway.****');

        //1.5 Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(connectionProfile, connectionOptions);

        //2. Access PaperNet network
        console.log('****Use network channel: mychannel.****');

        //2.1 Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        //2.2. Get addressability to vdx paper contract
        console.log('Use org.copnet.vdxpaper smart contract.');
        const contract = network.getContract('papervdx');

        //3. SubmitTransaction
        //3.1  create vdx paper
        console.log('Submit vdx paper create transaction.');

        //create transaction - requires 10 arguments, ex: ('create', 'PC', '00001', '2022-11-21', '35464646', '2', 'John Doe', 'NAS003', 'Ford Escape 2014, XX', '')
        let data = req.body
        const result = await contract.submitTransaction('create', data.issuer, data.paperNumber, data.createDateTime,
        data.nid, data.nvh, data.fullname, data.nas, data.lines, data.docHash );

        //3.2 process response
        console.log(`Process create transaction response. , Result is: ${result.toString()}`);

        res.status(200).json({response: result.toString()});

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to process Create transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }
});

app.post('/api/issue', async function (req, res) {
    try {

        //1. Connection Using Wallet and Access to the Gateway

        // 1.1. Loading of Wallet Identity
        // A wallet stores a collection of identities for use
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        //1.2. Check to see if we've already enrolled the user.
        // The user have to be created au prealable
        const identity = await wallet.get(userName);
        if (!identity) {
            console.log(`An identity for the user "${userName}" does not exist in the wallet`);
            console.log('Ask Admin to Run the EnrollUser application before retrying');
            return;
        }
        //1.3. Load info from connection-orgX.yaml (see ccpPath)
        let connectionProfile = yaml.safeLoad(fs.readFileSync(ccpPath, 'utf8'));
        
        //1.4 Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };
        // Connect to gateway using application specified parameters
        console.log('****Connect to Fabric gateway.****');

        //1.5 Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(connectionProfile, connectionOptions);

        //2. Access PaperNet network
        console.log('****Use network channel: mychannel.****');

        //2.1 Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        //2.2. Get addressability to vdx paper contract
        console.log('Use org.copnet.vdxpaper smart contract.');
        const contract = network.getContract('papervdx');

        //3. SubmitTransaction
        //3.1  issue vdx paper
        console.log('Submit vdx paper issue transaction.');

        //issue transaction - requires 6 argument, ex: ('issue', 'PC', '00001', '2022-11-21', 'PC', 'RQ')
        let data = req.body
        const result = await contract.submitTransaction('issue', data.issuer, data.paperNumber, data.issueDateTime, 
        data.currentOperator, data.newOperator);

        //3.2 process response
        console.log(`Process issue transaction response. , Result is: ${result.toString()}`);

        res.status(200).json({response: result.toString()});

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to process issue transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }
});

app.post('/api/pay', async function (req, res) {
    try {

        //1. Connection Using Wallet and Access to the Gateway

        // 1.1. Loading of Wallet Identity
        // A wallet stores a collection of identities for use
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        //1.2. Check to see if we've already enrolled the user.
        // The user have to be created au prealable
        const identity = await wallet.get(userName);
        if (!identity) {
            console.log(`An identity for the user "${userName}" does not exist in the wallet`);
            console.log('Ask Admin to Run the EnrollUser application before retrying');
            return;
        }
        //1.3. Load info from connection-orgX.yaml (see ccpPath)
        let connectionProfile = yaml.safeLoad(fs.readFileSync(ccpPath, 'utf8'));
        
        //1.4 Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };
        // Connect to gateway using application specified parameters
        console.log('****Connect to Fabric gateway.****');

        //1.5 Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(connectionProfile, connectionOptions);

        //2. Access PaperNet network
        console.log('****Use network channel: mychannel.****');

        //2.1 Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        //2.2. Get addressability to vdx paper contract
        console.log('Use org.copnet.vdxpaper smart contract.');
        const contract = network.getContract('papervdx');

        //3. SubmitTransaction
        //3.1  pay vdx paper
        console.log('Submit vdx paper pay transaction.');

        //pay transaction - requires 8 argument, ex: ('pay', 'PC', '00001', 'PC', 'SAAQ', '2022-11-21', 'dochashTestfeeedkdkdkd','RDRCF');
        let data = req.body
        const result = await contract.submitTransaction('pay', data.issuer, data.paperNumber, data.currentOperator, 
        data.newOperator, data.payDateTime, data.docHash, data.reference);

        //3.2 process response
        console.log(`Process pay transaction response. , Result is: ${result.toString()}`);

        res.status(200).json({response: result.toString()});

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to process pay transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }
});


app.listen(8080);