jQuery.winLoad = {
    html: '<div id="huazai-load">' +
		'<div class="huazai-mask"></div><div class="huazai-loader spinner-loading"></div></div>',
	loading : function() {
		$('body').append(this.html);
		$('#huazai-load').css('display','block');
	},
	close : function () {
        $('#huazai-load').css('display', 'none');
    }
};

jQuery.exportLoading = {
    html: '<div id="huazai-load-black">' +
    '<div class="huazai-mask-black"></div><div class="huazai-loader line-scale"><div></div><div></div><div></div><div></div><div></div></div><div class="huazai-text"></div>',
    exportLoad: function () {
        $('body').append(this.html);
        $('.huazai-text').html("正在导出数据<dot>...</dot>");
        $('#huazai-load-black').css('display', 'block');
    },
    noTextLoad: function (str) {
        $('body').append(this.html);
        $('.huazai-text').html(str ? str : "正在查询" + "<dot>...</dot>");
        $('#huazai-load-black').css('display', 'block');
    },
    importLoad: function () {
        var text = "数据导入中<dot>...</dot>";
        if (arguments.length > 0) {
            text = arguments[0] + "<dot>...</dot>";
        }
        $('body').append(this.html);
        $('.huazai-text').html(text);
        $('#huazai-load-black').css('display', 'block');
    },
    close: function () {
        $('#huazai-load-black').remove();
    }
};