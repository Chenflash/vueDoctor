<template>
  <div class="prescriptionList">
     
        
        <!--有网络状态-->
        <div v-if="!noFetch"  v-show="!isloading">
           <div class="prescriptionListContainer">
           
           

          <!-- tab-container -->
         <ul class="listCenter"   v-infinite-scroll="loadMore" 
               infinite-scroll-disabled="loading"
              infinite-scroll-immediate-check="false" v-if="!noData">
              
                <li class="listItem" v-for="(item,i) of prescriptionLists" :key="i" @click="toPrescription(item.id)" >
                   <p class="topTitle">开具时间：{{item.add_time}}</p>
                   <div class="centerInfo">
                       <div class="avatars"><img :src="item.member_avatar" :onerror="dafaultImg"/></div>
                       <div class="userInfo">
                            <p class="userName">{{item.buyer_name}},{{item.age}}岁,{{item.sex}}</p>
                            <p class="msg">诊断：{{item.recipe}}</p>    
                            <p class="phones">电话：{{item.buyer_phone}}</p>
                       </div> 
                   </div>
                   <div class="bottomInfo">
                       建议编号：{{item.order_sn}}     
                   </div>
                </li>
                  <!--底部判断是加载图标还是提示“全部加载”-->
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
        <!--无网络状态-->
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
  name: 'prescriptionList',
  data () {
    return {
      keyValue:"", //搜索值
      selected:"1",
      noData:false, //数据为空 
      noFetch:false,
      showMore:false,
      prescriptionLists: [], 
       isMore:false,
      isTwoMore:false,
      haveTwoMore:false,
      haveMore:false, //是否还有更多内容
      pageNum: 0,
      isCount:0,
      dafaultImg:'this.src="' + require('../../assets/noNull.png') + '"' ,
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
      this.fetchLists();
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
    }  
  },
  methods:{
    fetchLists(){ //获取我的处方列表
       var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_index&op=memberRecipe ',
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
              console.log(response);
              that.$store.commit("decrement");
               if(response!=undefined){
                   if(response.data.code==200){
                var results=response.data.datas;
               if(that.isCount==0){
                 if(results.length!=0 && results.length<10){
                 that.prescriptionLists=results;
                 that.isMore=false;
                 that.haveMore = false;   
                }else if(results.length==0){
                  that.haveMore = false;
                  that.isMore=false;
                  that.noData=true;
                }else{
                   that.prescriptionLists=that.prescriptionLists.concat(results);
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
                   that.prescriptionLists=that.prescriptionLists.concat(results);
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

    },
    searchList(){ //搜索
      if(this.keyValue==''){
          return;
      }else{
          
        Indicator.open()
        this.noData=false;
        $(".listCenter").css('display','block');
        var buyerName=this.keyValue;
        var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_index&op=memberRecipe ',
                    data:{
                       key:that.$route.query.key,
                       buyer_name:buyerName,
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
              setTimeout(()=>{
                  Indicator.close();
                  $(".listCenter").css('display','block');
              },500);
              if(response.data.code==200){
                var results=response.data.datas;
                 if(that.isCount==0){
                 if(results.length!=0 && results.length<10){
                 that.prescriptionLists=results;
                 that.isMore=true;
                that.showMore=true; //没有更多
                 that.haveMore = false;   
                }else if(results.length==0){
                  that.haveMore = false;
                  that.isMore=true;
                  that.noData=true;
                }else{
                   that.prescriptionLists=that.prescriptionLists.concat(results);
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
                   that.prescriptionLists=that.prescriptionLists.concat(results);
                   that.haveMore=true; //可以加载更多
                   that.isMore=true;
                   that.showMore=false;
                } 
               }
              }else if(response.data.code==400){
                that.noData=true;
              }else{
                Toast(response.data.datas.error)
              }

            },(err)=>{
                Toast('网络超时，请稍后重试');
            });      

      }

    },
    toPrescription(recipe_id){
         var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' +  window.location.host+"/wap/dist/";
         window.location.href=domain+"#/prescriptionDetail/"+recipe_id+"?key="+this.$route.query.key+"&buyer_name="+this.$route.query.buyer_name;
    },
   
     loadMore() {
       if(this.haveMore){
           this.loading = true;
        this.showMore=false;
        this.isCount=1;
          this.fetchLists();
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
    display: -moz-box;     /* 老版���语法: Firefox (buggy) */
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
  text-align:center !important;
  width:100% !important;
}
/*
*我的患者-列表
*/
.prescriptionListContainer{
    position:relative;
}
/*
*搜索条件
*/
.searchInput{
      background-color: #fff;
    height: 36px;
    line-height: 36px;
    margin: 5px;
    border: 1px solid #ddd;
    text-align: left;
    -moz-border-radius: 5px;
    border-radius: 5px;
}
.valueInput{
       height: 32px;
    line-height: 32px;
    width: 70%;
    border: 0px none;
    padding-left: 5px;
}
.btnSearch{
       float: right;
    width: 20%;
    margin-right: 0px;
    height: 36px;
    background: #3bdcd6;
    text-align: center;
}
.iconSearch{
  width: 2.2rem;
  height: 2.2rem
}
.iconSearch img{
   width:100%;
   height:100%; 
}
/*
*列表
*/
.listCenter{
      height: 100vh;
    background-color: #f2f2f2;

}
.listItem{
    background-color: #fff;
    width: 100%;
    text-align: left;
    border-bottom: 1px solid #ddd;
}
.topTitle{
    padding-left: 10px;
    line-height: 48px;
    height: 48px;
    background-color: #3bdcd6;
    font-size: 14px;
    color: #fff;
}
.centerInfo{
      font-size: 14px;
}
.avatars{
    display: inline-block;
    margin: 10px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    float: left;
    clear: both;
}
.avatars img{
  width:100%;
  height:100%;
}
.userInfo{
    padding-top: 15px;
    padding-bottom: 10px;
    line-height: 24px;
    width: 98%;
    color: #999;
}
.userName{
       color: #333;
}
.msg{

}
.phones{

}
.bottomInfo{
   clear: both;
    height: 36px;
    line-height: 36px;
    padding-left: 10px;
    border-top: 1px solid #ddd;
    font-size: 1.4rem;
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
