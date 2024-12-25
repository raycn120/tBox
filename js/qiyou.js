const webSite = 'http://www.qiyoudy4.com';
const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', };

//homeContent();
//categoryContent("2",1,null);
//detailContent("/view/33495.html");
//playerContent("/play/33495-0-0.html");
//searchContent("斗罗大陆");

//获取影视列表
async function categoryContent(tid, pg = 1, extend) {
    let backData = new RepVideo();
    try {
        let listUrl = webSite + `/list/${tid}_${pg}.html`;
        let pro = await req(listUrl, { headers: headers });
        const proData = await pro.text();
        console.log(proData);
        const $ = cheerio.load(proData);
        let allVideo = $('.stui-vodlist__box');
        let videos = [];
        allVideo.each((_, e) => {
            let url = $(e).find('a').attr('href');
            let name = $(e).find('a').attr('title');
            let pic = $(e).find('a').attr('data-original');
            let remarks = $(e).find('span.pic-text').text();
            let videoDet = new VideoList();
            videoDet.vod_id = url;
            videoDet.vod_pic = pic;
            videoDet.vod_name = name;
            videoDet.vod_remarks = remarks;
            videos.push(videoDet);
        })
        backData.list = videos;
    } catch (error) {
        console.error('Error in fetchData:', error);
        backData.msg = error.statusText;
    }
    console.log(JSON.stringify(backData));
    return JSON.stringify(backData);
}

//获取影视详情信息
async function detailContent(ids) {
    let backData = new RepVideo();
    const webUrl = webSite + ids;
    try {
        const pro = await req(webUrl, { headers: headers });
        const proData = await pro.text();
        //console.log(proData);
        const $ = cheerio.load(proData);
        let vod_content = $('meta[property=og:description]').attr('content');
        let vod_pic = $('.stui-vodlist__thumb img').attr('data-original');
        let vod_name = $('.stui-vodlist__thumb').attr('title');
        let vod_year = '';
        let vod_director = $('meta[property=og:video:director]').attr('content');
        let vod_actor = $('meta[property=og:video:actor]').attr('content');
        let vod_area = $('meta[property=og:area]').attr('content');
        let playlist = $('.stui-content__playlist');
        let playSources = $('.nav.nav-tabs.pull-right li a');
        let vod_play_url = [];
        let vod_play_from = [];
        playlist.each((index, element) => {
            let eps = $(element).find('li a');
            let temp = '';
            eps.each((index, e) => {
                let name = $(e).text();
                let url = $(e).attr('href');
                temp += `${name}$${url}`;
                if (index !== eps.length - 1) {
                    temp += '#';
                }
            })
            vod_play_url.push(temp);
        })
        playSources.each((index, element) => {
            vod_play_from.push($(element).text().trim());
        });
        let detModel = new VideoDetail();
        let videos = [];
        detModel.vod_year = vod_year;
        detModel.vod_director = vod_director;
        detModel.vod_actor = vod_actor;
        detModel.vod_area = vod_area;
        detModel.vod_content = vod_content;
        detModel.vod_pic = vod_pic;
        detModel.vod_name = vod_name;
        detModel.vod_play_from = vod_play_from.join('$$$')
        detModel.vod_play_url = vod_play_url.join('$$$');
        detModel.vod_id = ids;
        videos.push(detModel);
        backData.list = videos;
    } catch (error) {
        console.error('Error in fetchData:', error);
        backData.msg = error.statusText;
    }
    console.log(JSON.stringify(backData));
    return JSON.stringify(backData);
}

//获取首页分类
async function homeContent() {
    let backData = new RepVideo();
        // 定义分类数据
        const classData = [
            { "type_id": 1, "type_name": "电影" },
            { "type_id": 2, "type_name": "电视剧" },
            { "type_id": 3, "type_name": "动漫" },
            { "type_id": 4, "type_name": "综艺" }
        ];
        backData.class = classData;
        //console.log(JSON.stringify(backData));
        return JSON.stringify(backData);
}

//解析获取播放地址
async function playerContent(vod_id) {
    let backData = new RepVideoPlayUrl();
    let reqUrl = webSite + vod_id;
    try {
        const pro = await req(reqUrl, { headers: headers });
        const proData = await pro.text();
        let $ = cheerio.load(proData);
        let iframe = $('iframe').attr('src');
        let player = await req(iframe, { headers: headers });
        const playerData = await player.text();
        $ = cheerio.load(playerData);
        $('script').each((_, e) => {
            if ($(e).text().includes('DPlayer')) {
                let playUrl = $(e).text().match(/vid="(.*?)";/)[1];
                backData.url = playUrl;
                backData.header = headersToString(headers);
                //backData.header = '';
                backData.parse = 1;  //直链
                backData.playUrl = '';
            }
        })
        //console.log(JSON.stringify(backData));
    } catch (error) {
        console.error('Error in fetchData:', error);
        backData.msg = error.statusText;
    }
    console.log(JSON.stringify(backData));
    return JSON.stringify(backData);
}

// post搜索例子
async function searchContent(keyword) {
    let backData = new RepVideo();
    try {
        let searchUrl = `${webSite}/search.php`;
        console.log(searchUrl);
        let pro = await req(searchUrl, {
            method: 'POST',
            headers: { 'user-agent': headers['User-Agent'], 'content-type': 'application/x-www-form-urlencoded' },
            body: `searchword=${encodeURIComponent(keyword)}`,
        })
        const proData = await pro.text();
        let $ = cheerio.load(proData);
        let allVideo = $('.stui-vodlist__media > li');
        let videos = [];
        allVideo.each((_, e) => {
            let url = $(e).find('a').attr('href');
            let name = $(e).find('a').attr('title');
            let pic = $(e).find('a').attr('data-original');
            let remarks = $(e).find('span.pic-text').text();
            let videoDet = new VideoList();
            videoDet.vod_id = url;
            videoDet.vod_pic = pic;
            videoDet.vod_name = name;
            videoDet.vod_remarks = remarks;
            videos.push(videoDet);
        })
        backData.list = videos;
    } catch (error) {
        console.error('Error in fetchData:', error);
        backData.msg = error.statusText;
    }
    console.log(JSON.stringify(backData));
    return JSON.stringify(backData);
}
