<template>
  <div class="integral">
         <!--有网络状态-->
       <div v-if="!noFetch" style="backgroundColor:#f4f4f4;;" v-show="!isloading">
          <div class="INtegralTitle">
                <span class="leftTitle">类型/时间</span>
                <span class="centeTile">明细/可用</span>
                <span class="rightTitle">详情</span>
               </div>          
        <div  id="" v-show="!noData"> 
     
          <ul class="integralCenter"
           v-infinite-scroll="loadMore"
           infinite-scroll-disabled="loading"
           infinite-scroll-distance="0"
           id="dataList" v-cloak>
              
                <li class="listItem" v-for="(item,i) of logList" :key="i" @click="toDetail(item.pl_id)">
                     <div class="leftName">
                       <p class="stagetexts">{{item.stagetext}}</p>
                       <p class="createTime">{{item.addtimetext}}</p>
                     </div>
                    <div class="centerName">
                      <p class="points">{{item.pl_points}}</p>
                     <p class="changeafter">{{item.pl_changeafter}}</p>
                    </div>
                    <div class="rightName"><p>订单号：{{item.pl_desc}}</p></div>
                </li>
                
              </ul>
              <div class="noMore" v-if="isMore">
                <div class="textloading" v-if="!showMore"><img src="../../assets/load.gif"/></div>
                 <div class="textloading" v-else>没有更多了</div>
               </div>
        </div>
          <!--暂无数据-->
           <div class="noNull" v-show="noData">
                  <p ><img src="../../assets/noMessage.png" class="noMessage"/></p>
                  <p>暂无数据</p>   
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
  name: 'integral',
  data () {
    return {
      noData:false, //数据为空 
      noFetch:false,
      logList:[], //积分明细
      pageNum:0,
       isCount:0,
       pageNum:0,
      noMore:false,
      showMore:false,
      allLoaded: false,
       isMore:false,
      haveMore:false, //是否还有更多内容 
    }
  },
  computed:{
   
   isloading(){
      return this.$store.state.isloading;
    },
 
    
  },

mounted(){
    if(navigator.onLine){   //有网络状态
      this.fetchIntegral();
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
    }  
  },
  methods:{
    
      fetchIntegral(){
         var that=this;
         var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
         axios({
          method: 'POST',
           url:domain+'/mobile/index.php?act=member_points&op=pointslog',              
          data:{
             key:that.$route.query.key,
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
           if(response!=undefined){
                   if(response.data.code==200){
                var results=response.data.datas.log_list;
               if(that.isCount==0){
                 if(results.length!=0 && results.length<10){
                 that.logList=results;
                 that.isMore=false;
                 that.haveMore = false;   
                }else if(results.length==0){
                  that.haveMore = false;
                  that.isMore=false;
                  that.noData=true;
                }else{
                   that.logList=that.logList.concat(results);
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
                   that.logList=that.logList.concat(results);
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
             that.noFetch=true;
          });
      },
      toDetail(plId){
         var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' +  window.location.host+"/wap/dist/";
         window.location.href=domain+"#/intergralDetail/"+plId+"?key="+this.$route.query.key;
      },
     
      loadMore(){  //加载更多
        if(this.haveMore){
           this.loading = true;
          this.showMore=false;
          this.isCount=1;
          this.fetchIntegral();
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
.integralContainer{
     background-color: #fff;
    height: 100%;
}

.leftType{

}
.centerType{

}
.righType{

}

/*明细列表*/
.INtegralTitle{
    height: 48px;
    background-color: #eee;
    text-align: left;
    font-size: 1.4rem;
    display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
    display: -moz-box; /* Firefox 17- */
    display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
    display: -moz-flex; /* Firefox 18+ */
    display: -ms-flexbox; /* IE 10 */
    display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
    align-items: center;
}
.integralCenter{
   height:auto;
   margin-bottom:50px;
   background-color: #fff;

}
.listItem{
     display: flex;
    text-align: left;
    border-bottom: 1px solid #ddd;
    height: auto;
    position: relative;
    font-size: 14px;
    align-items:center;
}
.leftTitle{
    flex:0.5;
}
.centeTile{
    flex:0.5;
}
.rightTitle{
   flex:1;
}
.leftName{
    width: 23%;
    display: inline-block;
    vertical-align: top;
    text-align: left;
    line-height: 22px;
}
.stagetexts{
  padding-top: 10px;
  padding-left: 5px;

}
.createTime{
   padding-left: 5px;
}
.points{
  font-size: 1.4rem;
    font-weight: bold;
    padding-top: 10px;
    padding-left: 10px;
}
.changeafter{
  padding-left: 10px;
}
.centerName{
    height: 6.5rem;
    width: 23%;
    text-align: left;
    display: inline-block;
    line-height: 25px;
    vertical-align: top;
}
.rightName{
      display: inline-block;
    width: 50%;
    text-align: left;
    vertical-align: top;
}
.rightName p{
    width: 95%;
    margin: 0 auto;
    display: block;
    overflow: hidden;
    padding-top: 10px;
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
    vertical-align: middle;
    font-size:1.6rem;
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
  margin-top: 70px;
}

/*
*加载中
*/
.textloading{
    width: 100%;
    text-align: center;
    color: #333;
    height: 36px;
    font-size: 1.5rem;
}
.textloading img{
  width:2.4rem;
  height:2.4rem;
}

</style>
