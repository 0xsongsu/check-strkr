const fs = require('fs');
const axios = require('axios');
const https = require('https');

async function main() {
  // 读取 CSV 文件内容
  const csvData = fs.readFileSync('wallet.csv', 'utf-8');
  const lines = csvData.split('\n');

  // 循环处理每一行数据
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  const rowData = line.split(',');
  let address = rowData[0].trim().toLowerCase(); // 转换为小写
  let rank = rowData[1].trim();

  // 构造请求的 URL
  const url = `https://api.rhino.fi/activity-trackers/trackers/ZKSYNC?address=${address}`;

  // 创建 HTTPS Agent，忽略证书验证
  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  try {
    // 发送 HTTPS GET 请求
    const response = await axios.get(url, {
      httpsAgent: agent,
    });

    // 从响应中获取数据，并更新金额
    const topPercentage = response.data.ranking.topPercentage;
    const rankValue = (topPercentage * 100).toFixed(2);
    console.log(`地址 ${address} 的排名为：${rankValue}%`);

    let logMessage = ''; // 初始化日志信息

    if (parseFloat(rankValue) < 30) {
      // 输出“恭喜”日志
      logMessage = `You're eligible`;
    } else {
      // 输出“不满足条件”日志
      logMessage = `You're not eligible.`;
    }

    // 更新 CSV 行数据
    lines[i] = `${address},${logMessage}`;
    console.log(logMessage);
  } catch (error) {
    // 输出“请求失败”日志
    console.log(`请求失败：${error.message}`);
  }
};
  // 将更新后的数据写回 CSV 文件
  const updatedCsvData = lines.join('\n');
  fs.writeFileSync('wallet.csv', updatedCsvData);
}

// 执行主函数
main();
