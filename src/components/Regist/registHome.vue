<template>
  <div class="registHome">
     
       <div  class="typeContainer" >
           <!--用户注册-->
          <div class="btnTypes" v-if="registtype === '1'">
               <section class="showChose" v-show="showChose">
                <section class="address">
                <section class="title">
                <h4>所在区域</h4>
                <span @click="closeAdd()">×</span>
                </section>
                <section class="title">
                <div class="area" @click="provinceSelected()">{{Province?Province:""}}</div>
                <div class="area" @click="citySelected()" :class="City?'':'active'">{{City?City:'请选择'}}</div>
                <div class="area" @click="districtSelected()" :class="District?'':'active'" v-show="City">{{District?District:'请选择'}}</div>
                </section>
                <ul>
                <li class="addList" v-for="(v,k) in info" @click="getProvinceId(v.area_id, v.area_name, k)" v-show="showProvince" :class="v.selected ? 'active' : ''">{{v.area_name}}</li>
                <li class="addList" v-for="(v,k) in showCityList" @click="getCityId(v.area_id, v.area_name, k)" v-show="showCity" :class="v.selected ? 'active' : ''">{{v.area_name}}</li>
                <li class="addList" v-for="(v,k) in showDistrictList" @click="getDistrictId(v.area_id, v.area_name, k)" v-show="showDistrict" :class="v.selected ? 'active' : ''">{{v.area_name}}</li>
              
                </ul>
                </section>
                </section>
              <form onsubmit="return false" style="margin-bottom: 30px;    background-color: #f2f2f2;">
               <ul class="inputSubmit">
                   <li>
                       <span class="leftName"><span style="color:#f01">*</span>手机号</span>
                       <input type="tel"   placeholder="请输入手机号码" autocomplete="off"  v-model="phone" class="textInput" />
                   </li>
                    <li>
                       <span class="leftName"><span style="color:#f01">*</span>验证码</span>
                       <input type="number"  placeholder="请输入验证码" v-model="captcha" oninput="if(value.length>6)value=value.slice(0,6)"  class="codeInput" />
                       <span :class="isCode==false?'getCode':'activeGetcode'" @click="sendCode()">{{showTitle}}</span>
                   </li>
                    <li>
                       <span class="leftName">&nbsp;推荐码</span> 
                       <input type="text"  placeholder="请输入推荐码(可选)" v-model="inviter_id" readonly  class="textInput" style="width:40%" />
                   </li>
                   <li>
                       <span class="leftName"><span style="color:#f01">*</span>设置密码</span> 
                       <input placeholder="请输入6-20位密码" type="password" v-model="password" class="textInput" />
                   </li>
                    <li>
                       <span class="leftName"><span style="color:#f01">*</span>确认密码</span> 
                       <input placeholder="请再次输入密码" type="password" v-model="password_confirm"  class="textInput" />
                   </li>
                     <li @click="openAreaPick()">
                       <span class="leftName"><span style="color:#f01">*</span>所在地区</span> 
                       <span class="areaName">{{area_adress}}</span>
                       <img src="../../assets/icon_left_arrow.png" class="areaPicker" />
                  </li>
                  <li>
                       <span class="leftName"><span style="color:#f01">*</span>详细地址</span>
                       <input placeholder="请输入您的详细地址"  type="text" v-model="address" class="textInput" />
                   </li>

               </ul> 
              <p class="agree"> <input class="checkAgree"  type="checkbox" :value="isAgree"   v-model="isAgree"/><a href="#/agreeMent">同意用户注册协议</a>  </p>
               <button :class="isAgree==true?'btnRegist':'noAgree'" type="submit" @click="registUser" >注册</button> 
             </form>    
          </div>
          <!--医生注册-->
           <div class="btnTypes"  v-else-if="registtype === '2'">
               
               <div id="Pickervalue"  v-if="showPicker" >
                   <p class="btnOk" @click="changePicker">确定</p><p class="btnCancel" @click="clickCancel">取消</p>
              
                    <mt-picker  id="slotPicker" :slots="slots" @change="onValuesChange" ></mt-picker>
                    </mt-picker>
                    
                </div>
                 <section class="showChose" v-show="showChose">
                <section class="address">
                <section class="title">
                <h4>所在区域</h4>
                <span @click="closeAdd()">×</span>
                </section>
                <section class="title">
                <div class="area" @click="provinceSelected()">{{Province?Province:""}}</div>
                <div class="area" @click="citySelected()" :class="City?'':'active'">{{City?City:'请选择'}}</div>
                <div class="area" @click="districtSelected()" :class="District?'':'active'" v-show="City">{{District?District:'请选择'}}</div>
                </section>
                <ul>
                <li class="addList" v-for="(v,k) in info" @click="getProvinceId(v.area_id, v.area_name, k)" v-show="showProvince" :class="v.selected ? 'active' : ''">{{v.area_name}}</li>
                <li class="addList" v-for="(v,k) in showCityList" @click="getCityId(v.area_id, v.area_name, k)" v-show="showCity" :class="v.selected ? 'active' : ''">{{v.area_name}}</li>
                <li class="addList" v-for="(v,k) in showDistrictList" @click="getDistrictId(v.area_id, v.area_name, k)" v-show="showDistrict" :class="v.selected ? 'active' : ''">{{v.area_name}}</li>
              
                </ul>
                </section>
                </section>
                <form onsubmit="return false" style="margin-bottom: 30px;    background-color: #f2f2f2;">
               <ul class="inputSubmit">
                   <li>
                       <span class="leftName"><span style="color:#f01">*</span>手机号</span>
                       <input placeholder="请输入手机号码" autocomplete="off" type="tel" v-model="phone" class="textInput" />
                   </li>
                    <li>
                       <span class="leftName"><span style="color:#f01">*</span>验证码 </span>
                       <input type="number"   placeholder="请输入验证码" v-model="captcha" oninput="if(value.length>6)value=value.slice(0,6)" class="codeInput" />
                       <span :class="isCode==false?'getCode':'activeGetcode'" @click="sendCode()">{{showTitle}}</span>
                   </li>
                    <li>
                       <span class="leftName"><span style="color:#f01">*</span>真实姓名</span>
                       <input placeholder="请输入姓名" autocomplete="off" type="text" v-model="truename" require class="textInput" />
                   </li>
                   <li>
                       <span class="leftName" style="margin-right:10px"><span style="color:#f01">*</span>身份证号码</span>
                       <input placeholder="请输入身份证号码"  autocomplete="off" type="text" v-model="idcard" class="textInput" />
                   </li>
                   <li>
                       <span class="leftName" style="margin-right:10px"><span style="color:#f01">*</span>工作年限</span>
                       <input placeholder="请输入您的工作年限"  autocomplete="off" type="text" v-model="seniority" class="textInput" />
                   </li>
                   
                   <li @click="openPick()"> <span class="leftName"  ><span style="color:#f01">*</span>请选择执业资质</span>
                   <span class="rightPicker" >{{aptitude_type==1?'营养师编号':aptitude_type==2?'许可证编号':aptitude_type==3?'统一社会信用代码':aptitude_type==4?'营业执照注册号':''}}</span>
                    <img src="../../assets/icon_left_arrow.png" class="areaPicker" />
                   </li>
                    <li >
                       <span class="leftName"><span style="color:#f01">*</span>资质编号</span> 
                       <input placeholder="请输入资质编号" v-model="aptitude_num" class="textInput" />
                   </li>
                    <li >
                       <span class="leftName">&nbsp;推荐码</span> 
                       <input placeholder="请输入推荐码(可选)" readonly v-model="inviter_id" class="textInput" />
                   </li>
                   <li>
                       <span class="leftName"><span style="color:#f01">*</span>设置密码</span> 
                       <input placeholder="请输入6-20位密码" type="password" minlength="6" maxlength="20" v-model="password" class="textInput" />
                   </li>
                    <li>
                       <span class="leftName"><span style="color:#f01">*</span>确认密码</span> 
                       <input placeholder="请再次输入密码" type="password" minlength="6" maxlength="20" v-model="password_confirm" class="textInput" />
                   </li>
                   <li @click="openAreaPick()">
                       <span class="leftName"><span style="color:#f01">*</span>所在地区</span> 
                       <span class="areaName">{{area_adress}}</span>
                       <img src="../../assets/icon_left_arrow.png" class="areaPicker" />
                  </li>
                  <li>
                       <span class="leftName"><span style="color:#f01">*</span>详细地址</span>
                       <input placeholder="请输入您的详细地址"  type="text" v-model="address" class="textInput" />
                   </li>

               </ul> 
              <p class="agree"> <input class="checkAgree"  type="checkbox" :value="isAgree"   v-model="isAgree"/><a href="#/agreeMent">同意用户注册协议</a>  </p>
               <button :class="isAgree==true?'btnRegist':'noAgree'" type="submit" @click="registdoctor" >提交注册资料</button> 
             </form>
          </div> 
          <!--服务商注册-->
           <div class="btnTypes"  v-else-if="registtype === '3'">
                <form onsubmit="return false" style="margin-bottom: 30px;    background-color: #f2f2f2;">
               <ul class="inputSubmit">
                   <li>
                       <span class="leftName"><span style="color:#f01">*</span>手机号</span>
                       <input placeholder="请输入手机号码" autocomplete="off" type="tel" v-model="phone" class="textInput" />
                   </li>
                    <li>
                       <span class="leftName"><span style="color:#f01">*</span>验证码</span>
                       <input placeholder="请输入验证码" v-model="captcha" class="codeInput" />
                       <span :class="isCode==false?'getCode':'activeGetcode'" @click="sendCode()">{{showTitle}}</span>
                   </li>
                   <h3 class="showTxt">请提交服务商资料</h3>
                    <li>
                       <span class="leftName"><span style="color:#f01">*</span>真实姓名</span>
                       <input placeholder="请输入姓名"  autocomplete="off" type="text" v-model="truename" class="textInput" />
                   </li>
                   <li>
                       <span class="leftName" style="margin-right:10px"><span style="color:#f01">*</span>身份证号码</span>
                       <input placeholder="请输入身份证号码"  autocomplete="off" type="text" maxlength="20" v-model="idcard" class="textInput" />
                   </li>
                   <li>
                       <span class="leftName" style="margin-right:10px"><span style="color:#f01">*</span>服务级别</span>
                       <div class="rightInput">
                           <input type="checkbox" name="level" val="1" style="height: 20px; width: 20px; margin-right:5px;   border: 1px solid #ddd;background-color:#fff"  class="levelType"/>市级
                           <input type="checkbox" name="level" val="2" style="height: 20px; width: 20px; ; margin-right:5px;  border: 1px solid #ddd;background-color:#fff" class="levelType"/>县级
             
                       </div>  
                       </li>
                    <li>
                       <span class="leftName">&nbsp;推荐码</span> 
                       <input placeholder="请输入推荐码(可选)" readonly v-model="inviter_id" class="textInput" />
                   </li>
                   <li>
                       <span class="leftName"><span style="color:#f01">*</span>设置密码</span> 
                       <input placeholder="请输入6-20位密码" type="password" minlength="6" maxlength="20" v-model="password" class="textInput" />
                   </li>
                    <li>
                       <span class="leftName"><span style="color:#f01">*</span>确认密码</span> 
                       <input placeholder="请再次输入密码" type="password" minlength="6" maxlength="20" v-model="password_confirm" class="textInput" />
                   </li>
               </ul> 
              <p class="agree"> <input class="checkAgree"  type="checkbox" :value="isAgree"   v-model="isAgree"/><a href="#/agreeMent">同意用户注册协议</a>  </p>
               <button :class="isAgree==true?'btnRegist':'noAgree'" type="submit" @click="registProvider" >提交注册资料</button> 
             </form>
          </div>  
       
              
         
       </div>
       

  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求
axios.defaults.timeout = 3000
import { Toast,Loadmore,Indicator,Picker } from 'mint-ui';
export default {
  name: 'registHome',
  
  data () {
    return {
        registtype:this.$route.query.isType,
        inviter_id:this.$route.query.inviter_id,  //推荐码
        phone:"", //手机号码
        captcha:"", //测试期间用 69
        password:"", //密码
        password_confirm:"", //确认密码
        client:"",
        idcard:"", //身份证号码
        truename:"",//：真实姓名
        aptitude_type:"",//资质编号类型
        aptitude_num:"",  //资质编号
        seniority:"", //工作年限
        isAgree:false, //是否同意协议
        isCode:false,  //是否触发获取验证码
        sms_time:'',   //倒计时
        showTitle:'获取验证码',
        address:"",
        facilitator_level:"", //服务商级别-必填
        showPicker:false,    
        slots:[{
             flex: 1,
            values: ['营养师编号','许可证编号','统一社会信用代码','营业执照注册号'],
            className: 'slot1',
            textAlign: 'center'
        }],
        //城市地址
        showChose: false,
        showProvince: true,
        showCity: false,
        showDistrict: false,
        showCityList: false,
        showDistrictList: false,
        province: 5, //默认地址
        city: '',
        district: '',
        GetProvinceId: 2,
        District: false,
        Province: false,
        City: false,
        area_name:"",
        province_id:"", //省份ID
        city_id:"",     //城市ID
        area_id:"",     //地区ID
        area_adress:"", //地址
        info: [], //地址请求



        
    }
  },
  computed:{
    params(){
      return this.pageSize
    },
    isloading(){
      return this.$store.state.isloading;
    },
    isCount(){  //统计加载次数
      return this.$store.state.isCount;
    },
    
  },
  mounted(){  
   	var u = navigator.userAgent;
  	if(u.indexOf('iPhone') > -1){
  		this.client="ios";
  	}else{
       this.client="android";
    }   
     $(".checkAgree").on('click',function(e){
        this.isAgree=$(e.target).attr('value');
        if(this.isAgree=="true"){
            $(e.target).removeClass('disable');
             $(e.target).attr('value',false);
        }else if(this.isAgree=="false"){
            $(e.target).addClass('disable');
            $(e.target).attr('value',true);
        }
     });
     var that=this;
     $(".levelType").on('click',function(e){
         that.facilitator_level=$(e.target).attr('val');
          $(e.target).addClass('disable');
          $(e.target).siblings().removeClass('disable');
     })
  },
  methods:{
    registUser(){  //用户注册
       var that=this;
      if(that.phone==""){
         Toast("请输入手机号码");
          return; 
      }else{
          if(that.captcha==""){
          Toast("请输入验证码");
          return;
      }else{
           if(that.password_confirm==''|| that.password==""){
            Toast("请输入您的密码");
            return;
            }else{
                if(that.password!=that.password_confirm){
                    Toast("两次密码输入不一致！");
                    return;
                }else{
                     if(this.area_adress==""){
                         Toast("所在地区不能为空！"); 
                          return;
                     }else{
                       if(this.adress==""){
                           Toast("详细地址不能为空!");
                           return;
                       }else{
                                                       var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
                    axios({
                            method: 'Post',
                            url:domain+'/mobile/index.php?act=connect&op=sms_register',
                            data:{
                                member_type:that.$route.query.isType, //注册类型
                                inviter_id:that.inviter_id,  //推荐码
                                phone:that.phone, //手机号码
                                captcha:that.captcha, //测试期间用 69
                                password:that.password, //密码
                                password_confirm:that.password_confirm,
                                  province_id:that.province_id, //省份ID
                                                                    city_id:that.city_id,     //城市ID
                                                                    area_id:that.area_id,     //地区ID
                                client:that.client, //客户端

                            },
                        transformRequest: [function (data) {
                            let ret = ''
                            for (let it in data) {
                                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                            }
                            return ret
                            }],
                            headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                    }
                    }).then(function(response){ 
                    console.log(response);
                    if(response.data.code==200){
                        Toast("注册成功！");
                    }else{
                        Toast(response.data.datas.error);
                    }

                    },(err)=>{
                        Toast('网络超时，请稍后重试');
                    }); 
                       }     
                    }
                                         
                                                      
            
                }
               
            }
      }
      }
      
      

    },
    registdoctor(){  //医生注册
        var that=this;
      if(that.phone==""){
         Toast("请输入手机号码");
          return; 
      }else{
          if(that.captcha==""){
          Toast("请输入验证码");
          return;
        }else{
           if(that.truename==''){
            Toast("请填写您的真实姓名！");            
            return;
            }else{
                if(that.idcard==''){
                    Toast("请填写您的身份证信息");                                    
                   return; 
                }else{
                     if(that.aptitude_type==0){
                                Toast("请选择执业资质！"); 
                                return;
                                }else{
                                    if(that.seniority==""){
                                        Toast("工作年限不能为空！");
                                        return;
                                    }else{

                                    if(that.aptitude_num==""){
                                    Toast("请填写资质编号！");                             
                                    return;
                                    }else{
                                        if(that.password_confirm==''|| that.password==""){
                                        Toast("请输入密码！");
                                        return;  
                                        }else{
                                            if(that.password!=that.password_confirm){
                                        Toast("两次密码输入不一致！");
                                        return;
                                    }else{
                                      if(this.area_adress==""){
                                          Toast("所在地区不能为空！");
                                          return;
                                      }else{
                                             if(this.address==""){
                                                Toast("详细地址不能为空！"); 
                                                return;
                                             }   else{
                                                    var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
                                                        axios({
                                                                method: 'Post',
                                                                url:domain+'/mobile/index.php?act=connect&op=sms_register',
                                                                data:{
                                                                    member_type:that.$route.query.isType, //注册类型
                                                                    inviter_id:that.inviter_id,  //推荐码
                                                                    phone:that.phone, //手机号码
                                                                    captcha:that.captcha, //测试期间用 69
                                                                    password:that.password, //密码
                                                                    password_confirm:that.password_confirm,
                                                                    truename:that.truename,
                                                                    aptitude_type:that.aptitude_type,
                                                                    aptitude_num:that.aptitude_num,
                                                                    seniority:that.seniority,
                                                                    idcard:that.idcard,
                                                                     province_id:that.province_id, //省份ID
                                                                    city_id:that.city_id,     //城市ID
                                                                    area_id:that.area_id,     //地区ID
                                                                    client:that.client, //客户端
                                                                    address:that.address,

                                                                },
                                                            transformRequest: [function (data) {
                                                                let ret = ''
                                                                for (let it in data) {
                                                                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                                                                }
                                                                return ret
                                                                }],
                                                                headers: {
                                                                'Content-Type': 'application/x-www-form-urlencoded',
                                                        }
                                                        }).then(function(response){ 
                                                        console.log(response);
                                                        if(response.data.code==200){
                                                            Toast("注册成功！");
                                                        }else{
                                                            Toast(response.data.datas.error);
                                                        }

                                                        },(err)=>{
                                                            Toast('网络超时，请稍后重试');
                                                        }); 
                                                }
                                         
                                      }
                                            
                                    }
                                
                            }
                        }
                                    }
                                }
                    }

                }
                
          }
      }
    },
    registProvider(){  //服务商注册
          var that=this;
      if(that.phone==""){
         Toast("请输入手机号码");
          return; 
      }else{
          if(that.captcha==""){
          Toast("请输入验证码");
          return;
        }else{
           if(that.truename==''){
            Toast("请填写您的真实姓名！");            
            return;
            }else{
                if(that.idcard==''){
                    Toast("请填写您的身份证信息");                                    
                   return; 
                }else{
                     if(that.facilitator_level==""){
                                Toast("请选择服务商级别"); 
                                return;
                                }else{
                                   if(that.password_confirm==''|| that.password==""){
                                        Toast("请输入密码！");
                                        return;  
                                        }else{
                                            if(that.password!=that.password_confirm){
                                        Toast("两次密码输入不一致！");
                                        return;
                                    }else{
                                      
                                      var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
                                                        axios({
                                                                method: 'Post',
                                                                url:domain+'/mobile/index.php?act=connect&op=sms_register',
                                                                data:{
                                                                    member_type:that.$route.query.isType, //注册类型
                                                                    inviter_id:that.inviter_id,  //推荐码
                                                                    phone:that.phone, //手机号码
                                                                    captcha:that.captcha, //测试期间用 69
                                                                    password:that.password, //密码
                                                                    password_confirm:that.password_confirm,
                                                                    truename:that.truename,
                                                                    idcard:that.idcard,
                                                                    client:that.client, //客户端
                                                                    facilitator_level:that.facilitator_level

                                                                },
                                                            transformRequest: [function (data) {
                                                                let ret = ''
                                                                for (let it in data) {
                                                                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                                                                }
                                                                return ret
                                                                }],
                                                                headers: {
                                                                'Content-Type': 'application/x-www-form-urlencoded',
                                                        }
                                                        }).then(function(response){ 
                                                        console.log(response);
                                                        if(response.data.code==200){
                                                            Toast("注册成功！");
                                                        }else{
                                                            Toast(response.data.datas.error);
                                                        }

                                                        },(err)=>{
                                                            Toast('网络超时，请稍后重试');
                                                        }); 

                                            
                                    }
                                
                            }
                                }
                    }

                }
                
          }
      }
      
     
    },
   
  
 closeAdd: function() {
  this.showChose = false;
 },
 _filter(add,name,code) {
  let result = [];
  for(let i=0;i<add.length;i++) {
  if(code == add[i].id){
   result = add[i][name];
  }
  }
  return result;
 },
 getProvinceId: function(code,input,index) {
  this.province_id=code;   
  this.province = code;
  this.Province = input.length>5?input.slice(0,5)+"...":input;
  this.showProvince=false;
  this.showCity=true;
  this.showDistrict = false;
  this.showCityList = this._filter(this.info,'city',this.area_name);
  // 点击选择当前
  this.info.map( a => a.selected = false );
  this.info[index].selected = true;
  var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=area&op=area_list',
                    data:{
                      area_id:code
                    },
                   transformRequest: [function (data) {
                      let ret = ''
                      for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                      }
                      return ret
                    }],
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
              }
            }).then(function(response){ 
              console.log(response);
              if(response.data.code==200){
                that.showCityList=response.data.datas.area_list;

              }else{
                Toast(response.data.datas.error)
              }

            },(err)=>{
                Toast('网络超时，请稍后重试');
            });   
 },
 provinceSelected: function() {  //选择省份
        
  // 清除市级和区级列表
  this.showCityList = false;
  this.showDistrictList = false;
  // 清除市级和区级选项
  this.City = false;
  this.District = false;
  // 选项页面的切换
  this.showProvince = true;
  this.showCity = false;
  this.showDistrict = false;

 },
 getCityId: function(code, input, index) {
  this.city_id=code;   
  this.city = code;
  this.City = input.length>5?input.slice(0,5)+"...":input;
  this.showProvince=false;
  this.showCity=false;
  this.showDistrict = true;
  this.showDistrictList = this._filter(this.showCityList,'district',this.area_name);
  // 选择当前添加active
  this.showCityList.map( a => a.selected = false );
  this.showCityList[index].selected = true;
  var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
  var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=area&op=area_list',
                    data:{
                      area_id:code
                    },
                   transformRequest: [function (data) {
                      let ret = ''
                      for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                      }
                      return ret
                    }],
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
              }
            }).then(function(response){ 
              console.log(response);
              if(response.data.code==200){
                that.showDistrictList=response.data.datas.area_list;
                if(that.showDistrictList.length==0){
                    that.showChose = false;
                   that.area_adress=that.Province+" "+that.City+" ";

                }
              }else{
                Toast(response.data.datas.error)
              }

            },(err)=>{
                Toast('网络超时，请稍后重试');
            });   
 },
 citySelected: function() {
  this.showProvince=false;
  this.showCity=true;
  this.showDistrict = false;
 },
 getDistrictId: function(code, input, index) {
  this.area_id=code;   
  this.district = code;
  this.District = input.length>5?input.slice(0,5)+"...":input;
  // 选择当前添加active
  this.showDistrictList.map( a => a.selected = false );
  this.showDistrictList[index].selected = true;
  // 选取市区选项之后关闭弹层
  this.showChose = false;
  this.area_adress=this.Province+" "+this.City+" "+this.District;
   
 },
 districtSelected: function() {
  this.showProvince=false;
  this.showCity=false;
  this.showDistrict = true;

 },
    openAreaPick(){   //打开城市三级联动
       this.showChose=true;
        var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=area&op=area_list',
                   transformRequest: [function (data) {
                      let ret = ''
                      for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                      }
                      return ret
                    }],
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
              }
            }).then(function(response){ 
              console.log(response);
              if(response.data.code==200){
                that.info=response.data.datas.area_list;
              }else{
                Toast(response.data.datas.error)
              }
            },(err)=>{
                Toast('网络超时，请稍后重试');
            });                                                    

    },
    openPick(){
       this.showPicker=true; 
    },
    changePicker(){
      this.showPicker=false; 
    },
    clickCancel(){
        this.aptitude_type=0; 
        this.showPicker=false;  
    },
    onValuesChange(picker, values) {
      var that=this;
        if(values[0]=='营养师编号'){
          that.aptitude_type=1;
        }else if(values[0]=='许可证编号'){
          that.aptitude_type=2;
        }else if(values[0]=" 统一社会信用代码"){
          that.aptitude_type=3;  
        }else if(values[0]=" 营业执照注册号"){
          that.aptitude_type=4;  
        }
    },
    sendCode(){  //发送获取验证码
      console.log("可以点击么");
      if(this.phone==''){
          Toast({
            message: '请填写手机号',
            position: 'center',
            duration: 2000
          });
      }else{
         if(!(/^1[34578]\d{9}$/.test(this.phone))){ 
              Toast({
                    message: '请输入正确手机号',
                    position: 'center',
                    duration: 2000
                });
          }else{
              this.isCode=true;
              var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
            var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=connect&op=get_sms_captcha',
                    data:{
                       phone:that.phone,
                       type:1, //用于注册
                    },
                   transformRequest: [function (data) {
                      let ret = ''
                      for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                      }
                      return ret
                    }],
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
              }
            }).then(function(response){ 
              console.log(response);
              if(response.data.code==200){
                  clearInterval(timer);
                  that.sms_time=response.data.datas.sms_time;

                  that.showTitle=that.sms_time+'秒后可重发'
                  var timer=setInterval(function(){
                      if(that.sms_time>0){
                         that.sms_time--;
                         that.showTitle=that.sms_time+'秒后可重发'
                      }else{
                          that.isCode=false; 
                          that.showTitle="重新获取验证码";
                          clearInterval(timer);
                      }
                  },1000);
                  
              }else{
                that.isCode=false;  
                Toast(response.data.datas.error)
              }

            },(err)=>{
                Toast('网络超时，请稍后重试');
            });
          }
      }
    },
   
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
}
a {
  color: #42b983;
  text-decoration:none;
}
.registHome{
    background-color: #f2f2f2;
    height: 100vh;
}
.typeContainer{
    
}
/*
*用户注册
*/
.btnTypes{
    background-color: #f2f2f2;
    height: 100vh;
    font-size: 1.4rem;
}
.inputSubmit{
     background-color: #fff;
    height: auto;
    margin-bottom: 30px;
}
.inputSubmit li{
      height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #eee;
    width: 100%;
    text-align: left;
    font-family: PingFangSC-Light;
    font-size: 1.5rem;
    position: relative;
}
.leftName{
      color: #333;
      margin-left: 10px;
}
.areaName{
  margin-left: 25px;
  font-size: 12px;
  color: #666;
}
.areaPicker{
    width: 26px;
    height: 26px;
    float: right;
    margin-top: 15px;
    margin-right: 5px;
    color: #666;  

}
.textInput{
    position: absolute;
    left: 105px;
    width: 65%;
    height: 44px;
    line-height: 44px;
    border: 0px none;
}
.codeInput{
    width:30%;
    height: 44px;
    line-height: 44px;
    border: 0 none;
    padding-left:35px;
}
.getCode{
    display:inline-block;
    color: #00BCD4;
}
.activeGetcode{
   display: block;
    float: right;
    margin-right: 20px;
    color: #999;
    pointer-events: none;
    cursor: default;
    opacity: 0.6;
}
.agree{
    text-align: left;
    margin-left: 10px;
}
.checkAgree,.levelType{
    width: 20px;
    height: 20px;
    text-align: left;
    border: 1px solid #fff;
    background-color: #fff;
    margin-right: 5px;
    vertical-align: middle;
}

.btnRegist,.noAgree{
   color: #fff;
    background-color: #00BCD4;
    height: 36px;
    line-height: 36px;
    width: 90%;
    margin-top: 25px;
    outline: none;
    border: 0 none;
    font-size: 1.5rem;
    letter-spacing: 2px;
}
.btnRegist{
     opacity: 1;
}
.noAgree{
    pointer-events: none;
    cursor: default;
    opacity: 0.6;
}
.disable{
  background:url('../../assets/isCheked.png') no-repeat center center;/*背景图的写法是生效的*/
    
}
/*
*医生注册
*/

.showTxt{
    text-align: left;
    padding-left: 10px;
    line-height: 48px;
    height: 48px;
    font-size: 1.5rem;
    background-color: #f2f2f2;

}
#Pickervalue{
   width: 100%;
    position: fixed;
    background-color:#eee !important;
    bottom: 0px;
    z-index: 1000;
}
#slotPicker{
    z-index:1000; 
}

.btnOk{
    position: absolute;
    right: 30px;
    font-size: 16px;
    z-index:1200;
}
.btnCancel{
    position: absolute;
    left: 30px;
    font-size: 16px;
    color:#f44336;
    z-index:1200;
}
.iconleft{
  
}
.rightPicker{
  margin-left:20px;
  color:#666;
}
/*
*地址选择
*/
.myAddress{
 width: 100%;
 background-color: white;
 border-top: 4px solid rgba(245,245,245,1);
 color:#333;
}
.myAddress .cont{
 border-bottom: 1px solid rgba(245,245,245,0.8);
}
.myAddress .cont span{
 display: inline-block;
 font-size: 0.28rem;
 color: #333;
 line-height: 0.88rem;
 margin-left: 0.32rem;
}
.myAddress .cont section{
 float:left;
}
.myAddress .cont p{
 display: inline-block;
 font-size: 0.28rem;
 color: #333333;
 line-height: 0.88rem;
 margin-left: 1rem;
}
.myAddress .cont .pic2{
 float: right;
 width: 0.14rem;
 height: 0.24rem;
 margin: 0.32rem 0.32rem 0.32rem 0;
}
.myAddress .cont p.text{
 margin-left: 0.72rem;
}
.showChose{
     width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 120;
    background: rgba(77,82,113,0.8);
}
.address{
     position: absolute;
    bottom: 0;
    left: 0;
    z-index: 121;
    background: #fff;
    width: 100%;
    height: 300px;
}
.title{
        font-size: 16px;
    position: relative;
    height: 28px;
    line-height: 28px;
}
.title h4{
     display: inline-block;
    margin-left: 3.2rem;
    font-size: 1.4rem;
    line-height: 28px;
    font-weight: normal;
    color: #999;
}
.title span{
     font-size: 28px;
    float: right;
    color: #ddd;
    margin-right: 10px;
}
.area{
     display: inline-block;
    font-size: 1.4rem;
    line-height: 28px;
    margin-left: 0.42rem;
    color: #000;
}
.addList{
 width:100%;
 padding-left:0.32rem;
 font-size:0.34rem;
 line-height:0.88rem;
 color:#333;
}
/* 修改的格式 */
.address ul{
 font-size: 1.4px;
    width: 100%;
    height: 100%;
    max-height: 17rem;
    overflow: auto;
    text-align: left;
    margin-top: 20px;
}
.address ul li{
     height: 24px;
    margin-left: 7%;
    font-size:1.4rem;
}
.address .title .active{
 color: #ff7800;
    border-bottom: 2px solid #ff7800;
}
.address ul .active{
 color:#0071B8;
}
.rightInput{
    display: inline-block;
    margin-left: 20px;
}

</style>
