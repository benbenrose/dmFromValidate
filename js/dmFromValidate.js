/**
 *  auth lily
 * from validate
 * 2017/12/27.
 */

(function ($,window) {
    /*define( 'xxxx/common/lib/dmFromValidate', function( require, exports, module ){*/
        ;if('undefined' === typeof jQuery) throw new Error('dmFromValidate’s JavaScript require jQuery');
        +function ($) {
            //表单正则验证策略对象
            var InputStrategy = function () {
                var strategy = {
                    isNonEmpty: function(value, errorMsg) {
                        //不能为空
                        if (!value.length) {
                            return errorMsg;
                        }
                    },
                    minLength: function(value, length, errorMsg) {
                        //小于
                        if (value.length < length) {
                            return errorMsg;
                        }
                    },
                    maxLength: function(value, length, errorMsg) {
                        //大于
                        if ( length < value.length) {
                            return errorMsg;
                        }
                    },
                    isMobile: function(value, errorMsg) {
                        //是否为手机号码
                        if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
                            return errorMsg;
                        }
                    },
                    isEmail: function(value, errorMsg) {
                        //是否为邮箱
                        if (!/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(value)) {
                            return errorMsg;
                        }
                    },
                    between: function(value, range, errorMsg) {
                        //大于小于
                        var min = parseInt(range.split('-')[0]);
                        var max = parseInt(range.split('-')[1]);
                        if (value.length < min || value.length > max) {
                            return errorMsg;
                        }
                    },
                    onlyEn: function(value, errorMsg) {
                        //纯英文
                        if (!/^[A-Za-z]+$/.test(value)) {

                        }
                    },
                    onlyZh: function(value, errorMsg) {
                        //纯中文
                        if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
                            return errorMsg;
                        }
                    },
                    onlyNum: function(value, errorMsg) {
                        //数字包含小数
                        if (!/^[0-9]+([.][0-9]+){0,1}$/.test(value*1)) {
                            return errorMsg;
                        }
                    },
                    isDecimal: function(digit,value, errorMsg) {//最多保留n位小数
                        ///^[0-9]\d*\.\d{2}$|^[0-9]\d*\.\d{1}$|^[0-9]\d*$/;//正整数或者正浮点数 小数后2位 decimal'
                        //默认为保留2位小数
                        var reg = /^[0-9]\d*\.\d{2}$|^[0-9]\d*\.\d{1}$|^[0-9]\d*$/;
                        if(InputStrategy.check('onlyInt',digit,true)){
                            digit = 2;
                        }
                        //暂时这样做，想到好办法在优化
                        switch (digit+''){
                            case '1':
                                reg = /^[0-9]\d*\.\d{1}$|^[0-9]\d*$/;
                                break;
                            case '2':
                                reg  = /^[0-9]\d*\.\d{2}$|^[0-9]\d*\.\d{1}$|^[0-9]\d*$/;
                                break;
                            case '3':
                                reg  = /^[0-9]\d*\.\d{3}$|^[0-9]\d*\.\d{2}$|^[0-9]\d*\.\d{1}$|^[0-9]\d*$/;
                                break;
                            case '4':
                                reg  = /^[0-9]\d*\.\d{4}$|^[0-9]\d*\.\d{3}$|^[0-9]\d*\.\d{2}$|^[0-9]\d*\.\d{1}$|^[0-9]\d*$/;
                                break;
                            default :
                                break;
                        }
                        if (!reg.test(value*1)) {
                            return errorMsg;
                        }
                    },
                    onlyInt: function(value, errorMsg) {
                        //整数
                        if (!/^[0-9]*$/.test(value*1)) {
                            return errorMsg;
                        }
                    },
                    greaterThan: function(value1,value2, errorMsg) {
                        //大于
                        if (!(value1 > value2)) {
                            return errorMsg;
                        }
                    },
                    greaterThanEqual: function(value1,value2, errorMsg) {
                        //大于等于
                        if (!(value1 >= value2)) {
                            return errorMsg;
                        }
                    },
                    isChecked: function(value, errorMsg, el) {
                        var i = 0;
                        var $collection = $(el).find('input:checked');
                        if(!$collection.length){
                            return errorMsg;
                        }
                    },
                    notInfo:function () {
                        return false;
                    },
                    isIP:function (value, errorMsg) {
                        var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                        if(!reg.test(value)){
                            return errorMsg;
                        }
                    }
                }
                return {
                    check:function () {
                        var type = arguments[0],
                            value = [].slice.call(arguments,1);
                        return strategy[type] ? strategy[type].apply(this,value) : '没有该类型的检测方式'
                    },
                    addStrategy:function (type,fn) {
                        strategy[type] = fn;
                    }
                }
            }();
            /****************************************/
            /***
             * validType:识别符(*)///input :data-valid:'name'
             * valid:验证规则(*)
             * errorMsg：错误提示(*)
             * */
            var Validator = function(element,options) {//[{validType:'name',valid:'isNonEmpty||maxLength:6',error:'不能为空||不能小于6位'}]
                this.type = options.type || '';//pop
                this.options = options.data || [];
                this.element = element;
                $(this.element).find('[data-valid]').css('border-color', '#ccc').end().find('div[promo-error-box="box"]').remove();
                this.bind();
            };
            Validator.prototype.bind = function () {
                $(this.element)
                    .on('change.dm.validate','[data-valid]',$.proxy(this.validateRules, this))
                    .on('input.dm.validate','[data-valid]',$.proxy(this.validateRules, this))
                    .on('propertychange.dm.validate','[data-valid]',$.proxy(this.validateRules, this))
            };
            Validator.prototype.showMsg = function () {
                var $element = $(this.$element);var _top = '';
                if($element.is('.promo-chosen-input')){//为了配合dmChosen
                    $element = $element.parent().parent();
                    _top = 'top:100%';
                }
                this.cleanMsg();
                $element.css('border-color','#FF0000');
                var _divs = 'position: absolute; color: #EB5349; font-size: 12px; '+_top;
                var _spans = 'color: #FF0000; font-size: 14px;  display: inline; vertical-align: text-top;';
                var _ps = 'display: inline; vertical-align: text-top; margin-left: 1px; white-space: nowrap;margin-bottom:0px';
                if(this.type == 'pop'){
                    var _width = $(this.$element).width() + 50;
                    _divs = 'display: none; position: absolute; top: 7px; left: '+_width+'px; z-index:1;min-width: 100px; height: 38px; line-height: 27px; padding: 0; border: 1px solid rgb(255, 0, 0); border-radius: 4px; color: rgb(34, 34, 34); font-size: 12px; background: rgb(255, 229, 229);';
                    _spans = 'color: #EB5349; font-size: 16px; padding-right: 10px; display: inline-block; vertical-align: text-top; position: absolute; top: 11px; left: 4px; width: 16px; height: 16px; background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAOJJREFUKBWdUrsNg0AMNVEKGnaJxAYMkIxBiRghG0DHHKxAjZIR2CENVZz3dBznQwIlsfQkn/2eP2ARYyqSAXfgAbwW0GcsM9TgIlEAE6A7YK4ICngMAO8dgS1EjhPD4XhHnayQPrkZu3H+kBwG1aZRTRIH+oxZDjRnTHqL5h5HkaoSSVMXLkuRto0oeFzZkV8vVGSnrtPV6DNmOdCctqW+fqMS/1OoyJ1o7OQ7M2Y50HDHHrisnfLc7VTXLjTPIozF1nPH/34HC0H8+wH4CRbxtNnF7sZcfHJG7I/8CdLhkX8A5DEP/D++tpoAAAAASUVORK5CYII=") center no-repeat;';
                    _ps = 'display: inline-block; vertical-align: text-top; margin-left: 15px; white-space: nowrap; margin: 0 0 0 22px;';
                }
                $element.parent().css('position' ,'relative');
                var _d = document.createElement('div');
                _d.setAttribute('promo-error-box', 'box');
                _d.setAttribute('style', _divs);
                $element.parent()[0].appendChild(_d);
                var _s = document.createElement('span');
                _s.setAttribute('style', _spans);
                if(this.type != 'pop')_s.innerText = "*";
                _d.appendChild(_s);
                var _p = document.createElement('p');
                _p.setAttribute('style', _ps);
                _p.innerText = this.errorMsg;
                _d.appendChild(_p);
                if(this.type == 'pop'){
                    $(this.$element)
                        .on('mouseover.dm.validate', function(){
                            $(this).siblings('div[promo-error-box="box"]').show();
                        })
                        .on('mouseout.dm.validate', function(){
                            $(this).siblings('div[promo-error-box="box"]').hide();
                        });
                }
            }
            Validator.prototype.cleanMsg = function (type) {
                if(type == 'all'){//外部请求清除全部提示
                    $(this.element).find('[data-valid]').each(function () {
                        $(this).css('border-color', '#ccc').parent().find('div[promo-error-box="box"]').remove();
                    });
                    return;
                }
                //这个是内部清楚方法
                $.each(this.$elementList,function () {
                    if($(this).is('.promo-chosen-input')){//为了配合promChosen
                        $(this).parent().parent().css('border-color', '#ccc').parent().find('div[promo-error-box="box"]').remove();
                    }else{
                        $(this).css('border-color', '#ccc').parent().find('div[promo-error-box="box"]').remove();
                    }
                });
            }
            Validator.prototype.validateRules = function (e) {
                var that = this;
                var isValid = true;
                var $this = $(e.target || e.srcElement || e );
                that.$element = $this[0];
                this.$elementList = [];
                var validType = $this.data('valid');
                var isExits = false;
                $.each(that.options,function (i,obj) {
                    if(obj.validType == validType){
                        isExits = true;
                        var dataValid = obj.valid;
                        var validLen = dataValid.split('||');
                        var errCollection = obj.errorMsg;
                        var errMsgAry = errCollection.split("||");
                        var strategyAry, strategy, errorMsg;

                        for (var i = 0; i < validLen.length; i++) {
                            strategyAry = validLen[i].split(':');
                            strategy = strategyAry.shift();
                            if(strategy === 'greaterThan' || strategy ==='greaterThanEqual'){
                                var args = strategyAry.shift();
                                var argsAry =args.split('/');
                                var len = 2;
                                while(len > 0){
                                    var dom = $(that.element).find('[data-valid='+argsAry[len-1]+']');
                                    that.$elementList.push(dom);
                                    strategyAry.unshift(dom.val());
                                    len--;
                                }
                            }else if(strategy == 'isDecimal'){//isDecimal
                                var args = strategyAry.shift();
                                that.$elementList.push($this[0]);
                                strategyAry.unshift($.trim($this[0].value));
                                strategyAry.unshift(args);//传入位数
                            }else{
                                that.$elementList.push($this[0]);
                                strategyAry.unshift($.trim($this[0].value));
                            }
                            strategyAry.unshift(strategy);
                            strategyAry.push(errMsgAry[i]);
                            strategyAry.push($this[0]);
                            errorMsg = InputStrategy.check.apply($this, strategyAry);
                            if (errorMsg) {
                                that.errorMsg = errorMsg;
                                that.showMsg();
                                isValid = false;
                                break;
                            }
                            if (!errorMsg) {
                                that.cleanMsg();
                            }
                        };
                    }
                });
                //没找到相应的注册规则，则按notInfo处理
                if(!isExits)  {
                    that.$elementList.push($this[0]);
                    that.cleanMsg();
                }
                return isValid;

            }
            Validator.prototype.submitValid = function () {
                var that = this;
                var isValid = true;
                var $this = that.element;
                //如果是表格要确定每个的作用域
                if(arguments[0]){
                    $this = arguments[0];
                }
                $($this).find('[data-valid]:not([type="hidden"])').each(function () {
                    if(!$(this).parent().find('div[promo-error-box="box"]').length){
                        if(!that.validateRules(this)){
                            isValid = false;
                        }
                    }else{
                        isValid = false;
                    }
                });
                var e = $.Event('valid.dm.validate', { isValid: isValid} );
                $(this.element).trigger(e)
                return isValid;
            }
            Validator.prototype.validInfoText = function () {
                var that = this;
                var infoData = arguments[0] || [];
                $.each(infoData,function (i,obj) {
                    that.errorMsg = obj.errorMsg;
                    that.$element = $(that.element).find('[data-valid='+obj.validType+']')[0];
                    if(!that.$element) return;
                    that.$elementList = [];
                    that.$elementList.push(that.$element);
                    that.showMsg();
                })
                /*$(that.element).find('[data-valid]').each(function () {
                 that.validateRules(this)
                 })*/
            }
            Validator.prototype.changeValue = function (dataValid) {
               //如果告诉具体的datavalid就验证具体的，否则验证所有
                var that = this;
                setTimeout(function () {
                    var node = '[data-valid]';
                    if(dataValid){
                        node = '[data-valid = '+dataValid+']'
                    }
                    $(that.element).find(node).each(function () {
                        that.validateRules(this);
                    });
                },10);

            }

            Validator.prototype.destroy = function () {
              //销毁实例
                $(this.element).data('dm.validate',null)
            }

            function Plugin(opt) {
                var _arg = arguments;
                return this.each(function (  )  {
                    var $this = $(this);
                    var options = $.extend({}, typeof opt == 'object' && opt);
                    var data  = $this.data('dm.validate');
                    if(!data && typeof opt == 'string' && opt == 'destroy') return;
                    if (!data) $this.data('dm.validate', (data = new Validator(this,options)))
                    if (typeof opt == 'string' && opt == 'cleanMsg') {
                        data[opt]('all');
                        return;
                    }
                    if (typeof opt == 'string') data[opt](_arg[1]);
                })
            }
            $.fn.validator = Plugin
            $.validatorStrategy = InputStrategy;
        }(jQuery)
/*    });*/
})(jQuery,window);
