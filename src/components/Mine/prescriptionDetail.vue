<template>
  <div class="prescriptionDetail">
       
      <div v-if="!noFetch">
            <div class="prescriptionDetailContainer">
           <div class="topTitle">
              <p class="doctorWork">{{WorkName}}</p>
              <p class="doctoPresiotion">{{presiotionName}}</p>
           </div>
           <ul class="infoName">
             <li ><span class="leftName">姓名:</span><span class="rightInput">{{buyer_name}}</span> </li> 
             <li ><span class="leftName">性别:</span><span class="rightInput">{{sex}}</span></li>   
             <li><span class="leftName">年龄:</span><span class="rightInput">{{buyer_age}}</span></li>   
             <li><span class="leftName">电话:</span><span class="rightInput">{{buyer_phone}}</span> </li>       
             <li id="recipeli"><span class="leftName">健康建议<b style="color:#f01">(建议结果如下)</b></span>
               <textarea Maxlength="300" class="textaresInput" v-model="recipe" rows="10" cols="42"  readonly="readonly"/>
           
            </li> 
            <li ><span class="leftName">医生：</span><span class="rightInput">{{doctor_name}}</span> </li>             
           </ul>

        </div>    

      </div>

         <div class="noFetch" v-else @click="loadFetch()" > 
        <img src="../../assets/noFetch.png" />
        <p>网络���给力，点击刷新</p>    

        </div> 
  </div>
</template>

<script>
import axios from 'axios'  //引入异步加载的网络请求

import { Toast,Loadmore,Indicator} from 'mint-ui';
export default {
  name: 'prescriptionDetail',
  data () {
    return {
      WorkName:"国家高级公共营养师",
      presiotionName:"营养保健调理专用建议栈",
      noFetch:false,
      buyer_name:"",
      sex:"",
      buyer_age:"",
      buyer_phone:"",
      doctor_name:"",
      recipe:"",
      
    }
  },
   computed:{
   
   isloading(){
      return this.$store.state.isloading;
    },
    isCount(){  //统计加载次数
      return this.$store.state.isCount;
    }
    
  },
  mounted(){
    if(navigator.onLine){   //有网络状态
      this.fetchPrescription();
       if(this.$store.state.isCount==0){     //第一次加载
        this.$store.commit('increatement');
       
       }else if(this.$store.state.isCount==1){  //已经加载过
         this.$store.commit('decrement');
         return ; 
       }
    }else{   //无网络状态
       this.noFetch=true;
       Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
    }  
  },
  methods:{
    fetchPrescription(){
        var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
        var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=member_index&op=recipe_info',
                    data:{
                       key:that.$route.query.key,
                       recipe_id:that.$route.params.recipe_id,
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
              if(response.data.code==200){
                 that.$store.commit('iscreateCount');
                var result=response.data.datas;
                 that.buyer_name=result.buyer_name;
                 that.sex=result.sex;
                 that.buyer_age=result.buyer_age;
                 that.buyer_phone=result.buyer_phone;
                 that.doctor_name=result.doctor_name;
                 that.recipe=result.recipe;
                 
              }else{
                Toast(response.data.datas.error);
              }

            },(err)=>{
                Toast('网络超时，请稍后重试');
            });   

    },
  
     goback(){

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
.prescriptionDetailContainer{
     height: 100vh;
    background-color: #f2f2f2;
}
.topTitle{
      background-color: #fff;
    height: 56px;
    border-bottom: 1px solid #ddd;
}
.doctorWork{
   line-height: 28px;
    font-size: 1.5rem;
    color: #f01;
    font-weight: bold;
}
.doctoPresiotion{
   font-size: 15px;
    color: #7ad88b;
    line-height: 22px;
}

/*患者信息*/
.infoName{
  padding-top: 10px;
    height: auto;
    text-align: left;
    background-color: #fff;
}
.infoName li{
    margin-left: 10px;
    width: 95%;
    height: 48px;
    line-height: 48px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    font-size: 1.4rem;
    color: #333;
    font-weight: bold;
}
.infoName li:last-of-type{
  border-bottom: 0 none;
}
.leftName{
     margin-right: 15px;
}
.rightInput{
    width: 65%;
    line-height: 46px;
    vertical-align: middle;
    border: 0 none;
    color:#999; 
}
#recipeli{
  height:auto;
}
.textaresInput{
  border:0 none ;
  font-size:1.4rem;
  display:block;
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
</style>
