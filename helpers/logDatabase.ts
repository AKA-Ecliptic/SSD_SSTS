import fs from 'fs';
import { join } from 'path';

const today: string = new Date().toISOString().split('T')[0];
const fileOut: string = join(__dirname, `../logs/sequelize/sequelize_logs(${today}).txt`);

export default function logDB(data: string){
    let timestamp: string = new Date().toISOString().split('T')[1].split('.')[0];
    data = `${timestamp} | ${data}\n`;

    if(fs.existsSync(fileOut)){
        fs.appendFile(fileOut, data, { encoding: 'utf-8' }, () => { });
    }else{
        fs.writeFile(fileOut, data, { encoding: 'utf-8' }, () => { });
    }
}
