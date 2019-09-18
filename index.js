const client = require('cheerio-httpcli');

// TODO: Redis DB Connect

let url = 'https://work.mma.go.kr/caisBYIS/board/boardList.do?menu_id=m_m8_6&tmpl_id=1&gesipan_gbcd=13';
let param = {};
let tempDate = '';

client.fetch(url, param, (err, $, res) => {
    if (err) {
        console.log(err);
        return;
    }

    let todayDate = new Date();

    if (dateToString(todayDate) !== dateToString(tempDate)) {
        tempDate = todayDate;
        // TODO: DB Count 초기화, log에 초기화한 내역 기록
    }

    let newPostCount = 0;

    $(".brd_list_n > tbody > tr > td").each(function (index, element) {
        if ($(this).find('img').attr('alt') === '새글') {
            let date = $(this).next().next().text();
            if (date === dateToString(todayDate)) {
                newPostCount++;
                // TODO: DB 값과 비교  newPostCount > DB Value -> Telegram push(log 기록)
            }
        }
    });
    console.log(newPostCount);
});

function dateToString(format) {
    let year = format.getFullYear();

    let month = format.getMonth() + 1;
    if(month<10) month = '0' + month;

    let date = format.getDate();
    if(date<10) date = '0' + date;

    return year + "-" + month + "-" + date;
}