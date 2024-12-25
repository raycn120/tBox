
async function fetchShareInfo(url) {
const regex = /https:\/\/cloud\.189\.cn\/t\/(\w+)(?:\?password=(\w+))?|https:\/\/cloud\.189\.cn\/web\/share\?code=(\w+)(?:&password=(\w+))?/;
const match = url.match(regex);
if (!match) {
  throw new Error("Invalid URL format");
}
const code = match[1] || match[3];
const password = match[2] || match[4] || '';
console.log(code);
console.log(password);
  let fileId;
  let files = [];
  try {
    if (password) {
      // 如果 password 不为空，先验证密码
      const checkAccessUrl = `https://cloud.189.cn/api/open/share/checkAccessCode.action?noCache=${Math.random()}&shareCode=${code}&accessCode=${password}`;
      const checkAccessData = await fetchData(checkAccessUrl);
      if (checkAccessData.res_code !== 0) {
        throw new Error(
          `Password verification failed: ${checkAccessData.res_message}`
        );
      }
      shareId = checkAccessData.shareId;
    }
    // 获取 shareId 和 fileId
    const apiUrl = `https://cloud.189.cn/api/open/share/getShareInfoByCodeV2.action?noCache=${Math.random()}&shareCode=${code}`;
    console.log(apiUrl);
    const data = await fetchData(apiUrl);
    if (!shareId) {
      shareId = data.shareId;
    }
    fileId = data.fileId;
    // 递归获取文件和文件夹
    await fetchFilesAndFolders(code,fileId, shareId, password, files);
    const sortedVideos = sortVideos(files);
    const formattedFiles = sortedVideos
      .map((file) => `${file.name}$${file.id}`)
      .join("#");
    return formattedFiles;
  } catch (error) {
    console.error("Error fetching share info:", error);
    throw error;
  }
}

function sortVideos(videos) {
  return videos.sort((a, b) => {
    const extractNumbers = (fileName) => {
      const regex = /(\d+)/g;
      const matches = fileName.match(regex);
      return matches ? matches.map(Number) : [];
    };
    const numsA = extractNumbers(a.name);
    const numsB = extractNumbers(b.name);
    for (let i = 0; i < Math.max(numsA.length, numsB.length); i++) {
      const numA = numsA[i] || 0;
      const numB = numsB[i] || 0;

      if (numA !== numB) {
        return numA - numB;
      }
    }

    return 0;
  });
}



async function fetchFilesAndFolders(code, fileId, shareId, password, files, pageNum = 1, pageSize = 60) {
  let listShareUrl = `https://cloud.189.cn/api/open/share/listShareDir.action?noCache=${Math.random()}&pageNum=${pageNum}&pageSize=${pageSize}&fileId=${fileId}&shareDirFileId=${fileId}&isFolder=true&shareId=${shareId}&iconOption=5&orderBy=filename&descending=true&accessCode=`;
  if (password) {
      listShareUrl += password + '&shareMode=1';
  } else {
      listShareUrl += password + '&shareMode='+ shareMode;
  }
  console.log('listShareUrl:  '+listShareUrl);
  const listShareData = await fetchData(listShareUrl);
  // 提取 mediaType 为 3 的文件
  listShareData.fileListAO.fileList.forEach(file => {
      if (file.mediaType === 3) {
          const formattedSize = formatFileSize(file.size);
          files.push({
              name: `${file.name} [${formattedSize}]`,
              id:  'code='+code+'&pwd='+password  + '||shareId='+shareId+'&fileId='+file.id.toString()
          });
      }
  });

  // 递归遍历文件夹
  for (const folder of listShareData.fileListAO.folderList) {
      const folderId = folder.id.toString();  // 将 folder.id 转换为字符串
      await fetchFilesAndFolders(code, folderId, shareId, password, files, 1, pageSize);
  }

  // 计算总页数并翻页
  const totalPages = Math.ceil(listShareData.fileListAO.count / pageSize);
  if (pageNum < totalPages) {
      await fetchFilesAndFolders(code, fileId, shareId, password, files, pageNum + 1, pageSize);
  }
}

async function fetchData(url) {
  const response = await req(url, {
      headers: {
          'User-Agent': UA,
          'Accept': 'application/json;charset=UTF-8',
          'Sign-Type': '1',
      },
  });
  let text = await response.text();
  //console.log('天翼访问结果：'+text);
  return JSON.parse(text);
}

// Step 5: Format file size
function formatFileSize(size) {
  const mb = size / (1024 * 1024);
  if (mb < 1024) {
      return `${mb.toFixed(2)} M`;
  } else {
      const gb = mb / 1024;
      return `${gb.toFixed(2)} G`;
  }
}

const webSite = 'https://www.leijing1.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.95 Safari/537.36';
//let leijingCookie = '变量名称保持不变，测试时填入雷鲸小站的cookie，发布时在设置中看下访问是否正常';
//let cloud189Cookie = '变量名称保持不变，测试时填入天翼云盘cookie，发布时在设置中登录天翼云盘';
let shareId;
let shareMode=3;
//let leijingCookie ='';
//let cloud189Cookie ='';
//console.log('运行脚本');
//homeContent();
//categoryContent("42204792950357",1,null);
//detailContent("thread?topicId=18263");
//playerContent("code=zmUbu2IZZNBr&pwd=||shareId=12424112984510&fileId=925381161137919298");
//searchContent("斗罗大陆");

//获取影视列表
async function categoryContent(tid, pg = 1, extend) {
  let backData = new RepVideo();
  try {
    let listUrl = webSite + '/?tagId=' + tid + '&page=' + pg;
    console.log(listUrl);
    let pro = await req(listUrl, {
      headers: {
        'User-Agent': UA,
        'Cookie': leijingCookie,
      },
    });
    let proData = await pro.text();
    console.log('分类结果：'+proData);
    const $ = cheerio.load(proData);
    let allVideo = $('.topicItem');
    let videos = [];
    allVideo.each((_, e) => {
      if ($(e).find('.cms-lock-solid').length > 0) {
        return; // 跳过当前元素
      }
      if ($(e).find('span.module:contains("问题")').length > 0) {
        return; // 跳过当前元素
      }
      let titleElement = $(e).find('.title a');
      let vodUrl = titleElement.attr('href');
      let vodName = titleElement.text().trim();
       if(tid=='42212287587456'){
          vodName = vodName.replace(/【[^】]*】/g, '');
      }
      const liImageElement = $(e).find('li[data-src]');
      let vodPic = liImageElement.attr('data-src');
      if (!vodPic) {
        let avatarImageElement = $(e).find('.avatarBox img');
        vodPic = avatarImageElement.attr('src');
      }
       if (!vodPic) {
        vodPic = 'https://bizaladdin-image.baidu.com/0/pic/-1415092173_198088254_-1820154186.jpg';
      }
      let postTimeElement = $(e).find('.postTime');
      let remarks = postTimeElement.text().trim().replace('发表时间：', '');
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
  console.log(JSON.stringify(backData));
  return JSON.stringify(backData);
}

//获取影视详情信息
async function detailContent(ids) {
  let backData = new RepVideo();
  const webUrl = webSite+"/" + ids;
  try {
    let pro = await req(webUrl, {
      headers: {
        'User-Agent': UA,
        'Cookie': leijingCookie,
      },
    });
    //await toast("正在获取页面详情...", 2);
    let proData = await pro.text();
      const $ = cheerio.load(proData);
      let vod_content = '';
      let topicContentImageElement = $('.topicContent img').first();
      let vod_pic = topicContentImageElement.attr('src');
      if (!vod_pic) {
        let authorImageElement = $('.author a img');
        vod_pic = authorImageElement.attr('src');
    }
     if (!vod_pic) {
        vod_pic = 'https://bizaladdin-image.baidu.com/0/pic/-1415092173_198088254_-1820154186.jpg';
      }
      let vod_name = $('.topicBox .title').text().trim();
      //console.log(vod_name);
      let vod_year = '';
      let vod_director = '';
      let vod_actor = '';
      let vod_area = '';
      let linksWithAccessCode = new Set();
      proData =文本_取中间(proData,'<div class="left">','<div class="right">');
      let regexWithAccessCode = /https:\/\/cloud\.189\.cn\/t\/[a-zA-Z0-9]+[\(（]访问码[:：][^\s]+[\)）]|https:\/\/cloud\.189\.cn\/t\/[a-zA-Z0-9]+|https:\/\/cloud\.189\.cn\/web\/share\?code=[A-Za-z0-9]+[\(（]访问码[:：][^\s]+[\)）]|https:\/\/cloud\.189\.cn\/web\/share\?code=[A-Za-z0-9]+/g;
      let matchesWithAccessCode = proData.match(regexWithAccessCode);
      if (matchesWithAccessCode) {
        matchesWithAccessCode.forEach((link) => {
          let cleanLink = link.match(/https:\/\/cloud\.189\.cn\/t\/[a-zA-Z0-9]+|https:\/\/cloud\.189\.cn\/web\/share\?code=[A-Za-z0-9]+/)[0];
          let accessCodeMatch = link.match(/[\(（]访问码[:：]([^\s]+)+[\)）]/);
          if (accessCodeMatch) {
            let accessCode = accessCodeMatch[1];
            if(link.includes('/t/')){
              cleanLink += `?password=${accessCode}`;
            }else{
              cleanLink += `&password=${accessCode}`;
            }
          }
          linksWithAccessCode.add(cleanLink);
        });
      }


          // 新增部分：获取 href 中的天翼云盘链接并解码
    let hrefRegex = /href="([^"]+)"/g;
    let hrefMatches = proData.match(hrefRegex);
    if (hrefMatches) {
      hrefMatches.forEach((href) => {
        let link = href.match(/href="([^"]+)"/)[1];
        if (link.startsWith('https://cloud.189.cn/')) {
          let decodedLink = decodeURIComponent(link);
          let cleanLink = decodedLink.match(/https:\/\/cloud\.189\.cn\/t\/[a-zA-Z0-9]+|https:\/\/cloud\.189\.cn\/web\/share\?code=[A-Za-z0-9]+/)[0];
          let accessCodeMatch = decodedLink.match(/[\(（]访问码[:：]([^\s]+)+[\)）]/);
          if (accessCodeMatch) {
            let accessCode = accessCodeMatch[1];
            if (cleanLink.includes('/t/')) {
              cleanLink += `?password=${accessCode}`;
            } else {
              cleanLink += `&password=${accessCode}`;
            }
          }
          linksWithAccessCode.add(cleanLink);
        }else if (link.startsWith('https://content.21cn.com/h5/subscrip/index.html#/pages/own-home/index')) {
          let shareCodeMatch = link.match(/shareCode=([A-Za-z0-9]+)/);
          if (shareCodeMatch) {
            shareMode = 5;
            let shareCode = shareCodeMatch[1];
            let cloudLink = `https://cloud.189.cn/t/${shareCode}`;
            linksWithAccessCode.add(cloudLink);
          }
        }
      });
    }


 // 检查 linksWithAccessCode 是否为空，如果是空的，则进行额外匹配
 if (linksWithAccessCode.size === 0) {
  let content21cnRegex = /https:\/\/content\.21cn\.com\/h5\/subscrip\/index\.html.*shareCode=([A-Za-z0-9]+)/g;
  let content21cnMatches = proData.match(content21cnRegex);
  if (content21cnMatches) {
    shareMode = 5;
    content21cnMatches.forEach((link) => {
      let shareCodeMatch = link.match(/shareCode=([A-Za-z0-9]+)/);
      if (shareCodeMatch) {
        let shareCode = shareCodeMatch[1];
        let cloudLink = `https://cloud.189.cn/t/${shareCode}`;
        linksWithAccessCode.add(cloudLink);
      }
    });
  }
}


    // 处理重复的 code 并优先保留包含 password 的链接
    let codeMap = new Map();
    for (let link of linksWithAccessCode) {
      let codeMatch = link.match(/code=([A-Za-z0-9]+)|t\/([A-Za-z0-9]+)/);
      if (codeMatch) {
        let code = codeMatch[1] || codeMatch[2]; // 优先使用 code= 的匹配结果，如果没有则使用 t/ 的匹配结果
        if (codeMap.has(code)) {
          let existingLink = codeMap.get(code);
          if (link.includes('password') && !existingLink.includes('password')) {
            codeMap.set(code, link);
          }
        } else {
          codeMap.set(code, link);
        }
      }
    }

    // 将处理后的链接重新放入 linksWithAccessCode
    linksWithAccessCode.clear();
    for (let link of codeMap.values()) {
      linksWithAccessCode.add(link);
    }

     //await toast("正在获取网盘剧集...", 2);
    // 调用 fetchShareInfo 获取结果
    let vod_play_from = '';
    let vod_play_url = '';
    let index = 1;
    for (let link of linksWithAccessCode) {
      shareId='';
      console.log(link);
      let result = await fetchShareInfo(link);
      if (result) {
        if (vod_play_from) {
          vod_play_from += '$$$';
          vod_play_url += '$$$';
        }
        if (linksWithAccessCode.size === 1) {
          vod_play_from += '天翼云盘';
        } else {
          vod_play_from += `天翼云盘${index}`;
        }
        vod_play_url += result;
        index++;
      }
    }
      let detModel = new VideoDetail();
      let videos = [];
      detModel.vod_year = vod_year;
      detModel.vod_director = vod_director;
      detModel.vod_actor = vod_actor;
      detModel.vod_area = vod_area;
      detModel.vod_content = vod_content;
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
  //await toast(JSON.stringify(backData),5);
  console.log(JSON.stringify(backData));
  return JSON.stringify(backData);
}

//获取首页分类
async function homeContent() {
  let backData = new RepVideo();
  try {
      let list = [];
      let allClass = [
          {
              type_id: '42204681950354',
              type_name: '电影',
          },
          {
              type_id: '42204684250355',
              type_name: '剧集',
          },
          {
              type_id: '42204792950357',
              type_name: '动画动漫',
          },
          {
              type_id: '42210356650363',
              type_name: '综艺',
          },
          {
              type_id: '42212287587456',
              type_name: '影视原盘',
          }
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
  console.log(JSON.stringify(backData));
  return JSON.stringify(backData);
}


//解析获取播放地址
async function playerContent(vod_id) {
  //console.log(vod_id);
  let backData = new RepVideoPlayUrl();
  let part = vod_id.split('||');
  let headers = {'User-Agent': UA,'Cookie': cloud189Cookie,'Referer': 'https://cloud.189.cn/'};
  let url = 'https://cloud.189.cn/api/portal/getNewVlcVideoPlayUrl.action?noCache=0.617329187255641&&dt=1&'+part[1]+'&type=4';
  await toast("正在获取播放链接...", 2);
  try {
    const response = await req(url, {
      headers: {
          'User-Agent': UA,
          'Accept': 'application/json;charset=UTF-8',
          'Sign-Type': '1',
          'Cookie': cloud189Cookie,
      },
    });
    let proData = await response.text();
    let jsonObject = JSON.parse(proData);
    backData.url = jsonObject.normal.url;
    if (backData.url) {
      await toast("播放链接获取成功,尝试播放...", 2);          
    }
  } catch (error) {
    let errData = await error.text();
      await toast("解析播放链接失败："+ errData, 5);  
      console.error('Error in fetchData:', errData);
      backData.msg = error.statusText;
    }
  backData.playUrl = '';
  backData.parse = 1;
  backData.header = headersToString(headers);
  //console.log(JSON.stringify(backData));
  return JSON.stringify(backData);
}


async function searchContent(keyword) {
  let backData = new RepVideo();
  try {
    let listUrl = webSite + `/search?keyword=${keyword}`
    console.log(listUrl);
    let pro = await req(listUrl, {
      headers: {
        'User-Agent': UA,
        'Cookie': leijingCookie,
      },
    });
    let proData = await pro.text();
    const $ = cheerio.load(proData);
    let allVideo = $('.topicItem');
    let videos = [];
    allVideo.each((_, e) => {
      if ($(e).find('.cms-lock-solid').length > 0) {
        return; // 跳过当前元素
      }
      if ($(e).find('span.module:contains("问题")').length > 0) {
        return; // 跳过当前元素
      }
      let titleElement = $(e).find('.title a');
      let vodUrl = titleElement.attr('href');
      let vodName = titleElement.text().trim();
      const liImageElement = $(e).find('li[data-src]');
      let vodPic = liImageElement.attr('data-src');
      if (!vodPic) {
        let avatarImageElement = $(e).find('.avatarBox img');
        vodPic = avatarImageElement.attr('src');
      }
      if (!vodPic) {
        vodPic = 'https://bizaladdin-image.baidu.com/0/pic/-1415092173_198088254_-1820154186.jpg';
      }
      let postTimeElement = $(e).find('.postTime');
      let remarks = postTimeElement.text().trim().replace('发表时间：', '');
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
  console.log(JSON.stringify(backData));
  return JSON.stringify(backData);
}
