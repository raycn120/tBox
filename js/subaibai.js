const webSite = 'https://www.subaibaiys.com';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
let cookie = '';
const ignoreClassName = ['首页', '公告留言'];
//console.log('运行脚本');
//let key = Crypto.MD5('123456').toString();
//console.log(key);
//homeContent();
//categoryContent("https://www.subaibaiys.com/anime-drama",2,null);
//detailContent("https://www.subaibaiys.com/movie/53098.html");
//playerContent("https://www.subaibaiys.com/v_play/bXZfNTY4OTMtbm1fMQ==.html");
//searchContent("斗罗大陆");
//sliderBypass('https://www.subaibaiys.com');

async function sliderBypass(url) {
    let pro = await req(url, {
        headers: {
            'User-Agent': UA,
            Cookie: cookie,
        },
    });
    let proData = await pro.text();
    const $ = cheerio.load(proData);
    if ($('title').text() === '滑动验证') {
        let slide_js = webSite + $('body script').attr('src');
        let slide_js_res = await req(slide_js, {
            headers: {
                'User-Agent': UA,
            },
        });
        let slide_js_res_data = await slide_js_res.text();
        let vd_url = webSite + slide_js_res_data.match(/\/a20be899_96a6_40b2_88ba_32f1f75f1552_yanzheng_huadong\.php\?type=.*?&key=/)[0];
        let [, key, value] = slide_js_res_data.match(/key="(.*?)",value="(.*?)";/);
        vd_url = vd_url + `${key}&value=${md5encode(stringtoHex(value))}`;
        let vd_res = await req(vd_url, {
            headers: {
                'User-Agent': UA,
                Referer: webSite + '/',
            },
        });
        let jsonHeaders = await vd_res.headers;
        // 提取 set-cookie 字段
        const headers = JSON.parse(jsonHeaders);
        const setCookie = headers["set-cookie"];
        //console.log('setCookie:' + setCookie);
        cookie = setCookie[0].split(";")[0];
        //console.log('取出cookie:' + cookie);
        pro = await req(url, {
            headers: {
                'User-Agent': UA,
                Cookie: cookie,
            },
        });
        proData = await pro.text();
    }
    function stringtoHex(acSTR) {
        var val = ''
        for (var i = 0; i <= acSTR.length - 1; i++) {
            var str = acSTR.charAt(i)
            var code = str.charCodeAt()
            val += parseInt(code) + 1
        }
        return val
    }
    function md5encode(word) {
        return Crypto.MD5(word).toString()
    }
    return proData;
}

function isIgnoreClassName(className) {
    for (let index = 0; index < ignoreClassName.length; index++) {
        const element = ignoreClassName[index];
        if (className.indexOf(element) !== -1) {
            return true;
        }
    }
    return false;
}

//获取影视列表
async function categoryContent(tid, pg = 1, extend) {
    let backData = new RepVideo();
    try {
        let listUrl = tid;
        if (pg > 1) listUrl += '/page/' + pg;
        let proData = await sliderBypass(listUrl);
        const $ = cheerio.load(proData);
        let allVideo = $('.bt_img.mi_ne_kd.mrb li');
        let videos = [];
        allVideo.each((_, e) => {
            let vodUrl = $(e).find('a').attr('href');
            let vodPic = $(e).find('img.thumb').attr('data-original');
            let vodName = $(e).find('img.thumb').attr('alt');
            let remarks = $(e).find('.jidi').text() || $(e).find('.hdinfo').text().trim();
            let videoDet = new VideoList();
            videoDet.vod_id = vodUrl;
            videoDet.vod_pic = vodPic;
            videoDet.vod_name = vodName;
            videoDet.vod_remarks = remarks;
            videos.push(videoDet);
        })
        backData.list = videos;
    } catch (error) {
        console.error('Error in fetchData:', error);
        backData.msg = error.statusText;
    }
    //console.log(JSON.stringify(backData));
    return JSON.stringify(backData);
}

//获取影视详情信息
async function detailContent(ids) {
    let backData = new RepVideo();
    const webUrl = ids;
    try {
        let proData = await sliderBypass(webUrl);
        const $ = cheerio.load(proData);
        let vod_content = $('.yp_context').text();
        let vod_pic = $('.dyimg img').attr('src');
        let vod_name = $('.moviedteail_tt h1').text();
        let detList = $('ul.moviedteail_list li');
        let vod_year = '';
        let vod_director = '';
        let vod_actor = '';
        let vod_area = '';
        let playlist = $('.stui-content__playlist');
        let playSources = $('.nav.nav-tabs.pull-right li a');
        let vod_play_from = '播放列表';
        detList.each((_, e) => {
            const element = $(e);
            if (element.text().includes('年份')) {
                vod_year = element.text().replace('年份：', '');
            } else if (element.text().includes('导演')) {
                vod_director = element.text().replace('导演：', '');
            } else if (element.text().includes('主演')) {
                vod_actor = element.text().replace('主演：', '');
            } else if (element.text().includes('地区')) {
                vod_area = element.text().replace('地区：', '');
            }
        });

        let juJiDocment = $('.paly_list_btn').find('a');
        let vod_play_url = '';
        juJiDocment.each((index, e) => {
            const element = $(e);
            vod_play_url += element.text();
            vod_play_url += '$';
            vod_play_url += element.attr('href');
            if (index !== juJiDocment.length - 1) {
                vod_play_url += '#';
            }
        });

        let detModel = new VideoDetail();
        let videos = [];
        detModel.vod_year = vod_year;
        detModel.vod_director = vod_director;
        detModel.vod_actor = vod_actor;
        detModel.vod_area = vod_area;
        detModel.vod_content = vod_content.replace(/\s+/g, '');
        detModel.vod_pic = vod_pic;
        detModel.vod_name = vod_name;
        detModel.vod_play_from = vod_play_from;
        detModel.vod_play_url = vod_play_url;
        detModel.vod_id = ids;
        videos.push(detModel);
        backData.list = videos;
    } catch (error) {
        console.error('Error in fetchData:', error);
        backData.msg = error.statusText;
    }
    //console.log(JSON.stringify(backData));
    return JSON.stringify(backData);
}

//获取首页分类
async function homeContent() {
    await toast('尝试加载分类信息',2);
    let backData = new RepVideo();
    try {
        const proData = await sliderBypass(webSite);
        const $ = cheerio.load(proData);
        let list = [];
        let allClass = $('ul.navlist a');
        allClass.each((_, e) => {
            let isIgnore = isIgnoreClassName($(e).text());
            if (isIgnore) {
                return;
            }
            let type_name = $(e).text();
            let url = $(e).attr('href');
            if (url.length > 0 && type_name.length > 0) {
                let videoClass = new VideoClass();
                videoClass.type_id = url;
                videoClass.type_name = type_name;
                list.push(videoClass);
            }
        })
        backData.class = list;
    } catch (error) {
        console.error('Error in fetchData:', error);
        backData.msg = error.statusText;
    }
    //console.log(JSON.stringify(backData));
    return JSON.stringify(backData);
}

//解析获取播放地址
async function playerContent(vod_id) {
    let backData = new RepVideoPlayUrl();
    let url = vod_id;
    const headers = {'User-Agent': UA,'Origin': 'https://www.subaibaiys.com'};
    try {
        let proData = await sliderBypass(url);
        let $ = cheerio.load(proData);
        const isVipOnly = $('.noplay').text();
        if (isVipOnly) {
            backData.msg = isVipOnly;
        }
        let iframe = $('iframe').filter((i, iframe) => $(iframe).attr('src').includes('Cloud'));
        if (0 < iframe.length) {
            let pro = await req($(iframe[0]).attr('src'), {
                headers: {
                    Referer: url,
                    'User-Agent':
                        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
                },
            });
            const iframeHtml = pro.data;
            let code = iframeHtml.match(/var url = '(.*?)'/)[1].split('').reverse().join('');
            console.log('code:'+code);
            let temp = '';
            for (let i = 0; i < code.length; i += 2) {
                temp += String.fromCharCode(parseInt(code[i] + code[i + 1], 16));
            }
            const playUrl = temp.substring(0, (temp.length - 7) / 2) + temp.substring((temp.length - 7) / 2 + 7);
            backData.url = playUrl;
        } else {
            let playUrl = 'error';
            const script = $('script');
            const js = script.filter((i, script) => $(script).text().includes('window.wp_nonce')).text() ?? '';
            const group = js.match(/(var.*)eval\((\w*\(\w*\))\)/);
            console.log('group:'+group);
            const md5 = Crypto;
            const result = eval(group[1] + group[2]);
            console.log('result2:'+result);
            playUrl = result.match(/url:.*?['"](.*?)['"]/)[1];
            console.log('playUrl:'+playUrl);
            backData.url = playUrl;
        }

    } catch (error) {
        console.error('Error in fetchData:', error);
        backData.msg = error.statusText;
    }
    backData.playUrl='';
    backData.parse = 1;
    backData.header = headersToString(headers);
    //console.log(JSON.stringify(backData));
    return JSON.stringify(backData);
}

async function searchContent(keyword) {
    let backData = new RepVideo();
    try {
        let url = webSite + `/?s=${keyword}`
        //console.log(url);
        let proData = await sliderBypass(url);
        let $ = cheerio.load(proData);
        let allVideo = $('.search_list li');
        let videos = [];
        allVideo.each((_, e) => {
            let url = $(e).find('a').attr('href');
            let name = $(e).find('img.thumb').attr('alt');
            let pic = $(e).find('img.thumb').attr('data-original');
            let subTitle = $(e).find('.jidi span').text();
            let hdinfo = $(e).find('.hdinfo .qb').text();
            let videoDet = new VideoList();
            videoDet.vod_id = url;
            videoDet.vod_pic = pic;
            videoDet.vod_name = name;
            videoDet.vod_remarks = subTitle || hdinfo;
            videos.push(videoDet);
        })
        backData.list = videos;
    } catch (error) {
        console.error('Error in fetchData:', error);
        backData.msg = error.statusText;
    }
    //console.log(JSON.stringify(backData));
    return JSON.stringify(backData);
}
