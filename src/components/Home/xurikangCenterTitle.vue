<template>
  <div class="xurikangCenterTitle">
     

         <!--有网络状态-->
       <div v-if="!noFetch">
           
           <!--展示上拉加载的数据列表-->
        <ul class="listCenter data-list" id="dataList" v-cloak
         v-infinite-scroll="loadMore"
              infinite-scroll-disabled="loading"
              infinite-scroll-distance="0">
          <li class="listItem" v-for="(list,i) of centerTitleList" :key="i" @click="toTitleDetail(list.article_id)">
              <p class="listTitle">{{list.article_title}}</p>
              <p class="listDate">{{list.article_time}}</p>
              <p class="rightClick">浏览量:{{list.article_click}}</p>
          </li>

        </ul> 
            <div class="noMore" v-show="isMore">
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
axios.defaults.timeout = 3000
import { Toast } from 'mint-ui';

export default {
  name: 'xurikangCenterTitle',
  props:{
     pageSize:Number,
     default:10
  },  

  data () {
    return {
      noData:false,
      centerTitle:'',
      centerTitleList:[],
      noFetch:false, //网络状态
      isMore:false,
      haveMore:false, //是否还有更多内容
       pageNum:0,
      noMore:false,
      showMore:false,
      isCount:0,

    }
  },
  beforeCreate(){
    document.title=this.$route.query.ac_name;
  },
   computed:{
   
   isloading(){
      return this.$store.state.isloading;
    },
   
    
  },
  mounted(){
     
     if(navigator.onLine){   //有网络状态
       this.fetchTitle();
      
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
    } 
  },
  methods:{
    fetchTitle(){
       var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
       var that=this;
       axios({
          method: 'POST',
           url: domain+'/mobile/index.php?act=article&op=article_list',
           data:{
             ac_id:that.$route.params.ac_id,
             curpage:++that.pageNum,
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
              var results=response.data.datas.article_list; 
              if(that.isCount==0){
                 if(results.length!=0 && results.length<10){
                 that.centerTitleList=results;
                 that.isMore=true;
                that.showMore=true; //没有更多
                 that.haveMore = false;   
                }else if(results.length==0){
                  that.haveMore = false;
                  that.isMore=false;
                  that.noData=true;
                }else{
                   that.centerTitleList=that.centerTitleList.concat(results);
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
                   that.centerTitleList=that.centerTitleList.concat(results);
                   that.haveMore=true; //可以加载更多
                   that.isMore=true;
                   that.showMore=false;
                }
               } 
           }else{
             that.noData=true;               
               Toast(response.data.datas.error);
           }
              }else{
                $(".noMore").css('display','none');
                that.noFetch=true;
               that.showMore=true;
              }
          },(err)=>{
               that.noFetch=true;
          });  
    },
    loadTop(){
     setTimeout(()=>{
       this.pageNum=0;
        this.fetchTitle();
       this.$refs.loadmore.onTopLoaded(); 
    },1000);
    },
    loadMore(){
        if(this.haveMore){
           this.loading = true;
           this.showMore=false;
           this.isCount=1;
           this.fetchTitle();
        }
    },
    
     toTitleDetail(titleId){
         var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' + window.location.host+"/wap/dist/";
         window.location.href=domain+"#/articleDetail/"+titleId+"?key="+this.$route.query.key;
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
.wrapper{
  overflow-y:hidden;
}
/*网络状态*/
.noFetch{
    margin: 100px auto;
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
.xurikangCenterTitle{
}
.listCenter{
  width:100%;
  height:100%;
  background-color: #ffffff;
}
.listItem{
      position: relative;
    font-size: 1.4rem;
    display: block;
    text-align: left;
    border-bottom: 1px solid #d9d9d9;
}
.listTitle{
    padding-top: 5px;
    line-height: 24px;
    font-family: sans-serif;
    color: #666;
    margin-left:10px;
}
.listDate{
    color: #999;
    font-size: 1.3rem;
    padding-bottom: 30px;
    padding-top: 15px;
    margin-left:10px;
}
.rightClick{
    position: absolute;
    right: 25px;
    bottom: 5px;
    color: #666;
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
