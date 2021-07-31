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

download(contractsServer + '/compiled/approval.json', 'src/remote/contracts/compiled/approval.json', () => {
    console.log('Downloaded ' + contractsServer + '/compiled/approval.json')
});
download(contractsServer + '/compiled/clear.json', 'src/remote/contracts/compiled/clear.json', () => {
    console.log('Downloaded ' + contractsServer + '/compiled/clear.json')
});
download(contractsServer + '/compiled/escrow.json', 'src/remote/contracts/compiled/escrow.json', () => {
    console.log('Downloaded ' + contractsServer + '/compiled/escrow.json')
});
download(contractsServer + '/approval.teal', 'src/remote/contracts/approval.teal', () => {
    console.log('Downloaded ' + contractsServer + '/approval.teal')
});
download(contractsServer + '/clear.teal', 'src/remote/contracts/clear.teal', () => {
    console.log('Downloaded ' + contractsServer + '/clear.teal')
});
download(contractsServer + '/escrow.teal', 'src/remote/contracts/escrow.teal', () => {
    console.log('Downloaded ' + contractsServer + '/escrow.teal')
});