<template>
  <div class="apportantDetail">
   
          <div v-if="!noFetch"  >
    
        <div class="apportantDetailContainer">
           <ul class="apportantInfo">
               <h3 class="orderTitle">预约订单信息</h3>
               <li class="items"><span class="leftName">订单编号: </span><span class="rightName">{{order_sn}}</span></li>
               <li class="items"><span class="leftName">就诊日期: </span><span class="rightName">{{appointment_date}}</span></li>
               <li class="items"><span class="leftName">挂号费用: </span><span class="rightName" style="color:#ff8900;">{{freePrice==null?'0':freePrice}}元</span></li>
               <li class="items"><span class="leftName">平台赠送积分: </span><input type="text" class="txtPoints"  v-model="member_admin_points"/>
               <span class="userName">不使用<input type="checkbox" name="isUser" value="0"  v-bind:class="['radioType',isUserSeleted==false?'userSeleted':'isType']" readonly/></span>
               <span class="userName">使用<input type="checkbox" name="isUser" value="1"  v-bind:class="['radioType',isUserSeleted==false?'userSeleted':'isType']" readonly/></span>
              
               </li>
  

           </ul>  

             <h3 class="orderTitle">选择支付方式</h3>
            <ul class="apportantType">
               <li class="lists"><span class="leftName"><img src="../../assets/wxpay.png" class="iconType"/></span>
               <div class="centerName">
                  <p class="titleType">微信支付</p> 
                  <p class="titleContent">推荐有微信客户端的用户使用</p>
               </div>  
                <input type="checkbox" name="Casetype" value="1" v-model="Casetype" v-bind:class="['inputType',isSeleted==false?'rightSeleted':'selectedType']" readonly/>

               </li>
                <li class="lists"><span class="leftName"><img src="../../assets/apay.png" class="iconType"/></span>
               <div class="centerName">
                  <p class="titleType">支付宝支付</p> 
                  <p class="titleContent">推荐有支付宝客户端的用户使用</p>
               </div>  
                <input type="checkbox" name="Casetype" value="0" v-model="Casetype"  v-bind:class="['inputType',isSeleted==false?'rightSeleted':'selectedType']" readonly/>

               </li>
           </ul>
 
        </div>  
         <ul class="footer">
        <li @click="CancelAppointment" class="CancelAppointment">取消预约</li>
        <li @click="goPlay" class="play">立即支付</li>
        </ul>  
     
 </div>
          <!--没网络状态-->
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
import { Toast ,MessageBox,Loadmore,Indicator} from 'mint-ui';
export default {
  name: 'apportantDetail',
  data () {
    return {
      noFetch:false,
      order_sn:this.$route.query.orderSn,//订单号
      appointment_date:this.$route.query.appointment_date, //就诊日期 
      freePrice:this.$route.query.orderAmount,
      member_admin_points:this.$route.query.member_admin_points,
      isSeleted:false, //未选中 
      isUserSeleted:false,
      Casetype:"",
      payType:"",
      isUser:"",

    }
  },
  computed: {
   
   isloading(){
      return this.$store.state.isloading;
    },
   
  },
  mounted(){
    if(navigator.onLine){   //有网络状态
      if(this.freePrice==null){
          this.freePrice=0;
      }
      this.$store.commit("increatement");
    }else{   //无网络状态
       this.noFetch=true;
       this.showMore=true;
       Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
    }
   var that=this;
     $(".inputType").on('click',function(e) {
      that.Casetype=$(e.target).attr("value");
      
       $(e.target).attr("checked",'checked');
      $(e.target).addClass("selectedType");
      $(e.target).removeClass("rightSeleted");
     for(var i=0;i< $(e.target.parentElement).siblings().length;i++){
         var targets= $(e.target.parentElement).siblings()[i];
         $(targets.lastElementChild).addClass("rightSeleted");
         $(targets.lastElementChild).removeClass("selectedType");
          $(targets.lastElementChild).removeAttr("checked");
        }
       that.payType=that.Casetype; 
      
   })
    $(".radioType").on('click',function(e) {
      that.isUser=$(e.target).attr("value");
      console.log(that.isUser+"拿到的积分");
       $(e.target).attr("checked",'checked');
      $(e.target).addClass("isType");
      $(e.target).removeClass("userSeleted");
     for(var i=0;i< $(e.target.parentElement).siblings().length;i++){
         var targets= $(e.target.parentElement).siblings()[i];
         $(targets.lastElementChild).addClass("userSeleted");
         $(targets.lastElementChild).removeClass("isType");
          $(targets.lastElementChild).removeAttr("checked");
        }
       that.payType=that.Casetype; 
       console.log(that.isUser+"变化后拿到的积分");
      
   })
  },
  methods:{
    
    CancelAppointment(){
      var that=this;  
      var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' + window.location.host;
       MessageBox.confirm('<span style="color:#00BCD4 !important;font-size:1.6rem">确定取消预约？</span>','').then(action => {
          if (action == 'confirm') {           
                this.$router.go(-2);  
           }else if(action=='cancel'){
            console.log("取消了");
          }  
      });
    },
    goPlay(){  //立即支付的方法
      
       var that=this;
        if(that.payType==""){
            Toast("请选择支付方式");
        }else{
           if(that.isUser==""){
               Toast("请选择是否使用积分");
           }else{
              
            if(that.isUser==1){
              if(that.member_admin_points>that.$route.query.member_admin_points||that.member_admin_points<0){
                  Toast("积分不足!");
              }else if(that.member_admin_points>that.freePrice){
                 Toast("支付积分不能大于挂号费"); 
              }else{
                    MessageBox.confirm('<span style="color:#00BCD4 !important;font-size:1.2rem">确认使用积分抵扣，一经确认不可修改！</span>','').then(action => {
                 if (action == 'confirm') {  
                     var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;         
                    axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_index&op=changeMemberPoints ',
                    data:{
                       key:that.$route.query.key,
                       vr_pay_order_no:that.order_sn,
                       member_points:that.member_admin_points,
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
                app.toPay(that.order_sn,that.freePrice,that.payType);  
            },(err)=>{
                Toast('网络超时，请稍后重试');
            });  
              }else if(action=='cancel'){
                        console.log("取消了");
                    }  
                }); 
              }    
            }else if(that.isUser==0){
                 app.toPay(that.order_sn,that.freePrice,that.payType);
            }
           }
           
        }
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
.doctorContainer{
    
    height: 100vh;
    background-color: #f4f4f4
}
.apportantDetailContainer{
     
    background-color: #f4f4f4;
}
.apportantInfo{
     margin-bottom: 8px;
    background-color: #fff;
}
.orderTitle{
    border-bottom: 1px solid #ddd;
    text-align: left;
    padding-left: 10px;
    height: 48px;
    line-height: 48px;
    font-family: PingFang-SC-Bold;
    font-size: 15px;
    color: #333333;
}
.items{
     height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #ddd;
    width: 100%;
    text-align: left;
    padding-left: 10px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #666666;
}
.items:last-of-type{
    border-bottom: 0 none;
}
.leftName{
    margin-right:10px;
}
.rightName{

}
.iconType{
    width: 36px;
    height: 36px;
    overflow: hidden
}

/*
*支付方式
*/
.apportantType{
     background-color: #fff;
    height: 100%;
}
.lists{
        height: 80px;
    line-height: 80px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    width: 100%;
    padding-left: 10px;
    position: relative;
}
.lists .leftName{
      float: left;
    margin-right: 10px;
}
.centerName{
   line-height: 22px;
    height: 80px;
    padding-top: 20px;
    float: left;
}
.titleType{
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #333333;
}
.titleContent{
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #999999;
}
.rightSeleted{
     width: 32px;
    height: 32px;
    position: absolute;
    right: 15px;
    top: 30px;
    background:url('../../assets/noSelected.png') no-repeat center center;/*背景图的写法是生效的*/
    border:none !important;
}
.selectedType{
    width: 32px;
    height: 32px;
    position: absolute;
    right: 15px;
    top: 30px;
    background:url('../../assets/isSelected.png') no-repeat center center;/*背景图的写法是生效的*/
    border:none !important;
}
.txtPoints{
   width:50px;
   border:0 none;
   border-bottom: 1px solid #ddd;
}

/*
*脚步
*/
.footer{
    display: -webkit-box;  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;     /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;  /* 混合版本语法: IE 10 */
    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
    display: flex;         /* 新版本语法: Opera 12.1, Firefox 22+ */;
  flex:1;
  height:48px;
  border-top:1px solid #d9d9d9;
  background-color: #f4f4f4;
  justify-content:center;
  align-items:center;
  bottom:0px;
  position:fixed;
  width:100%;
  z-index: 998;
  background-color: #fff;
  font-size: 1.4rem;
}
.footer li{
  display: inline-block;
  flex: 0.5;
  line-height: 48px;
  border-right: 1px solid #d9d9d9;
}
.footer li:last-of-type{
  border-right: 0 none;
}
.CancelAppointment{
  background-color: #eee;
  color:#666;
}
.play{
    background-color: #00BCD4;
    color:#fff;
}

/*网络状态*/
.noFetch{
   height: 100vh;
    color: #999999;
    font-size: 14px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}
.noFetch img{
    width: 94px;
    height: 94px;
}
.noFetch p{
    line-height: 36px;
}
.btnFetch{
    width: 82px;
    height: 36px;
    background-color: #00BCD4;
    color: #ffffff;
    font-size: 16px;
    letter-spacing: 4px;
    border-radius: 5px;
}
.userName{
    position: relative;
    vertical-align: middle;
    width:5rem;
}
.userSeleted{
     width: 32px;
    height: 32px;
    vertical-align: middle;
    background:url('../../assets/noSelected.png') no-repeat center center;/*背景图的写法是生效的*/
    border:none !important;
}
.isType{
      width: 32px;
    height: 32px;
    vertical-align: middle;
    background:url('../../assets/isSelected.png') no-repeat center center;/*背景图的写法是生效的*/
    border:none !important; 
}

</style>


