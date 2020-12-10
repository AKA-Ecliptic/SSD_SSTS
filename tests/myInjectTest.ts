import { sequelize } from '../config/config';
import { User } from '../models/User';

async function test(): Promise<any>{

    sequelize.authenticate();

    let result1, result2, result3, result4, result5: string;

    let response1: any = await User.findOne({ where: {_id: "client"} });
    let response2: any = await User.findOne({ where: {_id: "?;DROP TABLE `tickets`;"} });
    let response3: any = await User.findOne({ where: {_id: "?';DROP TABLE `tickets`;"} });
    let response4: any = await User.findOne({ where: {_id: "?\';DROP TABLE `tickets`;"} });
    let response5: any = await User.findOne({ where: {_id: "?'';DROP TABLE `tickets`;"} });
    
    result1 = (response1 instanceof Object) ? 'PASSED' : 'FAILED'; //Expect valid query excepted, object to be returned
    result2 = (response2) ? 'FAILED' : 'PASSED'; //Expect injection failed, null to be returned
    result3 = (response3) ? 'FAILED' : 'PASSED'; //Expect injection failed, null to be returned
    result4 = (response4) ? 'FAILED' : 'PASSED'; //Expect injection failed, null to be returned
    result5 = (response5) ? 'FAILED' : 'PASSED'; //Expect injection failed, null to be returned

    let results: string[] = [result1, result2, result3, result4, result5];

    for(let r in results) {
        console.log(`Test ${r} | ${results[r]}`);
    }
}

test();
