import readFile from 'read-file';
import path from 'path';
import write from 'write';
import nodeWindowPolyfill from "node-window-polyfill";

nodeWindowPolyfill.register();
import {WalletSigner, Algodesk, betanet} from "@algodesk/core";

export async function compile(src: string, target: string) {

    const walletSigner = new WalletSigner();
    const algodesk = new Algodesk(betanet, walletSigner);

    const programSourcePath = path.join(__dirname, '..', '..', 'contracts', 'v1', 'teal', src);
    console.log(programSourcePath);
    const programSource = readFile.sync(programSourcePath);
    const compiled = await algodesk.applicationClient.compileProgram(programSource);

    const programCompiledPath = path.join(__dirname, '..', '..', 'contracts', 'v1', 'bytes', target);
    write.sync(programCompiledPath, JSON.stringify(compiled), { newline: true });
    console.log(compiled);
}

compile('approval.teal', 'approval.json');
compile('clear.teal', 'clear.json');