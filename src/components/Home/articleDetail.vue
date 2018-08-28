<template>
  <div class="articleDetail">
      
          <div class="centerDetail" v-if="!noFetch" v-show="!isloading">
          <div class="centerTitle">
            <h3 class="titles">{{article_title}}</h3>
            <p class="bottomCenter">
             <span class="newTime">时间：{{article_time}} </span> 
            <span class="looks">浏览：{{article_click}}次</span>
            <img @click="changeAttion" :src="is_fav==0?require('../../assets/noAttion.png'):require('../../assets/attiontion.png')" :disabled="isDisable"  class="atttions"/> 
           </p> 
           <div style="clear:both"></div> 
          <p class="centerContainer" v-html="article_content"></p>
        </div>  
           <p class="lastTitles" @click="preDetail(articleId,preTitle)">上一篇：{{preTitle==''?'没有内容了...':preTitle}}</p>
           <p class="lastTitles" @click="nextDetail(nextId,nextTitle)">下一篇：{{nextTitle==''?'没有内容了...':nextTitle}}</p>
          </div>

         <ul class="noFetch" v-else v-show="!isloading">
        <img src="../../assets/noFetch.png" />
        <p>网络无法连接</p>
        <p  @click="loadFetch()"  class="btnFetch">刷新</p>
       </ul>  
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求
axios.defaults.timeout = 3000
import { Toast,Indicator } from 'mint-ui';
export default {
  name: 'articleDetail',
  data () {
    return {
     noFetch:false,
     "article_title": "",//标题
      "article_content": "",//内容
     "article_time": "",//发布时间
      "article_click": "0",//浏览量
      "ac_name": null,//分类
      is_fav:0,
      preTitle:'', //上一篇
      nextTitle:'', //下一篇
      articleId:null,
      nextId:null,
      isloading:true,
      isDisable:true,

    }
  },
  mounted(){
      if (navigator.onLine) {
      Indicator.open({
        text: '加载中..',
        spinnerType: 'fading-circle'
      });  
      setTimeout(()=>{
        //有网络状态
      this.fetchDetail();
      this.fetchPre(); //上一篇文章标题
      this.fetchNext(); //下一篇文章标题
       Indicator.close();
       this.isloading=false;
      },1000);  
     
     
    } else {
      //无网络状态
      this.noFetch = true;
      Toast({
        message: "当前网络不可用，请检查网络",
        position: "bottom",
        duration: 1500
      });
    } 
  },
  methods:{
    fetchPre(){
       var that=this;
      var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
      axios({
          method: 'POST',
           url:domain+'/mobile/index.php?act=article&op=article_show',
           data:{
              key:that.$route.query.key,
              article_id:parseInt(that.$route.params.articleId)-1
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
               that.preTitle=response.data.datas.article_title;
               that.articleId=parseInt(that.$route.params.articleId)-1;
           }else{
               that.preTitle="";
           }
          });

    },
    fetchNext(){
       var that=this;
      var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
      axios({
          method: 'POST',
           url:domain+'/mobile/index.php?act=article&op=article_show',
           data:{
              key:that.$route.query.key,
              article_id:parseInt(that.$route.params.articleId)+1
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
               that.nextTitle=response.data.datas.article_title;
               that.nextId=parseInt(that.$route.params.articleId)+1;
           }else{
              that.nextTitle="";
           }
          });
    },
    preDetail(articleId,titles){
      if(titles!=undefined  && titles!=""){
         this.$router.push({ name: "articleDetail",params:{articleId:articleId},query:{key:this.$route.query.key}});
        location.reload();
        window.scrollTo(0, 0);
      }else{
        return;
      }
    },
    nextDetail(nextId,nextTitles){
      if(nextTitles!=undefined && nextTitles!=""){     
        this.$router.push({ name: "articleDetail",params:{articleId:nextId},query:{key:this.$route.query.key}});
        location.reload();
        window.scrollTo(0, 0);
      }else{
        return;
      }
    },
    fetchDetail(){
      var that=this;
      var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
      axios({
          method: 'POST',
           url:domain+'/mobile/index.php?act=article&op=article_show',
           data:{
              key:that.$route.query.key,
              article_id:that.$route.params.articleId
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
               that.article_title=response.data.datas.article_title;
               that.article_content=response.data.datas.article_content;
               that.article_time=response.data.datas.article_time;  
               that.is_fav=response.data.datas.is_fav;
               that.article_click=response.data.datas.article_click;
           }else{
             Toast(response.data.datas.error);
           }
          });
    },
     goback(){
       this.$router.go(-1);
     },
     loadFetch(){  //刷新
         this.noFetch=false;
         if(navigator.onLine){   //有网络状态
            //有网络状态
            this.fetchDetail();
            this.fetchPre(); //上一篇文章标题
            this.fetchNext(); //下一篇文章标题
         }else{   //无网络状态
            this.noFetch=true;
              Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
          }
      },
      changeAttion(status){  //收藏状态
      
     if(this.$route.query.key=='""' || this.$route.query.key=="undefined" || this.$route.query.key=='null'){
         Toast("账号没有登录，无法收藏！");
         return;
       }else{
          if(this.is_fav==0){  //未收藏
          if(this.isDisable){
            this.isDisable=false;
            var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
           var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_favorites_article&op=favorites_add',
                    data:{
                       key:that.$route.query.key,
                       article_id:that.$route.params.articleId,
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
              var res=response.data.datas;
               setTimeout(()=>{
                    that.isDisable=true;
                },1500);
              if(response.data.code==200){
                    that.is_fav=1;  
                    Toast("收藏成功"); 
              }else{
                Toast(response.data.datas.error)
              }


            },(err)=>{
                Toast('网络超时，请稍后重试');
            });   
          }


      }else if(this.is_fav==1){  //取消收藏
         if(this.isDisable)
          {
            this.isDisable=false;
             var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
         var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_favorites_article&op=favorites_del',
                    data:{
                       key:that.$route.query.key,
                       article_id:that.$route.params.articleId,
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
              var res=response.data.datas;
               setTimeout(()=>{
                    that.isDisable=true;
               },1500);
              if(response.data.code==200){
                     that.is_fav=0;  
                    Toast("取消收藏成功");
              }else{
                Toast(response.data.datas.error)
              }


            },(err)=>{
                Toast('网络超时，请稍后重试');
            });   
         }  

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
}
.articleDetail{
  background-color: #fff;
  height: auto;

}
/*网络状态*/
.noFetch {
  margin: 100px auto;
  color: #999999;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.noFetch img {
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

.centerDetail {
    width:100%;
    height:100%;
}
.centerTitle {
    height: auto;
    padding-bottom: 30px;
    width: 100%;
    border-bottom: 1px dashed #ddd;
}
.titles {
  padding-top: 25px;
  padding-left:10px;
  font-size: 1.6rem;
  color: #00bcd4;
  text-align:center;
}
.atttions {
    width: 24px;
    height: 24px;
    float: right;
    margin-right: 10px;
}
.bottomCenter {
  margin-top: 25px;
  text-align:left; 
  color: #999;
  font-size:1.4rem;
}
.newTime {
  margin-right:10px;
  margin-left:10px;
}
.looks {
  margin-left:5px;
}
.centerContainer {
  overflow:hidden;
  width:98%;
  margin:0 auto;
  text-align:left;
  margin-top:10px;
  font-size:1.4rem;
}
.lastTitles{
   text-align:left;
   padding-left:10px;
   padding-top:10px;
   line-height:24px;
   color:#666;
   font-size:1.4rem;
}
</style>

