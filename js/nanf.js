
const webSite='http://www.nanf.cc/';
   
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
   
           if (request.ok) resolve(response());
           else reject(response());
       });
   }
 
   
   function extractShareId(url) {
     // 使用正则表达式匹配 "s/" 和 "/" 之间的字符串
     const regex = /\/s\/([a-f0-9]+)/;
     const match = url.match(regex);
   
     if (match && match[1]) {
       return match[1];
     } else {
       return null; // 如果没有匹配到，返回 null 或其他你认为合适的值
     }
   }
   
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
         let setCookie = responseHeaders['set-cookie'];
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
   
   
   
   //调试脚本时用访问网页2，调试完毕后改回访问网页
   async function 访问网页2(url, method, postParams, cookie, headers, timeout = 15000, setCookieCallback) {
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
       const fetchPromise = fetch(url, requestOptions);
       const timeoutPromise = new Promise((_, reject) => {
         setTimeout(() => reject(new Error('Request timed out')), timeout);
       });
       try {
         // 发送请求并等待响应
         const response = await Promise.race([fetchPromise, timeoutPromise]);
         // 获取响应内容
         const responseText = await response.text();
         // 返回结果
         return responseText;
       } catch (error) {
         throw error;
       }
     }
   
   
   //playerContent('%7B%22fid_list%22%3A%5B%22ffd5fb1ba04e48bcbcb4e28fe449bbb3%22%5D%2C%22fid_token_list%22%3A%5B%22d84fe7f65cb8ae991beb66104222e653%22%5D%2C%22fid_size%22%3A5627266634%2C%22to_pdir_fid%22%3A%22%E6%9A%82%E5%AE%9A%22%2C%22pwd_id%22%3A%226dc9cce602e4%22%2C%22isQuark%22%3Atrue%2C%22stoken%22%3A%22DTPUGX1BRFxmEHFdRaFDBGEvq%2FfiI5T0rHSYL0CyH7E%3D%22%2C%22pdir_fid%22%3A%220%22%2C%22scene%22%3A%22link%22%7D')
    // .then(data => console.log(data))
    // .catch(error => console.error('Error:', error));
   
   
   async function playerContent(vod_id) {
     try {
       // Step 1: URL decode vod_id to get JSON text
       const decodedVodId = decodeURIComponent(vod_id);
       const vodData = JSON.parse(decodedVodId);
       const isQuark = vodData.isQuark;
       // Step 2: Find tBox folder and replace to_pdir_fid
       let page = 1;
       let tBoxFid = null;
       let getUrl = "";
       let createUrl = "";
       let fileUrl = "";
       let playUrl = "";
       let deleteUrl = "";
       let origin = "";
       let cookie = "";
       let tBoxFileUrl = "";
       if (isQuark) {
         getUrl = `https://drive-pc.quark.cn/1/clouddrive/file/sort?pr=ucpro&fr=pc&uc_param_str=&pdir_fid=0&_page=${page}&_size=100&_fetch_total=false&_fetch_sub_dirs=1&_sort=&__dt=1604987&__t=${Date.now()}`;
         createUrl = `https://drive-pc.quark.cn/1/clouddrive/file?pr=ucpro&fr=pc&uc_param_str=`;
         fileUrl = `https://pc-api.uc.cn/1/clouddrive/file/sort?pr=UCBrowser&fr=pc&pdir_fid=${vodData.to_pdir_fid}&_page=1&_size=50&_fetch_total=1&_fetch_sub_dirs=0&_sort=file_type:asc,updated_at:desc`;
         playUrl = `https://drive-pc.quark.cn/1/clouddrive/file/v2/play?pr=ucpro&fr=pc&uc_param_str=`;
         deleteUrl = `https://drive-pc.quark.cn/1/clouddrive/file/delete?pr=ucpro&fr=pc&uc_param_str=`;
         origin = `https://pan.quark.cn`;
         cookie = quarkCookie;
       } else {
         getUrl = `https://pc-api.uc.cn/1/clouddrive/file/sort?pr=UCBrowser&fr=pc&pdir_fid=0&_page=${page}&_size=50&_fetch_total=1&_fetch_sub_dirs=0&_sort=file_type:asc,updated_at:desc`;
         createUrl = `https://pc-api.uc.cn/1/clouddrive/file?pr=UCBrowser&fr=pc`;
         fileUrl = `https://pc-api.uc.cn/1/clouddrive/file/sort?pr=UCBrowser&fr=pc&pdir_fid=${vodData.to_pdir_fid}&_page=1&_size=50&_fetch_total=1&_fetch_sub_dirs=0&_sort=file_type:asc,updated_at:desc`;
         playUrl = `https://pc-api.uc.cn/1/clouddrive/file/v2/play?pr=UCBrowser&fr=pc`;
         deleteUrl = `https://pc-api.uc.cn/1/clouddrive/file/delete?pr=UCBrowser&fr=pc`;
         origin = `https://drive.uc.cn`;
         cookie = ucCookie;
       }
       //await toast('正在查找tBox文件夹',2);
       while (true) {
         const getResponse = await 访问网页(getUrl, 0, null, cookie);
         const getData = JSON.parse(getResponse);
         if (getData.status !== 200 || getData.code !== 0) {
           throw new Error(`Failed to get file list: ${getData.message}`);
         }
         const tBoxFolder = getData.data.list.find(
           (file) => file.file_type === 0 && file.file_name === "tBox"
         );
         if (tBoxFolder) {
           tBoxFid = tBoxFolder.fid;
           break;
         }
         // If the list size is less than 100, break the loop
         if (getData.data.list.length < 100) {
           break;
         }
         page++;
       }
       if (tBoxFid) {
         vodData.to_pdir_fid = tBoxFid;
         await toast('正在清空tBox文件夹内文件...',2);
         if (isQuark) {
           tBoxFileUrl = `https://drive-pc.quark.cn/1/clouddrive/file/sort?pr=ucpro&fr=pc&uc_param_str=&pdir_fid=${tBoxFid}&_page=1&_size=50&_fetch_total=1&_fetch_sub_dirs=0&_sort=file_type:asc,updated_at:desc`;
         } else {
           tBoxFileUrl = `https://pc-api.uc.cn/1/clouddrive/file/sort?pr=UCBrowser&fr=pc&uc_param_str=&pdir_fid=${tBoxFid}&_page=1&_size=50&_fetch_total=1&_fetch_sub_dirs=0&_sort=file_type:asc,updated_at:desc`;
         }
         // 带 cookie 用 get 方式访问指定的 URL 并取出 list 里的 fid
         const tBoxFileResponse = await 访问网页(tBoxFileUrl, 0, null, cookie);
         const tBoxFileData = JSON.parse(tBoxFileResponse);
         if (tBoxFileData.status !== 200 || tBoxFileData.code !== 0) {
           throw new Error(
             `Failed to get tBox file list: ${tBoxFileData.message}`
           );
         }
         const fids = tBoxFileData.data.list.map((file) => file.fid);
         if (fids.length > 0) {
           // 带 cookie 用 post 方式删除这些 fid
           const deleteParams = JSON.stringify({
             action_type: 2,
             filelist: fids,
             exclude_fids: [],
           });
           const deleteResponse = await 访问网页(
             deleteUrl,
             1,
             deleteParams,
             cookie,
             "Content-Type: application/json;charset=UTF-8"
           );
         }
       } else {
         // Step 3: Create tBox folder if not found
         //await toast('首次运行,自动创建tBox文件夹...',2);
         const createParams = JSON.stringify({
           pdir_fid: "0",
           file_name: "tBox",
           dir_path: "",
           dir_init_lock: false,
         });
         const createResponse = await 访问网页(
           createUrl,
           1,
           createParams,
           cookie,
           isQuark
             ? "Content-Type: application/json\nOrigin: https://pan.quark.cn\nReferer: https://pan.quark.cn/"
             : "Content-Type: application/json\nOrigin: https://drive.uc.cn\nReferer: https://drive.uc.cn/"
         );
         const createData = JSON.parse(createResponse);
         if (createData.status !== 200 || createData.code !== 0) {
           throw new Error(
             `Failed to create tBox folder: ${createData.message}`
           );
         }
         vodData.to_pdir_fid = createData.data.fid;
       }
       let retryCount = 0;
       let videoLinks = null;
       let saveAsTopFid = null;
       await toast("正在转存影片到网盘...", 2);
       while (retryCount < 5 && !videoLinks) {
         // Step 4: Post the final vodData
         const saveUrl = isQuark
           ? `https://drive-pc.quark.cn/1/clouddrive/share/sharepage/save?pr=ucpro&fr=pc&uc_param_str=&__dt=2460776&__t=${Date.now()}`
           : `https://pc-api.uc.cn/1/clouddrive/share/sharepage/save?pr=UCBrowser&fr=pc`;
         const saveParams = JSON.stringify(vodData);
         const saveResponse = await 访问网页(
           saveUrl,
           1,
           saveParams,
           cookie,
           isQuark
             ? "Content-Type: application/json\nOrigin: https://pan.quark.cn\nReferer: https://pan.quark.cn/"
             : "Content-Type: application/json\nOrigin: https://drive.uc.cn\nReferer: https://drive.uc.cn/"
         );
         const saveData = JSON.parse(saveResponse);
         if (saveData.status !== 200 || saveData.code !== 0) {
           throw new Error(`Failed to save vodData: ${saveData.message}`);
         }
         // Step 5: Check task status
         const taskId = saveData.data.task_id;

         let retryIndex = 0;
         let isTaskFinished = false;
         saveAsTopFid = null;

         while (retryIndex < 15 && !isTaskFinished) {
           const taskUrl = isQuark
             ? `https://drive-pc.quark.cn/1/clouddrive/task?pr=ucpro&fr=pc&uc_param_str=&task_id=${taskId}&retry_index=${retryIndex}&__dt=337800&__t=${Date.now()}`
             : `https://pc-api.uc.cn/1/clouddrive/task?pr=UCBrowser&fr=pc&uc_param_str=&task_id=${taskId}&retry_index=${retryIndex}&__dt=337800&__t=${Date.now()}`;
           const taskResponse = await 访问网页(
             taskUrl,
             0,
             "",
             cookie,
             isQuark
               ? "Origin: https://pan.quark.cn\nReferer: https://pan.quark.cn/"
               : "Content-Type: application/json\nOrigin: https://drive.uc.cn\nReferer: https://drive.uc.cn/"
           );
           const taskData = JSON.parse(taskResponse);

           if (taskData.status === 400 && taskData.code === 32003) {
             const fileResponse = await 访问网页(
               fileUrl,
               0,
               "",
               cookie,
               isQuark
                 ? "Content-Type: application/json\nOrigin: https://pan.quark.cn\nReferer: https://pan.quark.cn/"
                 : "Content-Type: application/json\nOrigin: https://drive.uc.cn\nReferer: https://drive.uc.cn/"
             );
             const fileData = JSON.parse(fileResponse);
             const fileList = fileData.data.list;
             const targetFile = fileList.find(
               (file) => file.size === vodData.fid_size
             );
             if (targetFile) {
               isTaskFinished = true;
               saveAsTopFid = targetFile.fid;
             }
           } else if (taskData.status !== 200 || taskData.code !== 0) {
             throw new Error(`Failed to get task status: ${taskData.message}`);
           } else if (taskData.data.finished_at) {
             isTaskFinished = true;
             saveAsTopFid = taskData.data.save_as.save_as_top_fids[0];
           }

           retryIndex++;
           await new Promise((resolve) => setTimeout(resolve, 500));
         }

         if (!isTaskFinished) {
           throw new Error("Task did not finish within the expected time.");
         }

         // Step 6: Get video playback links with retry mechanism
         await toast("正在获取影片播放链接...", 2);
         let retryCountForPlay = 0;
         let mySetCookie = null;

 const fetchPlayResponse = async (url, params, headers) => {
  return await 访问网页(url, 1, params, cookie, headers, 15000, (setCookie) => {
    mySetCookie = setCookie;
  });
};

const mergeCookies = (newCookies) => {
  const mergedCookies = [
    ...new Set([
      ...newCookies,
      ...cookie.split(";").map((item) => item.trim()),
    ]),
  ].join("; ");
  return mergedCookies;
};

const handlePlayResponse = (playResponse) => {
  let playData = JSON.parse(playResponse);
  if (playData.status !== 200 || playData.code !== 0) {
    if (playData.message.includes("文件已删除") || playData.message.includes("file not found")) {
      return null;
    }
    throw new Error(`Failed to get video playback links: ${playData.message}`);
  }
  return playData;
};

if (isQuark) {
  while (retryCountForPlay < 5 && !videoLinks) {
    try {
      let playParams = JSON.stringify({
        fid: saveAsTopFid,
        resolutions: "normal,low,high,super,2k,4k",
        supports: "fmp4,m3u8",
      });
      let playResponse = await fetchPlayResponse(
        playUrl,
        playParams,
        `Referer: ${origin}`
      );
      let playData = handlePlayResponse(playResponse);
      if (!playData) break;

      videoLinks = playData.data.video_list
        .map((video) => {
          const url = video.video_info && video.video_info.url ? video.video_info.url : null;
          if (url) {
            return {
              url: url,
              resolution: video.resolution,
              member_right: video.member_right,
              width: video.video_info.width,
              height: video.video_info.height,
            };
          }
        })
        .filter((video) => video !== undefined);

      if (mySetCookie) {
        const newCookies = mySetCookie
          .split(",")
          .map((item) => item.split(";")[0].trim())
          .filter((item) => item !== undefined);
        cookie = mergeCookies(newCookies);
      }
    } catch (error) {
      retryCountForPlay++;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
} else {
  let playParams = JSON.stringify({ fids: [saveAsTopFid] });
  let playResponse = await fetchPlayResponse(
    "https://pc-api.uc.cn/1/clouddrive/file/download?pr=UCBrowser&fr=pc",
    playParams,
    `Content-Type: application/json;charset=UTF-8\nReferer: ${origin}`
  );
  let playData = handlePlayResponse(playResponse);
  if (!playData) return null;

  let downloadUrl = playData.data[0].download_url;
  if (downloadUrl) {
    videoLinks = [{ url: downloadUrl }];

    if (mySetCookie) {
      const newCookies = mySetCookie
        .split(",")
        .map((item) => item.split(";")[0].trim())
        .filter((item) => item !== undefined);
      cookie = mergeCookies(newCookies);
    }
  }
}

         if (!videoLinks) {
           retryCount++;
           if (retryCount < 5) {
             //console.log("文件已删除，重新执行 Step 4 + Step 5  "+retryCount.toString());
             await new Promise((resolve) => setTimeout(resolve, 5000));
           } else {
             throw new Error(
               "Failed to get video playback links after 3 attempts."
             );
           }
         }
       }

       // Step 7: Delete the file
       const deleteParams = JSON.stringify({
         action_type: 2,
         filelist: [saveAsTopFid],
         exclude_fids: [],
       });
       const deleteResponse = await 访问网页(
         deleteUrl,
         1,
         deleteParams,
         cookie,
         isQuark
           ? "Content-Type: application/json\nOrigin: https://pan.quark.cn\nReferer: https://pan.quark.cn/"
           : "Content-Type: application/json\nOrigin: https://drive.uc.cn\nReferer: https://drive.uc.cn/"
       );
       const deleteData = JSON.parse(deleteResponse);
       if (deleteData.status !== 200 || deleteData.code !== 0) {
         throw new Error(`Failed to delete file: ${deleteData.message}`);
       }



       //return {
       //    saveAsTopFid: saveAsTopFid,
       //     videoLinks: videoLinks
       //};
       await toast("影片链接获取完毕,尝试播放...", 2);
       const result = {
         parse: 1,
         header: `Cookie: ${cookie}\nOrigin: ${origin}\nReferer: ${origin}`,
         playUrl: "",
         url: "",
       };
       if (videoLinks.length > 0) {
         result.url = videoLinks[0].url;
       }
       console.log(JSON.stringify(result));
       return JSON.stringify(result);
     } catch (error) {


    let errorMessage;
    if (Array.isArray(error)) {
        errorMessage = error.map(err => {
            if (typeof err === 'object' && err !== null) {
                return err.message || JSON.stringify(err, null, 2);
            } else if (typeof err === 'string') {
                return err;
            } else {
                return String(err);
            }
        }).join('\n');
    } else if (typeof error === 'object' && error !== null) {
        errorMessage = error.message || JSON.stringify(error, null, 2);
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        errorMessage = String(error);
    }

         await toast(`获取影片链接失败: ${errorMessage}`,5);
       //console.error(error);
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
   
   
   
   // 获取uc、夸克网盘视频文件列表
   async function fetchVideoFiles(url) {
     try {
       const pwd_id = extractShareId(url);
       const isQuark = url.includes(".uc.cn")
         ? false
         : true;
       // Step 1: Send POST request to get stoken
       const postUrl = url.includes(".uc.cn")
         ? "https://pc-api.uc.cn/1/clouddrive/share/sharepage/v2/detail?pr=UCBrowser&fr=pc"
         : "https://drive-h.quark.cn/1/clouddrive/share/sharepage/token?pr=ucpro&fr=pc&uc_param_str=&__dt=300&__t=" + Date.now();
       const postParams = url.includes(".uc.cn")
         ? JSON.stringify({ pwd_id: pwd_id, passcode: "", force: 0, page: 1, size: 50, fetch_banner: 1, fetch_share: 1, fetch_total: 1, sort: "file_type:asc,file_name:asc", banner_platform: "other", web_platform: "mac", fetch_error_background: 1 })
         : JSON.stringify({ pwd_id: pwd_id, passcode: "" });
       const postResponse = await 访问网页(postUrl, 1, postParams, null, "Content-Type: application/json;charset=UTF-8");
       if (postResponse.includes("好友已取消了分享")) {
         return '该网盘已取消了分享$1';
       }
       const postData = JSON.parse(postResponse);
       if (postData.status !== 200 || postData.code !== 0) {
         throw new Error(`Failed to get stoken: ${postData.message}`);
       }
       const stoken = url.includes(".uc.cn")
         ? postData.data.token_info.stoken
         : postData.data.stoken;
   
       // Step 2: Fetch files from a given pdir_fid
       async function fetchFiles(pdir_fid) {
         let page = 1;
         let allFiles = [];
         while (true) {
           const getUrl = url.includes(".uc.cn")
             ? `https://pc-api.uc.cn/1/clouddrive/share/sharepage/detail?pr=UCBrowser&fr=pc&pwd_id=${pwd_id}&stoken=${encodeURIComponent(stoken)}&pdir_fid=${pdir_fid}&force=0&_page=${page}&_size=50&_fetch_banner=0&_fetch_share=0&_fetch_total=1&_sort=file_type:asc,file_name:asc`
             : `https://drive-h.quark.cn/1/clouddrive/share/sharepage/detail?pr=ucpro&fr=pc&uc_param_str=&pwd_id=${pwd_id}&stoken=${encodeURIComponent(stoken)}&pdir_fid=${pdir_fid}&force=0&_page=${page}&_size=50&_fetch_banner=1&_fetch_share=1&_fetch_total=1&_sort=file_type:asc,updated_at:desc&__dt=494&__t=${Date.now()}`;
   
           const getResponse = await 访问网页(getUrl, 0);
           const getData = JSON.parse(getResponse);
           if (getData.status !== 200 || getData.code !== 0) {
             throw new Error(`Failed to get file list: ${getData.message}`);
           }
           allFiles = allFiles.concat(getData.data.list);
           // If the list size is less than 50, break the loop
           if (getData.data.list.length < 50) {
             break;
           }
           page++;
         }
   
         return allFiles;
       }
   
       // Step 3: Recursively fetch all video files
       async function fetchAllVideos(pdir_fid) {
         const files = await fetchFiles(pdir_fid);
         const videos = [];
         for (const file of files) {
           if (file.obj_category && file.obj_category.startsWith("video")) {
             videos.push({
               file_name: file.file_name,
               size: file.size,
               fid: file.fid,
               pdir_fid: file.pdir_fid,
               share_fid_token: file.share_fid_token
             });
           } else if (file.file_type === 0) {
             // If it's a folder, recursively fetch videos from this folder
             const folderVideos = await fetchAllVideos(file.fid);
             videos.push(...folderVideos);
           }
         }
         return videos;
       }
   
       // Step 4: Sort videos by file name
       function sortVideos(videos) {
         return videos.sort((a, b) => {
           const extractNumbers = (fileName) => {
             const regex = /(\d+)/g;
             const matches = fileName.match(regex);
             return matches ? matches.map(Number) : [];
           };
   
           const numsA = extractNumbers(a.file_name);
           const numsB = extractNumbers(b.file_name);
   
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
   
       // Step 6: Append formatted file size to file name
       function appendFileSize(videos) {
         return videos.map(video => {
           const formattedSize = formatFileSize(video.size);
           return {
             ...video,
             file_name: `${video.file_name} [${formattedSize}]`
           };
         });
       }
   
       // Step 7: Format the result as specified
       function formatResult(videos, pwd_id, stoken) {
         return videos.map(video => {
           const result = {
             fid_list: [video.fid],
             fid_token_list: [video.share_fid_token],
             fid_size: video.size,
             to_pdir_fid: "暂定",
             pwd_id: pwd_id,
             isQuark: isQuark,
             stoken: stoken,
             pdir_fid: "0",
             scene: "link"
           };
           //return `${video.file_name}#${JSON.stringify(result)}`;
           return `${video.file_name}$${encodeURIComponent(JSON.stringify(result))}`;
         }).join('#');
       }
   
       // Start fetching from the root directory (pdir_fid=0)
       const allVideos = await fetchAllVideos(0);
       const sortedVideos = sortVideos(allVideos);
       const videosWithSize = appendFileSize(sortedVideos);
       const formattedResult = formatResult(videosWithSize, pwd_id, stoken);
       return formattedResult;
   
     } catch (error) {
       console.error(error);
       return null;
     }
   }
   
   
   
   async function homeContent() {
       // 定义分类数据
       const classData = [
         { "type_id": 2, "type_name": "古装穿越" },
         { "type_id": 3,  "type_name": "甜宠虐恋" },
         { "type_id": 5,  "type_name": "世纪重生" },
         { "type_id": 7,  "type_name": "末世求生" },
         { "type_id": 1, "type_name": "都市牛人" },
         { "type_id": 4, "type_name": "灵异惊悚" },
         { "type_id": 6, "type_name": "修仙玄幻" },
         { "type_id": 8, "type_name": "海外短剧" }
       ];
   
       // 定义分类数据
       const filterData = {
         "2": [
           {
             "key": "cateId",
             "name": "剧情",
             "value": [
               { "n": "全部", "v": "" },
               { "n": "爱情", "v": "爱情" },
               { "n": "古装", "v": "古装" },
               { "n": "喜剧", "v": "喜剧" },
               { "n": "励志", "v": "励志" },
               { "n": "历史", "v": "历史" },
               { "n": "穿越", "v": "穿越" },
               { "n": "家庭", "v": "家庭" },
               { "n": "成长", "v": "成长" },
               { "n": "宫廷", "v": "宫廷" },
               { "n": "悬疑", "v": "悬疑" },
               { "n": "言情", "v": "言情" },
               { "n": "奇幻", "v": "奇幻" },
               { "n": "冒险", "v": "冒险" },
               { "n": "权谋", "v": "权谋" },
               { "n": "商战", "v": "商战" },
               { "n": "复仇", "v": "复仇" },
               { "n": "神话", "v": "神话" },
               { "n": "政治", "v": "政治" },
               { "n": "战争", "v": "战争" },
               { "n": "情感", "v": "情感" }
             ]
           },
           {
             "key": "letter",
             "name": "字母",
             "value": [
               { "n": "全部", "v": "" },
               { "n": "A", "v": "A" },
               { "n": "B", "v": "B" },
               { "n": "C", "v": "C" },
               { "n": "D", "v": "D" },
               { "n": "E", "v": "E" },
               { "n": "F", "v": "F" },
               { "n": "G", "v": "G" },
               { "n": "H", "v": "H" },
               { "n": "I", "v": "I" },
               { "n": "J", "v": "J" },
               { "n": "K", "v": "K" },
               { "n": "L", "v": "L" },
               { "n": "M", "v": "M" },
               { "n": "N", "v": "N" },
               { "n": "O", "v": "O" },
               { "n": "P", "v": "P" },
               { "n": "Q", "v": "Q" },
               { "n": "R", "v": "R" },
               { "n": "S", "v": "S" },
               { "n": "T", "v": "T" },
               { "n": "U", "v": "U" },
               { "n": "V", "v": "V" },
               { "n": "W", "v": "W" },
               { "n": "X", "v": "X" },
               { "n": "Y", "v": "Y" },
               { "n": "Z", "v": "Z" }
             ]
           },
           {
             "key": "by",
             "name": "排序",
             "value": [
               { "n": "时间", "v": "" },
               { "n": "人气", "v": "hits" },
               { "n": "评分", "v": "score" }
             ]
           }
         ],
         "3": [
           {
             "key": "cateId",
             "name": "剧情",
             "value": [
               { "n": "全部", "v": "" },
               { "n": "爱情", "v": "爱情" },
               { "n": "家庭", "v": "家庭" },
               { "n": "励志", "v": "励志" },
               { "n": "成长", "v": "成长" },
               { "n": "喜剧", "v": "喜剧" },
               { "n": "悬疑", "v": "悬疑" },
               { "n": "复仇", "v": "复仇" },
               { "n": "商战", "v": "商战" },
               { "n": "古装", "v": "古装" },
               { "n": "伦理", "v": "伦理" },
               { "n": "情感", "v": "情感" },
               { "n": "职场", "v": "职场" },
               { "n": "青春", "v": "青春" },
               { "n": "豪门", "v": "豪门" },
               { "n": "都市", "v": "都市" },
               { "n": "婚姻", "v": "婚姻" },
               { "n": "家庭伦理", "v": "家庭伦理" },
               { "n": "穿越", "v": "穿越" },
               { "n": "历史", "v": "历史" },
               { "n": "友情", "v": "友情" }
             ]
           },
           {
             "key": "letter",
             "name": "字母",
             "value": [
               { "n": "全部", "v": "" },
               { "n": "A", "v": "A" },
               { "n": "B", "v": "B" },
               { "n": "C", "v": "C" },
               { "n": "D", "v": "D" },
               { "n": "E", "v": "E" },
               { "n": "F", "v": "F" },
               { "n": "G", "v": "G" },
               { "n": "H", "v": "H" },
               { "n": "I", "v": "I" },
               { "n": "J", "v": "J" },
               { "n": "K", "v": "K" },
               { "n": "L", "v": "L" },
               { "n": "M", "v": "M" },
               { "n": "N", "v": "N" },
               { "n": "O", "v": "O" },
               { "n": "P", "v": "P" },
               { "n": "Q", "v": "Q" },
               { "n": "R", "v": "R" },
               { "n": "S", "v": "S" },
               { "n": "T", "v": "T" },
               { "n": "U", "v": "U" },
               { "n": "V", "v": "V" },
               { "n": "W", "v": "W" },
               { "n": "X", "v": "X" },
               { "n": "Y", "v": "Y" },
               { "n": "Z", "v": "Z" }
             ]
           },
           {
             "key": "by",
             "name": "排序",
             "value": [
               { "n": "时间", "v": "" },
               { "n": "人气", "v": "hits" },
               { "n": "评分", "v": "score" }
             ]
           }
         ],
         "5": [
           {
             "key": "cateId",
             "name": "剧情",
             "value": [
                { "n": "全部", "v": "" },
                { "n": "爱情", "v": "爱情" },
                { "n": "励志", "v": "励志" },
                { "n": "家庭", "v": "家庭" },
                { "n": "喜剧", "v": "喜剧" },
                { "n": "成长", "v": "成长" },
                { "n": "复仇", "v": "复仇" },
                { "n": "古装", "v": "古装" },
                { "n": "悬疑", "v": "悬疑" },
                { "n": "青春", "v": "青春" },
                { "n": "商战", "v": "商战" },
                { "n": "科幻", "v": "科幻" },
                { "n": "穿越", "v": "穿越" },
                { "n": "历史", "v": "历史" },
                { "n": "情感", "v": "情感" },
                { "n": "剧情", "v": "剧情" },
                { "n": "冒险", "v": "冒险" },
                { "n": "重生", "v": "重生" },
                { "n": "言情", "v": "言情" },
                { "n": "奇幻", "v": "奇幻" },
                { "n": "都市", "v": "都市" },
             ]
           },
           {
            "key": "letter",
            "name": "字母",
            "value": [
              { "n": "全部", "v": "" },
              { "n": "A", "v": "A" },
              { "n": "B", "v": "B" },
              { "n": "C", "v": "C" },
              { "n": "D", "v": "D" },
              { "n": "E", "v": "E" },
              { "n": "F", "v": "F" },
              { "n": "G", "v": "G" },
              { "n": "H", "v": "H" },
              { "n": "I", "v": "I" },
              { "n": "J", "v": "J" },
              { "n": "K", "v": "K" },
              { "n": "L", "v": "L" },
              { "n": "M", "v": "M" },
              { "n": "N", "v": "N" },
              { "n": "O", "v": "O" },
              { "n": "P", "v": "P" },
              { "n": "Q", "v": "Q" },
              { "n": "R", "v": "R" },
              { "n": "S", "v": "S" },
              { "n": "T", "v": "T" },
              { "n": "U", "v": "U" },
              { "n": "V", "v": "V" },
              { "n": "W", "v": "W" },
              { "n": "X", "v": "X" },
              { "n": "Y", "v": "Y" },
              { "n": "Z", "v": "Z" }
            ]
          },
           {
             "key": "by",
             "name": "排序",
             "value": [
               { "n": "时间", "v": "" },
               { "n": "人气", "v": "hits" },
               { "n": "评分", "v": "score" }
             ]
           }
         ],
         "7": [
            {
                "key": "cateId",
                "name": "剧情",
                "value": [
                   { "n": "全部", "v": "" },
                   { "n": "爱情", "v": "爱情" },
                   { "n": "科幻", "v": "科幻" },
                   { "n": "喜剧", "v": "喜剧" },
                   { "n": "悬疑", "v": "悬疑" },
                   { "n": "冒险", "v": "冒险" },
                   { "n": "励志", "v": "励志" },
                   { "n": "惊悚", "v": "惊悚" },
                   { "n": "动作", "v": "动作" },
                   { "n": "末世", "v": "末世" },
                   { "n": "灾难", "v": "灾难" },
                   { "n": "生存", "v": "生存" },
                   { "n": "奇幻", "v": "奇幻" },
                   { "n": "推理", "v": "推理" },
                   { "n": "末世题材", "v": "末世题材" },
                   { "n": "末日", "v": "末日" },
                   { "n": "金融", "v": "金融" },
                   { "n": "人际关系", "v": "人际关系" },
                   { "n": "伦理", "v": "伦理" },
                   { "n": "创新", "v": "创新" },
                   { "n": "剧情", "v": "剧情" }
                ]
              },
           {
             "key": "letter",
             "name": "字母",
             "value": [
               { "n": "全部", "v": "" },
               { "n": "A", "v": "A" },
               { "n": "B", "v": "B" },
               { "n": "C", "v": "C" },
               { "n": "D", "v": "D" },
               { "n": "E", "v": "E" },
               { "n": "F", "v": "F" },
               { "n": "G", "v": "G" },
               { "n": "H", "v": "H" },
               { "n": "I", "v": "I" },
               { "n": "J", "v": "J" },
               { "n": "K", "v": "K" },
               { "n": "L", "v": "L" },
               { "n": "M", "v": "M" },
               { "n": "N", "v": "N" },
               { "n": "O", "v": "O" },
               { "n": "P", "v": "P" },
               { "n": "Q", "v": "Q" },
               { "n": "R", "v": "R" },
               { "n": "S", "v": "S" },
               { "n": "T", "v": "T" },
               { "n": "U", "v": "U" },
               { "n": "V", "v": "V" },
               { "n": "W", "v": "W" },
               { "n": "X", "v": "X" },
               { "n": "Y", "v": "Y" },
               { "n": "Z", "v": "Z" }
             ]
           },
           {
             "key": "by",
             "name": "排序",
             "value": [
               { "n": "时间", "v": "" },
               { "n": "人气", "v": "hits" },
               { "n": "评分", "v": "score" }
             ]
           }
         ],
         "1": [
            {
                "key": "cateId",
                "name": "剧情",
                "value": [
                  { "n": "全部", "v": "" },
                  { "n": "爱情", "v": "爱情" },
                  { "n": "励志", "v": "励志" },
                  { "n": "家庭", "v": "家庭" },
                  { "n": "喜剧", "v": "喜剧" },
                  { "n": "古装", "v": "古装" },
                  { "n": "成长", "v": "成长" },
                  { "n": "悬疑", "v": "悬疑" },
                  { "n": "冒险", "v": "冒险" },
                  { "n": "历史", "v": "历史" },
                  { "n": "奇幻", "v": "奇幻" },
                  { "n": "动作", "v": "动作" },
                  { "n": "神话", "v": "神话" },
                  { "n": "商战", "v": "商战" },
                  { "n": "情感", "v": "情感" },
                  { "n": "武侠", "v": "武侠" },
                  { "n": "剧情", "v": "剧情" },
                  { "n": "医疗", "v": "医疗" },
                  { "n": "都市", "v": "都市" },
                  { "n": "职场", "v": "职场" },
                  { "n": "家庭伦理", "v": "家庭伦理" },
                  { "n": "战争", "v": "战争" },
                  { "n": "青春", "v": "青春" },
                  { "n": "推理", "v": "推理" },
                  { "n": "复仇", "v": "复仇" },
                  { "n": "犯罪", "v": "犯罪" },
                  { "n": "修真", "v": "修真" }
                ]
              },
           {
             "key": "letter",
             "name": "字母",
             "value": [
               { "n": "全部", "v": "" },
               { "n": "A", "v": "A" },
               { "n": "B", "v": "B" },
               { "n": "C", "v": "C" },
               { "n": "D", "v": "D" },
               { "n": "E", "v": "E" },
               { "n": "F", "v": "F" },
               { "n": "G", "v": "G" },
               { "n": "H", "v": "H" },
               { "n": "I", "v": "I" },
               { "n": "J", "v": "J" },
               { "n": "K", "v": "K" },
               { "n": "L", "v": "L" },
               { "n": "M", "v": "M" },
               { "n": "N", "v": "N" },
               { "n": "O", "v": "O" },
               { "n": "P", "v": "P" },
               { "n": "Q", "v": "Q" },
               { "n": "R", "v": "R" },
               { "n": "S", "v": "S" },
               { "n": "T", "v": "T" },
               { "n": "U", "v": "U" },
               { "n": "V", "v": "V" },
               { "n": "W", "v": "W" },
               { "n": "X", "v": "X" },
               { "n": "Y", "v": "Y" },
               { "n": "Z", "v": "Z" }
             ]
           },
           {
             "key": "by",
             "name": "排序",
             "value": [
               { "n": "时间", "v": "" },
               { "n": "人气", "v": "hits" },
               { "n": "评分", "v": "score" }
             ]
           }
         ],
         "4": [
            {
                "key": "cateId",
                "name": "剧情",
                "value": [
                  { "n": "全部", "v": "" },
                  { "n": "悬疑", "v": "悬疑" },
                  { "n": "爱情", "v": "爱情" },
                  { "n": "惊悚", "v": "惊悚" },
                  { "n": "古装", "v": "古装" },
                  { "n": "喜剧", "v": "喜剧" },
                  { "n": "奇幻", "v": "奇幻" },
                  { "n": "神秘", "v": "神秘" },
                  { "n": "冒险", "v": "冒险" },
                  { "n": "家庭", "v": "家庭" },
                  { "n": "神话", "v": "神话" },
                  { "n": "励志", "v": "励志" },
                  { "n": "推理", "v": "推理" },
                  { "n": "剧情", "v": "剧情" },
                  { "n": "恐怖", "v": "恐怖" },
                  { "n": "伦理", "v": "伦理" },
                  { "n": "情感", "v": "情感" },
                  { "n": "成长", "v": "成长" },
                  { "n": "动作", "v": "动作" },
                  { "n": "武侠", "v": "武侠" },
                  { "n": "法律", "v": "法律" }
                ]
              },
           {
             "key": "letter",
             "name": "字母",
             "value": [
               { "n": "全部", "v": "" },
               { "n": "A", "v": "A" },
               { "n": "B", "v": "B" },
               { "n": "C", "v": "C" },
               { "n": "D", "v": "D" },
               { "n": "E", "v": "E" },
               { "n": "F", "v": "F" },
               { "n": "G", "v": "G" },
               { "n": "H", "v": "H" },
               { "n": "I", "v": "I" },
               { "n": "J", "v": "J" },
               { "n": "K", "v": "K" },
               { "n": "L", "v": "L" },
               { "n": "M", "v": "M" },
               { "n": "N", "v": "N" },
               { "n": "O", "v": "O" },
               { "n": "P", "v": "P" },
               { "n": "Q", "v": "Q" },
               { "n": "R", "v": "R" },
               { "n": "S", "v": "S" },
               { "n": "T", "v": "T" },
               { "n": "U", "v": "U" },
               { "n": "V", "v": "V" },
               { "n": "W", "v": "W" },
               { "n": "X", "v": "X" },
               { "n": "Y", "v": "Y" },
               { "n": "Z", "v": "Z" }
             ]
           },
           {
             "key": "by",
             "name": "排序",
             "value": [
               { "n": "时间", "v": "" },
               { "n": "人气", "v": "hits" },
               { "n": "评分", "v": "score" }
             ]
           }
         ],
         "6": [
            {
                "key": "cateId",
                "name": "剧情",
                "value": [
                  { "n": "全部", "v": "" },
                  { "n": "爱情", "v": "爱情" },
                  { "n": "古装", "v": "古装" },
                  { "n": "神话", "v": "神话" },
                  { "n": "励志", "v": "励志" },
                  { "n": "奇幻", "v": "奇幻" },
                  { "n": "喜剧", "v": "喜剧" },
                  { "n": "冒险", "v": "冒险" },
                  { "n": "家庭", "v": "家庭" },
                  { "n": "成长", "v": "成长" },
                  { "n": "悬疑", "v": "悬疑" },
                  { "n": "武侠", "v": "武侠" },
                  { "n": "仙侠", "v": "仙侠" },
                  { "n": "医疗", "v": "医疗" },
                  { "n": "动作", "v": "动作" },
                  { "n": "修真", "v": "修真" },
                  { "n": "历史", "v": "历史" },
                  { "n": "都市", "v": "都市" },
                  { "n": "情感", "v": "情感" },
                  { "n": "伦理", "v": "伦理" },
                  { "n": "惊悚", "v": "惊悚" }
                ]
              },
           {
             "key": "letter",
             "name": "字母",
             "value": [
               { "n": "全部", "v": "" },
               { "n": "A", "v": "A" },
               { "n": "B", "v": "B" },
               { "n": "C", "v": "C" },
               { "n": "D", "v": "D" },
               { "n": "E", "v": "E" },
               { "n": "F", "v": "F" },
               { "n": "G", "v": "G" },
               { "n": "H", "v": "H" },
               { "n": "I", "v": "I" },
               { "n": "J", "v": "J" },
               { "n": "K", "v": "K" },
               { "n": "L", "v": "L" },
               { "n": "M", "v": "M" },
               { "n": "N", "v": "N" },
               { "n": "O", "v": "O" },
               { "n": "P", "v": "P" },
               { "n": "Q", "v": "Q" },
               { "n": "R", "v": "R" },
               { "n": "S", "v": "S" },
               { "n": "T", "v": "T" },
               { "n": "U", "v": "U" },
               { "n": "V", "v": "V" },
               { "n": "W", "v": "W" },
               { "n": "X", "v": "X" },
               { "n": "Y", "v": "Y" },
               { "n": "Z", "v": "Z" }
             ]
           },{
             "key": "by",
             "name": "排序",
             "value": [
               { "n": "时间", "v": "" },
               { "n": "人气", "v": "hits" },
               { "n": "评分", "v": "score" }
             ]
           }
         ],
         "8": [
            {
                "key": "cateId",
                "name": "剧情",
                "value": [
                  { "n": "全部", "v": "" },
                  { "n": "古装", "v": "古装" },
                  { "n": "战争", "v": "战争" },
                  { "n": "青春偶像", "v": "青春偶像" },
                  { "n": "喜剧", "v": "喜剧" },
                  { "n": "家庭", "v": "家庭" },
                  { "n": "犯罪", "v": "犯罪" },
                  { "n": "动作", "v": "动作" },
                  { "n": "奇幻", "v": "奇幻" },
                  { "n": "剧情", "v": "剧情" },
                  { "n": "历史", "v": "历史" },
                  { "n": "经典", "v": "经典" },
                  { "n": "乡村", "v": "乡村" },
                  { "n": "情景", "v": "情景" },
                  { "n": "商战", "v": "商战" },
                  { "n": "网剧", "v": "网剧" },
                  { "n": "其他", "v": "其他" }
                ]
              },{
             "key": "by",
             "name": "排序",
             "value": [
               { "n": "时间", "v": "" },
               { "n": "人气", "v": "hits" },
               { "n": "评分", "v": "score" }
             ]
           }
         ]
       };
   
       return JSON.stringify({
         code: 1,
         msg: "数据列表",
         page: "1",
         limit: "20",
         class: classData,
         filters: filterData
       });
   }
   
   
   // 定义一个函数来提取影片信息
   async function searchContent(keyword) {
       try {
           const encodedKeyword = encodeURIComponent(keyword);
           const url = `${webSite}/djsearch/${encodedKeyword}-------------.html`;
           const html = await 访问网页(url);
           const items = 文本_取中间_批量(html,'<li class="col8">','</li>');
           const list = items.map((item) => {
               const vod_name = 文本_取中间(item,'title="','"') || '';
               const vod_pic = 文本_取中间(item,'data-original="','"') || '';
               const vod_id = 文本_取中间(item,'href="','"') || '';
               const vod_remarks = 文本_取中间(item,'<p class="text">','</p>') || '';
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
               page: "1",
               limit: "20",
               list: list
           });
       } catch (error) {
           console.error('Error fetching movie data:', error);
           return JSON.stringify({
               code: 0,
               msg: "获取数据失败",
               page: "1",
               limit: "20",
               list: []
           });
       }
   }
   // 使用示例
   //searchContent('我的').then(data => {
   //    console.log(data);
   //});
   
   //homeContent()
   //  .then(data => console.log(data))
   //  .catch(error => console.error('Error:', error));
   
   //获取影视分类列表
   async function categoryContent(tid, pg = 1, extend) {
     try {
       // 解析 extend 参数
       let extendObj = extend ? JSON.parse(extend) : null;
       let url = `${webSite}/djshow/${tid}-{area}-{by}-{cateId}--{letter}---${pg}---{year}.html`;
       // 替换 URL 中的占位符
       if (extendObj) {
         for (const [key, value] of Object.entries(extendObj)) {
           const placeholder = `{${key}}`;
           const encodedValue = encodeURIComponent(value || ''); // 对 value 进行 URL 编码
           url = url.replace(new RegExp(placeholder, 'g'), encodedValue);
         }
       }
       // 删除剩余的 {} 包围的占位符
       url = url.replace(/{(.*?)}/g, '');
       console.log(url);
       const html = await 访问网页(url);
       // 使用正则表达式匹配所有的电影项
       const itemRegex = /<li class="col8">([\s\S]*?)<\/li>/g;
       const items = html.match(itemRegex) || [];
       const list = items.map((item) => {
         console.log(item);
         const vod_name = item.match(/title="([^"]+)"/)?.[1].trim() || '';
         const vod_pic = item.match(/data-original="([^"]+)"/)?.[1] || '';
         const vod_link = item.match(/ href="([^"]+)"/)?.[1] || '';
         const vod_remarks = vod_name.match(/(\d+)集/)?.[0]?.trim() || '';
         return {
           vod_id: vod_link,
           vod_name: vod_name,
           vod_remarks: vod_remarks,
           vod_pic: vod_pic
         };
       });
       return JSON.stringify({
         code: 1,
         msg: "数据列表",
         page: "1",
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
   //categoryContent('2',1)
   //  .then(data => console.log(data))
   //  .catch(error => console.error('Error:', error));
   

   //detailContent('/djinfo/xiaoxiaochuniangbuhaore64jiquanlishiraoampshixuejing.html')
   //  .then(data => console.log(data))
   //  .catch(error => console.error('Error:', error));

   //获取影视详情信息
   async function detailContent(ids) {
     const url = `${webSite}${ids}`;
     try {
       //console.log(url);
       //await toast('正在加载影片详情页',2);
       const html = await 访问网页(url);
       // 使用正则表达式提取信息
       const vod_id = ids;
       const vod_name = 文本_取中间(html, '<div class="shoutu-media-bd"><h1>', '</h1>').replace(/amp;/g,'') || '未知片名';
        console.log(vod_name);
       const vod_year = '';
       //console.log(vod_year);
       const vod_director = 文本_取中间(html, '<div>导演：', '</div>') || '未知';
        //console.log(vod_director);
       const vod_actor = 文本_取中间(html, '<div>主演：', '</div>') || '未知';
       //console.log(vod_actor);
       const vod_pic = 文本_取中间(html, '<img class="lazyload" data-original="', '"') || '';
       //console.log(vod_pic);
       let vod_remarks='';
        //console.log(vod_remarks);
       const vod_content = 移除html代码(文本_取中间(html, '简介：</span>', '<')) || '暂无剧情';
       //console.log(vod_content);
       const cloudLinks = html.match(/<a class="btn btn-radius btn-main1" href="(.*?)"/g).map(link => link.replace(/<a class="btn btn-radius btn-main1" href="/, '').replace(/"/g, '')) || [];
       //console.log(cloudLinks);
       // 初始化 vod_play_from 和 vod_play_url
       let vod_play_from = [];
       let vod_play_url = [];
       // 记录云盘名称的使用次数
       const cloudNameCount = {};
       //await toast('正在加载网盘剧集信息',5);
   for (let i = 0; i < cloudLinks.length; i++) {
     const link = cloudLinks[i];
     if (link.includes('uc.cn') || link.includes('quark.cn')) {
      let baseCloudName = link.includes('uc.cn') ? 'UC网盘' : '夸克网盘'; // 对应 vod_play_from
       await toast(`正在获取网盘剧集信息`, 2); // 2 秒的持续时间
       const result = await fetchVideoFiles(link); // 所有播放链接对应 vod_play_url
       if (result) { // 检查 result 是否为空
         // 检查云盘名称是否已经使用过
         if (cloudNameCount[baseCloudName] === undefined) {
           cloudNameCount[baseCloudName] = 1;
           vod_play_from.push(baseCloudName);
         } else {
           cloudNameCount[baseCloudName]++;
           vod_play_from.push(`${baseCloudName}${cloudNameCount[baseCloudName]}`);
         }
   
         vod_play_url.push(result);
       }
     }
   }
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
           vod_play_from: vod_play_from.join('$$$'),
           vod_play_url: vod_play_url.join('$$$')
         }]
       };
   
       // 处理 vod_play_from 和 vod_play_url
       const playFromList = movieDetails.list[0].vod_play_from.split('$$$');
       const playUrlList = movieDetails.list[0].vod_play_url.split('$$$');
   
       const filteredPlayFromList = [];
       const filteredPlayUrlList = [];
   
       for (let i = 0; i < playUrlList.length; i++) {
         if (!playUrlList[i].includes('该网盘已取消了分享')) {
           filteredPlayFromList.push(playFromList[i]);
           filteredPlayUrlList.push(playUrlList[i]);
         }
       }
   
       movieDetails.list[0].vod_play_from = filteredPlayFromList.join('$$$');
       movieDetails.list[0].vod_play_url = filteredPlayUrlList.join('$$$');
   
       // 返回 JSON 字符串
       console.log(JSON.stringify(movieDetails));
       return JSON.stringify(movieDetails);
     } catch (error) {
       console.error('Error fetching movie details:', error);
       return JSON.stringify({ code: 0, msg: "获取数据失败", error: error.message });
     }
   }
   

   
   
   
   
   
   
