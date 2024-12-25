// 下面是发布代码
const webSite = 'https://m.douban.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.95 Safari/537.36';
  //调试完毕后，屏蔽下方测试的代码
  //homeContent();
  //categoryContent("1", 1, JSON.stringify({类型: "喜剧",地区: "华语",年代: "2020年代", 排序: "近期热度"}));

//获取首页分类和推荐视频
async function homeContent() {
  let backData = new RepVideo();
  // 定义分类数据
  const allClass = [
    { type_id: "1", type_name: "找电视剧" },
    { type_id: "2", type_name: "找电影" },
    { type_id: "3", type_name: "找综艺" }
  ];
  const createLabelOptions = (labels) => labels.map(label => ({ n: label, v: label === "全部" || label === "近期热度" ? "" : label }));
  const tvLabels = {
    types: ["全部", "喜剧", "爱情", "悬疑", "动画", "武侠", "古装", "家庭", "犯罪", "科幻", "恐怖", "历史", "战争", "动作", "冒险", "传记", "剧情", "奇幻", "惊悚", "灾难", "歌舞", "音乐"],
    areas: ["全部", "华语", "欧美", "国外", "韩国", "日本", "中国大陆", "中国香港", "美国", "英国", "泰国", "中国台湾", "意大利", "法国", "德国", "西班牙", "俄罗斯", "瑞典", "巴西", "丹麦", "印度", "加拿大", "爱尔兰", "澳大利亚"],
    years: ["全部", "2020年代", "2024", "2023", "2022", "2021", "2020", "2019", "2010年代", "2000年代", "90年代", "80年代", "70年代", "60年代", "更早"],
    platforms: ["全部", "腾讯视频", "爱奇艺", "优酷", "湖南卫视", "Netflix", "HBO", "BBC", "NHK", "CBS", "NBC", "tvN"],
    sortOptions: [ "近期热度", "综合排序","首播时间", "高分优先"]
  };

  const movieLabels = {
    types: ["全部", "喜剧", "爱情", "动作", "科幻", "动画", "悬疑", "犯罪", "惊悚", "冒险", "音乐", "历史", "奇幻", "恐怖", "战争", "传记", "歌舞", "武侠", "情色", "灾难", "西部", "纪录片", "短片"],
    areas: ["全部", "华语", "欧美", "韩国", "日本", "中国大陆", "美国", "中国香港", "中国台湾", "英国", "法国", "德国", "意大利", "西班牙", "印度", "泰国", "俄罗斯", "加拿大", "澳大利亚", "爱尔兰", "瑞典", "巴西", "丹麦"],
    years: ["全部", "2020年代", "2024", "2023", "2022", "2021", "2020", "2019", "2010年代", "2000年代", "90年代", "80年代", "70年代", "60年代", "更早"],
    platforms: ["全部", "腾讯视频", "爱奇艺", "优酷", "湖南卫视", "Netflix", "HBO", "BBC", "NHK", "CBS", "NBC", "tvN"],
    sortOptions: [ "近期热度", "综合排序","首播时间", "高分优先"]
  };

  const varietyLabels = {
    types: ["全部", "真人秀", "脱口秀", "音乐", "歌舞"],
    areas: ["全部", "华语", "欧美", "国外", "韩国", "日本", "中国大陆", "中国香港", "美国", "英国", "泰国", "中国台湾", "意大利", "法国", "德国", "西班牙", "俄罗斯", "瑞典", "巴西", "丹麦", "印度", "加拿大", "爱尔兰", "澳大利亚"],
    years: ["全部", "2020年代", "2024", "2023", "2022", "2021", "2020", "2019", "2010年代", "2000年代", "90年代", "80年代", "70年代", "60年代", "更早"],
    platforms: ["全部", "腾讯视频", "爱奇艺", "优酷", "湖南卫视", "Netflix", "HBO", "BBC", "NHK", "CBS", "NBC", "tvN"],
    sortOptions: ["近期热度", "综合排序", "首播时间", "高分优先"]
  };

  // 生成过滤器数据
  const generateFilterData = (labels) => [
    { key: "类型", name: "类型", value: createLabelOptions(labels.types) },
    { key: "地区", name: "地区", value: createLabelOptions(labels.areas) },
    { key: "年代", name: "年代", value: createLabelOptions(labels.years) },
    { key: "平台", name: "平台", value: createLabelOptions(labels.platforms) },
    { key: "排序", name: "排序", value: createLabelOptions(labels.sortOptions) }
  ];
  const filterData = {
    "1": generateFilterData(tvLabels),
    "2": generateFilterData(movieLabels),
    "3": generateFilterData(varietyLabels)
  };
  backData.filters = filterData;
  backData.class = allClass;

  console.log(JSON.stringify(backData));
  return JSON.stringify(backData);
}


// 获取影视分类列表
async function categoryContent(tid, pg = 1, extend) {
  let backData = new RepVideo();
  try {
    // 初始化参数
    let param1 = tid === "1" ? '{"形式":"电视剧",' : tid === "2" ? '{"形式":"电影",' : tid === "3" ? '{"形式":"综艺",' : "{";
    let extendObj = extend ? JSON.parse(extend) : null;
    let start = (pg - 1) * 20;
    let tags = tid === "3" ? '综艺,': '';
    let sort = "U";
    // 处理扩展参数
    if (extendObj) {
      for (const [key, value] of Object.entries(extendObj)) {
        if (key === "排序") {
          const sortMap = {
            "综合排序": "",
            "近期热度": "U",
            "": "U",
            "首播时间": "R",
            "高分优先": "S",
          };
          sort = sortMap[value] || "";
        } else if (value !== "全部") {
          param1 += `"${key}":"${value}",`;
          tags += `${value},`;
        }
      }
      param1 = param1.endsWith(",") ? param1.slice(0, -1) + "}" : param1 + "}";
      tags = tags.endsWith(",") ? tags.slice(0, -1) : tags;
    }

    // 构建请求URL
    let webUrl = `${webSite}/rexxar/api/v2/${tid === "2" ? "movie" : "tv"}/recommend?refresh=0&start=${start}&count=20&selected_categories=${param1}&uncollect=false&tags=${tags}`;
    // 如果 sort 有值，则添加到 URL 中
    if (sort) {
      webUrl += `&sort=${sort}`;
    }

    // 发送请求
    let pro = await req(webUrl, {
      headers: {
        'User-Agent': UA,
        'Referer': webSite
      },
    });

    // 解析响应数据
    let proData = await pro.json();
    console.log("Response Data:", proData);

    // 处理视频列表
    let video = proData?.items?.map((item) => {
      let videoDet = new VideoList();
      videoDet.vod_id = item.id;
      //videoDet.vod_pic = item.pic?.normal || item.pic?.large || "";
      //图片加入缓存机制
videoDet.vod_pic = item.pic?.normal 
  ? `https://images.weserv.nl/?url=${item.pic.normal}&w=300&h=300` 
  : item.pic?.large 
    ? `https://images.weserv.nl/?url=${item.pic.large}&w=300&h=300` 
    : "";

      videoDet.vod_name = item.title;
      videoDet.vod_remarks = "豆瓣" + (item.rating?.value || "");
      return videoDet;
    }) || [];

    backData.list = video;
  } catch (error) {
    console.error('Error fetching the webpage:', error);
    backData.msg = error.message || error.statusText || 'Unknown error';
  }

  console.log(JSON.stringify(backData));
  return JSON.stringify(backData);
}


//推荐源，无需下列三个函数。但是也需要在代码中定义
async function detailContent(ids) {
    console.log('detailContent');
}
async function searchContent(keyword) {
    console.log('searchContent');
}

async function playerContent(vod_id) {
    console.log('playerContent');
}
   
