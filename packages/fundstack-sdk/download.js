const https = require('https');
const fs = require('fs');

const contractsServer = 'https://betanet.contracts.fundstack.io';
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

download(contractsServer + '/v1/fund/bytes/approval.json', 'src/contracts/v1/fund/bytes/approval.json', () => {
    console.log('Downloaded ' + contractsServer + '/v1/fund/bytes/approval.json')
});
download(contractsServer + '/v1/fund/bytes/clear.json', 'src/contracts/v1/fund/bytes/clear.json', () => {
    console.log('Downloaded ' + contractsServer + '/v1/fund/bytes/clear.json')
});
