<template>
  <div class="doctoRanProvide">
     
        
         <div v-if="!noFetch"  v-show="!isloading">
          <div class="doctoRanProvideContainer">
          <div   class="nav"  id="ulTab" >
            <li id="0" class="liTab"   @click="changeNav(1)">一级<img src="../../assets/low.png" class="lows" v-if="!seletedFlag"/></li>
             <li id="1" class="liTab" @click="changeNav(2)"  >二级 <img src="../../assets/low.png" class="lows" v-if="seletedFlag"/></li>

          </div>

          <!-- tab-container -->
          <div class=""  v-show="!seletedFlag">
         
             <ul class="integralCenter"  v-infinite-scroll="loadMore" 
               infinite-scroll-disabled="loading"
              infinite-scroll-immediate-check="false" v-if="!noData">
              
                <li class="listItem" v-for="(item,i) of doctorUserList" :key="i" @click="toDetail(item.member_id)">
                     <img class="avatars" :src="item.member_avatar" :onerror="defaultImg"/>
                    <div class="centerTitle">
                       <p class="names">{{item.member_name}}</p>  
                       <p class="phones">{{item.member_mobile.slice(0,5)+'***'+item.member_mobile.slice(8,11)}}</p>  
                       <p class="rightTime"> 注册时间：{{item.member_time}}</p> 
                    </div>
                </li>
                 <!--底部判断是加载图标还是提示“全部加载”-->
                 <div class="noMore"  v-if="isMore">
                <div class="textloading" v-if="!showMore"><img src="../../assets/load.gif"/></div>
                 <div class="textloading" v-else>没有更多了</div>
               </div>
              
              </ul>
                
             
          <!--暂无数据-->
          <div class="noNull" v-else >
			      <p ><img src="../../assets/noMessage.png" class="noMessage"/></p>
			      <p>暂无数据</p>   
			   </div> 
           </div>
          
           <div class="" id="1"  v-show="seletedFlag"> 
           <ul class="integralCenter"  v-infinite-scroll="TwoloadMore" 
               infinite-scroll-disabled="Twoloading"
              infinite-scroll-immediate-check="false" v-if="!noTwoData">
              
                <li class="listItem" v-for="(item,i) of TwodoctoRanProvideList" :key="i" @click="toDetail(item.member_id)">
                     <img class="avatars" :src="item.member_avatar" :onerror="defaultImg"/>
                    <div class="centerTitle">
                       <p class="names">{{item.member_name}}</p>  
                       <p class="phones">{{item.member_mobile.slice(0,5)+'***'+item.member_mobile.slice(8,11)}}</p>  
                       <p class="rightTime"> 注册时间：{{item.member_time}}</p> 
                    </div>
                </li>
                 <div class="TwoNomore" v-if="isTwoMore">
                   <div class="textloading" v-if="!TwoshowMore"><img src="../../assets/load.gif"/></div>
                   <div class="textloading" v-else>没有更多了</div>
                 </div>
               
              </ul>
              
          <!--暂无数据-->
          <div class="noNull" v-else >
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
  name: 'doctoRanProvide',
  data () {
    return {
     selected:"1",
      seletedFlag:false,
      noData:false, //数据为空 
      noFetch:false,
      noTwoData:false,
      doctorUserList: [], //推荐的用户
      TwodoctoRanProvideList:[],
       //初始化无限加载相关参数
      queryLoading: false,
      moreLoading: false,
      allLoaded: false,
      pageNum:0,
      TwopageNum:0,
      noMore:false,
      showMore:false,
      TwoshowMore:false,
      TwonoMore:false,
      noTwoData:false,
       isMore:false,
      isTwoMore:false,
      haveTwoMore:false,
      haveMore:false, //是否还有更多内容
      isCount:0,
      TwoCount:0,
      defaultImg:'this.src="' + require('../../assets/noNull.png') + '"' 
    }
  },
   computed:{
   
   isloading(){
      return this.$store.state.isloading;
    },
    
  },
  mounted(){
    if(navigator.onLine){   //有网络状态
      this.fetchadviserList();
      
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
    }  
  },
  methods:{
    //切换tab栏目
    changeNav(type){
      if(type==1){
        this.seletedFlag=false;
         this.pageNum=0;
         this.fetchadviserList();
      }else if(type==2){
        this.seletedFlag=true;
         this.TwopageNum=0;
         this.fetchList();
      }
    },
    fetchadviserList(){
       var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_index&op=facilitator_invite',
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
                var results=response.data.datas.list;
               if(that.isCount==0){
                 if(results.length!=0 && results.length<10){
                 that.doctorUserList=results;
                 that.isMore=false;
                 that.haveMore = false;   
                }else if(results.length==0){
                  that.haveMore = false;
                  that.isMore=false;
                  that.noData=true;
                }else{
                   that.doctorUserList=that.doctorUserList.concat(results);
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
                   that.doctorUserList=that.doctorUserList.concat(results);
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
     fetchList(){
       var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_index&op=facilitator_invite',
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
                var results=response.data.datas.list;
               if(that.TwoCount==0){
                 if(results.length!=0 && results.length<10){
                 that.TwodoctoRanProvideList=results;
                 that.isTwoMore=false;
                 that.haveTwoMore = false;   
                }else if(results.length==0){
                  that.haveTwoMore = false;
                  that.isTwoMore=false;
                  that.noTwoData=true;
                }else{
                   that.TwodoctoRanProvideList=that.TwodoctoRanProvideList.concat(results);
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
                   that.TwodoctoRanProvideList=that.TwodoctoRanProvideList.concat(results);
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
            this.fetchList(); 

       } 

      },
      toDetail(member_id){
         var domain = process.env.NODE_ENV == 'development' ? '' : 'http://' +  window.location.host+"/wap/dist/";
         window.location.href=domain+"#/orderDetail/"+member_id+"?key="+this.$route.query.key;
      },
     goback(){
        app.back();   
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
.doctoRanProvide{
   height: 100vh;
    background-color: #f2f2f2;
}
.doctoRanProvideContainer{
}
.integralCenter{
    height:auto;
    margin-top: 3px;
}
.listItem{
    text-align: left;
    height: 9rem;
    border-bottom: 1px solid #ddd;
    display:block;
    background-color:#fff;
}
.avatars{
    margin: 10px;
    width: 6.4rem;
    height: 6.4rem;
    border-radius: 50%;
    vertical-align: top
}
.centerTitle{
     padding-top: 15px;
    line-height: 24px;
    font-size: 1.4rem;
    color: #333;
    display:inline-block;
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
.clearBoth{
 clear:both;
}
.tabs{
display: inline-block;
text-align: center;
 width: 50%;
}

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



</style>


