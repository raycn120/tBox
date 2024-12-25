export class VideoClass {
  constructor() {
      // 当前分类的链接
      this.type_id = "";
      // 分类名称
      this.type_name = "";
  }
}

export class RepVideo {
  constructor() {
      this.list = [];
      this.filters= [];
      this.msg = "";
      this.total = 1;
      this.code = 1;
  }
}

export class VideoList {
  constructor() {
      // 视频链接
      this.vod_id = "";
      // 视频名称
      this.vod_name = "";
      // 视频图片
      this.vod_pic = "";
      // 更新到
      this.vod_remarks = "";
  }
}

export class VideoDetail {
  constructor() {
      // 当前视频详情链接
      this.vod_id = "";
      // 视频名称
      this.vod_name = "";
      /**
       * 线路列表 (没什么特殊区别可为空) 线路1$$$线路2$$$
       */
      this.vod_play_from = "";
      /**
       * 所有剧集 使用 $$$ 分割线路，# 分割剧集，$ 分割剧集名称和剧集链接
       * 第一集$第一集的视频详情链接#第二集$第二集的视频详情链接$$$第一集$第一集的视频详情链接#第二集$第二集的视频详情链接
       */
      this.vod_play_url = "";
      // 封面
      this.vod_pic = "";
      // 更新到
      this.vod_remarks = "";
      // 年份
      this.vod_year = "";
      // 演员
      this.vod_actor = "";
      // 导演
      this.vod_director = "";
      // 描述
      this.vod_content = "";
      // 地区
      this.vod_area = "";
  }
}

export class RepVideoPlayUrl {
  constructor() {
      /**
       * 播放视频的URL
       **/
      this.url = "";
      /**
       * 播放视频的请求header
       **/
      this.header;
      /**
      * parse=1直链  parse=0嗅探播放
      **/
      this.parse;
      /**
      * 播放器链接 通常parse也要设置为0
      **/
      this.playUrl = "";
      this.msg;
  }
}
