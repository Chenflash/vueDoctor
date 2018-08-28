<template>
  <div class="addTranList">
          

         <!--有网络状态-->
       <div v-if="!noFetch"  v-show="!isloading">
            
        <div class="addTranListContainer">
           <h3>温馨提示： 请确保你本人的信息真实有效！</h3>
           <ul class="formAddIntell">
                <li class="itemsIntell"><span class="letText">培训讲师：</span><input type="text" v-model="lectuer"  placeholder="请输入培训讲师姓名" class="rightInput"/></li>                  
                <li class="itemsIntell"><span class="letText">开始时间：</span><span  class="rightInput" @click="openStartDate">{{myStartTime==''?'请选择培训开始时间':myStartTime}}</span></li>
                <li class="itemsIntell"><span class="letText">结束时间：</span><span  class="rightInput" @click="openEndDate">{{myEndTime==''?'请选择培训结束时间':myEndTime}}</span></li>  
                <li class="itemsIntell"><span class="letText">培训课程 : </span><input type="text" v-model="course"  placeholder="请输入培训讲师姓名" class="rightInput"/></li>                  
                <li class="itemsIntell"><span class="letText">培训机构：</span><input type="text" v-model="institution"  placeholder="填写培训机构名称" class="rightInput"/></li>                  
               
            </ul>
           <div class="btnAddTranList" @click="btnTranAdd">确定添加</div> 
        </div> 
        <div class="showDates" v-if="showDate">
            <mt-datetime-picker refs="picker" 
            type="date"
            v-model="start_time"
            :startDate="startDate"
            :endDate="new Date()"
            year-format="{value}年"
            month-format="{value}月"
            date-format="{value}日"
            confirm="handleConfirm"  @cancel="checkinCancel" 
            style="display:block" @confirm="handleConfirm">
        </mt-datetime-picker>
        </div>
        <div class="showDates" v-if="showEndDate">
            <mt-datetime-picker refs="picker" 
            type="date"
            v-model="end_time"
            :startDate="startDate"
            :endDate="new Date()"
            year-format="{value}年"
            month-format="{value}月"
            date-format="{value}日"
            confirm="handleConfirm"  @cancel="checkinEndCancel" 
            style="display:block" @confirm="handleEndConfirm">
        </mt-datetime-picker>
        </div>
        </div>
          <ul class="noFetch" v-else>
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
  name: 'addTranList',
  data () {
    return {
       noFetch:false,
       lectuer:"",
       myStartTime:"",
       myEndTime:"",
       start_time:"",
       startDate:new Date('1960-01-01'),
       end_time:"",
       course:"",
       institution:"",
       showDate:false,
       showEndDate:false,

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
     if (navigator.onLine) {
      
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
      formatDate(date) {  //转化时间格式
        const y = date.getFullYear()
        let m = date.getMonth() + 1
        m = m < 10 ? '0' + m : m
        let d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        return y + '-' + m + '-' + d
    },
    
     openStartDate(){  //打开时间组件
       if(this.showEndDate==true){
          return; 
       }else{
           this.myStartTime=="";
          this.showDate=true; 
       }
    },
    openEndDate(){
      if(this.showDate==true){
          return;
      }else{
          this.myEndTime=="";
           this.showEndDate=true; 
      }
    },
    checkinEndCancel(){
       this.myEndTime="";
      this.showEndDate=false;
    },
    handleEndConfirm(){
      this.showEndDate=false;
      this.myEndTime=this.formatDate(this.end_time);

    },
    checkinCancel(){ //取消
      this.myStartTime="";
      this.showDate=false;
    
    },
    handleConfirm(){  //确定选择格式后
      this.showDate=false;
      this.myStartTime=this.formatDate(this.start_time);

    },
    btnTranAdd(){   //添加学历信息
        var s=new Date(this.myStartTime.replace(/-/g, '-'));
      var e=new Date(this.myEndTime.replace(/-/g, '-'));
       if(this.lectuer==""|| this.myStartTime=="" || this.myEndTime ==""  || this.course=="" || this.institution==""){
             Toast("请填写完整的证学历信息"); 
             return;
      }
       else if(s<e==false){
        Toast("开始日期不能大于结束日期!");
        return;
      }else{
          Indicator.open();
          var domain = process.env.NODE_ENV == 'development' ? '/api' : 'http://' + window.location.host;
          var that=this;
            axios({
                    method: 'Post',
                    url:domain+'/mobile/index.php?act=training&op=add',
                    data:{
                       key:that.$route.query.key,
                       lectuer:that.lectuer,
                       start_time:that.myStartTime,
                       end_time:that.myEndTime,
                       course:that.course,
                       institution:that.institution,

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
              if(response.data.code==200){
                  setTimeout(()=>{
                       Indicator.close();
                       that.$router.go(-1);
                  },1000);
              }else{
                  setTimeout(()=>{
                       Indicator.close();
                       Toast(response.data.datas.error)
                  },1000); 
               
              }

            },(err)=>{
                Toast('网络超时，请稍后重试');
            });
      }

    },
     loadFetch(){  //刷新
         this.noFetch=false;
         if(navigator.onLine){   //有网络状态
            //有网络状态
            
         }else{   //无网络状态
            this.noFetch=true;
              Toast({message:'当前网络不可用，请检查网络',position: 'bottom',duration: 1500})
          }
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
.addTranList{
    height: auto;
    background-color: #fff;
}
.addTranListContainer{
      text-align: left;
}
.addTranListContainer h3{
      font-size: 1.5rem;
    background-color: #25a7bb;
    height: 36px;
    line-height: 36px;
    padding-left: 10px;
    color: #fff;
}
.addTranListContainer p{
   line-height: 24px;
    font-size: 1.4rem;

}
/*
*培训机构
*/
.formAddIntell{
      width: 100%;
    margin-bottom: 20px;
    height: auto;
}
.itemsIntell{
    width: 100%;
    display: block;
    height: 42px;
    line-height: 42px;
    border-bottom: 1px solid #ddd;
    font-size: 1.4rem;
}
.letText{
    color: #333;
    margin-right: 10px;
    margin-left:10px;
}
.rightInput{
     width: 60%;
    line-height: 33px;
    border: 0 none;
    color:#666;
}
.btnAddTranList{
       text-align: center;
    height: 36px;
    line-height: 36px;
    background-color: #ff8800;
    color: #fff;
    font-size: 1.4rem;
}

/*底部btn*/
.btnTranList{
   display: block;
    position: fixed;
    bottom: 60px;
    left: 0px;
    right: 0px;
    text-align: center;
    line-height: 46px;
    height: 46px;
    background-color: #f47731;
    font-size: 1.4rem;
    color: #fff;
    z-index: 1000;
    letter-spacing: 2px;
}
.btneduList{
    display: block;
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    text-align: center;
    line-height: 46px;
    height: 46px;
    background-color: #f47731;
    font-size: 1.4rem;
    color: #fff;
    letter-spacing: 2px;
    z-index: 1000;
}
.noData{
 background-color: #fff;
 text-align: center;
}

</style>

