# dmFromValidate
自动表单验证
## 初始化
     $('#tab-protocol').validator({type:'',data:[
                {validType:'activityNo',valid:'isNonEmpty',errorMsg:'不能为空'},
                {validType:'profitScale',valid:'isNonEmpty||isDecimal:2',errorMsg:'不能为空||只能输入数值且保留两位小数'}
                {validType:'limitStartDate',valid:'greaterThanEqual:limitEndDate/limitStartDate',errorMsg:'开始时间必须小于截止时间'},
                {validType:'limitEndDate',valid:'greaterThanEqual:limitEndDate/limitStartDate',errorMsg:'截止时间必须大于开始时间'},
                ]});
    type:''/pop:table表单编辑提示
    validType:对应HTMLdata-valid 必须
    valid:isNonEmpty/minLength/maxLength/isMobile/isEmail/between/onlyEn/onlyZh/onlyNum/isDecimal(1-4)/onlyInt
                /greaterThan/greaterThanEqual
                
    $('#tab-protocol').one('valid.dm.validate',function (a) {
    console.log(a.isValid)//true/false
    }).validator('submitValid')
                //注：如果是table popo 要给每个tr作用域validator('submitValid'，this)
                <br>
                $('#tab-protocol').validator('validInfoText', [{validType:'activityNo',errorMsg:'活动号无效'}]);
                <br>
                $('#tab-protocol').validator('cleanMsg');//清除全部
                <br>
                $('#tab-protocol').validator('changeValue','pageManage');//为了兼容INput；改变某一个字段触发验证

                <br>
                input type="hidden" data-valid="goodsName" //跳过验证
