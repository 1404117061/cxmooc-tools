// ==UserScript==
// @name         超星慕课小工具
// @namespace    https://github.com/CodFrm/cxmooc-tools
// @version      2.10
// @description  一个超星慕课刷课工具,火狐,谷歌,油猴支持.全自动任务,视频倍速秒过,作业考试题库,验证码自动打码(੧ᐛ੭挂科模式,启动)
// @author       CodFrm
// @match        *://*/mycourse/studentstudy?*
// @match        *://*/ztnodedetailcontroller/visitnodedetail?*
// @match        *://*/antispiderShowVerify.ac*
// @match        *://*/html/processVerify.ac?*
// @match        *://*/exam/test/reVersionPaperMarkContentNew?*
// @match        *://*/exam/test/reVersionTestStartNew?*
// @match        *://*/work/selectWorkQuestionYiPiYue?*
// @match        *://*/work/doHomeWorkNew?*
// @grant        GM_xmlhttpRequest
// @license      MIT
// ==/UserScript==

let config = {
    answer_ignore: false,    //忽略题目,勾选此处将不会答题
    auto: true,              //全自动挂机,无需手动操作,即可自动观看视频等
    interval: 2,             //时间间隔,当任务点完成后,会等待5分钟然后跳转到下一个任务点
    rand_answer: false,      //随机答案,没有答案的题目将自动的生成一个答案
    video_multiple: 1,       //视频播放倍速,视频播放的倍数,建议不要改动,为1即可,这是危险的功能
    video_mute: true,        //视频静音,视频自动静音播放
    vtoken: "user",          //鉴权token,用于验证码打码,提交题目可获得打码次数
    video_cdn: "公网1"            //锁定视频播放源,为空为记录最后一次选中的源(公网1,公网2等)
};

localStorage['config'] = JSON.stringify(config);

