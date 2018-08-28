<template>
  <div class="InquisitonDetail">
      
   <!--时间选择器-->
   <div class="showDates" v-if="showDate">
  
 <mt-datetime-picker refs="picker" 
            type="datetime"
            v-model="appointment_date"
            :startDate="new Date()"
            month-format="{value}月"
            date-format="{value}日"
            confirm="handleConfirm"  @cancel="checkinCancel" 
            style="display:block" @confirm="handleConfirm">
        </mt-datetime-picker>
   </div>
        <!--有网络-->  
   <div v-if="!noFetch" v-show="!isloading">
     <form onsubmit="return false"> 
       <div class="inquistionInfo">
        <h3 class="infoTitle">请填写以下挂号信息!</h3>
        <div class="infoDetail">
          <p><span>预约医生 </span> <span class="infoName">{{memberTruename}}</span></p>
          <p><span>挂号费用</span> <span class="freePrice">{{freePrice==null?'0':freePrice}}元</span></p>
        </div>
        <h3 class="userTitle">就诊人信息</h3>
        <ul class="userInfo">
           <li><span class="leftName"></span>时间
           <span class="rightName" @click="openDate()"> <input type="datetime" placeholder="选择挂号的预约时间" style="width:80%" :value="appointmentDate"  name="appointment_date" id="start_time_picker" class="datetimepicker" readonly></span>
          <img src="../../assets/date.png" @click="openDate()" class="dates"/>
           </li> 
            <li><span class="leftName"></span>姓名
             <span class="rightName"><input type="text" placeholder="患者姓名" v-model="buyer_name" Minlength="2" Maxlength="20" /></span>
           </li> 
            <li><span class="leftName"></span>年龄
             <span class="rightName"><input type="number" placeholder="患者年龄" v-model="age" pattern="^(?:[1-9]?\d|100)$" /></span>
           </li> 
            <li><span class="leftName"></span>性别
              <span class="rightName">
              <input type="checkbox" name="sex"  value="1" style="height: 20px; width: 20px; margin-right:5px;   border: 1px solid #ddd;background-color:#fff"  class="sexs" />男
             <input type="checkbox" name="sex"  value="2" style="height: 20px; width: 20px; ; margin-right:5px;  border: 1px solid #ddd;background-color:#fff" class="sexs"/>女
              </span>
              </li> 
           <li><span class="leftName"></span>电话
             <span class="rightName"><input type="number"  placeholder="填写联系电话"  pattern="^[0-9]*[1-9][0-9]*$" v-model="buyer_phone" Minlength="10" Maxlength="11"/></span>
           </li> 
        </ul>  
        <div class="infoType">
          <h3 class="userTitle">选择问诊方式</h3>
           <ul class="types">
               
                <li><input type="checkbox"  name="type" val="2" style=" vertical-align: middle;height: 20px; width: 20px; margin-right:5px;   border: 1px solid #ddd;background-color:#fff"  class="typeSeleted"/>
                   图文问诊
                </li>
                 <li><input type="checkbox"  name="type" val="3" style=" vertical-align: middle;height: 20px; width: 20px; margin-right:5px;   border: 1px solid #ddd;background-color:#fff"  class="typeSeleted"/>
                   语音电话
                </li>
           </ul>  
           <div class="infoContent">
            <span class="leftName">病情描述</span>
             <textarea Maxlength="300" class="textares" placeholder="(发病时间、主要症状)" v-model="buyer_msg" rows="10" cols="42"/>
           
           </div>
       </div>   

     </div >  
     <div class="footerbtn" @click="toAppointment">
       确定预约
    </div>  
     </form>  
    </div>
      <!--没有网络的状态-->
      <div class="noFetch" v-else>
            <img src="../../assets/noFetch.png" />
            <p>网络无法连接</p>
            <p  @click="loadFetch()"  class="btnFetch">刷新</p>
      </div>


  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求
import { Toast,DatetimePicker,MessageBox } from 'mint-ui';

export default {
  name: 'InquisitonDetail',
  components:{
  },
  data () {
    return {
      showDate:false,   //时间组件
       //初始化无限加载相关参数
      queryLoading: false,
      moreLoading: false,
      allLoaded: false,
      totalNum: 0,
      pageSize: 10,
      pageNum: 1,
      allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
      scrollMode:"touch", //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
      totalpage:0,
      loading:false,
       bottomText: '',  //下拉刷新
       bottomStatus: '',
       wrapperHeight: 0,
       topStatus: '',
       //wrapperHeight: 0,
       translate: 0,
       moveTranslate: 0,
       noFetch:false,
       memberTruename:this.$route.query.memberTruename,
       freePrice:this.$route.query.registeredFee,
       appointment_date:"",
       buyer_name:'',
       age:'',
       sex:'',
       buyer_phone:'',
       type:'',
       buyer_msg:'',
       order_sn:"",
       appointmentDate:"",
      member_admin_points:"",

     
    }
  },
  computed:{
    isloading(){
      return this.$store.state.isloading;
    },
  },
  
  mounted(){
  
     if(navigator.onLine){   //有网络状态
       
    }else{   //无网络状态
       this.noFetch=true;
       this.showMore=true;
       Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
    }
  var checked=$(".sex").attr('checked');
   var that=this;
  that.type="";
  that.sex="";
  if(checked=="checked"){
    $(".sex").removeAttr("checked");
  }  else{
    $(".sex").attr("checked",'checked');
  }
   $(".sexs").on('click',function(e) {
     $(e.target).addClass("seletedCheck");
     $(e.target).attr("checked",'checked');
     $(e.target).siblings().removeClass("seletedCheck");
     $(e.target).siblings().removeAttr("checked");
     that.sex=$(e.target).attr("value");
     console.log(that.sex+"性别");
      
   })
   if(checked=="checked"){
    $(".typeSeleted").removeAttr("checked");
  }  else{
    $(".typeSeleted").attr("checked",'checked');
  }
 
   $(".typeSeleted").on('click',function(e){
       that.type=$(e.target).attr("val");
       console.log("类型："+that.type);
        $(e.target).addClass("seletedCheck");
        for(var i=0;i< $(e.target.parentElement).siblings().length;i++){
         var targets= $(e.target.parentNode).siblings()[i];
          $(targets.children).removeClass("seletedCheck");
        }
   });
 
  },

  methods:{
      formatDate(date) {  //转化时间格式
        const y = date.getFullYear()
        let m = date.getMonth() + 1
        m = m < 10 ? '0' + m : m
        let d = date.getDate()
        d = d < 10 ? ('0' + d) : d;
        let h=date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let mi=date.getMinutes();
        mi=mi<10?('0'+mi):mi;
        return y + '-' + m + '-' + d+" "+h+":"+mi+":00"
    },
    openDate(){  //打开时间组件
       this.appointmentDate="";
       this.showDate=true;
    
    },
    checkinCancel(){ //取消
      this.appointmentDate="";
      this.showDate=false;
    
    },
    handleConfirm(){  //确定选择格式后
      this.showDate=false;
      this.appointmentDate=this.formatDate(this.appointment_date);

       
    },
    toAppointment(){  //预约详情
     if(this.freePrice==null){
       this.freePrice=0;
     }
   console.log(this.freePrice);     
    var reg=/^1\d{10}$/;
       if(this.appointmentDate=="" || this.buyer_name=="" ||this.age=="" || this.sex=="" || this.buyer_phone=="" || this.type=="" ){
         Toast("请填写好完整的预约信息!"); 
       }else if(this.age<0 || this.age>200){
         Toast("请输入有效年龄");
       }else if(!reg.test(this.buyer_phone)){
         Toast("请输入正确的手机号码!");
       }else{
          MessageBox.confirm('', { 
          message: '<p style="color:#00BCD4 !important;font-size:15px"">恭喜您挂号成功！</p><p style="color: #333333;font-size:15px">您先需要支付<span style="color:#FF9800">'+this.freePrice+'元</span>挂号费!<p>', 
          title: '提示', 
          confirmButtonText: '马上支付', 
          cancelButtonText: '取消' 
          }).then(action => { 
          if (action == 'confirm') {     //确认的回调
             var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
             var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_vr_order&op=create',
                    data:{
                       key:that.$route.query.key,
                       store_id:that.$route.params.storeId,
                       appointment_date:that.appointmentDate,
                       buyer_name:that.buyer_name,
                       age:that.age,
                       sex:that.sex,
                       buyer_phone:that.buyer_phone,
                       type:that.type,
                       buyer_msg:that.buyer_msg,
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
               that.order_sn=response.data.datas.order_sn;
               if(response.data.datas.order_amount==null){
                 that.order_amount=0;
               }else{
                that.order_amount=response.data.datas.order_amount;
               }
               
               that.appointmentDate=response.data.datas.appointment_date;
               if(response.data.datas.member_admin_points==null){
                 that.member_admin_points=0;
               }else{
                  that.member_admin_points=response.data.datas.member_admin_points;
               }
                var domains = process.env.NODE_ENV == 'development' ? '' : 'http://' + window.location.host+"/wap/dist/";
                window.location.href=domains+"#/apportantDetail/"+that.$route.params.storeId+"?key="+that.$route.query.key+"&orderSn="+that.order_sn+"&orderAmount="+ that.order_amount+"&appointment_date="+that.appointmentDate+
                "&member_admin_points="+that.member_admin_points;
            
              }else{
                Toast(response.data.datas.error)
              }


            },(err)=>{
                Toast('网络超时，请稍后重试');
            });   
          }
          }).catch(err => { 
          if (err == 'cancel') {     //取消的回调
          console.log(2);
          } 
          });
       }
    },
     goback(){

     }
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
}
input[type="checkbox"]{
  border:1px solid #d9d9d9;
}

/*
*预约详情
*/
.inquistionInfo{
    background-color: #ffffff !important;
    height: 100vh;
    margin-bottom: 50px;
}
.infoTitle{
 background: rgba(255, 152, 0, 0.16);
    font-family: PingFangSC-Regular;
    font-size: 15px;
    height: 40px;
    line-height: 40px;
    color: #FF9800;
}
 .infoDetail{
       height: 48px;
    line-height: 48px;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    flex: 1;
    background-color: #fff;
     margin-bottom: 10px;
     border-bottom: 10px solid #f2f2f2;
 } 
 .infoDetail p{
     flex: 0.5;
    text-align: left;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    border-right: 1px solid #dddd;
    color:#333;
   
 }
  .infoDetail p:last-of-type{
    border-right: 0 none;
  }
 .infoDetail p span:first-child{
       padding-left: 10px;
 }
 .infoName{
   color: #FF9800;
    float: right;
    margin-right: 5px;
 }   
 .userTitle{
       height: 40px;
    line-height: 40px;
    text-align: left;
    padding-left: 10px;
    border-bottom: 1px solid #ddd;
    background-color: #fff;
    font-family: PingFang-SC-Bold;
    font-size: 15px;
    color: #333333;
 }
 .freePrice{
    color: #FF9800;
    float: right;
    margin-right: 5px;
 }
 /*
 *就诊人信息
 */
 .userInfo{
     background-color: #FFF;
 }
 .userInfo li{
    display: block;
    text-align: left;
    border-bottom: 1px solid #ddd;
    padding-left: 10px;
    line-height: 48px;
    position: relative;
    font-size:1.4rem;
 }
 .leftName{
   font-size: 15px;
    color: #333333;
 } 
 .rightName{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    margin-left: 25px;
    color: #999999;
 }
 .dates{
   width: 20px;
    height: 20px;
    opacity: 0.8;
    position: absolute;
    right: 10px;
    top:15px;
    vertical-align: middle;
 }
 .rightName input{
       height: 48px;
      line-height: 48px;
      border: 0 none;
      background-color: transparent;
 }

 /*
 *问诊方式
 */
 .infoType{
  
 }
 .userTitle{

 }
 .typeSeleted{
   margin-left:10px;
 }
 .types{
      height: 48px;
     line-height: 48px;
     border-bottom: 1px solid #ddd;
     background-color: #fff;
     display:block;
     text-align:left;
 }
 .types li{
   width:48%;
   border-right: 1px solid #ddd;
 }
  .types li:last-of-type{
    border-right: 0 none;
  }
 .infoContent{
       height: 160px;
    text-align: left;
    padding-left: 10px;
    padding-top: 10px;
    font-size: 15px;
    color: #333;
    background-color: #fff;
 }
 .textares{
    resize: none;
    border: 0 none;
    overflow: scroll;
    width:95%;
    margin:0 auto;
    padding-top: 5px;
    font-size: 1.4rem;
    display:block;
 }

.footerbtn{
     height: 48px;
    line-height: 48px;
    background: #00BCD4;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #FFFFFF;
    display: block;
    width: 100%;
    position: fixed;
    bottom: 0px;
    z-index: 999;
}
 /*input 选中后的样式 */
.seletedCheck{
   width:15px;
   height: 15px;
   background-size: contain;
    background:url('../../assets/isCheked.png') no-repeat center center;/*背景图的写法是生效的*/
     border:none !important;
 }
.sexs{
  vertical-align: middle;
}
.showDates{
   position: fixed;
    z-index: 1000;
    bottom: 0px;
}
</style>

