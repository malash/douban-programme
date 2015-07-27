// ==UserScript==
// @name  Douban Programme
// @namespace https://malash.me/
// @author  Malash <i@malash.me>
// @icon  http://img3.douban.com/favicon.ico
// @version 1.0.1
// @description 豆瓣歌单自动生成脚本
// @homepageURL https://github.com/malash/douban-programme
// @include http://music.douban.com/subject/*
// ==/UserScript==

/* global jQuery */
'use strict';
!(function(window) {
    var _onload = window.onload;
    window.onload = function() {
        _onload && _onload();
        /*jshint -W020 */
        $ || ($ = jQuery);
        function make() {
            function getCk() {
                var cookies = document.cookie.split(';');
                cookies = cookies.filter(function(cookie) {
                    return $.trim(cookie).startsWith('ck=');
                });
                if (cookies.length === 0) {
                    return null;
                }
                var cookie = cookies[0];
                return cookie.substring(cookie.indexOf('=') + 2, cookie.length - 1);
            }
            var ck = getCk();
            if (!ck) {
                alert('请登录后操作');
                return;
            }
            var title = $('#wrapper h1 span').html();
            if (!title) {
                alert('请在专辑页面运行');
                return;
            }
            if ($('.song-item').length === 0) {
                alert('此专辑没有可以添加到收藏的曲目');
                return;
            }
            $.post('http://music.douban.com/j/songlist/create', { sl_title: title, ck:ck }, function(result) {
                if (result.r !== 'success') {
                    return;
                }
                var url = result.sl_url;
                var programmeID = parseInt(url.substring(url.lastIndexOf('/') + 1, url.length));
                console.log('添加收藏:', programmeID);
                var elItems = $('.song-item');
                for (var i = 0; i < elItems.length; i++) {
                    var songId = $(elItems[i]).attr('id');
                    /*jshint -W083 */
                    $.ajax({
                        type: 'POST',
                        url: 'http://music.douban.com/j/songlist/addsong',
                        data: { sl_id: programmeID, song_id: songId, ck: ck },
                        async: false,
                        success: function(){
                            console.log('添加歌曲', i, ':', songId);
                        }
                    });
                    console.log('添加完成');
                    window.location.href = url;
                }
            });
        }

        if (!$('#wrapper h1 span').html()) {
            return;
        }
        $('<button>自动生成豆瓣歌单</button><span id="douban-programme"></span>').appendTo('#wrapper h1').click(function(){
            make();
        });
    };
 
})(window);

