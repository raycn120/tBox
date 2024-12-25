export async function toast(msg, seconds = 2) {
  //await sendMessage("toast", JSON.stringify({ msg: msg, seconds: seconds }));
  console.log(msg);
}


//type参数实际中为0时使用http库，为1时使用dio库。调试时无效
export async function req(url, options, type = 0) {
  options = options || {};
  // 如果 method 为空，默认设置为 GET
  if (!options.method) {
      options.method = 'GET';
  }
  try {
      let response;
      if (type === 0) {
          // 使用 fetch API
          response = await fetch(url, options);
      } else {
          // 使用 fetch API 的另一种方式（这里只是为了保持函数一致性，实际上与上面相同）
          response = await fetch(url, options);
      }
      const responseClone = response.clone();
      const headers = {};
      response.headers.forEach((value, key) => {
          if (['set-cookie', 'vary', 'link', 'warning'].includes(key.toLowerCase())) {
              if (!headers[key]) {
                  headers[key] = [];
              }
              headers[key].push(value);
          } else {
              headers[key] = value;
          }
      });
    const jsonHeaders = JSON.stringify(headers);
      const customResponse = {
          ok: response.ok,
          statusText: response.statusText,
          status: response.status,
          url: response.url,
          text: async () => await response.text(),
          json: async () => await response.json(),
          blob: async () => await response.blob(),
          clone: () => responseClone,
          headers: jsonHeaders, // 返回 JSON 格式的 headers
      };
      if (response.ok) {
          return customResponse;
      } else {
          throw customResponse;
      }
  } catch (error) {
      throw error;
  }
}


/*
async function req(url, options, type = 0) {
    options = options || {};
    try {
        let request;
        if (type === 1) {
            // 使用 dio库
            request = await sendMessage("dio", JSON.stringify({ "url": url, "options": options }));
        } else {
            // 使用 http库
            request = await sendMessage("fetch", JSON.stringify({ "url": url, "options": options }));
        }
        const response = {
            ok: ((request.status / 100) | 0) == 2, // 200-299
            statusText: request.statusText,
            status: request.status,
            url: request.responseURL,
            text: () => Promise.resolve(request.responseText),
            data: () => Promise.resolve(request.data),//返回16进制数据
            json: () => Promise.resolve(request.responseText).then(JSON.parse),
            blob: () => Promise.resolve(new Blob([request.response])),
            clone: () => response,
            headers: request.headers,
        };
  
        if (request.ok) {
            return response;
        } else {
            throw response;
        }
    } catch (error) {
        throw error;
    }
  }
*/


//持久化储存数据
export async function setStorage(key, value) {
    await sendMessage('setStorage', JSON.stringify({ key: key, value: value }));
}


//持久化读取数据
export async function getStorage(key) {
    try {
        const response = await sendMessage('getStorage', JSON.stringify({ key }));
        return response.value || '';
    } catch (error) {
        console.error('Error in getStorage:', error);
        return '';
    }
}


export function 移除html代码(text) {
    return text
      .replace(/<[^>]+>|&[^;]+;|[\\/]|\s+/g, '') // 删除 HTML 标签、HTML 实体、反斜杠、正斜杠、换行符和空白字符
      .trim(); // 删除文本前后的空格
  }


   /*
   参数说明：
   fullText: 完整的文本内容。
   leftText: 左边文本，用于定位中间内容的起始位置。
   rightText: 右边文本，用于定位中间内容的结束位置。
   startPos: 起始查找位置，默认为 0，表示从文本的第一个字符开始查找。
   includeLeft: 是否在结果中包含左边文本，默认为 false。
   includeRight: 是否在结果中包含右边文本，默认为 false。
   */
   export function 文本_取中间(fullText, leftText, rightText, startPos = 0, includeLeft = false, includeRight = false) {
    const leftPos = fullText.indexOf(leftText, startPos);
    if (leftPos === -1) return null; 
    const rightStartPos = leftPos + leftText.length;
    const rightPos = fullText.indexOf(rightText, rightStartPos);
    if (rightPos === -1) return null; 
    const start = leftPos + (includeLeft ? 0 : leftText.length);
    const end = rightPos + (includeRight ? rightText.length : 0);
    return fullText.substring(start, end);
  }







     /*
   // 示例用法
   const fullText = '1=2=3=4';
   const keyword = '=';
   const leftText = 文本_取左边(fullText, keyword);
   console.log(leftText); // 输出: 1
   */
   export function 文本_取左边(fullText, keyword) {
    // 查找关键字的位置
    const keywordPos = fullText.indexOf(keyword);
    if (keywordPos === -1) {
      return null; // 如果没有找到关键字，返回 null
    }
    // 取出关键字左边的文本
    const leftText = fullText.substring(0, keywordPos);
    return leftText;
  }
  





  /*
  // 示例用法
  const fullText = '1=2=3=4';
  const keyword = '=';
  const rightText = 文本_取右边(fullText, keyword);
  console.log(rightText); // 输出: 2=3=4
  */
  export function 文本_取右边(fullText, keyword) {
    // 查找关键字的位置
    const keywordPos = fullText.indexOf(keyword);
    if (keywordPos === -1) {
      return null; // 如果没有找到关键字，返回 null
    }
    // 取出关键字右边的文本
    const rightText = fullText.substring(keywordPos + keyword.length);
    return rightText;
  }


 /*
   // 示例用法
   const fullText = 'Hello,World,Hello,World';
   const separator = ',';
   const ignoreCase = false;
   const splitResult = 分割文本(fullText, separator, ignoreCase);
   console.log(splitResult); // 输出: [ 'Hello', 'World', 'Hello', 'World' ]
   */
   export function 分割文本(fullText, separator, ignoreCase = false) {
     // 如果忽略大小写，将分割文本内容转换为小写
     if (ignoreCase) {
       separator = separator.toLowerCase();
     }
     // 使用分割文本内容分割完整文本
     const splitArray = fullText.split(separator);
     // 如果忽略大小写，需要重新组合分割结果
     if (ignoreCase) {
       let result = [];
       let currentPart = '';
       for (let i = 0; i < fullText.length; i++) {
         currentPart += fullText[i];
         if (currentPart.toLowerCase().endsWith(separator)) {
           result.push(currentPart.slice(0, -separator.length));
           currentPart = '';
         }
       }
       if (currentPart) {
         result.push(currentPart);
       }
       return result;
     }
     return splitArray;
   }
   





   
   /*
   // 示例用法
   const fullText = '<a href="http://www.baidu1.com"><a href="http://www.baidu2.com"><a href="http://www.baidu3.com">';
   const leftText = 'href="';
   const rightText = '"';
   const includeLeft = false;
   const includeRight = false;
   const extractedTexts = 文本_取中间_批量(fullText, leftText, rightText, includeLeft, includeRight);
   console.log(extractedTexts); // 输出: [http://www.baidu1.com, http://www.baidu2.com, http://www.baidu3.com]
   */
   export function 文本_取中间_批量(fullText, leftText, rightText, includeLeft = false, includeRight = false) {
     const results = [];
     let startPos = 0;
     while (true) {
       // 查找左边文本的位置
       const leftPos = fullText.indexOf(leftText, startPos);
       if (leftPos === -1) {
         break; // 如果没有找到左边文本，结束循环
       }
       // 计算右边文本的起始查找位置
       const rightStartPos = leftPos + leftText.length;
       // 查找右边文本的位置
       const rightPos = fullText.indexOf(rightText, rightStartPos);
       if (rightPos === -1) {
         break; // 如果没有找到右边文本，结束循环
       }
       // 计算中间文本的起始和结束位置
       let start = leftPos + (includeLeft ? 0 : leftText.length);
       let end = rightPos + (includeRight ? rightText.length : 0);
       // 取出中间的文本
       const result = fullText.substring(start, end);
       results.push(result);
       // 更新起始查找位置，继续查找下一个匹配项
       startPos = rightPos + rightText.length;
     }
     return results;
   }
   
   


   /*
   // 示例用法
   const fullText = 'Hello, World!';
   const searchText = 'world';
   const ignoreCase = true;
   const position = 寻找文本(fullText, searchText, ignoreCase);
   console.log(position); // 输出: 7 没找到返回-1
   */
   export function 寻找文本(fullText, searchText, ignoreCase = false) {
     // 如果忽略大小写，将完整文本和寻找文本都转换为小写
     if (ignoreCase) {
       fullText = fullText.toLowerCase();
       searchText = searchText.toLowerCase();
     }
     // 查找寻找文本的位置
     const position = fullText.indexOf(searchText);
     return position;
   }
   


   /*
   // 示例用法
   const fullText = 'Hello, World! Hello, World!';
   const searchText = 'world';
   const ignoreCase = true;
   const position = 倒找文本(fullText, searchText, ignoreCase);
   console.log(position); // 输出: 19
   */
   export function 倒找文本(fullText, searchText, ignoreCase = false) {
     // 如果忽略大小写，将完整文本和寻找文本都转换为小写
     if (ignoreCase) {
       fullText = fullText.toLowerCase();
       searchText = searchText.toLowerCase();
     }
     // 从最后一个位置开始往前查找寻找文本的位置
     const position = fullText.lastIndexOf(searchText);
     return position;
   }
   



//十六进制字符串转字节数组
export function hexStringToByteArray(hexString) {
    if (hexString.length % 2 !== 0) {
        throw new Error("十六进制字符串的长度必须是偶数。");
    }
    const byteArray = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
        byteArray[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }
    return byteArray;
}


//在playerContent返回播放链接时使用
export function headersToString(headers) {
  return Object.entries(headers)
    .map(([key, value]) => {
      return `${key}: ${value}`;
    })
    .join("\n");
}



