import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [
    /*
    *首页模块
    */
    {
      path: '/InquisitionList',  //云问诊
      name: 'InquisitionList',
      component: resolve=>require(['@/components/Home/InquisitionList'],resolve),
      meta:{
        title:"在线问诊",
        keepAlive:true
      },
    },{
      path: '/InquisitonDetail/:storeId',  //预约详情
      name: 'InquisitonDetail',
      component: resolve=>require(['@/components/Home/InquisitonDetail'],resolve),
      meta: {
        title: "预约详情",
        keepAlive: true
      },
    },{
      path: '/doctorDetail/:storeId',  //医生详情
      name: 'doctorDetail',
      component: resolve=>require(['@/components/Home/doctorDetail'],resolve),
      meta: {
        title: "医生详情",
        keepAlive: true
      },
    },{
      path: '/apportantDetail/:storeId',  //预约详情-支付
      name: 'apportantDetail',
      component: resolve=>require(['@/components/Home/apportantDetail'],resolve),
      meta: {
        title: "预约详情",
        keepAlive: true
      },
    },{
      path: '/xurikangCenter',  //旭日康中心
      name: 'xurikangCenter',
      component: resolve=>require(['@/components/Home/xurikangCenter'],resolve),
      meta: {
        title: "旭日康中心",
        keepAlive:true
      },
    },{
      path: '/xurikangCenterTitle/:ac_id',  //旭日康中心标题列表页
      name: 'xurikangCenterTitle',
      component: resolve=>require(['@/components/Home/xurikangCenterTitle'],resolve),
      meta:{
        keepAlive: true
      }
     
    },{
      path: '/articleDetail/:articleId',  //旭日康家园详情
      name: 'articleDetail',
      component: resolve=>require(['@/components/Home/articleDetail'],resolve),
      meta: {
        title: "文章详情",
        keepAlive: true
      },
    },{
      path: '/xurikangHomeland',  //健康资讯
      name: 'xurikangHomeland',
      component: resolve=>require(['@/components/Home/xurikangHomeland'],resolve),
      meta: {
        title: "健康大讲堂",
        keepAlive: true
      },
    },
    {
      path: '/experienceList',  //健康体验店
      name: 'experienceList',
      component: resolve => require(['@/components/Home/experienceList'], resolve),
      meta: {
        title: "健康体验店",
      },
    },
    {
      path: '/experiencelDetail/:storeId',  //健康体验店
      name: 'experiencelDetail',
      component: resolve => require(['@/components/Home/experiencelDetail'], resolve),
      meta: {
        title: "健康体验店",
      },
    },

    
    /*
    *我的
    **/
   //健康顾问
   {
    path: '/adviserRanDoctor',  //我推荐的终端商，健康顾问
    name: 'adviserRanDoctor',
    component: resolve=>require(['@/components/Mine/adviserRanDoctor'],resolve),
     meta: {
       title: "我推荐的终端商",
       keepAlive: true
     },
  },
  {
    path: '/adviserRanProvide',  //我推荐的服务商，健康顾问
    name: 'adviserRanProvide',
    component: resolve=>require(['@/components/Mine/adviserRanProvide'],resolve),
    meta: {
      title: "我推荐的服务商",
      keepAlive: true
    },
  },
  //终端商
  {
    path: '/doctorPatient',  //我的预约
    name: 'doctorPatient',
    component: resolve=>require(['@/components/Mine/doctorPatient'],resolve),
    meta: {
      title: "我的预约",
      keepAlive: true
    },
  },
    {
      path: '/doctorPrescription/:order_id',  //开处方
      name: 'doctorPrescription',
      component: resolve => require(['@/components/Mine/doctorPrescription'], resolve),
      meta: {
        title: "我的预约",
        keepAlive: true
      },
    },
  {
    path: '/prescriptionList',  //健康建议
    name: 'prescriptionList',
    component: resolve => require(['@/components/Mine/prescriptionList'],resolve),
    meta: {
      title: "健康建议",
      keepAlive: true
    },
  },
    {
      path: '/prescriotionDoctor',  //健康建议,医生
      name: 'prescriotionDoctor',
      component: resolve => require(['@/components/Mine/prescriotionDoctor'], resolve),
      meta: {
        title: "健康建议",
        keepAlive: true
      },
    },
    {
      path: '/prescriptionDetail/:recipe_id',  //开处方
      name: 'prescriptionDetail',
      component: resolve => require(['@/components/Mine/prescriptionDetail'], resolve),
      meta: {
        title: "健康建议",
        keepAlive: true
      },
    },
  
  {
    path: '/doctorRecSelf',  //我推荐的医生
    name: 'doctorRecSelf',
    component: resolve=>require(['@/components/Mine/doctorRecSelf'],resolve),
    meta: {
      title: "我推荐的终端商",
      keepAlive: true
    },
  },
  {
    path: '/doctorRecUser',  //我推荐的用户
    name: 'doctorRecUser',
    component: resolve=>require(['@/components/Mine/doctorRecUser'],resolve),
    meta: {
      title: "我推荐的用户",
      keepAlive: true
    },
  },
    {
      path: '/doctoRanProvide',  //我推荐的服务商，终端商
      name: 'doctoRanProvide',
      component: resolve => require(['@/components/Mine/doctoRanProvide'], resolve),
      meta: {
        title: "我推荐的服务商",
        keepAlive: true
      },
    },
    {
      path: '/provideoOtherDoctor',  //我推荐的终端商(跨区)
      name: 'provideoOtherDoctor',
      component: resolve => require(['@/components/Mine/provideoOtherDoctor'], resolve),
      meta: {
        title: "我推荐的终端商(跨区)",
        keepAlive: true
      },
    },
    {
      path: '/provideRanOtherSelf',  //我推荐的服务商(跨区)
      name: 'provideRanOtherSelf',
      component: resolve => require(['@/components/Mine/provideRanOtherSelf'], resolve),
      meta: {
        title: "我推荐的服务商(跨区)",
        keepAlive: true
      },
    },
    {
      path: '/provideManUser',  // 我辖区的普通用户
      name: 'provideManUser',
      component: resolve => require(['@/components/Mine/provideManUser'], resolve),
      meta: {
        title: "我辖区的普通用户",
        keepAlive: true
      },
    },

 
  //服务商
  {
    path: '/provideManDoctor',  //我辖区的医生，服务商
    name: 'provideManDoctor',
    component: resolve=>require(['@/components/Mine/provideManDoctor'],resolve),
    meta: {
      title: "我辖区的终端商",
      keepAlive: true
    },
  },
    {
      path: '/provideManSelf',  //我辖区的服务商
      name: 'provideManSelf',
      component: resolve => require(['@/components/Mine/provideManSelf'], resolve),
      meta: {
        title: "我辖区的服务商",
        keepAlive: true
      },
    },
  {
    path: '/provideRanDoctor',  //服务商推荐的医生
    name: 'provideRanDoctor',
    component: resolve=>require(['@/components/Mine/provideRanDoctor'],resolve),
    meta: {
      title: "我推荐的终端商",
      keepAlive: true
    },
  },
  {
    path: '/provideRanSelf',  //我推荐的服务商，服务商
    name: 'provideRanSelf',
    component: resolve=>require(['@/components/Mine/provideRanSelf'],resolve),
    meta: {
      title: "我推荐的服务商",
      keepAlive: true
    },
  },
    {
      path: '/orderDetail/:memberId',  //订单详情
      name: 'orderDetail',
      component: resolve => require(['@/components/Mine/orderDetail'], resolve),
      meta: {
        keepAlive: true,
        title: "订单详情",
      },
    },
  {
    path: '/integral',  //积分明细
    name: 'integral',
    component: resolve=>require(['@/components/Mine/integral'],resolve),
    meta: {
      title: "积分明细",
      keepAlive: true
    },
  },
  {
    path: '/intergralDetail/:pl_id',  //积分详情
    name: 'intergralDetail',
    component: resolve=>require(['@/components/Mine/intergralDetail'],resolve),
    meta: {
      title: "积分详情",
      keepAlive: true,
    },
  },
  {
    path: '/opinion',  //意见反馈
    name: 'opinion',
    component: resolve=>require(['@/components/Mine/opinion'],resolve),
    meta: {
      title: "意见反馈",
      keepAlive: true,
    },
  },
  {
    path: '/editShop',  //店铺简介
    name: 'editShop',
    component: resolve => require(['@/components/Mine/editShop'],resolve),
    meta: {
      title: "店铺简介",
    },
  },
    {
      path: '/editManager',  //经营特色
      name: 'editManager',
      component: resolve => require(['@/components/Mine/editManager'], resolve),
      meta: {
        title: "经营特色",
      },
    },
    {
      path: '/editService',  //健康服务
      name: 'editService',
      component: resolve => require(['@/components/Mine/editService'], resolve),
      meta: {
        title: "健康服务",
      },
    },
    {
      path: '/goodsCollectionList',  //商品收藏
      name: 'goodsCollectionList',
      component: resolve => require(['@/components/Mine/goodsCollectionList'], resolve),
      meta: {
        title: "商品收藏",
        keepAlive: true,
      },
    },
    {
      path: '/articleList',  //资讯收藏
      name: 'articleList',
      component: resolve => require(['@/components/Mine/articleList'], resolve),
      meta: {
        title: "资讯收藏",
        keepAlive: true,
      },
    },
    {
      path: '/intelligenManList',  //资质管理
      name: 'intelligenManList',
      component: resolve => require(['@/components/Mine/intelligenManList'], resolve),
      meta: {
        title: "资质管理",
        keepAlive: true
      },
    },
     {
       path: '/addIntelligen',  //添加资质证书
       name: 'addIntelligen',
       component: resolve => require(['@/components/Mine/addIntelligen'], resolve),
      meta: {
        title: "添加资质证书",
        keepAlive: true
      },
    },
    {
      path: '/eduInfo',  //学历管理
      name: 'eduInfo',
      component: resolve => require(['@/components/Mine/eduInfo'], resolve),
      meta: {
        title: "学历信息",
      },
    },
    {
      path: '/addTranList',  //学历管理-添加培训
      name: 'addTranList',
      component: resolve => require(['@/components/Mine/addTranList'], resolve),
      meta: {
        title: "学历信息",
      },
    },
     {
       path: '/addEduInfo',  //学历管理-学历教育
       name: 'addEduInfo',
       component: resolve => require(['@/components/Mine/addEduInfo'], resolve),
      meta: {
        title: "学历信息",
      },
    },


  //注册
  {
    path: '/registType',  
    name: 'registType',
    component: resolve=>require(['@/components/Regist/registType'],resolve),
    meta: {
      title: "注册类型",
    },
  },
  {
    path: '/registHome',  
    name: 'registHome',
    component: resolve=>require(['@/components/Regist/registHome'],resolve),
    meta: {
      title: "注册会员",
    },
  },
    {
      path: '/agreeMent',
      name: 'agreeMent',
      component: resolve => require(['@/components/Regist/agreeMent'], resolve),
      meta: {
        title: "用户协议",
        keepAlive: true
      },
    },
    {
      path: '/callPhone',
      name: 'callPhone',
      component: resolve => require(['@/components/Mine/callPhone'], resolve),
      meta: {
        title: "联系我们",
        keepAlive: true
      },
    },
  



  ],
  //滚动位置
   scrollBehavior(to, from,savedPosition) {
    return {
      x: 0,
      y: 0
    }
  }
})
