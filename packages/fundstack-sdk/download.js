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
    download(contractsUrl + '/v1/pool/bytes/approval.json',  'src/contracts/' + network + '/v1/pool/bytes/approval.json', () => {
        console.log('Downloaded ' + contractsUrl + '/v1/pool/bytes/approval.json')
    });
    download(contractsUrl + '/v1/pool/bytes/clear.json',  'src/contracts/' + network + '/v1/pool/bytes/clear.json', () => {
        console.log('Downloaded ' + contractsUrl + '/v1/pool/bytes/clear.json')
    });
}

downloadContracts('betanet', 'https://betanet-contracts-p4nsc39q3-fundstack.vercel.app');
downloadContracts('testnet', 'https://testnet-contracts-7nbce948x-fundstack.vercel.app');

