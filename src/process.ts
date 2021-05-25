import * as path from 'path';
import * as fs from 'fs';
import { Decimal } from 'decimal.js';

// /root/sigma/data/21-05-10
const rootDir = process.argv[2];

const ReserveCoinDefaultPrice = new Decimal('1000000');
const MinBoxValue = new Decimal('10000000');

const Zero = new Decimal('0');
const One = new Decimal('1');

type Item = {
    "time": string;
    "reserveRatio": Decimal;
    "stableCoinPrice": Decimal;
    "stableCoinRatio": Decimal;
    "reserveCoinPrice": Decimal;
    "reserveCoinRatio": Decimal;
  }

const out = fs.readdirSync(rootDir).reduce((acc: Item[], file) => {
    if (file.startsWith('bank')) {
        const [year, month, day, hour, minute] = file.split('.')[1].split('-').map(n => parseInt(n, 10));
        try {
            const bankData = JSON.parse(fs.readFileSync(path.join(rootDir, file), 'utf-8'));
            const oracleData = JSON.parse(fs.readFileSync(path.join(rootDir, file.replace('bank', 'oracle')), 'utf-8'));
            const bankValue = new Decimal(bankData.items[0].value);
            const cirSigmaUsd = new Decimal(bankData.items[0].additionalRegisters.R4.renderedValue);
            const cirSigmaRsv = new Decimal(bankData.items[0].additionalRegisters.R5.renderedValue);
            const oracleRate = new Decimal(oracleData.items[0].additionalRegisters.R4.renderedValue).div(new Decimal('1000000000'));


            const baseReserves = bankValue.lt(MinBoxValue) ? Zero : bankValue;
            const numCirculatingStableCoins = cirSigmaUsd.div(new Decimal('100'));
            const reserveRatio = baseReserves.div(numCirculatingStableCoins).div(oracleRate).div(new Decimal('10000000'));


            const baseReservesNeeded = numCirculatingStableCoins.mul(oracleRate);
            const liabilities = (numCirculatingStableCoins.eq(Zero) ? Zero : Decimal.min(baseReservesNeeded, baseReserves)).mul(new Decimal('1000000000'));
            const stableCoinPrice = numCirculatingStableCoins.eq(Zero) || oracleRate.lt(liabilities.div(numCirculatingStableCoins)) ? oracleRate : liabilities.div(numCirculatingStableCoins);
            const stableCoinRatio = One.div(stableCoinPrice);


            const equity = baseReserves.lte(liabilities) ? Zero : baseReserves.sub(liabilities);
            const numCirculatingReserveCoins = cirSigmaRsv;
            const reserveCoinPrice = (numCirculatingReserveCoins.lte(One) || equity.eq(Zero) ? ReserveCoinDefaultPrice : equity.div(numCirculatingReserveCoins)).div(new Decimal('1000000000'));
            const reserveCoinRatio = One.div(reserveCoinPrice);

            return [
                ...acc,
                {
                    time: new Date(Date.UTC(year + 2000, month - 1, day, hour, minute)).toISOString(),
                    reserveRatio,
                    stableCoinPrice,
                    stableCoinRatio,
                    reserveCoinPrice,
                    reserveCoinRatio
                },
            ];
        } catch (e) {
            return acc;
        }
    } else {
        return acc;
    }
}, []);

console.log(JSON.stringify(out));
