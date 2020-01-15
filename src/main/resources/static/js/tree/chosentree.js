


(function(){
    var __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent)
        {
            for (var key in parent)
            {
                if (__hasProp.call(parent, key)) child[key] = parent[key];
            }

            function ctor()
            {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };

    function browser_is_supported() {
    	//浏览器支持判断
    	
        if (window.navigator.appName === "Microsoft Internet Explorer")
        {
            return document.documentMode >= 8;
        }
        if (/iP(od|hone)/i.test(window.navigator.userAgent))
        {
            return false;
        }
        if (/Android/i.test(window.navigator.userAgent))
        {
            if (/Mobile/i.test(window.navigator.userAgent))
            {
                return false;
            }
        }
        return true;
    }
    
    var NODE_NAME = "zui.node";
    
    var ChosenTree = (function()
    {
        function ChosenTree(formField, options)
        {
            this.formField = formField;
            this.$formField = $(formField);
            
            this.options = options;
            this.textField = options.textField;
            this.idField = options.idField;
            
            this.data = options.data;
            
            
            this.isMultiple = this.formField.multiple;
            this.setup();
            this.setupHtml();
            this.registerObservers();
        }

        ChosenTree.prototype.setup = function()
        {
            this.$formField = $(this.formField);
            //this.current_selectedIndex = this.form_field.selectedIndex;
            
            if (this.formField.getAttribute("data-placeholder"))
            {
                this.defaultText = this.formField.getAttribute("data-placeholder");
            }
            return this.isRtl = this.$formField.hasClass("chosen-rtl");
        };

        ChosenTree.prototype.setupHtml = function()
        {
            var containerClasses, 
            	containerProps,
            	that = this;
            
            containerClasses = ["chosen-container"];
            containerClasses.push("chosen-container-" + (this.isMultiple ? "multi" : "single"));
            if (this.formField.className)
            {
                containerClasses.push(this.formField.className);
            }
            if (this.isRtl)
            {
                containerClasses.push("chosen-rtl");
            }

            containerProps = {
                'class': containerClasses.join(' '),
                'title': this.formField.title
            };

            if (this.formField.id.length)
            {
                containerProps.id = this.formField.id.replace(/[^\w]/g, '_') + "_chosen";
            }

            this.container = $("<div />", containerProps);
            if (this.isMultiple)
            {
                //多选
                this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="' + this.defaultText + '" class="default" autocomplete="off" style="width:25px;" /></li></ul>' +
                    '<div class="chosen-drop">' +
                    '<div class="chosentree-option"></div>' +
                    '</div>');
            } else {
                //单选
                this.container.html('<a class="chosen-single chosen-default" tabindex="-1"><span>' + this.defaultText + '</span><div><b></b></div></a>' +
                    '<div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div>' +
                    '<div class=" chosentree-option"></div>' +//chosen-results
                    '</div>');
            }
            this.$formField.hide().after(this.container);
            this.$dropdown = this.container.find('div.chosen-drop').first();
            //this.$dropdown.css("left","0");
            
            this.$searchField = this.container.find('input').first();
            this.$optionTree = this.container.find('div.chosentree-option').first();
            
            //
            this.searchNoResults = this.container.find('li.no-results').first();

            if (this.isMultiple) {
//                this.search_choices = this.container.find('ul.chosen-choices').first();
//                this.search_container = this.container.find('li.search-field').first();
            } else {
                this.$searchContainer = this.container.find('div.chosen-search').first();
                this.$selectedItem = this.container.find('.chosen-single').first();
            }

            if(this.options.dropWidth)
            {
            	this.$dropdown.css('width', this.options.dropWidth).addClass('chosen-drop-size-limited');
            } else {
                this.$dropdown.css('width', '100%').addClass('chosen-drop-size-limited');
            }

            this.$optionTree.delegate('li > span', 'click', function (e) {
            	var $target = $(e.target);
            	
            	//伸缩按钮
            	if($target.is('i')) {
            		var $li = $target.parent("span").parent('li.parent_li');
            		//节点是parent_li类型
            		if ($li.length) {
            			var children = $li.find(' > ul');
                        if (children.is(":visible")) {
                            children.hide('fast');
                            //Collapse this branch
                            $target.attr('title', '展开 ').find(' > i');
                            $target.addClass('icon-plus-sign').removeClass('icon-minus-sign');
                        } else {
                            children.show('fast');
                            //Expand this branch
                            $target.attr('title', '收缩').find(' > i');
                            $target.addClass('icon-minus-sign').removeClass('icon-plus-sign');
                        }
            		}
            	} else {
            		//选择
            		var $selli = $target.parents("li");
            		
            		
            		that.selectNode($selli);
            	}
                
                e.stopPropagation();
            });
            
            
            //结果选项 生成
            this.optionTreeBuild();
//            this.resultsBuild();
//            this.setTabIndex();
//            this.setLabelBehavior();
            return this.$formField.trigger("chosen:ready",
            {
                chosen: this
            });
        };
      
        ChosenTree.prototype.inputFocus = function(evt) {
        	
        	if (!this.activeField) {
        		this.activateField();
        	}
        };
        
        ChosenTree.prototype.inputBlur = function(evt) {
        	var that = this;
//        	that.closeField();
//        	if (this.mouseOnContainer) {
//        		this.activeField = false;
//        		
////        		 return setTimeout((function()
////                {
////                    return that.blur_test();
////                }), 100);
//        	}
        	
        };
        ChosenTree.prototype.containerMousedown = function(evt) {
        	
        	
        	if (!this.isDisabled) {
        		if (evt && evt.type === "mousedown" && !this.optionShowing)
                {
                    evt.preventDefault();
                }
        		
                if (!((evt != null) && ($(evt.target)).hasClass("search-choice-close")))
                {
                    if (!this.optionShowing)
                    {
//                        if (this.is_multiple)
//                        {
//                            this.search_field.val("");
//                        }
//                        $(this.container[0].ownerDocument).bind('click.chosen', this.click_test_action);
//                        this.results_show();
                    	this.optionShow();
                    }
                    else if ( !this.isMultiple && evt && (($(evt.target)[0] === this.$selectedItem[0]) || $(evt.target).parents("a.chosen-single").length) ) 
                    {
                    	
                        evt.preventDefault();
                        this.optionToggle();
                        
                    }
                    return this.activateField();
                }
        	}
        };
        //注册观察事件
        ChosenTree.prototype.registerObservers = function()
        {
        	var that = this;
            this.container.bind('mousedown.chosen', function(evt)
            {
            	that.containerMousedown(evt);
            });
            this.container.bind('mouseup.chosen', function(evt)
            {
//                console.log("mouseup");
               // _this.containerMouseup(evt);
            });
            this.container.bind('mouseenter.chosen', function(evt)
            {
//                console.log("mouseenter");
                //_this.mouseEnter(evt);
            });
            this.container.bind('mouseleave.chosen', function(evt)
            {
//                console.log("mouseleave");
                //_this.mouseLeave(evt);
            });
//            this.search_results.bind('mouseup.chosen', function(evt)
//            {
//                //_this.searchResultsMouseup(evt);
//            });
//            this.search_results.bind('mouseover.chosen', function(evt)
//            {
//                //_this.search_results_mouseover(evt);
//            });
//            this.search_results.bind('mouseout.chosen', function(evt)
//            {
//                //_this.search_results_mouseout(evt);
//            });
//            this.search_results.bind('mousewheel.chosen DOMMouseScroll.chosen', function(evt)
//            {
//               // _this.search_results_mousewheel(evt);
//            });
//            this.search_results.bind('touchstart.chosen', function(evt)
//            {
//                //_this.search_results_touchstart(evt);
//            });
//            this.search_results.bind('touchmove.chosen', function(evt)
//            {
//                //_this.search_results_touchmove(evt);
//            });
//            this.search_results.bind('touchend.chosen', function(evt)
//            {
//                //_this.search_results_touchend(evt);
//            });
//            this.form_field_jq.bind("chosen:updated.chosen", function(evt)
//            {
//                //_this.results_update_field(evt);
//            });
//            this.form_field_jq.bind("chosen:activate.chosen", function(evt)
//            {
//                //_this.activate_field(evt);
//            });
//            this.form_field_jq.bind("chosen:open.chosen", function(evt)
//            {
//                //_this.container_mousedown(evt);
//            });
              this.$searchField.bind("blur.chosen", function(evt) {
            	  that.inputBlur(evt);
              });
              this.$formField.bind("chosen:close.chosen", function(evt)
              {
            	  if (that.mouseOnContailner) {
            		  that.activeField = false;
                      return setTimeout((function()
                      {
                    	  if (!that.activeField && this.container.hasClass("chosen-container-active"))
                          {
                              return that.closeField();
                          }
                      }), 100);
            	  }
              });
//            this.search_field.bind('blur.chosen', function(evt)
//            {
//                //_this.input_blur(evt);
//            });
//            this.search_field.bind('keyup.chosen', function(evt)
//            {
//                //_this.keyup_checker(evt);
//            });
//            this.search_field.bind('keydown.chosen', function(evt)
//            {
//                //_this.keydown_checker(evt);
//            });
//            this.search_field.bind('focus.chosen', function(evt)
//            {
//                //_this.input_focus(evt);
//            });
//            this.search_field.bind('cut.chosen', function(evt)
//            {
//                //_this.clipboard_event_checker(evt);
//            });
//            this.search_field.bind('paste.chosen', function(evt)
//            {
//                //_this.clipboard_event_checker(evt);
//            });
//            if (this.is_multiple)
//            {
//                return this.search_choices.bind('click.chosen', function(evt)
//                {
//                   // _this.choices_click(evt);
//                });
//            }
//            else
//            {
//                return this.container.bind('click.chosen', function(evt)
//                {
//                    evt.preventDefault();
//                });
//            }
        };

        //选择结果数据的构建
        ChosenTree.prototype.optionTreeBuild = function()
        {
            var that = this,
            	options = this.options,
            	idField = this.idField,
            	textField = this.textField,
            	data = this.data,
            	$optionTree = this.$optionTree;
            $optionTree.html('');
            //渲染节点s
            var i = 0;
            function renderNodes(nodes, $root) {
                if (nodes && nodes.length > 0) {
                    var $ul = $("<ul>");
                    nodes.forEach(function(node) {
                    	var cls = null;
                        var $li = $("<li>"),
                            id = node[idField] || "tree-node-" +i++,
                            text = node[textField] || "";
                        
                        if (node.children && node.children.length > 0 ) {
                        	cls = options.minusIcon + ' fa fa-folder-open';
                        } else {
                        	cls = 'icon-leaf fa fa-folder';
                        }
                        $li.addClass("active-result");
                        $li.data(NODE_NAME, node);
                        $li.append('<span><i class="'+ cls +'"></i> ' + text + '</span>')
                            .attr({"node-id":id});
                        $ul.append($li);
                        
                        renderNodes(node.children,$li);
                    });
                    $root.append($ul);
                }
            }
            renderNodes(data, $optionTree);
            
            $optionTree.find('li:has(ul)').addClass('parent_li').find(' > span').attr('title', '收缩');
            
            
            
            
            
        };
        
        //field
        ChosenTree.prototype.closeField = function() {};
        ChosenTree.prototype.activateField = function() {};
        
        //显示选项
        ChosenTree.prototype.optionShow = function() {
        	
        	if (!this.optionShowing)
            {
        		this.container.addClass("chosen-container-active");
	        	this.container.addClass("chosen-with-drop");
	        	this.optionShowing = true;
	            this.$searchField.focus();
	            return this.$formField.trigger("chosen:showing_dropdown",
	            {
	                chosen: this
	            });
            }
        };
        ChosenTree.prototype.optionHide = function() {
        	 if (this.optionShowing)
             {
        		 this.container.removeClass("chosen-container-active");
                 this.container.removeClass("chosen-with-drop");
                 return this.optionShowing = false;
                 
                 return this.$formField.trigger("chosen:hiding_dropdown",
                 {
                     chosen: this
                 });
             }
             
        };
        ChosenTree.prototype.optionToggle = function() {
        	if (this.optionShowing) {
        		this.optionHide();
        	} else {
        		this.optionShow();
        	}
        };
        
        //将根据input val值来刷新界面
        ChosenTree.prototype.refresh = function() {
        	var idField = this.idField,
        		id = this.$formField.val(),
        		data = this.data;
        	
        	
        	var searchNode = null,
        		preTraverse = function(nodes, fn) {
	        		if (nodes && nodes.length > 0) {
	        			for (var i = 0; i < nodes.length; i++) {
	        				if (searchNode) {
	        					return false;
	        				}
	        				var node = fn(nodes[i]);
	        				if (node) {
	        					searchNode = node;
	        					return true;
	        				}
	        				if(preTraverse(nodes[i].children, fn) === true) {
	                        	return true;
	                        }
	                    }
	        		}
            	};
        	
        	preTraverse(data, function(node) {
        		if (node[idField] == id) {
        			return node;
        		}
        	});
        	if (searchNode) {
        		this.selectNode(searchNode);
        	} else {
//        		this.setValue('');
//        		this.setText(this.defaultText);
        	}
        };
        
        
        //选择选项$(li)
        ChosenTree.prototype.selectNode = function(selected) {
        	
        	var node = selected;
        	if (node instanceof jQuery) {
        		node = selected.data(NODE_NAME);
        	}
        	
        	this.$formField.trigger("chosen:update", 
        			node
        	);	
        	
        	this.$selectedItem.removeClass("chosen-default");
        	
        	var id = node[this.idField];
        	var text = node[this.textField];
        	
        	this.setValue(id);
        	this.setText(text);
//        	this.optionHide();
        };
        ChosenTree.prototype.setValue = function(value) {
        	this.$formField.val(value);
        };
        ChosenTree.prototype.setText = function(text) {
        	this.$selectedItem.find("span").attr("title", text).html(text);
        };
        
        
        ChosenTree.prototype.destroy = function()
        {
            $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
            if (this.search_field[0].tabIndex)
            {
                this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex;
            }
            this.container.remove();
            this.form_field_jq.removeData('chosen');
            return this.form_field_jq.show();
        };

        ChosenTree.prototype.search_field_disabled = function()
        {
            this.is_disabled = this.form_field_jq[0].disabled;
            if (this.is_disabled)
            {
                this.container.addClass('chosen-disabled');
                this.search_field[0].disabled = true;
                if (!this.is_multiple)
                {
                    this.selected_item.unbind("focus.chosen", this.activate_action);
                }
                return this.close_field();
            }
            else
            {
                this.container.removeClass('chosen-disabled');
                this.search_field[0].disabled = false;
                if (!this.is_multiple)
                {
                    return this.selected_item.bind("focus.chosen", this.activate_action);
                }
            }
        };

        ChosenTree.prototype.container_mousedown = function(evt)
        {
            if (!this.is_disabled)
            {
                if (evt && evt.type === "mousedown" && !this.results_showing)
                {
                    evt.preventDefault();
                }
                if (!((evt != null) && ($(evt.target)).hasClass("search-choice-close")))
                {
                    if (!this.active_field)
                    {
                        if (this.is_multiple)
                        {
                            this.search_field.val("");
                        }
                        $(this.container[0].ownerDocument).bind('click.chosen', this.click_test_action);
                        this.results_show();
                    }
                    else if (!this.is_multiple && evt && (($(evt.target)[0] === this.selected_item[0]) || $(evt.target).parents("a.chosen-single").length))
                    {
                        evt.preventDefault();
                        this.results_toggle();
                    }
                    return this.activate_field();
                }
            }
        };

        ChosenTree.prototype.container_mouseup = function(evt)
        {
            if (evt.target.nodeName === "ABBR" && !this.is_disabled)
            {
                return this.results_reset(evt);
            }
        };

        ChosenTree.prototype.search_results_mousewheel = function(evt)
        {
            var delta;
            if (evt.originalEvent)
            {
                delta = -evt.originalEvent.wheelDelta || evt.originalEvent.detail;
            }
            if (delta != null)
            {
                evt.preventDefault();
                if (evt.type === 'DOMMouseScroll')
                {
                    delta = delta * 40;
                }
                return this.search_results.scrollTop(delta + this.search_results.scrollTop());
            }
        };

        ChosenTree.prototype.blur_test = function(evt)
        {
            if (!this.active_field && this.container.hasClass("chosen-container-active"))
            {
                return this.close_field();
            }
        };

        ChosenTree.prototype.close_field = function()
        {
            $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
            this.active_field = false;
            this.results_hide();
            this.container.removeClass("chosen-container-active");
            this.clear_backstroke();
            this.show_search_field_default();
            return this.search_field_scale();
        };

        ChosenTree.prototype.activate_field = function()
        {
            this.container.addClass("chosen-container-active");
            this.active_field = true;
            this.search_field.val(this.search_field.val());
            return this.search_field.focus();
        };

        ChosenTree.prototype.test_active_click = function(evt)
        {
            var active_container;
            active_container = $(evt.target).closest('.chosen-container');
            if (active_container.length && this.container[0] === active_container[0])
            {
                return this.active_field = true;
            }
            else
            {
                return this.close_field();
            }
        };

        ChosenTree.prototype.load = function(data) {
        	if (data) {
        		this.data = data;
        	}
        	this.optionTreeBuild();
        	
        	this.refresh();
        };
        

        ChosenTree.prototype.result_do_highlight = function(el)
        {
            var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
            if (el.length)
            {
                this.result_clear_highlight();
                this.result_highlight = el;
                this.result_highlight.addClass("highlighted");
                maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
                visible_top = this.search_results.scrollTop();
                visible_bottom = maxHeight + visible_top;
                high_top = this.result_highlight.position().top + this.search_results.scrollTop();
                high_bottom = high_top + this.result_highlight.outerHeight();
                if (high_bottom >= visible_bottom)
                {
                    return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
                }
                else if (high_top < visible_top)
                {
                    return this.search_results.scrollTop(high_top);
                }
            }
        };

        ChosenTree.prototype.result_clear_highlight = function()
        {
            if (this.result_highlight)
            {
                this.result_highlight.removeClass("highlighted");
            }
            return this.result_highlight = null;
        };

        ChosenTree.prototype.results_show = function()
        {
            if (this.is_multiple && this.max_selected_options <= this.choices_count())
            {
                this.form_field_jq.trigger("chosen:maxselected",
                {
                    chosen: this
                });
                return false;
            }
            this.container.addClass("chosen-with-drop");
            this.results_showing = true;
            this.search_field.focus();
            this.search_field.val(this.search_field.val());
            this.winnow_results();
            return this.form_field_jq.trigger("chosen:showing_dropdown",
            {
                chosen: this
            });
        };

        ChosenTree.prototype.update_results_content = function(content)
        {
            return this.search_results.html(content);
        };

        ChosenTree.prototype.results_hide = function()
        {
            if (this.results_showing)
            {
                this.result_clear_highlight();
                this.container.removeClass("chosen-with-drop");
                this.form_field_jq.trigger("chosen:hiding_dropdown",
                {
                    chosen: this
                });
            }
            return this.results_showing = false;
        };

        ChosenTree.prototype.set_tab_index = function(el)
        {
            var ti;
            if (this.form_field.tabIndex)
            {
                ti = this.form_field.tabIndex;
                this.form_field.tabIndex = -1;
                return this.search_field[0].tabIndex = ti;
            }
        };

        ChosenTree.prototype.set_label_behavior = function()
        {
            var _this = this;
            this.form_field_label = this.form_field_jq.parents("label");
            if (!this.form_field_label.length && this.form_field.id.length)
            {
                this.form_field_label = $("label[for='" + this.form_field.id + "']");
            }
            if (this.form_field_label.length > 0)
            {
                return this.form_field_label.bind('click.chosen', function(evt)
                {
                    if (_this.is_multiple)
                    {
                        return _this.container_mousedown(evt);
                    }
                    else
                    {
                        return _this.activate_field();
                    }
                });
            }
        };

        ChosenTree.prototype.show_search_field_default = function()
        {
            if (this.is_multiple && this.choices_count() < 1 && !this.active_field)
            {
                this.search_field.val(this.default_text);
                return this.search_field.addClass("default");
            }
            else
            {
                this.search_field.val("");
                return this.search_field.removeClass("default");
            }
        };

        ChosenTree.prototype.search_results_mouseup = function(evt)
        {
            var target;
            target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
            if (target.length)
            {
                this.result_highlight = target;
                this.result_select(evt);
                return this.search_field.focus();
            }
        };

        ChosenTree.prototype.search_results_mouseover = function(evt)
        {
            var target;
            target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
            if (target)
            {
                return this.result_do_highlight(target);
            }
        };

        ChosenTree.prototype.search_results_mouseout = function(evt)
        {
            if ($(evt.target).hasClass("active-result" || $(evt.target).parents('.active-result').first()))
            {
                return this.result_clear_highlight();
            }
        };

        ChosenTree.prototype.choice_build = function(item)
        {
            var choice, close_link,
                _this = this;
            choice = $('<li />',
            {
                "class": "search-choice"
/// ZUI change begin
/// Set title to span with item value
///            }).html("<span>" + item.html + "</span>");
            }).html("<span title='" + item.html + "'>" + item.html + "</span>");
/// ZUI change end
            if (item.disabled)
            {
                choice.addClass('search-choice-disabled');
            }
            else
            {
                close_link = $('<a />',
                {
                    "class": 'search-choice-close',
                    'data-option-array-index': item.array_index
                });
                close_link.bind('click.chosen', function(evt)
                {
                    return _this.choice_destroy_link_click(evt);
                });
                choice.append(close_link);
            }
            return this.search_container.before(choice);
        };

        ChosenTree.prototype.choice_destroy_link_click = function(evt)
        {
            evt.preventDefault();
            evt.stopPropagation();
            if (!this.is_disabled)
            {
                return this.choice_destroy($(evt.target));
            }
        };

        ChosenTree.prototype.choice_destroy = function(link)
        {
            if (this.result_deselect(link[0].getAttribute("data-option-array-index")))
            {
                this.show_search_field_default();
                if (this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1)
                {
                    this.results_hide();
                }
                link.parents('li').first().remove();
                return this.search_field_scale();
            }
        };

        ChosenTree.prototype.reset = function()
        {
        	this.setText(this.defaultText);
        	this.setValue("");
        	//this.$searchField.addClass("default");
        	this.$selectedItem.addClass("chosen-default");
        	this.$formField.trigger("change");
        	
        	this.$formField.trigger("chosen:update", 
        			null
        	);	
        };

        ChosenTree.prototype.results_reset_cleanup = function()
        {
            this.current_selectedIndex = this.form_field.selectedIndex;
            return this.selected_item.find("abbr").remove();
        };

        ChosenTree.prototype.result_select = function(evt)
        {
            var high, item;
            if (this.result_highlight)
            {
                high = this.result_highlight;
                this.result_clear_highlight();
                if (this.is_multiple && this.max_selected_options <= this.choices_count())
                {
                    this.form_field_jq.trigger("chosen:maxselected",
                    {
                        chosen: this
                    });
                    return false;
                }
                if (this.is_multiple)
                {
                    high.removeClass("active-result");
                }
                else
                {
                    this.reset_single_select_options();
                }
                item = this.results_data[high[0].getAttribute("data-option-array-index")];
                item.selected = true;
                this.form_field.options[item.options_index].selected = true;
                this.selected_option_count = null;
                if (this.is_multiple)
                {
                    this.choice_build(item);
                }
                else
                {
                    this.single_set_selected_text(item.text);
                }
                if (!((evt.metaKey || evt.ctrlKey) && this.is_multiple))
                {
                    this.results_hide();
                }
                this.search_field.val("");
                if (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex)
                {
                    this.form_field_jq.trigger("change",
                    {
                        'selected': this.form_field.options[item.options_index].value
                    });
                }
                this.current_selectedIndex = this.form_field.selectedIndex;
                return this.search_field_scale();
            }
        };

        ChosenTree.prototype.single_set_selected_text = function(text)
        {
            if (text == null)
            {
                text = this.default_text;
            }
            if (text === this.default_text)
            {
                this.selected_item.addClass("chosen-default");
            }
            else
            {
                this.single_deselect_control_build();
                this.selected_item.removeClass("chosen-default");
            }
/// ZUI change begin
/// Change title with text
///         return this.selected_item.find("span").text(text); // old code
            return this.selected_item.find("span").attr('title', text).text(text);
/// ZUI change end
        };

        ChosenTree.prototype.result_deselect = function(pos)
        {
            var result_data;
            result_data = this.results_data[pos];
            if (!this.form_field.options[result_data.options_index].disabled)
            {
                result_data.selected = false;
                this.form_field.options[result_data.options_index].selected = false;
                this.selected_option_count = null;
                this.result_clear_highlight();
                if (this.results_showing)
                {
                    this.winnow_results();
                }
                this.form_field_jq.trigger("change",
                {
                    deselected: this.form_field.options[result_data.options_index].value
                });
                this.search_field_scale();
                return true;
            }
            else
            {
                return false;
            }
        };

        return ChosenTree;

    })();
    
    
    ChosenTree.VERSION = "0.0.1";
    ChosenTree.DEFAULTS = {
        idField: 'id', //对节点解析id
        textField: 'text',  //对节点解析text
        plusIcon: 'icon-plus-sign',
        minusIcon: 'icon-minus-sign',
        data: [],
        formatter: function(item) {
            //对每个节点的解析
            return  " <a class='edit-btn' href='javascript:;'><i class='icon-pencil'></i></a> &nbsp;" +
                " <a class='del-btn text-danger' href='javascript:;'><i class='icon-trash'></i></a>";

        }

    };


    var NAME = 'zui.chosentree';
    $.fn.extend(
    {
        chosentree: function(options)
        {
            if (!browser_is_supported())
            {
            	console.log(" chosentree browser_is_supported");
             //   return this;
            }
            var params = arguments;
            return this.each(function()
            {
                var $this = $(this), 
                	chosenTree = $this.data(NAME);
                
                if (!chosenTree) {
                	options = $.extend(
                        {}, ChosenTree.DEFAULTS, options);
                    
                    $this.data(NAME, (data = new ChosenTree(this, options)));
                    return;
                }
                
                if (typeof options == 'string') {
                	
                	chosenTree[options](params[1]);
                	
                }
            });
        }
    });
 
    

}).call(this);
