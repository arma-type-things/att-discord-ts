import { GameDig } from 'gamedig';

async function queryGameDig() {
    const result = await GameDig.query({
        type: 'armareforger',
        host: '172.96.164.58',
        port: 7931,
        givenPortOnly: true
    });
    
    return result;
}

const response = await queryGameDig();
console.log(response);