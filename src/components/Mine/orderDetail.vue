<template>
  <div class="orderDetai">
     
        <div v-if="!noFetch" v-show="!isloading">
          <div class="orderDetaiContainer">
            <!--滑动的区域-->
         <div  v-if="!noData"> 
          <h3 class="nameTitle">{{member_name}}的所有订单</h3>
          
           <ul class="lists data-list" 
              v-infinite-scroll="loadMore"
              infinite-scroll-disabled="loading"
              infinite-scroll-distance="0"
            id="dataList"  v-cloak>
              
                <li class="listItem" v-for="(item,i) of orderDetailList" :key="i" >

                  <div class="topOrder">
                    <p class="topInfo"><span class="leftOrder">订单号：{{item.order_sn}}</span><span class="rightStatus">{{item.order_state}}</span></p>
                    <p class="infoAdress">物流信息： {{item.ship_express}}({{item.shipping_code}})</p>                   
                  </div>
                  
                  <div class="centerOrder">
                    <li class="shopli" v-for="(list,i) of item.extend_order_goods" :key="i">
                      <p class="leftImgUrl"><img  :src="list.goods_image" :onerror="defaultImg"/></p>
                      <p class="centerName"><span class="goodsName">{{list.goods_name.length>20?list.goods_name.slice(0,20)+"...":list.goods_name}}</span></p>
                      <div class="rightDetail">
                        <p class="prices"><b>￥{{list.goods_price==null?'0:00':list.goods_price}}</b></p>
                        <p class="nums">x{{list.goods_num}}</p>
                        <p class="integral">共{{list.goods_num}}件商品,合计<b>￥{{item.order_amount}}</b> ({{item.shipping_fee==null?"不含运费￥0":'运费'+item.shipping_fee}})</p>
                      </div>
                    </li>
                  </div>
                 
                 </li>
              </ul>
              <div class="noMore" v-if="isMore">
                <div class="textloading" v-if="!showMore"><img src="../../assets/load.gif"/></div>
                 <div class="textloading" v-else>没有更多了</div>
               </div>
         </div>
          <!--暂无数据-->
                <div class="noNull" v-if="noData" v-show="!isloading">
                  <p ><img src="../../assets/noMessage.png" class="noMessage"/></p>
                  <p>暂无订单数据</p>   
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
  name: 'orderDetai',
  props:{
     pageSize:Number,
     default:10
  },
  data () {
    return {
      noData:false, //数据为空 
      noFetch:false,
      isCount:0,
        pageNum:0,
      noMore:false,
      showMore:false,
      allLoaded: false,
       isMore:false,
      haveMore:false, //是否还有更多内容 
       member_name:"",
       orderDetailList:[],
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
      
    Indicator.open("加载中...");
    this.$store.commit("increatement");
      setTimeout(()=>{
        this.fetchOrderDetail();  
      },1000);
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
    }  
  },
  methods:{
   
     fetchOrderDetail(){
         var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_index&op=orders_for_invitee',
                    data:{
                       key:that.$route.query.key,
                       member_id:that.$route.params.memberId,
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
               Indicator.close();
               if(response!=undefined){
                   if(response.data.code==200){
                     
                var results=response.data.datas.order_list;
                that.member_name=response.data.datas.member_name;
               if(that.isCount==0){
                 if(results.length!=0 && results.length<10){
                 that.orderDetailList=results;
                 that.isMore=true;
                that.showMore=true; //没有更多
                 that.haveMore = false;   
                }else if(results.length==0){
                  that.haveMore = false;
                  that.isMore=false;
                  that.noData=true;
                }else{
                   that.orderDetailList=that.orderDetailList.concat(results);
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
                   that.orderDetailList=that.orderDetailList.concat(results);
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
     delOrder(ids){
          console.log(ids);
        MessageBox.confirm('<span style="color:#00BCD4 !important;font-size:1.6rem">确定要删除订单？</span>','').then(action => {
          if (action == 'confirm') {
             var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;     
             var that=this;
            axios({
                          method: 'Post',
                          url:domain+'/mobile/index.php?act=member_order&op=order_delete',
                          data:{
                            key:that.$route.query.key,
                            order_id:ids,
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
                  }).then(function(res){ 
                    if(res.data.code==200){
                        Indicator.open({
                          text: '正在删除...',
                          spinnerType: 'fading-circle'
                        });
                        setTimeout(()=>{
                          Indicator.close();
                          location.reload();
                          Toast("删除成功");
                        },1500)
                    }else{
                       Toast(res.data.datas.error);
                    }
                        

                  },(err)=>{
                      Toast('网络超时，请稍后重试');
                  }); 
          }else if(action=='cancel'){
            console.log("取消了");
          }  
      });
     },
     loadMore(){  //加载更多
        if(this.haveMore){
          this.loading = true;
          this.showMore=false;
          this.isCount=1;
          this.fetchOrderDetail();
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
*订单详情
*/
.orderDetaiContainer{
      
    height: 100vh;
    background-color: #f2f2f2;
}
.nameTitle{
    height: 48px;
    line-height: 48px;
    text-align: left;
    padding-left: 10px;
    background-color: #fff;
    font-size: 1.5rem;
    color: #666;
    margin: 10px 0px;
}
.lists{
       background-color: #f2f2f2;
}
.listItem{
    width: 100%;
    margin-bottom: 10px;
    font-size: 1.2rem;
    text-align: left;
    margin-bottom:10px;
    background-color:#fff;
}
.leftOrder{
  margin-left:10px;
}
.topOrder{
       width: 100%;
    line-height: 24px;
    text-align: left;
    color: #666;
    border-bottom: 1px solid #ddd;
}
.topInfo{

}
.rightStatus{
  float:right;
  margin-right:10px;
  color:#ff8800;
}
.infoAdress{
      clear: both;
    text-align: left;
    margin-left:10px;
}
.centerOrder{
    height: auto;
    line-height: 24px;
    text-align: left;
}

.shopli{
     border-bottom: 1px solid #ddd;
    width: 100%;
    height: 8rem;
    position: relative;
    font-size: 1.2rem;
}
.leftImgUrl{
   float: left;
    width: 3.6rem;
    height: 3.6rem;
    overflow: hidden;
    margin: 10px;
}
.leftImgUrl img{
     width: 100%;
    height: 100%;
    background-size:cover;
}
.centerName{
    color: #666;
    padding-top: 10px;
    font-size:1.2rem;
}
.goodsName{
    margin-right:5px;
}
.spec{

}
.rightDetail{
    float: right;
    text-align: right;
    right: 5px;
    top: 10px;
    color: #666;
    position: absolute;
}
.prices{

}
.nums{

}
.integral{

}
.btnDel{
      float: right;
    margin-right: 10px;
    color: #00BCD4;
    display: inline-block;
    width: 64px;
    height: 24px;
    line-height: 24px;
    border: 1px solid #00BCD4;
    text-align: center;
    margin-top: 5px;
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

