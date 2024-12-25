//当域名更换的话，修改下方网址即可
const webSite='https://hrrcjob.com';

async function 访问网页(url, method, postParams, cookie, headers, timeout = 15000, setCookieCallback) {
    // 定义请求方法
    const methods = ['GET', 'POST', 'PUT'];
    const requestMethod = methods[method] || 'GET';
  
    // 构建请求头
    const requestHeaders = {};
    if (cookie) {
      requestHeaders['Cookie'] = cookie;
    }
    if (headers) {
      headers.split('\n').forEach(header => {
        const index = header.indexOf(':');
        if (index !== -1) {
          const key = header.substring(0, index).trim();
          const value = header.substring(index + 1).trim();
          if (key && value) {
            requestHeaders[key] = value;
          }
        }
      });
    }
    // 构建请求体（仅在 POST 或 PUT 时需要）
    let body = null;
    if (requestMethod === 'POST' || requestMethod === 'PUT') {
      if (postParams) {
        body = postParams;
      }
    }
    // 构建请求配置
    const requestOptions = {
      method: requestMethod,
      headers: requestHeaders,
      body: body,
      redirect: 'follow'
    };
    // 创建一个 Promise 用于超时控制
    const fetchPromise = newfetch(url, requestOptions);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), timeout);
    });
    try {
      // 发送请求并等待响应
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      // 获取响应内容
      const responseText = await response.text();
      // 提取响应头中的 set-cookie
        const responseHeaders = JSON.parse(response.headers);
      // 解析 set-cookie 字段
      console.log('responseHeaders:',url, responseHeaders);
      let setCookie = responseHeaders['set-cookie'];
      console.log('setCookie:',url, setCookie);
      // 如果提供了 setCookieCallback，则调用它并传递 set-cookie
      if (setCookieCallback && setCookie) {
        setCookieCallback(setCookie);
      }
      // 返回结果
      return responseText;
    } catch (error) {
      throw error;
    }
  }

function newfetch(url, options) {
    options = options || {};
    return new Promise(async (resolve, reject) => {
        let request = await sendMessage("fetch", JSON.stringify({"url": url, "options": options}))
        const response = () => ({
            ok: ((request.status / 100) | 0) == 2, // 200-299
            statusText: request.statusText,
            status: request.status,
            url: request.responseURL,
            text: () => Promise.resolve(request.responseText),
            json: () => Promise.resolve(request.responseText).then(JSON.parse),
            blob: () => Promise.resolve(new Blob([request.response])),
            clone: response,
            headers: request.headers,
        })
        //console.log(request.headers);
        if (request.ok) resolve(response());
        else reject(response());
    });
}


async function homeContent() {
    try {
    const response = await 访问网页(webSite);
    const items = 文本_取中间_批量(response, '"vodId', '}', true, true);
    const list = items.map((item) => {
            const vod_name = 文本_取中间(item, 'vodName\\\":\\\"', '\\\"') || '';
            const vod_pic = 文本_取中间(item,'vodPic\\\":\\\"','\\\"') || '';
            const vod_id = 文本_取中间(item,'vodId\\\":',',') || '';
            const vod_remarks = 文本_取中间(item,'vodRemarks\\\":\\\"','\\\"') || '';
            return {
                vod_id: vod_id,
                vod_name: vod_name,
                vod_remarks: vod_remarks,
                vod_pic: vod_pic
            };
        });
    //console.log(Crypto.SHA1(Crypto.MD5('signkey').toString()).toString());
        // 定义分类数据
        const classData = [
            { "type_id": 1, "type_name": "电影" },
            { "type_id": 2, "type_name": "电视剧" },
            { "type_id": 4, "type_name": "动漫" },
            { "type_id": 3, "type_name": "综艺" }
          ];


// 定义分类数据
    const filterData = {
      "2": [
        {
          "key": "type",
          "name": "类型",
          "value": [
            { "n": "全部", "v": "" },
            { "n": "国产剧", "v": "14" },
            { "n": "欧美剧", "v": "15" },
            { "n": "港台剧", "v": "16" },
            { "n": "日韩剧", "v": "62" },
            { "n": "其他剧", "v": "68" }
          ]
        },{
          "key": "class",
          "name": "剧情",
          "value": [
            { "n": "全部", "v": "" },
            { "n": "古装", "v": "古装" },
            { "n": "战争", "v": "战争" },
            { "n": "喜剧", "v": "喜剧" },
            { "n": "家庭", "v": "家庭" },
            { "n": "犯罪", "v": "犯罪" },
            { "n": "动作", "v": "动作" },
            { "n": "奇幻", "v": "奇幻" },
            { "n": "剧情", "v": "剧情" },
            { "n": "历史", "v": "历史" },
            { "n": "短片", "v": "短片" },
            { "n": "其他", "v": "其他" },
          ]
        },
        {
          "key": "area",
          "name": "地区",
          "value": [
            { "n": "全部", "v": "" },
            { "n": "大陆", "v": "中国大陆" },
            { "n": "香港", "v": "中国香港" },
            { "n": "台湾", "v": "中国台湾" },
            { "n": "美国", "v": "美国" },
            { "n": "韩国", "v": "韩国" },
            { "n": "日本", "v": "日本" },
            { "n": "泰国", "v": "泰国" },
            { "n": "其他", "v": "其他" }
          ]
        },
        {
          "key": "year",
          "name": "年份",
          "value": [
            { "n": "全部", "v": "" },
            { "n": "2024", "v": "2024" },
            { "n": "2023", "v": "2023" },
            { "n": "2022", "v": "2022" },
            { "n": "2021", "v": "2021" },
            { "n": "2020", "v": "2020" },
            { "n": "2019", "v": "2019" },
            { "n": "2018", "v": "2018" },
            { "n": "2017", "v": "2017" },
            { "n": "2016", "v": "2016" },
            { "n": "2015", "v": "2015" },
            { "n": "2014", "v": "2014" },
            { "n": "2013", "v": "2013" },
            { "n": "2012", "v": "2012" },
            { "n": "2011", "v": "2011" },
            { "n": "2010", "v": "2010" }
          ]
        },
        {
          "key": "sortType",
          "name": "排序",
          "value": [
            { "n": "最近更新", "v": "" },
            { "n": "添加时间", "v": "2" },
            { "n": "人气", "v": "3" },
            { "n": "评分", "v": "4" }
          ]
        }
      ],
      "1": [
{
          "key": "type",
          "name": "类型",
          "value": [
            { "n": "全部", "v": "1" },
            { "n": "动作", "v": "23" },
            { "n": "喜剧", "v": "22" },
            { "n": "爱情", "v": "26" },
            { "n": "科幻", "v": "30" },
            { "n": "恐怖", "v": "36" },
            { "n": "剧情", "v": "37" },
            { "n": "战争", "v": "25" },
            { "n": "灾难", "v": "81" },
            { "n": "奇幻", "v": "87" },
            { "n": "犯罪", "v": "35" },
            { "n": "冒险", "v": "31" },
            { "n": "悬疑", "v": "27" },
            { "n": "动画", "v": "33" },
            { "n": "惊悚", "v": "34" },
            { "n": "其他", "v": "43" }
          ]
        },
        {
          "key": "area",
          "name": "地区",
          "value": [
            { "n": "全部", "v": "" },
            { "n": "大陆", "v": "中国大陆" },
            { "n": "香港", "v": "中国香港" },
            { "n": "台湾", "v": "中国台湾" },
            { "n": "美国", "v": "美国" },
            { "n": "韩国", "v": "韩国" },
            { "n": "英国", "v": "英国" },
            { "n": "日本", "v": "日本" },
            { "n": "泰国", "v": "泰国" },
            { "n": "印度", "v": "印度" },
            { "n": "法国", "v": "法国" },
            { "n": "其他", "v": "其他" }
          ]
        },
        {
          "key": "year",
          "name": "年份",
          "value": [
            { "n": "全部", "v": "" },
            { "n": "2024", "v": "2024" },
            { "n": "2023", "v": "2023" },
            { "n": "2022", "v": "2022" },
            { "n": "2021", "v": "2021" },
            { "n": "2020", "v": "2020" },
            { "n": "2019", "v": "2019" },
            { "n": "2018", "v": "2018" },
            { "n": "2017", "v": "2017" },
            { "n": "2016", "v": "2016" },
            { "n": "2015", "v": "2015" },
            { "n": "2014", "v": "2014" },
            { "n": "2013", "v": "2013" },
            { "n": "2012", "v": "2012" },
            { "n": "2011", "v": "2011" },
            { "n": "2010", "v": "2010" },
            { "n": "2009~2000", "v": "2009~2000" }
          ]
        },
        {
          "key": "sortType",
          "name": "排序",
          "value": [
            { "n": "时间", "v": "" },
            { "n": "人气", "v": "3" },
            { "n": "评分", "v": "4" }
          ]
        }
      ],
      "4": [
        {
          "key": "type",
          "name": "类型",
          "value": [
            { "n": "全部", "v": "" },
            { "n": "国产动漫", "v": "75" },
            { "n": "日韩动漫", "v": "76" },
            { "n": "欧美动漫", "v": "77" }
          ]
        },{
          "key": "class",
          "name": "剧情",
          "value": [
            { "n": "全部", "v": "" },
            { "n": "喜剧", "v": "喜剧" },
            { "n": "科幻", "v": "科幻" },
            { "n": "热血", "v": "热血" },
            { "n": "冒险", "v": "冒险" },
            { "n": "动作", "v": "动作" },
            { "n": "运动", "v": "运动" },
            { "n": "战争", "v": "战争" },
            { "n": "儿童", "v": "儿童" },
            { "n": "动画", "v": "动画" },
            { "n": "其他", "v": "其他" }
          ]
        }, {
          "key": "area",
          "name": "地区",
          "value": [
            { "n": "全部", "v": "" },
            { "n": "大陆", "v": "中国大陆" },
            { "n": "美国", "v": "美国" },
            { "n": "日本", "v": "日本" },
            { "n": "法国", "v": "法国" }
          ]
        },
        {
          "key": "year",
          "name": "年份",
          "value": [
            { "n": "全部", "v": "" },
            { "n": "2024", "v": "2024" },
            { "n": "2023", "v": "2023" },
            { "n": "2022", "v": "2022" },
            { "n": "2021", "v": "2021" },
            { "n": "2020", "v": "2020" },
            { "n": "2019", "v": "2019" },
            { "n": "2018", "v": "2018" },
            { "n": "2017", "v": "2017" },
            { "n": "2016", "v": "2016" },
            { "n": "2015", "v": "2015" },
            { "n": "2014", "v": "2014" },
            { "n": "2013", "v": "2013" },
            { "n": "2012", "v": "2012" },
            { "n": "2011", "v": "2011" },
            { "n": "2010", "v": "2010" }
          ]
        },
        {
          "key": "sortType",
          "name": "排序",
          "value": [
            { "n": "最近更新", "v": "" },
            { "n": "添加时间", "v": "2" },
            { "n": "人气", "v": "3" },
            { "n": "评分", "v": "4" }
          ]
        }
      ],
      "3": [
        {
          "key": "type",
          "name": "类型",
          "value": [
            { "n": "全部", "v": "" },
            { "n": "国产综艺", "v": "69" },
            { "n": "港台综艺", "v": "70" },
            { "n": "日韩综艺", "v": "72" },
            { "n": "欧美综艺", "v": "73" }
          ]
        },{
          "key": "area",
          "name": "地区",
          "value": [
            { "n": "全部", "v": "" },
            { "n": "大陆", "v": "中国大陆" },
            { "n": "香港", "v": "中国香港" },
            { "n": "台湾", "v": "中国台湾" },
            { "n": "美国", "v": "美国" },
            { "n": "韩国", "v": "韩国" },
            { "n": "日本", "v": "日本" },
            { "n": "其他", "v": "其他" }
          ]
        },
        {
          "key": "year",
          "name": "年份",
          "value": [
            { "n": "全部", "v": "" },
            { "n": "2024", "v": "2024" },
            { "n": "2023", "v": "2023" },
            { "n": "2022", "v": "2022" },
            { "n": "2021", "v": "2021" },
            { "n": "2020", "v": "2020" }
          ]
        },
        {
          "key": "sortType",
          "name": "排序",
          "value": [
            { "n": "最近更新", "v": "" },
            { "n": "添加时间", "v": "2" },
            { "n": "人气", "v": "3" },
            { "n": "评分", "v": "4" }
          ]
        }
      ]
    };
          return JSON.stringify({
            code: 1,
            msg: "数据列表",
            page: "1",
            limit: "20",
            list: list,
            class: classData,
            filters: filterData
          });
        } catch (error) {
          console.error('Error fetching the webpage:', error);
          return JSON.stringify({
            code: -1,
            msg: "获取数据失败",
            page: "1",
            limit: "20",
            list: []
          });
        }
      }


//获取影视分类列表
async function categoryContent(tid, pg = 1, extend) {
  try {
    // 解析 extend 参数
    let extendObj = extend ? JSON.parse(extend) : null;
let url = `${webSite}/vod/show/id/${tid}/type/{type}/class/{class}/area/{area}/year/{year}/sortType/{sortType}/page/${pg}`;
// 替换 URL 中的占位符
if (extendObj) {
  for (const [key, value] of Object.entries(extendObj)) {

    if (value) {
    const placeholder = `{${key}}`;
    const encodedValue = encodeURIComponent(value || ''); // 对 value 进行 URL 编码
      url = url.replace(new RegExp(placeholder, 'g'), encodedValue);
    }
  }
}
// 删除剩余的 {} 包围的占位符
    url = url.replace(/\/[a-zA-Z]+\/\{[a-zA-Z]+\}/g, '');
    console.log(url);
    const response = await 访问网页(url);
    // 使用正则表达式匹配所有的电影项
    const items = 文本_取中间_批量(response, '"vodId', '}', true, true);
    const list = items.map((item) => {
            const vod_name = 文本_取中间(item, 'vodName\\\":\\\"', '\\\"') || '';
            const vod_pic = 文本_取中间(item,'vodPic\\\":\\\"','\\\"') || '';
            const vod_id = 文本_取中间(item,'vodId\\\":',',') || '';
            const vod_remarks = 文本_取中间(item,'vodRemarks\\\":\\\"','\\\"') || '';
            return {
                vod_id: vod_id,
                vod_name: vod_name,
                vod_remarks: vod_remarks,
                vod_pic: vod_pic
            };
        });
    return JSON.stringify({
      code: 1,
      msg: "数据列表",
      page: pg,
      limit: "20",
      list: list
    });
  } catch (error) {
    console.error('Error fetching the webpage:', error);
    return JSON.stringify({
      code: -1,
      msg: "获取数据失败",
      page: "1",
      limit: "20",
      list: []
    });
  }
}



//获取影视详情信息
async function detailContent(ids) {
  const url = `${webSite}/detail/${ids}`;
  try {
    //console.log(url);
    const html = await 访问网页(url);
    // 使用正则表达式提取信息
    const vod_id = ids;
    const vod_name = 文本_取中间(html,'vodName\\\":\\\"','\\\"') || '未知片名';
        //console.log(vod_name);
    const vod_year = 文本_取中间(html,'vodPubdate\\\":\\\"','\\\"') || ''; 
    //console.log(vod_year);
    const vod_director = 文本_取中间(html,'vodDirector\\\":\\\"','\\\"') || '未知';
     //console.log(vod_director);
    const vod_actor = 文本_取中间(html,'vodActor\\\":\\\"','\\\"') || '未知';
    //console.log(vod_actor);
    const vod_pic = 文本_取中间(html,'vodPic\\\":\\\"','\\\"') || ''; 
    //console.log(vod_pic);
    let vod_remarks=文本_取中间(html,'vodRemarks\\\":\\\"','\\\"') || ''; 
     //console.log(vod_remarks);
    const vod_content = 移除html代码(文本_取中间(html,'vodContent\\\":\\\"','\\\"')) || '暂无剧情';
    //console.log(vod_content);
    // 初始化 vod_play_from 和 vod_play_url
    let vod_play_from = '播放列表';
    let vod_play_url = [];
    const items = 文本_取中间_批量(html, '<div class=" listitem">', '</div>');
    const list = items.map((item) => {
            const name = 文本_取中间(item, '>', '</a>') || '';
            const link = 文本_取中间(item,'href="','"') || '';
            return `${name}\$${link}`;
        });
    vod_play_url =list.join('#');
    // 将提取的信息组织成一个对象
    const movieDetails = {
      code: 1,
      msg: "数据列表",
      page: 1,
      pagecount: 1,
      limit: "20",
      total: 1,
      list: [{
        vod_id: vod_id,
        vod_name: vod_name,
        vod_pic: vod_pic,
        vod_actor: vod_actor,
        vod_director: vod_director,
        vod_remarks: vod_remarks,
        vod_year: vod_year,
        vod_content: vod_content,
        vod_play_from: vod_play_from,
        vod_play_url: vod_play_url
      }]
    };
    // 返回 JSON 字符串
    console.log(JSON.stringify(movieDetails));
    return JSON.stringify(movieDetails);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return JSON.stringify({ code: 0, msg: "获取数据失败", error: error.message });
  }
}


async function playerContent(vod_id) {
  try {
      // 使用 split 方法按 / 分割字符串
    const parts = vod_id.split('/');
    // 取出所需的值
    const pid = parts[3]; 
    const nid = parts[5]; 
    const t = new Date().getTime();
    const signkey = 'id='+pid+'&nid='+nid+'&key=cb808529bae6b6be45ecfab29a4889bc&t='+t;
    const key = Crypto.SHA1(Crypto.MD5(signkey).toString()).toString();
    const url=webSite+'/api/mw-movie/anonymous/v1/video/episode/url?id='+pid+'&nid='+nid;
    const response = await 访问网页(url, 0, null, '',`User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36\ndeviceid: c6bce57d-bb62-4db7-96cd-265dfb2a79cf\nsign: ${key}\nt: ${t}`);
// 解析 JSON 字符串
const jsonObj = JSON.parse(response);
const playUrl = jsonObj.data.playUrl;
const result = {
  parse: 1,
  header: `Referer: ${webSite}`,
  playUrl: '',
  url: `${playUrl}`,
};
return JSON.stringify(result);
  } catch (error) {
    const result = {
      parse: 1,
      header: "",
      playUrl: "",
      url: "",
      message: `获取链接失败: ${error}`,
    };
    return JSON.stringify(result);
  }
}


//搜索影视
async function searchContent(keyword) {
  try {
        const encodedKeyword = encodeURIComponent(keyword);
        const url = `${webSite}/vod/search/${encodedKeyword}`;
        const response = await 访问网页(url);
        const items = 文本_取中间_批量(response, '"vodId', '}', true, true);
        const list = items.map((item) => {
            const vod_name = 文本_取中间(item, 'vodName\\\":\\\"', '\\\"') || '';
            const vod_pic = 文本_取中间(item,'vodPic\\\":\\\"','\\\"') || '';
            const vod_id = 文本_取中间(item,'vodId\\\":',',') || '';
            const vod_remarks = 文本_取中间(item,'vodRemarks\\\":\\\"','\\\"') || '';
            return {
                vod_id: vod_id,
                vod_name: vod_name,
                vod_remarks: vod_remarks,
                vod_pic: vod_pic
            };
        });
    return JSON.stringify({
      code: 1,
      msg: "数据列表",
      page: '1',
      limit: "20",
      list: list
    });
  } catch (error) {
    console.error('Error fetching the webpage:', error);
    return JSON.stringify({
      code: -1,
      msg: "获取数据失败",
      page: "1",
      limit: "20",
      list: []
    });
  }
}
