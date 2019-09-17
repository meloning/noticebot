const client = require('cheerio-httpcli');

let url = 'https://work.mma.go.kr/caisBYIS/board/boardList.do?menu_id=m_m8_6&tmpl_id=1&gesipan_gbcd=13';
let param = {};

client.fetch(url, param, (err, $, res) => {
    if (err) {
        console.log(err);
        return;
    }
    let newPostCount = 0;
    $(".brd_list_n > tbody > tr > td").each(function (index, element) {
        if ($(this).find('img').attr('alt') === '새글') {
            newPostCount++;
            console.log($(this).find('a').text());
        }
    });
    console.log(newPostCount);
});