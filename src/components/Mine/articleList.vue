<template>
  <div class="articleList">
      
    
         <!--有网络状态-->
       <div v-if="!noFetch" style="" >
            
              <ul class="articleListCenter"
              v-infinite-scroll="loadMore"
              infinite-scroll-disabled="loading"
              infinite-scroll-distance="0"
                id="dataList" v-cloak v-show="!noData">
              
                <li class="listItem" v-for="(item,i) of articleLists" :key="i" @click="toarticleDetail(item.article_id)">
                   <div class="articlePic"><img :src="item.article_pic" :onerror="dafaultImg"/></div>
                   <div class="rightItem">
                      <p class="articleTitle">{{item.article_title.length>40?item.article_title.slice(0,40)+"...":item.article_title}}</p>    
                      <p><span>{{item.article_time}}</span><span class="rightClick">浏览量：{{item.article_click}}</span></p> 
                      <p>{{item.article_position}}</p>
                   </div>
                   <div class="clearBoth"></div>
                </li>
             
              </ul>
                <div class="noMore"  v-show="isMore">
                <div class="textloading" v-if="!showMore"><img src="../../assets/load.gif"/></div>
                 <div class="textloading" v-else>没有更多了</div>
               </div>
              <!--暂无数据-->
                <div class="noNull" v-if="noData">
                  <p ><img src="../../assets/noMessage.png" class="noMessage"/></p>
                  <p>暂无数据</p>   
              </div> 
       </div>
        <ul class="noFetch" v-else @click="loadFetch()" > 
        <img src="../../assets/noFetch.png" />
        <p>网络不给力，点击刷新</p>
      </ul>  
        
        
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求

import { Toast ,MessageBox,Loadmore,Indicator} from 'mint-ui';
export default {
  name: 'articleList',
   props:{
     pageSize:Number,
     default:10
  },  
  data () {
    return {
      noData:false, //数据为空 
      noFetch:false,
      articleLists:[], //资讯列表
      pageNum:0,
      noMore:false,
      showMore:false,
      isCount:0,
       isMore:false,
      haveMore:false, //是否还有更多内容
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
   var that=this;
    that.$store.commit("increatement");
      setTimeout(()=>{
        that.fetchArticle();
      },1000);
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
    }  
  },
  methods:{
    
     fetchArticle(){
        var that=this;
             //延时一秒，请求网络
        var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
       axios({
          method: 'POST',
           url:domain+'/mobile/index.php?act=member_favorites_article&op=favorites_list',
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
                var results=response.data.datas.favorites_list;
               if(that.isCount==0){
                 if(results.length!=0 && results.length<10){
                 that.articleLists=results;
                 that.isMore=true;
                that.showMore=true; //没有更多
                 that.haveMore = false;   
                }else if(results.length==0){
                  that.haveMore = false;
                  that.isMore=false;
                  that.noData=true;
                }else{
                   that.articleLists=that.articleLists.concat(results);
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
                   that.articleLists=that.articleLists.concat(results);
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
             
         });
     },
    loadMore(){  //加载更多
        if(this.haveMore){
        this.loading = true;
        this.showMore=false;
        this.isCount=1;
        this.fetchArticle();
       }
    },
    loadTop(){
     setTimeout(()=>{
       this.pageNum=0;
       this.$refs.loadmore.onTopLoaded(); 
       location.reload();
    },1000);
    },
     toarticleDetail(artileId){
        var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' + window.location.host+"/wap/dist/";
         window.location.href=domain+"#/articleDetail/"+artileId+"?key="+this.$route.query.key;
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
    height: 100vh;
    background-color: #fff;
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
.articleListContainer{
    height: 100%;
}
.articleListCenter{
  text-align:left;
}
.listItem{
     background-color: #fff;
    display: block;
    height: auto;
    border-bottom: 1px solid #ddd;
}
.clearBoth{
  clear:both;
}
.articlePic{
     width: 10rem;
    height: 8rem;
    overflow: hidden;
    display: inline-block;
    margin: 10px;
    float: left;
}
.articlePic img{
  width:100%;
  height:100%;
}
.rightItem{
    padding-top: 10px;
    font-size: 1.4rem;
    margin-bottom:10px;
}
.rightItem p{
   line-height: 28px;
    color: #666;
    font-size: 14px;
    display: block;
    width: 100%;
   
}
.rightClick{
     float: right;
    margin-right: 10px;
}
.articleTitle{
   color:#333 !important;
   font-weight:bold;
   line-height:18px !important;
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
    background-color: #ffffff;
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
/*
*加载中
*/
.textloading{
    width: 100%;
    text-align: center;
    color: #333;
    height: 36px;
    font-size: 1.5rem;
     margin-top:30px !important;
    margin-bottom:30px !important;
}
.textloading img{
  width:2.4rem;
  height:2.4rem;
}
/*
*加载状态
*/
.loading{
  width:100%;
  height:100%;
  text-align:center;
}
.loading img{
  width:6.4rem;
  height:6.4rem;
  padding-top:100px;
  text-align:center;
}
.loading{
  font-size:1.4rem;
  color:#333;
}
</style>

