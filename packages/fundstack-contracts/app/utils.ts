import readFile from 'read-file';
import write from 'write';
import {Algodesk, getNetwork} from "@algodesk/core";

export async function compile(programTealPath: string, programBytesPath: string, network: string) {
    console.log('******************************************');
    console.log(programTealPath);
    console.log(programBytesPath);

    const algodesk = new Algodesk(getNetwork(network));

    const programSource = readFile.sync(programTealPath);
    const compiled = await algodesk.applicationClient.compileProgram(programSource);
    write.sync(programBytesPath, JSON.stringify(compiled), { newline: true });

    console.log(compiled);
    console.log('******************************************');
}