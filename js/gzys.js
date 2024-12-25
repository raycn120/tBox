
const webSite = 'https://api.zaqohu.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

//console.log('运行脚本');
//let key = Crypto.MD5('123456').toString();
//console.log(key);
//homeContent();
//categoryContent("6|9384",1,null);
//detailContent("66477");
//playerContent("https://www.czzy77.com/v_play/bXZfMTg5NTEtbm1fNDA=.html");
//searchContent("斗罗大陆");


//获取影视列表
async function categoryContent(tid, pg = 1, extend) {
    let backData = new RepVideo();
    try {
        let listUrl = webSite;
        let params='';
        const tidArray = tid.split('|');
if (tidArray[1]) {
    listUrl = listUrl + '/H5/Category/GetModuleList';
    params = { show_id: tidArray[1], show_pid: tidArray[0], pageSize: 24, page: pg };
} else {
    listUrl = listUrl + '/H5/Category/GetChoiceList';
    params = { pid: tidArray[0], pageSize: 24, page: pg };
}
        let pro = await req(listUrl, {
            method: 'POST',
            headers: {
                'User-Agent': UA,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ params: aesEncode(JSON.stringify(params)) }),
        });
        let proData = await pro.text();
        let obj2 = JSON.parse(proData);
        let decryptBody = aesDecode(obj2.data);
        let obj = JSON.parse(decryptBody);
        let allVideo = obj.list;
        let videos = [];
        allVideo.forEach((e) => {
            let vodUrl = e.vod_id || ''
            let vodPic = e.c_pic || e.vod_pic
            let vodName = e.c_name || e.vod_name
            let vodDiJiJi = e.vod_continu || ''
            let videoDet = new VideoList()
            videoDet.vod_id = +vodUrl
            videoDet.vod_pic = vodPic
            videoDet.vod_name = vodName.trim()
            videoDet.vod_remarks = vodDiJiJi.trim()
            videos.push(videoDet)
        });
        backData.list = videos;
    } catch (error) {
        //console.error('Error in fetchData:', error);
        backData.msg = error.statusText;
    }
    //console.log(JSON.stringify(backData));
    return JSON.stringify(backData);
}

//获取影视详情信息
async function detailContent(ids) {
    await toast('尝试获取影片信息',2);
    let backData = new RepVideo();
    const webUrl = `${webSite}/H5/Resource/GetVodInfo`
    try {
        let params = { vod_id: ids };
        let pro = await req(webUrl, {
            method: 'POST',
            headers: {
                'User-Agent': UA,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ params: aesEncode(JSON.stringify(params)) }),
        });
        let proData = await pro.text();
        let obj2 = JSON.parse(proData);
        let decryptBody = aesDecode(obj2.data);
        let obj = JSON.parse(decryptBody).vodInfo;
        let vod_content = obj.vod_use_content;
        let vod_pic = obj.pic;
        let vod_name = obj.vod_name;
        let vod_year = obj.vod_year || '';
        let vod_director = obj.vod_director || '';
        let vod_actor = obj.vod_actor || '';
        let vod_area = obj.vod_area || '';
        await toast('尝试获取剧集信息',2);
        let playlistUrl = `${webSite}/H5/Resource/GetOnePlayList`
        let params2 = { vod_id: ids, pageSize: 10000, page: 1 };
        let res = await req(playlistUrl, {
            method: 'POST',
            headers: {
                'User-Agent': UA,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ params: aesEncode(JSON.stringify(params2)) }),
        });
        let playData = await res.text();
        let obj3 = JSON.parse(playData);
        let decryptBody2 = aesDecode(obj3.data);
        let obj4 = JSON.parse(decryptBody2);
        //let vod_play_url = obj4.urls.map((item) => item.name + '$' + item.url).join('#');
        let vod_play_url = obj4.urls.map((item) => {
    let name = item.name || '正片'; // 如果 item.name 为空，则使用 '正品'
    return name + '$' + item.url;
}).join('#');
        let detModel = new VideoDetail();
        let videos = [];
        detModel.vod_year = vod_year;
        detModel.vod_director = vod_director;
        detModel.vod_actor = vod_actor;
        detModel.vod_area = vod_area;
        detModel.vod_content = vod_content.replace(/\s+/g, '');
        detModel.vod_pic = vod_pic;
        detModel.vod_name = vod_name;
        detModel.vod_play_from = '播放列表';
        detModel.vod_play_url = vod_play_url;
        detModel.vod_id = ids;
        videos.push(detModel);
        backData.list = videos;
    } catch (error) {
        //console.error('Error in fetchData:', error);
        backData.msg = error.statusText;
    }
    //console.log(JSON.stringify(backData));
    return JSON.stringify(backData);
}

//获取首页分类
async function homeContent() {
    let backData = new RepVideo();
    try {
        let list = [];
        let allClass = [
            {
                type_id: '3|',
                type_name: '电影',
            },
            {
                type_id: '4|',
                type_name: '电视剧',
            },
            {
                type_id: '5|',
                type_name: '动漫',
            },
            {
                type_id: '6|',
                type_name: '综艺',
            },
            {
                type_id: '3|19260',
                type_name: 'TC抢先看',
            },{
                type_id: '3|15649',
                type_name: '院线大片',
            },{
                type_id: '3|12814',
                type_name: '网络新片',
            },{
                type_id: '3|9153',
                type_name: '动作片',
            },{
                type_id: '3|12558',
                type_name: '犯罪片',
            },{
                type_id: '3|14',
                type_name: '喜剧片',
            },{
                type_id: '3|15511',
                type_name: '惊悚恐怖片',
            },{
                type_id: '3|11517',
                type_name: '科幻魔幻片',
            },{
                type_id: '3|466',
                type_name: '情感剧情片',
            },{
                type_id: '3|15510',
                type_name: 'Netflix电影',
            },{
                type_id: '4|17473',
                type_name: '港剧',
            },{
                type_id: '4|15386',
                type_name: '高分大陆剧',
            },{
                type_id: '4|17084',
                type_name: '高分台剧',
            },{
                type_id: '5|127',
                type_name: '国产动漫',
            },{
                type_id: '5|446',
                type_name: '日本动漫',
            },{
                type_id: '5|128',
                type_name: '欧美动漫',
            },{
                type_id: '5|14182',
                type_name: '动漫电影',
            },{
                type_id: '5|6175',
                type_name: '今日动漫',
            },{
                type_id: '5|10772',
                type_name: '必追动漫',
            },{
                type_id: '5|12655',
                type_name: '奇幻番剧榜',
            },{
                type_id: '5|8101',
                type_name: '热血番剧榜',
            },{
                type_id: '6|6663',
                type_name: '热门综艺',
            },{
                type_id: '6|14244',
                type_name: 'NetFlix综艺',
            },{
                type_id: '6|7017',
                type_name: '日韩综艺',
            },{
                type_id: '6|9384',
                type_name: '卫视综艺',
            },
        ];
        //console.log(allClass.length);
        allClass.forEach((e) => {
            let videoClass = new VideoClass()
            videoClass.type_id = e.type_id
            videoClass.type_name = e.type_name
            list.push(videoClass)
        });
        backData.class = list;
    } catch (error) {
        //console.error('Error in fetchData:', error);
        backData.msg = error.statusText;
    }
    //console.log(JSON.stringify(backData));
    return JSON.stringify(backData);
}


function aesEncode(str) {
    const key = Crypto.enc.Utf8.parse('181cc88340ae5b2b')
    const iv = Crypto.enc.Utf8.parse('4423d1e2773476ce')

    let encData = Crypto.AES.encrypt(str, key, {
        iv: iv,
        mode: Crypto.mode.CBC,
        padding: Crypto.pad.Pkcs7,
    })
    return encData.ciphertext.toString(Crypto.enc.Hex)
}

function aesDecode(str) {
    const key = Crypto.enc.Utf8.parse('181cc88340ae5b2b')
    const iv = Crypto.enc.Utf8.parse('4423d1e2773476ce')

    str = Crypto.enc.Hex.parse(str)
    return Crypto.AES.decrypt({ ciphertext: str }, key, {
        iv: iv,
        mode: Crypto.mode.CBC,
        padding: Crypto.pad.Pkcs7,
    }).toString(Crypto.enc.Utf8)
}


//解析获取播放地址
async function playerContent(vod_id) {
    //await toast('正在分析直链...',2);
    let backData = new RepVideoPlayUrl();
    const headers = {'User-Agent': UA};
    backData.url=vod_id;
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
        let pro = await req(url, {
            headers: {
                'User-Agent': UA
            },
        });
        let proData = await pro.text();
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
