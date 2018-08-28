<template>
  <div class="provideManUser">
     <!--服务商角色，管理的医生-->
     
         
         <div v-if="!noFetch"  v-show="!isloading">
            <div class="provideManUserContainer">
              <ul class="integralCenter"  
               v-infinite-scroll="loadMore" 
               infinite-scroll-disabled="loading"
              infinite-scroll-immediate-check="false"
               v-if="!noData">
                <li class="listItem" v-for="(item,i) of provideManUserList" :key="i" @click="toDetail(item.member_id)">
                     <img class="avatars" :src="item.member_avatar" :onerror="dafaultImg"/>
                    <div class="centerTitle">
                       <p class="names">{{item.member_name}}</p>  
                       <p class="phones">{{item.member_mobile.slice(0,5)+'***'+item.member_mobile.slice(8,11)}}</p>  
                       <p class="rightTime"> 注册时间：{{item.member_time}}</p>  
                    </div>
                    <div style="clear:both"></div>
                  
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
        </div>

        <div class="noFetch" v-else @click="loadFetch()" > 
        <img src="../../assets/noFetch.png" />
        <p>网络不给力，点击刷新</p>    

        </div>    

        </div>
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求

import { Toast,Loadmore,Indicator} from 'mint-ui';
export default {
  name: 'provideManUser',
  data () {
    return {
     selected:"1",
      noData:false, //数据为空 
      noFetch:false,
      provideManUserList: [], //推荐的用户
      isCount:0,
       pageNum:0,
      showMore:false,
       isMore:false,
      isTwoMore:false,
      haveTwoMore:false,
      haveMore:false, //是否还有更多内容
      pageNum: 0,
      dafaultImg:'this.src="' + require('../../assets/noNull.png') + '"' ,
    }
  },
   computed:{
   
   isloading(){
      return this.$store.state.isloading;
    },
  
    
  },
  mounted(){
    if(navigator.onLine){   //有网络状态
      this.fetchProvide();
       if(this.$store.state.isCount==0){     //第一次加载
        this.$store.commit('increatement');
       
       }else if(this.$store.state.isCount==1){  //已���加载过
         this.$store.commit('decrement');
         return ; 
       }
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
    }  
  },
  methods:{
    fetchProvide(){
       var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
          setTimeout(()=>{
              axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_index&op=my_own_member',
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
              that.$store.commit("decrement");
               if(response!=undefined){
                   if(response.data.code==200){
                var results=response.data.datas;
               if(that.isCount==0){
                 if(results.length!=0 && results.length<10){
                 that.provideManUserList=results;
                 that.isMore=false;
                 that.haveMore = false;   
                }else if(results.length==0){
                  that.haveMore = false;
                  that.isMore=false;
                  that.noData=true;
                }else{
                   that.provideManUserList=that.provideManUserList.concat(results);
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
                   that.provideManUserList=that.provideManUserList.concat(results);
                   that.haveMore=true; //可以加载更多
                   that.isMore=true;
                   that.showMore=false;
                } 
               }
                  
              }else if(response.data.code==400){
                  that.noData=true;
              }else{
                 Toast(response.data.datas.error);
                  that.noData=true;
              }
               }else{
                 that.noFetch=true;
               }
            },(err)=>{
                Toast('网络超时，请稍后重试');
            });  
          },1000); 
        },
       loadMore() {
          if(this.haveMore){
            this.loading = true;
            this.showMore=false;
            this.isCount=1;
            this.fetchProvide(); 
          }
           
      },
       toDetail(member_id){
         var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' +  window.location.host+"/wap/dist/";
         window.location.href=domain+"#/orderDetail/"+member_id+"?key="+this.$route.query.key;
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

}
a {
  color: #42b983;
}
.provideManUser{
   height: auto;
}
.provideManUserContainer{
}
.integralCenter{
    height:auto;
}
.listItem{
    text-align: left;
    height: auto;
    border-bottom: 1px solid #ddd;
    background-color:#fff;
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
    margin-right: 5px;
    color:#999;
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
    padding-top:100px;
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
.Twomore_loading{
  margin-top: 30px;
}
.more_loading{
  margin-top: 30px;
  font-size:16px !important;
  text-align:center;
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

