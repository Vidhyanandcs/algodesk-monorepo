import https from 'https';
import fs from 'fs';

const contractsServer = 'https://contracts.fundstack.io';
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

download(contractsServer + '/compiled/approval.json', 'src/contracts/teal/compiled/approval.json', () => {
    console.log('Downloaded ' + contractsServer + '/compiled/approval.json')
});
download(contractsServer + '/compiled/clear.json', 'src/contracts/teal/compiled/clear.json', () => {
    console.log('Downloaded ' + contractsServer + '/compiled/clear.json')
});
download(contractsServer + '/compiled/escrow.json', 'src/contracts/teal/compiled/escrow.json', () => {
    console.log('Downloaded ' + contractsServer + '/compiled/escrow.json')
});
download(contractsServer + '/approval.teal', 'src/contracts/teal/approval.teal', () => {
    console.log('Downloaded ' + contractsServer + '/approval.teal')
});
download(contractsServer + '/clear.teal', 'src/contracts/teal/clear.teal', () => {
    console.log('Downloaded ' + contractsServer + '/clear.teal')
});
download(contractsServer + '/escrow.teal', 'src/contracts/teal/escrow.teal', () => {
    console.log('Downloaded ' + contractsServer + '/escrow.teal')
});