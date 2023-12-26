const fs = require('fs');
const axios = require('axios');
const https = require('https');

async function main() {
  const csvData = fs.readFileSync('wallet.csv', 'utf-8');
  const lines = csvData.split('\n');

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  const rowData = line.split(',');
  let address = rowData[0].trim().toLowerCase();

  const url = `https://starkrocket.xyz/api/check_wallet?address=${address}`;

  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  try {
    const response = await axios.get(url, {
      httpsAgent: agent,
    });

    const amount = response.data.result.points;
    console.log(`地址 ${address} 的数量为：${amount}`);

    let logMessage = `${amount}`;

  lines[i] = `${address},${logMessage}`;
} catch (error) {
  console.log(`请求失败：${error.message}`);
}
};
  const updatedCsvData = lines.join('\n');
  fs.writeFileSync('wallet.csv', updatedCsvData);
}

main();
