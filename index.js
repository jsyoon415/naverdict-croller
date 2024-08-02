const puppeteer = require('puppeteer');
const fs = require('fs');

const queries = ['your', 'word', 'list'];

const getHtml = async (query, idx) => {
    let hasError = false;
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto(`https://en.dict.naver.com/#/search?query=${query}`);
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    setTimeout(async () => {
        let data = await page.$('#searchPage_entry > div > div:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > p');
        let evalData = await page.evaluate((element) => {
            return element.textContent;
        }, data);

        fs.readFile('output.md', 'utf-8', (err, d1) => {
            if (err) {
                hasError = true;
                console.log(`❌ Word ${idx + 1} Failed : \n${err}`);
                return;
            } else {
                var newValue = d1 + '\n' + '# ' + query + '\n' + evalData.trim();
                console.log();

                fs.writeFile('output.md', newValue, (e) => {
                    if (e) {
                        hasError = true;
                        console.log(`❌ Word ${idx + 1} Failed : \n${e}`);
                        return;
                    }
                });
            }
        });

        await browser.close();
        if (!hasError) console.log(`✅ Word ${idx + 1} Success`);
    }, 1250);
};
fs.writeFileSync('output.md', '', 'utf-8');
for (let i = 0; i < queries.length; i++) getHtml(queries[i], i);
