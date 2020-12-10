import fs from 'fs';
import { join } from 'path';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

const fileOut: string = join(__dirname, `../logs/attacks/sequelize_logs.txt`);

export default function sanitiseInput(input: string | null): string {
    let timestamp: string = new Date().toISOString().split('T')[1].split('.')[0];
    
    const window: any = new JSDOM('').window;
    const DOMPurify = createDOMPurify(window);

    input = (input) ? input : '';
    
    if(input.search((/onload=|alert\(|<script/ig)) >= 0){
        let toWrite = `${timestamp} |  { ${input} }\n`;
        
        if(fs.existsSync(fileOut)){
            fs.appendFile(fileOut, toWrite, { encoding: 'utf-8' }, () => { });
        }else{
            fs.writeFile(fileOut, toWrite, { encoding: 'utf-8' }, () => { });
        }
        
        return DOMPurify.sanitize(input);
    }
    
    return input;
}
