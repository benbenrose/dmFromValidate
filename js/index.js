/**
 * Created by lily on 2017/12/27.
 */
$(document).ready(function(){
    $('#validTest').validator({type:'',data:[
        {validType:'test1',valid:'isNonEmpty||minLength:6',errorMsg:'不能为空||不能小于6位'},
        {validType:'test2',valid:'isNonEmpty||isDecimal:2',errorMsg:'不能为空||只能输入数值且保留两位小数'},
        {validType:'test3',valid:'isNonEmpty||onlyNum',errorMsg:'不能为空||只能输入数值'},
        {validType:'test4',valid:'greaterThanEqual:test5/test4',errorMsg:'开始时间必须小于截止时间'},
        {validType:'test5',valid:'greaterThanEqual:test5/test4',errorMsg:'截止时间必须大于开始时间'}
    ]});
    $('.validTestTable').validator({type:'pop',data:[
        {validType:'name',valid:'isNonEmpty',errorMsg:'不能为空'},
        {validType:'sex',valid:'isNonEmpty',errorMsg:'不能为空'},
        {validType:'age',valid:'isNonEmpty||onlyNum',errorMsg:'不能为空||只能输入数值'},
    ]});
    $('.btn-save').on('click',function () {
        var that = this;
        $('.validTestTable').one('valid.dm.validate',function (a) {
            console.log(a.isValid)//true/false
            $(that).next('span').html(a.isValid?'验证通过':'验证失败');
        }).validator('submitValid',$(this).parent().parent())
    });
});