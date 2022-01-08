const https = require('https');
const fs = require('fs');

const download = (url, dest, callback) => {
    let file = fs.createWriteStream(dest);
    https.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close();
            callback();
        });
    });
}

function downloadContracts(network, contractsUrl) {
    download(contractsUrl + '/v1/fund/bytes/approval.json',  'src/contracts/' + network + '/v1/fund/bytes/approval.json', () => {
        console.log('Downloaded ' + contractsUrl + '/v1/fund/bytes/approval.json')
    });
    download(contractsUrl + '/v1/fund/bytes/clear.json',  'src/contracts/' + network + '/v1/fund/bytes/clear.json', () => {
        console.log('Downloaded ' + contractsUrl + '/v1/fund/bytes/clear.json')
    });
}

downloadContracts('betanet', 'https://betanet.contracts.fundstack.io');
downloadContracts('testnet', 'https://testnet-contracts.vercel.app');

