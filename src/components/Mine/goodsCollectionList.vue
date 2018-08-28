<template>
  <div class="goodsCollectionList">
      
         <!--有网络状态-->
       <div v-if="!noFetch" style="" v-show="!isloading">
            <!--滑动的区域-->
               <div id="" class="" v-if="!noData">
                 <ul class="goodsCollectionListCenter"
               v-infinite-scroll="loadMore"
              infinite-scroll-disabled="loading"
              infinite-scroll-distance="0"
            >
                <li class="listItem" v-for="(item,i) of collectionList" :key="i" >
                    <p class="goodImage"><img :src="item.goods_image_url" :onerror="defaultImg" @click="toGoodDetail(item.goods_id)"/></p>
                    <p class="goodTitle" @click="toGoodDetail(item.goods_id)">{{item.goods_name.length>20?item.goods_name.slice(0,20)+"...":item.goods_name}}</p>
                    <p class="bottomGood"><span class="leftPrice">￥{{item.goods_price}}</span><img class="btnDel" src="../../assets/del.png" @click="btnDel(item.goods_id,$event)"></span></p>
                </li>
                
              </ul>
                <!--底部判断是加载图标还是提示“全部加载”-->
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
            <div class="noFetch" v-else @click="loadFetch()" > 
        <img src="../../assets/noFetch.png" />
        <p>网络不给力，点击刷新</p>    

        </div>   
        
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求


import { Toast ,MessageBox,Loadmore,Indicator} from 'mint-ui';
export default {
  name: 'goodsCollectionList',
  data () {
    return {
      noData:false, //数据为空 
      noFetch:false,
      collectionList:[], //商品收藏列表
      isCount:0,
       pageNum:0,
      noMore:false,
      showMore:false,
      allLoaded: false,
       isMore:false,
      haveMore:false, //是否还有更多内容
       defaultImg:'this.src="' + require('../../assets/noNull.png') + '"' ,
     
    }
  },
  computed:{
   
   isloading(){
      return this.$store.state.isloading;
    },

    
  },

mounted(){
    if(navigator.onLine){   //有网络状态
      this.fetchGoods();
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
    }  
  },
  methods:{
    fetchGoods(){
        var that=this;
             //延时一秒，请求网络
        var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
       axios({
          method: 'POST',
           url:domain+'/mobile/index.php?act=member_favorites&op=favorites_list',
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
                 that.collectionList=results;
                 that.isMore=true;
                that.showMore=true; //没有更多
                 that.haveMore = false;   
                }else if(results.length==0){
                  that.haveMore = false;
                  that.isMore=false;
                  that.noData=true;
                }else{
                   that.collectionList=that.collectionList.concat(results);
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
                   that.collectionList=that.collectionList.concat(results);
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
        this.fetchGoods();
        
      }
    },
     toGoodDetail(goodsId){  //跳转到商品详情
         window.location.href="http://gzxurikang.com/wap/tmpl/product_detail.html?key="+this.$route.query.key+"&goods_id="+goodsId;
      },
    btnDel(goodId,event){   //删除收藏
        console.log(goodId);
        event.preventDefault();
        event.stopPropagation();
         MessageBox.confirm('<span style="color:#00BCD4 !important;font-size:1.6rem">确定要删除？</span>','').then(action => {
          if (action == 'confirm') {
             var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
           var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_favorites&op=favorites_del',
                    data:{
                       key:that.$route.query.key,
                       fav_id:goodId 
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
              Indicator.open("删除中...");
               
              if(response.data.code==200){
                setTimeout(()=>{
                  Indicator.close();
                  location.reload(); 
                },1500);
               
                }else{
                   Indicator.close();
                Toast(response.data.datas.error)
              }

            },(err)=>{
                Toast('网络超时，请稍后重试');
            });
             
           }else if(action=='cancel'){
            console.log("取消了");
          }  
      });

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
.goodsCollectionListContainer{
     background-color: #fff;
    height: 100%;
}
.goodsCollectionListCenter{
  text-align:left;
  width: 98%;
  margin: 10px;

}
.listItem{
    display: inline-block;
    width: 42%;
    height: 17.5rem;
    margin: 10px;
}
.goodImage{
    height: 12rem;
    width: 100%;
    overflow: hidden;
    display: inline-block;
}
.goodImage img{
  width:100%;
  height:100%;
}
.goodTitle{
    text-align: left;
    font-size: 14px;
    color: #666;
    height: 35px;
}
.bottomGood{
    height: 32px;
    line-height: 32px;
    position: relative;
}
.leftPrice{
    font-size: 14px;
    color: #f01;
    font-weight: bold;
}
.btnDel{
    position: absolute;
    right: 5px;
    top: 5px;
    width: 20px;
    height: 18px;
    vertical-align: middle; 
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
  clear:both;
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
</style>

