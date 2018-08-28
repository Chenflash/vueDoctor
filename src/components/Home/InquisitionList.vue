<template>
  <div class="InquisitionList">
     
         
         <div v-if="!noFetch"  v-show="!isloading">
           
          <div class="InquisitionListContainer">
         
          <div   class="nav"  id="ulTab" >
            <li id="0" class="liTab"   @click="changeNav(0)">按距离<img src="../../assets/low.png" class="lows" v-if="!seletedFlag"/></li>
             <li id="1" class="liTab" @click="changeNav(1)"  >按资质 <img src="../../assets/low.png" class="lows" v-if="seletedFlag"/></li>

          </div>

          <!-- 按资质 -->
          <div   v-show="!seletedFlag" >
           <div v-if="!noData"> 
           <ul class="integralCenter "
              v-infinite-scroll="loadMore"
              infinite-scroll-disabled="loading"
              infinite-scroll-distance="0" >
                       
                <li v-for="(item,i) in doctorList" :key="i" class="listItem" @click="todoctorDetail(item.store_id)">
                <p class="listImg"><img :src="item.member_avatar" :onerror="logo"/></p>
                <div class="infos">
                  <p class="userName">姓名：{{item.member_truename}}</p>
                  <p class="works">专业技能：{{item.speciality}}</p>
                  <p>工龄：{{item.seniority}}年</p>
                  <p>距离：<span style="color:#f01">{{item.distance}}</span></p>
                  
                </div>
                <p  class="rightText" style="color: rgb(0, 188, 212);" @click="toMap(item.member_address)">导航到店</p>
               <div style="clear:both"></div>
              </li>
               
              </ul>
              <div class="noMore"  v-show="isMore">
                <div class="textloading" v-if="!showMore"><img src="../../assets/load.gif"/></div>
                 <div class="textloading" v-else>没有更多了</div>
               </div>
           </div>

               <!--暂无数据-->
                <div class="noNull" v-if="noData">
                  <p ><img src="../../assets/noMessage.png" class="noMessage"/></p>
                  <p>暂无数据</p>   
              </div> 
          </div>
          <!--按资质-->
           <div v-show="seletedFlag" > 
             <div v-if="!noTwoData">
              <ul class="integralCenter data-list"
              v-infinite-scroll="TwoloadMore"
              infinite-scroll-disabled="Twoloading"
              infinite-scroll-distance="0"  v-cloak> 
               <li v-for="(item,i) in TwoDoctorList" :key="i" class="listItem" @click="todoctorDetail(item.store_id)">
                <p class="listImg"><img :src="item.member_avatar" :onerror="logo"/></p>
             
                <div class="infos">
                  <p class="userName">姓名：{{item.member_truename}}</p>
                  <p class="works">专业技能：{{item.speciality}}</p>
                  <p>工龄：{{item.seniority}}年</p>
                  <p>距离：<span style="color:#f01">{{item.distance}}</span></p>
                  
              </div>
               <p  class="rightText" style="color: rgb(0, 188, 212);" @click="toMap(item.member_address)">导航到店</p>
               <div style="clear:both"></div>
              </li>
                
              </ul>
              <div class="TwoNomore" v-show="isTwoMore">
                   <div class="textloading" v-if="!TwoshowMore"><img src="../../assets/load.gif"/></div>
                   <div class="textloading" v-else>没有更多了</div>
                 </div>

             </div>
               
               <!--暂无数据-->
                <div class="noNull" v-if="noTwoData">
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

import { Toast,Loadmore,Indicator} from 'mint-ui';

export default {
  name: 'InquisitionList',
  props:{
    pageSize:Number,
    default:10
  },
  data () {
    return {
      selected:"1",
      seletedFlag:false,
      noFetch:false,
      isMore:false,
      isTwoMore:false,
      haveTwoMore:false,
      haveMore:false, //是否还有更多内容
      doctorList: [], //推荐的用户
      TwoDoctorList:[],
      
       //初始化无限加载相关参数    
      logo:'this.src="' + require('../../assets/defaultAvatar.png') + '"', 
      curNavIndex:0, //导航栏
      Arr:new Array(2),
      pageNum:0,
      TwoPageNum:0,
      noMore:false,
      showMore:false,
      TwoshowMore:false,
      TwonoMore:false,
      noData:false,
      noTwoData:false,
      isCount:0,
      TwoCount:0,



    }
  },
   computed:{
   
   isloading(){
      return this.$store.state.isloading;
    },
 
  },
 
  mounted(){
    if(navigator.onLine){   //有网络状态
      this.fetchDocotr();
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
    }  
  },
  methods:{
   changeNav(type){ //更改切换条件
      if(type==0){
        this.seletedFlag=false;
        this.curNavIndex=0;
        this.pageNum=0;
      }else if(type==1){
        this.seletedFlag=true;
        this.curNavIndex=1;
        this.TwoPageNum=0;
         Indicator.open({
        text: '',
          spinnerType: 'fading-circle'
        });  
         this.fetchDisctor();
      }
     
      
   },
   loadTop(){
    setTimeout(()=>{
       
       if(this.curNavIndex==0){
         this.pageNum=0;

         location.reload();
       }else{
        this.TwoPageNum=0;
        this.fetchDisctor();
         this.selected=2
       }
     this.$refs.loadmore.onTopLoaded(); 
    },1000);
   },

   fetchDocotr(){
     var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
     var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=index&op=doctor_list',
                    data:{
                        key:that.$route.query.key,
                        lng:that.$route.query.lng, //经度
                        lat:that.$route.query.lat, //维度
                        order_type:1, //距离排序
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
               that.$store.commit("decrement");
                Indicator.close();
               if(response!=undefined){
                   if(response.data.code==200){
                var results=response.data.datas;
               if(that.isCount==0){
                 if(results.length!=0 && results.length<10){
                 that.doctorList=results;
                 that.isMore=true;
                that.showMore=true; //没有更多
                 that.haveMore = false;   
                }else if(results.length==0){
                  that.haveMore = false;
                  that.isMore=false;
                  that.noData=true;
                }else{
                   that.doctorList=that.doctorList.concat(results);
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
                   that.doctorList=that.doctorList.concat(results);
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
                that.noData=true;
                Indicator.close();
            });   
   }, 
   toMap(address){ //导航到店
       console.log("导航到地图");
      var lat=this.$route.query.lat;
      var lng=this.$route.query.lng;
      console.log(lat,lng, address);
      app.toNavigation(lat,lng, address);
   },
   fetchDisctor(){
     var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
     var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=index&op=doctor_list',
                    data:{
                        key:that.$route.query.key,
                        lng:that.$route.query.lng, //经度
                        lat:that.$route.query.lat, //维度
                        order_type:2, //距离排序
                        curpage:++that.TwoPageNum
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
               that.$store.commit("decrement");
                Indicator.close();
               if(response!=undefined){
                   if(response.data.code==200){
                var results=response.data.datas;
               if(that.TwoCount==0){
                 if(results.length!=0 && results.length<10){
                 that.TwoDoctorList=results;
                 that.isTwoMore=true;
                that.TwoshowMore=true; //没有更多
                 that.haveTwoMore = false;   
                }else if(results.length==0){
                  that.haveTwoMore = false;
                  that.isMore=true;
                  that.noTwoData=true;
                }else{
                   that.TwoDoctorList=that.TwoDoctorList.concat(results);
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
                   that.TwoDoctorList=that.TwoDoctorList.concat(results);
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
                 that.$store.commit("decrement");
                  Indicator.close();
                that.noFetch=true;
            });   
   
   },
   loadMore(){
     if(this.haveMore){
        this.loading = true;
        this.showMore=false;
        this.isCount=1;
        this.fetchDocotr();
        
     }
      
      
   },
   TwoloadMore(){
     if(this.haveTwoMore){
        this.Twoloading = true;
        this.TwoshowMore=false;
        this.TwoCount=1;
        this.fetchDisctor();  
     }
   },
      todoctorDetail(storeId){
        var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' + window.location.host+"/wap/dist/";
        window.location.href=domain+"#/doctorDetail/"+storeId+"?key="+this.$route.query.key;
      },
      loadFetch(){  //刷新
         this.noFetch=false;
         if(navigator.onLine){   //有网络状态
          location.reload();
         }else{   //无网络状态
            this.noFetch=true;
              Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
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

a {
  color: #42b983;
}
.InquisitionList{
  height: auto;
}
.InquisitionListContainer{
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

.integralCenter{
    height:auto;
    text-align:left;
    margin-top:3px;
    background-color:#fff;

}
.listItem{
   background-color:#fff;
    text-align: left;
    height: auto;
    border-bottom: 1px solid #ddd;
    position:relative;
}
.listItem:last-of-type{
  border-bottom: 0 none;
}
.avatars{
    padding: 10px;
    float: left;
    width: 6.4rem;
    height: 6.4rem;
    border-radius: 50%;
}
.centerTitle{
     padding-top: 15px;
    line-height: 24px;
    font-size: 1.4rem;
    color: #333;
}
.names{
   
}
.phones{
  
}
.rightTime{
    float: right;
    margin-right: 5px;
    color:#999;
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
/*
*暂无数据
*/
.noNull{
    display: -webkit-box;  /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
    display: -moz-box;     /* 老版本语法: Firefox (buggy) */
    display: -ms-flexbox;  /* 混合版本语法: IE 10 */
    display: -webkit-flex; /* 新版本语法: Chrome 21+ */
    display: flex;         /* 新版本语法: Opera 12.1, Firefox 22+ */;
    justify-content:center;
    flex-direction: column;
    align-items:center;
    width:100%;
     height:100vh;
    background-color: #fff;
}
.noMessage{
    width: 8rem;
    height: 8rem;

}
.noNull p{
  font-size: 14px;
  color: #999999;
  line-height: 60px;
}



/*网络状态*/
.noFetch{
    padding: 100px auto;
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
    background-color: #00BCD4;
    color: #ffffff;
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
.moreLoading{
  text-align:center;
  width:100%;
  margin-top: 30px;
  font-size:1.4rem;
}

/*
*云问诊列表
*/
.works{
  overflow: hidden;
    display: block;
}

.listImg{
     width: 8rem;
    height: 8rem;
    border-radius: 50%;
    margin: 10px;
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;
}
.listImg img{
      width: 100%;
      height:100%;
}
.infos{
        padding-top: 10px;
    font-size: 1.4rem;
    color: #666;
    line-height: 22px;
    display: inline-block;
    vertical-align: middle;
    width: 60%;
}
 .rightText{
    position: absolute;
    font-size:14px;
    top: 12px;
    right: 10px;
 }
</style>

