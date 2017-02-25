;
(function(factory) {
	if (typeof define === "function" && define.amd) {
		// AMD模式
		define(["jquery"], factory);
	} else {
		// 全局模式
		factory(jQuery);
	}
}(function($) {
	function substitute(str, o, regexp) {
		return str.replace(regexp || /\\?\{([^{}]+)\}/g, function(match, name) {
			var names = name.split('.');
			var res = o;
			for (var i = 0; i < names.length; i++) {
				res = (typeof(res) == "object") ? res[names[i]] : null;
			};
			return (res === undefined) ? '' : res;
		});
	}

	var Dialog = function(options) {
		var _this = this;
		var defaultOptions = {
			title: "Dialog",
			titleUnderline: false,
			btnLeft: {
				text: "btnLeft",
				fn: null
			},
			btnRight: {
				text: "btnRight",
				fn: null
			},
			html: "Dialog content...",
			beforeAction: function() {},
			beforeAppendTo: function() {},// 窗口对象在加载到HTML文档前
			dialogStyle: "dialog", // 窗口样式，取值为“dialog”（默认）、“tab”；当取值为tab时，窗口全屏
			overlayClass: "global_black_overlay",// 背景层的样式
			actions: {}
		};

		var singleLineTpl = '<div>{html}</div>';
		var contentTpl = '<h3><div class="ellipsis" style="line-height: 18px;" title="{html}">{html}</div></h3>';
		var btns = '';
		if (options.btnLeft || options.btnRight) {
			btns =  '    <div class="global_dialog_confirm_ft">' +
					'        <div title="{btnLeft.text}" class="global_dialog_confirm_nor" role="cancel"><span>{btnLeft.text}</span></div>' +
					'        <div title="{btnRight.text}" class="global_dialog_confirm_nor" role="confirm"><span>{btnRight.text}</span><div class="errortip"></div></div>' +
					'    </div>';
		}
		
		this.options = $.extend(defaultOptions, options);
		
		
		var dialogTpl = "";
		if ('tab' == this.options.dialogStyle)
		{
			dialogTpl = '<div class="global_dialog_confirm_main_fullScreen" style="display: block;">' +
				'    <div class="global_dialog_confirm_title">' +
				'        <h3 class="ellipsis" title="{title}">{title}</h3>' +
				'    </div>' +
				'    <div class="global_dialog_confirm_content">{content}</div>' +
				btns +
				'</div>' +
				'<div class="' + this.options.overlayClass + '"></div>';			
		}
		else
		{
			var dialogStyle = 'display: block;';
			if (this.options.width)
			{
				dialogStyle = dialogStyle + 'width:' + this.options.width + ';';
			}
			
			if (this.options.height)
			{
				dialogStyle = dialogStyle + 'height:' + this.options.height + ';';
			}
			
			if (this.options.top)
			{
				dialogStyle = dialogStyle + 'top:' + this.options.top + ';';
			}
			
			if (this.options.left)
			{
				dialogStyle = dialogStyle + 'left:' + this.options.left + ';';
			}
			
			dialogTpl = '<div class="global_dialog_confirm_main" style="' + dialogStyle + '">' +
				'    <div class="global_dialog_confirm_title">' +
				'        <h3 class="ellipsis" title="{title}">{title}</h3>' +
				'    </div>' +
				'    <div class="global_dialog_confirm_content">{content}</div>' +
				btns +
				'</div>' +
				'<div class="' + this.options.overlayClass + '"></div>';		
		}

		// html
		if (/<.*?>/.test(options.html)) {
			this.options.content = substitute(singleLineTpl, this.options);
		} else { // text
			this.options.content = substitute(contentTpl, this.options);
		}

		this.dialogHtml = substitute(dialogTpl, this.options);

		this.$dialogWrap = null;

		this.init = function() {
			this.$dialogWrap = $(this.dialogHtml);
			this.$mask = this.$dialogWrap.last();
			this.$dialog = this.$dialogWrap.first();

			if (!this.options.btnLeft) {
				this.$dialog.find('[role=cancel]').remove();
			}

			if (this.options.titleUnderline) {
				this.$dialog.find('.global_dialog_confirm_title h3').css({
					'text-decoration': 'underline'
				});
			}

			this.$dialog.on('click', '[role=confirm]', function(e) {
				e.stopPropagation();
				if ($(this).attr("disabled")) {
					return;
				}
				var rfn = _this.options.btnRight.fn;
				if (typeof(rfn) == "function") {
					rfn.call(_this);
				}
			}).on('click', '[role=cancel]', function() {
				var lfn = _this.options.btnLeft.fn;
				if (typeof(lfn) == "function") {
					lfn.call(_this);
				}
				_this.$dialog.trigger('close');
			}).on('click', '[act]', function(e) {
				e.stopPropagation();
				var fn = _this.options.actions[$(this).attr('act')];
				if (typeof(fn) == "function") {
					fn.call(_this);
				}
			}).on('close', function() {
				_this.hide();
			});

			this.$mask.on('selectstart', function() {
				return false;
			}).on('mousedown', function() {
				return false;
			});
		};

		this.show = function() {
			this.init();
			
			if (typeof(this.options.beforeAppendTo) == "function") {
				this.options.beforeAppendTo.call(this);
			}
			
			this.$dialogWrap.appendTo('body');

			if (typeof(this.options.beforeAction) == "function") {
				this.options.beforeAction.call(this);
			}

			this.$dialogWrap.fadeIn(function() {
				if ('tab' != _this.options.dialogStyle)
				{
					_this.$dialog.css({
						"margin-top": -(_this.$dialog.outerHeight()) / 2
					});
				}				
			});
		};

		this.hide = function() {
			if (this.$dialogWrap && this.$dialogWrap.length > 0) {
				this.$dialogWrap.fadeOut(function() {
					_this.$dialogWrap.remove();
				});
			}
		};
		
		this.enable = function() {
			//_this.$dialog.find("[role=confirm]").attr("disabled", false);
			//上一句 手机上不兼容改为如下
			_this.$dialog.find("[role=confirm]").removeAttr("disabled");
			_this.$dialog.find("[role=confirm]").removeClass("globle_dialog_btn_disabled");
			_this.$dialog.find("[role=confirm]").css({"cursor": "pointer"});
		};
		this.disabled = function() {
			_this.$dialog.find("[role=confirm]").attr("disabled", true);
			_this.$dialog.find("[role=confirm]").addClass("globle_dialog_btn_disabled");
			_this.$dialog.find("[role=confirm]").css({"cursor": "auto"});
		};

		return this;
	};



	$.fn.Dialog = function(params) {
		var el = this[0];
		
		if (!el) {
			return;
		}
		
		if (typeof(params) == "string") {
			switch (true) {
				case params == "show":
					el.dialog.show();
					break;
				case params == "hide":
					el.dialog.hide();
					break;
				case params == "enable":
					el.dialog.enable();
					break;
				case params == "disabled":
					el.dialog.disabled();
					break;
				default:
					alert("error param");
					break;
			}
		} else if (typeof(params) == "object") {
			el.dialog = new Dialog(params);
			$(el).on('click', function() {
				if ($(this).attr("disabled")) {
					return;
				}
				this.dialog.show();
			});
		} else {
			alert("error param");
		}
		return this;
	};



	var DropList = function(options, obj) {
		var _this = this;
		var defaultOptions = {
			items: [{
				value: 0,
				label: "defaultValue"
			}],
			defaultValue: null,
			onChange: function() {}
		};

		this.selectHtml = '<input type="hidden">' +
			'<b class="dptick r"></b>' +
			'<span></span>' +
			'<ul class="dpmenu" style="display: none;z-index:1000;"></ul>';

		this.options = $.extend(defaultOptions, options);

		this.init = function() {
			this.$obj = $(obj).addClass('ddrop').append(this.selectHtml);

			var $ul = this.$obj.find('.dpmenu');
			var defaultObj = null;
			for (var i = 0; i < this.options.items.length; i++) {
				
				// 如果为json字符串的话，就要采用相应的处理手段了
				$ul.append("<li data-value='" +this.options.items[i].value + "'>" + subStr(this.options.items[i].label) + "</li>");
			
				if (!this.options.defaultValue && this.options.defaultValue !== 0 && i == 0) {
					defaultObj = this.options.items[i];
				} else if (this.options.defaultValue === this.options.items[i].value) {
					defaultObj = this.options.items[i];
				}
			};
			
			if (!defaultObj) {
				defaultObj = this.options.items[0];
			}

			this.$obj.find('span').text(subStr(defaultObj.label));
			this.$obj.find('input').val(defaultObj.value);

			this.$obj.on("click", function() {
				var open = $(this).data("open");
				if (!open) {
					$(this).children('.dpmenu').attr("tabindex", 0).fadeIn(300).focus();
					$(this).data("open", true);
				}
			}).on("click", ".dpmenu > li", function() {
				var $p = $(this).closest('.ddrop');
				
				if(typeof($(this).data("value"))=="object")
				{
					// 如果为object类型，那么认定其为json格式
					$p.children('input').val(JSON.stringify($(this).data("value")));
				}
				else
				{
					$p.children('input').val($(this).data("value"));
				}
				$p.children('span').text($(this).text());
				$(this).parent().fadeOut(300, function() {
					$p.data("open", false);
				});
				if (typeof(_this.options.onChange) == "function") {
					_this.options.onChange.call(_this, $(this).data("value"), $(this).text());
				}
			}).on("blur", ".dpmenu", function() {
				$(this).fadeOut(300, function() {
					$(this).parent().data("open", false);
				});
			});
		};

		this.selectValue = function(value) {
			var selectObj = null;
			for (var i = 0; i < this.options.items.length; i++) {
				if (value === this.options.items[i].value) {
					selectObj = this.options.items[i];
				}
			};
			this.$obj.find('span').text(selectObj.label);
			this.$obj.find('input').val(selectObj.value);
		};

		return this;
	};

	$.fn.DropList = function(params) {
		var el = this[0];
		if (typeof(params) == "string") {
			switch (true) {
				case params == "select":
					el.droplist.selectValue(arguments[1]);
					break;
				default:
					alert("error param");
					break;
			}
		} else if (typeof(params) == "object") {
			el.droplist = new DropList(params, el);
			el.droplist.init();
		} else {
			alert("error param");
		}
		return this;
	};
	
	//EMUI5 droplist
	
	var DropListEMUI5 = function(options, obj) {
		var _this = this;
		var defaultOptions = {
			items: [{
				value: 0,
				label: "defaultValue"
			}],
			defaultValue: null,
			onChange: function() {},
			showDefaultValue:true,
			suffix:""
		};

		

		this.options = $.extend(defaultOptions, options);
		this.selectHtml = '<input type="hidden">' +
		'<div class="select-ico r"></div>' +
		'<span class="select-text"></span>' +this.options.suffix+
		'<ul class="dpmenu-EMU5" style="display:none;"></ul>';
		this.init = function() {
			this.$obj = $(obj).addClass('ddrop-EMU5').append(this.selectHtml);

			var $ul = this.$obj.find('.dpmenu-EMU5');
			var defaultObj = null;
			var length = this.options.items.length;
			$ul.append('<div class="flow-top"></div>');
			if(length>6)
			{
				$ul.css("overflow-y","scroll");
			}
			for (var i = 0; i < length; i++) {
				
				// 如果为json字符串的话，就要采用相应的处理手段了
				if(i!=length-1)
				{	
				$ul.append("<li data-value='" +this.options.items[i].value + "'>" + subStr(this.options.items[i].label) + "</li><div class='bottom-line'></div>");
				}
				else
				{
					$ul.append("<li data-value='" +this.options.items[i].value + "'>" + subStr(this.options.items[i].label) + "</li>");
				}	
				if (!this.options.defaultValue && this.options.defaultValue !== 0 && i == 0) {
					defaultObj = this.options.items[i];
				} else if (this.options.defaultValue === this.options.items[i].value) {
					defaultObj = this.options.items[i];
				}
			};
			
			if (!defaultObj) {
				defaultObj = this.options.items[0];
			}
            if(!this.options.showDefaultValue)
            {
			this.$obj.find('span').text(subStr(defaultObj.label)).css("visibility","hidden");
			this.$obj.find('input').val(defaultObj.value);
            }
            else
            {
            	this.$obj.find('span').text(subStr(defaultObj.label));
    			this.$obj.find('input').val(defaultObj.value);
            }
			this.$obj.on("click", function() {
				var open = $(this).data("open");
				if (!open) {
					$(this).children('.dpmenu-EMU5').attr("tabindex", 0).fadeIn(300).focus();
					$(this).data("open", true);
				}
			}).on("click", ".dpmenu-EMU5 > li", function() {
				var $p = $(this).closest('.ddrop-EMU5');
				
				if(typeof($(this).data("value"))=="object")
				{
					// 如果为object类型，那么认定其为json格式
					$p.children('input').val(JSON.stringify($(this).data("value")));
				}
				else
				{
					$p.children('input').val($(this).data("value"));
				}
				$p.children('span').text($(this).text()).css("visibility","visible");
				$(this).parent().fadeOut(300, function() {
					$p.data("open", false);
				});
				if (typeof(_this.options.onChange) == "function") {
					_this.options.onChange.call(_this, $(this).data("value"), $(this).text());
				}
			}).on("blur", ".dpmenu-EMU5", function() {
				$(this).fadeOut(300, function() {
					$(this).parent().data("open", false);
				});
			});
		};

		this.selectValue = function(value) {
			var selectObj = null;
			for (var i = 0; i < this.options.items.length; i++) {
				if (value === this.options.items[i].value) {
					selectObj = this.options.items[i];
				}
			};
			this.$obj.find('span').text(selectObj.label);
			this.$obj.find('input').val(selectObj.value);
		};

		return this;
	};

	$.fn.DropListEMUI5 = function(params) {
		var el = this[0];
		if (typeof(params) == "string") {
			switch (true) {
				case params == "select":
					el.droplistEMUI5.selectValue(arguments[1]);
					break;
				default:
					alert("error param");
					break;
			}
		} else if (typeof(params) == "object") {
			el.droplistEMUI5 = new DropListEMUI5(params, el);
			el.droplistEMUI5.init();
		} else {
			alert("error param");
		}
		return this;
	};
	
	
	
	
	
	
	
	
	
	
	
	

	//switch 2
	$(document).on("click", ".radio", function() {
		if ($(this).data("check")) {
			return;
		}
		var group = $(this).data("group");
		checkRadio($(this), true);
		checkRadio($("[data-group='" + group + "']").not(this), false);
		$("#" + group).val($(this).data("value"));
		$("#" + group).trigger('change');
	}).on("check", ".radio", function() {
		$(this).trigger('click');
	});

	function checkRadio(obj, check) {
		if (check) {
			obj.removeClass("roff").addClass("ron");
		} else {
			obj.removeClass("ron").addClass("roff");
		}
		obj.data("check", check);
	}
	
	//帐号大于28长度的时候展示的时候就去掉一部分，为了能够正常显示到下拉列表
	function subStr(str) {
		if(str.length > 28) {
			if (str.indexOf("*") > 0)
			{
				var strPre = str.substring(0, str.indexOf("*"));
				var strPost = str.substring(str.lastIndexOf("*"), str.length);
				strPre = strPre.substring(0, 24-strPost.length);
				str = strPre +"****"+ strPost;
			}
		}
		return str;
	}
	
}));