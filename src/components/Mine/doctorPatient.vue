<template>
  <div class="doctorPatient">
     
        <!--有网络状态-->
        <div v-if="!noFetch"  v-show="!isloading">
           <div class="doctorPatientContainer">
           <div class="searchInput">
            
              
              <select id="selectInput" name="selectInput" @change="changeSelected" >
                  <option :value="0" selected>患者名称</option>  
                  <option :value="1" >订单号</option>      
              </select>
              <input type="text" autocomplete="off" v-model="q_value" placeholder="请输入关键字..." class="valueInput"/>
               <button @click="btnsearch()" class="btnSearch">搜索</button>
           </div>
             <div   class="nav"  id="ulTab" >
            <li id="0" class="liTab"   @click="changeNav(1)">待就诊<img src="../../assets/low.png" class="lows" v-if="!seletedFlag"/></li>
             <li id="1" class="liTab" @click="changeNav(2)"  >已就诊<img src="../../assets/low.png" class="lows" v-if="seletedFlag"/></li>

          </div>

          <!-- tab-container待问诊 -->
            <!-- tab-container -->
          <div class=""  v-show="!seletedFlag">
         
             <ul class="listCenter"  v-infinite-scroll="loadMore" 
               infinite-scroll-disabled="loading"
              infinite-scroll-immediate-check="false" v-if="!noData">
              
                <li class="listItem" v-for="(item,i) of pendingList" :key="i" >
                   <div class="topItem">
                       <span class="avatars"><img :src="item.member_avatar" :onerror="dafaultImg" class=""/></span>
                        <div class="rightInfo">
                        <p class="topName">患者：{{item.buyer_name}},{{item.age}}岁,{{item.sex}}</p> 
                        <p class="time">时间：{{item.add_time}}</p>
                        <p class="desc">病情描述：{{item.buyer_msg.length>30?item.buyer_msg.slice(0,30)+"...":item.buyer_msg}}</p>
                        <p class="appointmentDate">预约就诊时间：{{item.appointment_date}}</p>
                        <p class="appointType">预约就诊方式：{{item.type_desc}}</p>
                        </div>  
                   </div>
                   <div class="bottomItem">
                     <span class="leftAppoint">预约编号：{{item.order_sn}}</span> 
                     <button @click="toTreatment(item.order_id,item.order_state)" :class="item.order_state==20?'btnTreatment':'btnWait'">{{item.order_state==20?'立即接诊':'待完成'}}</button> 
                   </div>
                </li>
                 <!--底部判断是加载图标还是提示“全部加载”-->
                 <div class="noMore"  v-if="isMore">
                <div class="textloading" v-if="!showMore"><img src="../../assets/load.gif"/></div>
                 <div class="textloading" v-else>没有更多了</div>
               </div>
              
              </ul>
                
             
          <!--暂无数据-->
          <div class="noNull" v-if="noData" >
			      <p ><img src="../../assets/noMessage.png" class="noMessage"/></p>
			      <p>暂无数据</p>   
			   </div> 
           </div> 

         <div class="" id=""  v-show="seletedFlag">    		  
       <ul class="listCenter" v-infinite-scroll="TwoloadMore" 
               infinite-scroll-disabled="Twoloading"
              infinite-scroll-immediate-check="false" v-if="!noTwoData">
              
                <li class="listItem" v-for="(item,i) of AlreadyList" :key="i" >
                    <div class="topItem">
                       <span class="avatars"><img :src="item.member_avatar" :onerror="dafaultImg" class=""/></span>
                        <div class="rightInfo">
                        <p class="topName">患者：{{item.buyer_name}},{{item.age}}岁,{{item.sex}}</p> 
                        <p class="time">时间：{{item.add_time}}</p>
                        <p class="desc">病情描述：{{item.buyer_msg.length>30?item.buyer_msg.slice(0,30)+"...":item.buyer_msg}}</p>
                        <p class="appointmentDate">预约就诊时间：{{item.appointment_date}}</p>
                        <p class="appointType">预约就诊方式：{{item.type_desc}}</p>
                        </div>  
                   </div>
                   <div class="bottomItem">
                     <span class="leftAppoint">预约编号：{{item.order_sn}}</span>  
                     <button @click="toPrescription(item.order_id)" class="btnPrescription">健康建议</button> 
                   </div>
                </li>
                 <!--底部判断是加载图标还是提示“全部加载”-->
                 <div class="TwoNomore" v-if="isTwoMore">
                   <div class="textloading" v-if="!TwoshowMore"><img src="../../assets/load.gif"/></div>
                   <div class="textloading" v-else>没有更多了</div>
                 </div>
              </ul>
                  <!--暂无数据-->
              <div class="noNull " v-if="noTwoData" >
                <p ><img src="../../assets/noMessage.png" class="noMessage"/></p>
                <p>暂无数据</p>   
            </div> 
            </div>

            


        </div> 
        </div>
        <div class="noFetch" v-else @click="loadFetch()" > 
        <img src="../../assets/noFetch.png" />
        <p>网络不给力，点击刷新</p>    

        </div>  
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求


import { Toast,Loadmore,MessageBox ,Indicator} from 'mint-ui';
export default {
  name: 'doctorPatient',
  data () {
    return {
      myVal:"",
      options:[
        {
           name:'患者姓名',
           value:0,
        },{
          name:'订单号',
          value:1
        }
      ],
      q_value:"", //搜索值
      q_type:"buyer_name", //默认-搜索类型名称
      selected:"1",
      noData:false, //数据为空 
      noFetch:false,
      pendingList: [], 
       seletedFlag:false,
       AlreadyList:[],
        TwoqueryLoading: false,
        TwomoreLoading: false,
        TwoallLoaded: false,
        TwoNoData:false,
         dafaultImg:'this.src="' + require('../../assets/noNull.png') + '"' ,
      noMore:false,
      showMore:false,
      TwoshowMore:false,
      TwonoMore:false,
      noData:false,
      noTwoData:false,
       isMore:false,
      isTwoMore:false,
      haveTwoMore:false,
      haveMore:false, //是否还有更多内容
      isCount:0,
      TwoCount:0,
        pageNum:0,
      TwopageNum:0,
      selected:"1",
    }
  },
   computed:{
   
   isloading(){
      return this.$store.state.isloading;
    },
    
  },
  created(){
  },
  mounted(){
    if(navigator.onLine){   //有网络状态
      this.$store.commit('increatement');  
      this.fetchPending();
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
    }  
  },
  methods:{
    changeNav(type){
      if(type==1){
        this.seletedFlag=false;
        this. selected=1;
        this.pageNum=0;
         this.fetchPending();
      }else if(type==2){
        this. selected=2;
        this.seletedFlag=true;
        this.TwopageNum=0;
         this.fetchAlready();
      }
    },
    fetchPending(){ //待就诊
       var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_index&op=my_patient',
                    data:{
                       key:that.$route.query.key,
                       type:1,
                       curpage:++that.pageNum
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
              that.$store.commit("decrement");
               if(response!=undefined){
                   if(response.data.code==200){
                var results=response.data.datas;
               if(that.isCount==0){
                 if(results.length!=0 && results.length<10){
                 that.pendingList=results;
                 that.isMore=false;
                 that.haveMore = false;   
                }else if(results.length==0){
                  that.haveMore = false;
                  that.isMore=false;
                  that.noData=true;
                }else{
                   that.pendingList=that.pendingList.concat(results);
                   that.haveMore=true; //可以加载更多
                   that.isMore=true;
                   that.showMore=false;
                } 
               }else{ //加载第N页面
                   if(results.length==0){
                  that.haveMore = false;
                  that.isMore=true;
                  that.showMore=true;
                  that.pageNum--
                }else{
                   that.pendingList=that.pendingList.concat(results);
                   that.haveMore=true; //可以加载更多
                   that.isMore=true;
                   that.showMore=false;
                } 
               }
                  
              }else if(response.data.code==400){
                  that.noData=true;
                 
              }else{
                 Toast(response.data.datas.error);
              }
               }else{
                 that.noFetch=true;
               }

            },(err)=>{
                Toast('网络超时，请稍后重试');
            });   

    },
    fetchAlready(){  //已就诊
        var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_index&op=my_patient',
                    data:{
                       key:that.$route.query.key,
                       type:2,
                       curpage:++that.TwopageNum
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
              that.$store.commit("decrement");
              if(response!=undefined){
                   if(response.data.code==200){
                var results=response.data.datas;
               if(that.TwoCount==0){
                 if(results.length!=0 && results.length<10){
                 that.AlreadyList=results;
                 that.isTwoMore=false;
                 that.haveTwoMore = false;   
                }else if(results.length==0){
                  that.haveTwoMore = false;
                  that.isTwoMore=true;
                  that.noTwoData=true;
                }else{
                   that.AlreadyList=that.AlreadyList.concat(results);
                   that.haveTwoMore=true; //可以加载更多
                   that.isTwoMore=true;
                   that.TwoshowMore=false;
                } 
               }else{ //加载第N页面
                   if(results.length==0){
                  that.haveTwoMore = false;
                  that.isTwoMore=true;
                  that.TwoshowMore=true;
                  that.TwoPageNum--
                }else{
                   that.AlreadyList=that.AlreadyList.concat(results);
                   that.haveTwoMore=true; //可以加载更多
                   that.isTwoMore=true;
                   that.showMore=false;
                } 
               }
                  
              }else if(response.data.code==400){
                  that.noTwoData=true;
                 
              }else{
                 Toast(response.data.datas.error);
              }
               }else{
                 that.noFetch=true;
               }

            },(err)=>{
                Toast('网络超时，请稍后重试');
            });   

    },
    toTreatment(OrderId,OrderStatus){  //接诊
       console.log(OrderId+"...当前订单号",OrderStatus);  
       if(OrderStatus==20){  //确认接诊
         MessageBox.confirm('<span style="color:#00BCD4 !important;font-size:1.6rem">是否立即接诊？</span>','').then(action => {
          if (action == 'confirm') {
            var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
            var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_vr_order&op=attendance',
                    data:{
                       key:that.$route.query.key,
                       order_id:OrderId,
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
              if(response.data.code==200){
                Toast("您已接诊成功!");
                that.fetchPending();
                that.selected=2;
              }else{
                Toast(response.data.datas.error)
              }

            },(err)=>{
                Toast('网络超时，请稍后重试');
            });   

             
          }else if(action=='cancel'){
            console.log("取消了");
          }  
      });
       }else if(OrderStatus==30){ //确认完成就诊
           MessageBox.confirm('<span style="color:#00BCD4 !important;font-size:1.6rem">确定完成就诊？</span>','').then(action => {
          if (action == 'confirm') {
            var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
            var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_vr_order&op=diagnosis',
                    data:{
                       key:that.$route.query.key,
                       order_id:OrderId,
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
              if(response.data.code==200){
                location.reload();
                that.selected=2;
              }else{
                Toast(response.data.datas.error)
              }

            },(err)=>{
                Toast('网络超时，请稍后重试');
            });   

             
          }else if(action=='cancel'){
            console.log("取消了");
          }  
      });
       }
    },
    toPrescription(OrderId){  //开处方药  
        var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' +  window.location.host+"/wap/dist/";
        window.location.href=domain+"#/doctorPrescription/"+OrderId+"?key="+this.$route.query.key;

    },
    btnTretment(orderId){
     console.log(orderId);
    },
    changeSelected(ele){  //获取选中的条件
         this.myVal=ele.target.value;
         if(this.myVal==''){
           return;
         }else if(this.myVal==0){
           this.q_type="buyer_name"
         }else if(this.myVal==1){
           this.q_type="order_sn"
         }
         console.log("当前选择的类型是:"+this.q_type);
    },
    btnsearch(){  //搜索
      if(this.q_value==''){
        return;
      }else{
         if(this.selected=='1'){ //待就诊列表搜索
         this.isCount=0;
        var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
        that.pendingList=[];
        that.isMore=false;
         Indicator.open()
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_index&op=my_patient',
                    data:{
                       key:that.$route.query.key,
                       type:1,
                       q_type:that.q_type,
                       q_value:that.q_value,
                       curpage:that.pageNum
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
              
              Indicator.close();
              if(response.data.code==200){
                 if(results.length!=0){
                   that.noData=false;
                 that.pendingList=response.data.datas;
                 that.isMore=true;
                that.showMore=true; //没有更多
                 that.haveMore = false;   
                }else{
                  that.haveMore = false;
                  that.isMore=false;
                  that.noData=true;
                }
              }else{
                that.noData=true;
              }

            },(err)=>{
                Toast('网络超时，请稍后重试');
            });   


      }else if(this.selected=='2'){  //已完成就诊
         var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
        that.AlreadyList=[];
        that.TwoCount=0;
         Indicator.open()
         that.isTwoMore=false;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_index&op=my_patient',
                    data:{
                       key:that.$route.query.key,
                       type:2,
                       q_type:that.q_type,
                       q_value:that.q_value,
                       curpage:that.pageNum
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
              that.$store.commit("decrement");
              Indicator.close();
              var results=response.data.datas;
              if(response.data.code==200){
                if(results.length>0){
                  that.noTwoData=false;
                  that.AlreadyList=response.data.datas;
                  that.TwoshowMore=true; //没有更多
                }
                else{
                  that.haveTwoMore = false;
                  that.isTwoMore=true;
                  that.noTwoData=true;
                }
              }else{
                that.noTwoData=true;
              }

            },(err)=>{
                Toast('网络超时，请稍后重试');
            });  
           
      }
      }
     
      

    },
    
    loadMore() {
      if(this.haveMore){
        this.loading = true;
        this.showMore=false;
        this.isCount=1;
        this.fetchadviserList();
        
     }   
    },
    TwoloadMore(){
        if(this.haveTwoMore){
           this.Twoloading = true;
            this.TwoshowMore=false;
            this.TwoCount=1;
            this.fetchAlready(); 

       }
    }, 
      loadFetch(){  //刷新
         this.noFetch=false;
         if(navigator.onLine){   //有网络状态
            location.reload();
         }else{   //无网络状态
            this.noFetch=true;
              Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
          }
      },
     goback(){
        app.back();
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
/*
*暂无数据
*/
.noNull{
    display: -webkit-box;  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;     /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;  /* 混合版本语法: IE 10 */
    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
    display: flex;         /* 新版本语法: Opera 12.1, Firefox 22+ */;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    width: 100%;
    background-color: #fff;
    height: 100vh;
}
.noMessage{
    width: 8rem;
    height: 8rem;
    margin-top: 100px;

}
.noNull p{
  font-size: 14px;
  color: #999999;
  line-height: 60px;
}




/*网络状态*/

/*网络状态*/
.noFetch{
    color: #999999;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.noFetch img{
    width: 94px;
    height: 94px;
    padding-top: 100px;
}
.noFetch p{
    line-height: 36px;
}
.btnFetch{
    width: 82px;
    height: 36px;
    color: #333;
    font-size: 16px;
    letter-spacing: 4px;
    border-radius: 5px;
}
/*
*滚动刷新
*/
.loading-background, .mint-loadmore-top span {
    -webkit-transition: .2s linear;
    transition: .2s linear
}
.mint-loadmore-top span {
    display: inline-block;
    vertical-align: middle
}

.mint-loadmore-top span.is-rotate {
}

.page-loadmore .mint-spinner {
    display: inline-block;
    vertical-align: middle
}

.page-loadmore-desc {
    text-align: center;
    color: #666;
    padding-bottom: 5px
}

.page-loadmore-desc:last-of-type,
.page-loadmore-listitem {
    border-bottom: 1px solid #eee
}

.page-loadmore-listitem {
    height: 50px;
    line-height: 50px;
    text-align: center
}

.page-loadmore-listitem:first-child {
    border-top: 1px solid #eee
}

.page-loadmore-wrapper {
    overflow: scroll;
    background-color: #ffffff;
}

.mint-loadmore-bottom span {
    display: inline-block;
    -webkit-transition: .2s linear;
    transition: .2s linear;
    vertical-align: middle
}

.mint-loadmore-bottom span.is-rotate {
}
.more_loading{
  margin-top: 30px;
}
.Twomore_loading{
  margin-top: 30px;
  text-align:center !important;
  width:100% !important;
}
.doctorPatient{
   height: 100vh;
   background-color: #f2f2f2;
}
/*
*我的患者-列表
*/
.doctorPatientContainer{
    position:relative;
}
/*
*搜索条件
*/
.searchInput{
    height: 36px;
    line-height: 36px;
    border: 2px solid #00bcd4;
    margin: 5px 5px;
    background-color: #fff;
    text-align: left;
    display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
    display: -moz-box; /* Firefox 17- */
    display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
    display: -moz-flex; /* Firefox 18+ */
    display: -ms-flexbox; /* IE 10 */
    display: flex;
    flex: 1;
}
#selectInput{
  border: 0px none;
    border-right: 1px solid #ddd;
    line-height: 36px;
    height: 36px;
    background-color: #fff;
    -webkit-appearance: none;
    flex: 0.2;
    
}
#selectInput option{
    height: 30px;
    line-height: 36px;
    padding-left: 5px;
    border: 0px none;
}
.valueInput{
       padding-left: 5px;
    border: 0px none;
    flex: 0.65;
}
.btnSearch{
    height: 36px;
    outline: none;
    border: 0px none;
    background-color: #00bcd4;
    color: #fff;
    flex: 0.2;
}
/*列表*/
.listCenter{
    width: 100%;
    background-color: #fff;
    text-align: left;
    margin-top: 3px;
}
.listItem{
    width: 100%;
    height: auto;
    border-bottom: 1px solid #ddd;
}
.topItem{
    border-bottom: 1px solid #ddd;
    height: auto;
}
.avatars{
    width: 6.4rem;
    height: 6.4rem;
    overflow: hidden;
    border-radius: 50%;
    margin: 10px;
    display: inline-block;
    vertical-align: top;
}
.avatars img{
    width:100%;
    height:100%;
}
.rightInfo{
    padding-top: 10px;
    font-size: 1.2rem;
    color: #666;
    line-height: 22px;
    text-align: left;
    display: inline-block;
    vertical-align: top;
}
.topName{

}
.time{

}
.desc{

}
.appointmentDate{
      color: #333;
    font-weight: 700;
}
.appointType{

}
.bottomItem{
    height: 48px;
    line-height: 48px;
    color: #333;
    font-family: monospace;
}
.leftAppoint{
    margin-left: 10px
}
.btnTreatment,.btnPrescription,.btnWait{
    float: right;
    margin: 10px;
    width:64px;
    line-height: 28px;
    height: 28px;
    border: 0px none;
    color: #fff;
}

.btnTreatment{
   background-color: #26a2ff;
}
.btnWait{
  background-color:#ffae00;
}
.btnPrescription{
  background-color:#f17519;
}

#ulTab{
        height: 48px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    width: 100%;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
}
.liTab{
   display: inline-block;
    width: 49%;
    text-align: center;
    line-height: 48px;
    font-size: 1.6rem;
}
.more_loading{
  margin-top: 30px;
  font-size:16px !important;
  text-align:center;
}
.Twomore_loading{
  margin-top: 30px;
  font-size:16px !important;
  text-align:center !important;
}
.textloading{
    width: 100%;
    text-align: center;
    margin-bottom: 50px;
    color: #333;
    height: 36px;
    font-size: 1.5rem;
}
.textloading img{
  width:2.4rem;
  height:2.4rem;
}
</style>
