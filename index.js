const client = require('cheerio-httpcli');
let url = 'https://work.mma.go.kr/caisBYIS/board/boardList.do?menu_id=m_m8_6&tmpl_id=1&gesipan_gbcd=13';
let param = {};

const redis = require('redis');
const redisClient = redis.createClient();

const TelegramBot = require('node-telegram-bot-api');
// replace the value below with the Telegram token you receive from @BotFather
const token = '988819272:AAFTQDQbO0DRY8HrWoxavBoMFGu4ksg4moU';
const chatId = 981635602;
const bot = new TelegramBot(token, {polling: true});

const cron = require('node-cron');

let tempDate = '';

function sendMessageBot() {
    bot.sendMessage(chatId,"[JunsuAlert]");
    console.log("[INFO] SUCCESS Send Message([JunsuAlert])");
}
cron.schedule('*/30 * * * * *', function () {
    console.log("[INFO} ================== Cron Work ==================");
    client.fetch(url, param, (err, $) => {
        if (err) {
            console.log(err);
            return;
        }

        let todayDate = new Date();
        let newPostCount = 0;

        // format Date
        let year = todayDate.getFullYear();
        let month = todayDate.getMonth() + 1;
        if (month < 10) month = '0' + month;
        let date = todayDate.getDate();
        if (date < 10) date = '0' + date;

        let formattedDate = year + "-" + month + "-" + date;

        // Init todayCount key when Date changed.
        if (formattedDate !== tempDate) {
            tempDate = formattedDate;
            redisClient.set('todayCount', 1);
            console.log("[INFO] The value of todayCount is initialized because the date(" + formattedDate + ") has changed.")
        }

        $(".brd_list_n > tbody > tr > td").each(function () {
            if ($(this).find('img').attr('alt') === '새글') {
                let date = $(this).next().next().text();
                if (date === formattedDate) {
                    newPostCount++;
                }
            }
        });
        console.log("[INFO] newPostCount:" + newPostCount);

        redisClient.get('todayCount', (err, reply) => {
            console.log("[INFO] Redis todayCount:" + reply);
            if (newPostCount > reply) {
                redisClient.set('todayCount', newPostCount);
                sendMessageBot();
            }
        });
    });
});