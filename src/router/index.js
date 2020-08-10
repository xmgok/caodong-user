import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow.
// so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

import Layout from '../views/layout'

Vue.use(Router)

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/

let routerMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { onlyShowParent: true },
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },
  { path: '/enterprise', name: 'Enterprise', component: () => import('@/views/enterprise/index'), hidden: true },

  {
    path: '/brand',
    component: Layout,
    meta: { title: '品牌', icon: 'crown' },
    children: [
      {
        path: '',
        name: 'Brand',
        component: () => import('@/views/brand/index'),
        meta: { title: '品牌信息', code: 'PP1000' }
      },
      {
        path: 'material',
        name: 'Material',
        component: () => import('@/views/brand/Material'),
        meta: { title: '图片管理', code: 'PP1002' }
      },
      {
        path: 'MaterialCategory',
        name: 'MaterialCategory',
        component: () => import('@/views/brand/MaterialCategory'),
        meta: { title: '图片分类', code: 'PP1004' }
      }
      // {
      //   path: 'info',
      //   name: 'EnterpriseInfo',
      //   component: () => import('@/views/brand/Info'),
      //   meta: { title: '企业信息', code: 'PP1003' }
      // }
      // {
      //   path: 'goods-recommend',
      //   name: 'GoodsRecommend',
      //   component: () => import('@/views/brand/GoodsRecommend'),
      //   meta: { title: '商品推荐' }
      // }
    ]
  },

  {
    path: '/miniapp',
    component: Layout,
    meta: { title: '小程序', icon: 'minapp' }, // code: 'XCX2000'
    children: [
      {
        path: '',
        name: 'MiniAppTemplateIndex',
        component: () => import('@/views/miniapp'),
        meta: { title: '小程序模板', code: 'XCX2001' }
      },
      {
        path: 'add',
        name: 'miniappAdd',
        component: () => import('@/views/miniapp/Template'),
        meta: { title: '新增模板' },
        hidden: true
      },
      {
        path: 'look',
        name: 'miniappLook',
        component: () => import('@/views/miniapp/Template'),
        meta: { title: '查看' },
        hidden: true
      },
      {
        path: 'edit',
        name: 'miniappEdit',
        component: () => import('@/views/miniapp/Template'),
        meta: { title: '编辑' },
        hidden: true
      },
      {
        path: 'list',
        name: 'MiniAppList',
        component: () => import('@/views/miniapp/List'),
        meta: { title: '小程序管理', code: 'XCX2002' }
      },
      {
        path: 'upload',
        hidden: true,
        name: 'MiniAppUpload',
        component: () => import('@/views/miniapp/Upload'),
        meta: { title: '小程序上传', code: 'XCX2000' }
      }
    ]
  },

  {
    path: '/goods',
    component: Layout,
    meta: { title: '商品', icon: 'shipping-bag', code: 'SP3000' }, // code: 'SP3000'
    children: [
      {
        path: 'list-warehouse',
        name: 'GoodsListWarehouse',
        component: () => import('@/views/goods/ListWarehouse'),
        meta: { title: '商品库', code: 'SP3001', keepAlive: true }
      },
      {
        path: '',
        name: 'GoodsList',
        component: () => import('@/views/goods/List'),
        meta: { title: '商品列表', code: 'SP3002' }
      },
      {
        path: ':id(\\d+)',
        name: 'GoodsEdit',
        hidden: true,
        component: () => import('@/views/goods/Edit'),
        meta: { title: '商品编辑' }
      },
      {
        path: 'add',
        name: 'GoodsAdd',
        hidden: true,
        component: () => import('@/views/goods/Edit'),
        meta: { title: '商品添加' }
      },
      {
        path: 'category',
        name: 'GoodsCategory',
        component: () => import('@/views/goods/Category'),
        meta: { title: '商品分类', code: 'SP3003' }
      },
      {
        path: 'tag',
        name: 'GoodsTag',
        component: () => import('@/views/goods/Tag'),
        meta: { title: '标签管理', code: 'SP3004' }
      },
      {
        path: 'comment',
        name: 'GoodsComment',
        component: () => import('@/views/goods/Comment'),
        meta: { title: '评价管理', code: 'SP3006' }
      },
      {
        path: 'import',
        name: 'GoodsImport',
        component: () => import('@/views/goods/Import'),
        meta: { title: '商品导入', code: 'SP3005' }
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    meta: { title: '订单', icon: 'order', code: 'DD4000' },
    children: [
      {
        path: '',
        name: 'Order',
        component: () => import('@/views/order/List'),
        meta: { title: '订单列表', code: 'DD4001' }
      },
      {
        path: 'after-sale',
        name: 'AfterSale',
        component: () => import('@/views/order/AfterSale'),
        meta: { title: '售后订单', code: 'DD4002' }
      }
    ]
  },

  {
    path: '/store',
    component: Layout,
    meta: { title: '门店', icon: 'mendian', code: 'MD5000' },
    children: [
      {
        path: '',
        name: 'Store',
        component: () => import('@/views/store/List'),
        meta: { title: '门店管理', code: 'MD5001' }
      },
      {
        path: 'add',
        name: 'AddStore',
        component: () => import('@/views/store/AddStore'),
        meta: { title: '门店详情', code: 'MD5001' },
        hidden: true
      },
      {
        path: 'take',
        name: 'Take',
        component: () => import('@/views/store/Take'),
        meta: { title: '门店自提', code: 'MD5002' }
      },
      {
        path: 'takelist',
        name: 'TakeList',
        component: () => import('@/views/store/TakeList'),
        meta: { title: '自提记录', code: 'MD5003' }
      },
      {
        path: 'import',
        name: 'StoreImport',
        component: () => import('@/views/store/Import'),
        meta: { title: '门店导入', code: 'MD5004' }
      }
    ]
  },

  {
    path: '/coupon',
    component: Layout,
    meta: { title: '优惠券', icon: 'youhuiquan', code: 'YHJ6000' },
    children: [
      {
        path: '',
        name: 'CouponList',
        component: () => import('@/views/coupon/List'),
        meta: { title: '优惠券列表', code: 'YHJ6001' }
      },
      {
        path: 'add',
        name: 'CouponAdd',
        component: () => import('@/views/coupon/Add'),
        hidden: true,
        meta: { title: '优惠券详情', code: 'YHJ6001' }
      },
      {
        path: 'wx-card-bag',
        name: 'WeChatCardBag',
        component: () => import('@/views/coupon/WeChatCardBag'),
        meta: { title: '微信卡券设置', code: 'YHJ6002' }
      },
      {
        path: 'coupon-bag-list',
        name: 'CouponBagList',
        component: () => import('@/views/coupon/CouponBagList'),
        meta: { title: '券包列表', code: 'YHJ6003' }
      },
      {
        path: 'coupon-bag-detail',
        name: 'CouponBagDetail',
        component: () => import('@/views/coupon/CouponBagDetail'),
        hidden: true,
        meta: { title: '券包详情', code: 'YHJ6003' }
      }
    ]
  },

  {
    path: '/fullreduce',
    component: Layout,
    meta: { title: '促销', icon: 'manjiansong', code: 'MJS11000' },
    children: [
      {
        path: '',
        name: 'FullReduceList',
        component: () => import('@/views/fullreduce/List'),
        meta: { title: '满减送', code: 'MJS11001' }
      },
      {
        path: 'add',
        name: 'FullReduceAdd',
        component: () => import('@/views/fullreduce/Add'),
        hidden: true,
        meta: { title: '满减送详情', code: 'MJS11000' }
      },
      {
        path: 'coupon-split-list',
        name: 'PromotionCouponSplitList',
        component: () => import('@/views/promotion/coupon-split/List'),
        meta: { title: '瓜分券', code: 'MJS11005' }
      },
      {
        path: 'coupon-split-detail',
        name: 'PromotionCouponSplitDetail',
        component: () => import('@/views/promotion/coupon-split/Detail'),
        hidden: true,
        meta: { title: '瓜分券详情', code: 'MJS11005' }
      },
      {
        path: 'group-list',
        name: 'PromotionGroupList',
        component: () => import('@/views/promotion/group/List'),
        meta: { title: '拼团', code: 'MJS11002' }
      },
      {
        path: 'group-detail',
        name: 'PromotionGroupDetail',
        component: () => import('@/views/promotion/group/Detail'),
        hidden: true,
        meta: { title: '拼团详情', code: 'MJS11002' }
      },
      {
        path: 'seckill-list',
        name: 'PromotionSeckillList',
        component: () => import('@/views/promotion/seckill/List'),
        meta: { title: '秒杀', code: 'MJS11008' }
      },
      {
        path: 'seckill-detail',
        name: 'PromotionSeckillDetail',
        component: () => import('@/views/promotion/seckill/Detail'),
        hidden: true,
        meta: { title: '秒杀详情', code: 'MJS11008' }
      },
      {
        path: 'bargain-list',
        name: 'PromotionBargainList',
        component: () => import('@/views/promotion/bargain/List'),
        meta: { title: '砍价', code: 'MJS11006' }
      },
      {
        path: 'bargain-detail',
        name: 'PromotionBargainDetail',
        component: () => import('@/views/promotion/bargain/Detail'),
        hidden: true,
        meta: { title: '砍价详情', code: 'MJS11006' }
      },
      {
        path: 'activity',
        name: 'Activity',
        component: () => import('@/views/promotion/activity/List'),
        meta: { title: '活动', code: 'MJS11003' }
      },
      // {
      //   path: 'activity-fh',
      //   name: 'ActivityFH',
      //   component: () => import('@/views/promotion/activity/ActivityFH'),
      //   meta: { title: '风火活动', code: 'FH10000' }
      // },
      {
        path: 'activity-add',
        name: 'ActivityAdd',
        component: () => import('@/views/promotion/activity/Add'),
        hidden: true,
        meta: { title: '活动详情', code: 'MJS11003' }
      },
      {
        path: 'video',
        name: 'PromotionVideo',
        component: () => import('@/views/promotion/video/List'),
        meta: { title: '视频', code: 'MJS11004' }
      },
      {
        path: 'video-add',
        name: 'PromotionVideoAdd',
        component: () => import('@/views/promotion/video/Add'),
        hidden: true,
        meta: { title: '视频详情', code: 'MJS11004' }
      },
      {
        path: 'live',
        name: 'promotionLive',
        component: () => import('@/views/promotion/live/List'),
        meta: { title: '直播', code: 'MJS11007' }
      }
    ]
  },

  {
    path: '/task',
    component: Layout,
    meta: { title: '任务', icon: 'renwu', code: 'RW12000' },
    redirect: '/task/task-list',
    children: [
      {
        path: 'task-list',
        name: 'TaskList',
        component: () => import('@/views/task/List'),
        meta: { title: '导购任务', code: 'RW12001' }
      },
      {
        path: 'task-detail',
        name: 'TaskDetail',
        component: () => import('@/views/task/Detail'),
        hidden: true,
        meta: { title: '任务详情', code: 'RW12001' }
      },
      {
        path: 'article-list',
        name: 'ArticleList',
        component: () => import('@/views/article/List'),
        meta: { title: '文章列表', code: 'RW12002' }
      },
      {
        path: 'article-detail',
        name: 'ArticleDetail',
        component: () => import('@/views/article/Detail'),
        hidden: true,
        meta: { title: '文章详情', code: 'RW12002' }
      }
    ]
  },

  {
    path: '/appointment',
    component: Layout,
    meta: { title: '预约', icon: 'manjiansong', code: 'YY15000' },
    redirect: '/appointment/appointment-list',
    children: [
      {
        path: 'appointment-list',
        name: 'AppointmentList',
        component: () => import('@/views/appointment/List'),
        meta: { title: '服务项目', code: 'YY15001' }
      },
      {
        path: 'appointment-detail',
        name: 'AppointmentDetail',
        component: () => import('@/views/appointment/appointmentDetail'),
        meta: { title: '服务项目详情', code: 'YY15001' },
        hidden: true
      },
      {
        path: 'appointment-manage-list',
        name: 'AppointmentManageList',
        component: () => import('@/views/appointment/AppointmentManageList'),
        meta: { title: '预约管理', code: 'YY15002' }
      },
      {
        path: 'appointment-write-off',
        name: 'AppointmentWriteOff',
        component: () => import('@/views/appointment/AppointmentWriteOff'),
        meta: { title: '预约核销', code: 'YY15003' }
      },
      {
        path: 'appointment-write-off-record',
        name: 'AppointmentWriteOffRecord',
        component: () => import('@/views/appointment/AppointmentWriteOffRecord'),
        meta: { title: '核销记录', code: 'YY15004' }
      }
    ]
  },
  /*
  {
    path: '/article',
    component: Layout,
    meta: { title: '文章', icon: 'wenzhang', code: 'RW12000' },
    redirect: '/article/article-list',
    children: [
      {
        path: 'article-list',
        name: 'ArticleList',
        component: () => import('@/views/article/List'),
        meta: { title: '文章列表', code: 'WZ13000' }
      },
      {
        path: 'article-detail',
        name: 'ArticleDetail',
        component: () => import('@/views/article/Detail'),
        hidden: true,
        meta: { title: '文章详情', code: 'WZ13001' }
      }
    ]
  },
  */

  {
    path: '/seller',
    component: Layout,
    meta: { title: '分销', icon: 'fenxiao', code: 'FX13000' },
    children: [
      {
        path: '',
        name: 'SellerManagement',
        component: () => import('@/views/seller/SellerManagement'),
        meta: { title: '分销管理', code: 'FX130001' }
      },
      {
        path: 'detailed-commission',
        name: 'DetailedCommission',
        component: () => import('@/views/seller/DetailedCommission'),
        meta: { title: '佣金明细', code: 'FX130002' }
      },
      {
        path: 'application-for-cash',
        name: 'ApplicationForCash',
        component: () => import('@/views/seller/ApplicationForCash'),
        meta: { title: '提现申请', code: 'FX130003' }
      }
    ]
  },

  {
    path: '/customer',
    component: Layout,
    meta: { title: '会员', icon: 'user-tie', code: 'HY7000' },
    children: [
      {
        path: '',
        name: 'Customer',
        component: () => import('@/views/customer/List'),
        meta: { title: '会员列表', code: 'HY7001' }
      },
      {
        path: 'label',
        name: 'Tag',
        component: () => import('@/views/customer/Label'),
        meta: { title: '标签管理', code: 'HY7002' }
      },
      {
        path: 'score-detail-list',
        name: 'ScoreDetailList',
        component: () => import('@/views/customer/ScoreDetailList'),
        meta: { title: '积分明细', code: 'HY7003' }
      }
    ]
  },

  {
    path: '/employee',
    component: Layout,
    meta: { title: '员工', icon: 'user-card', code: 'YG8000' },
    children: [
      {
        path: '',
        name: 'Employee',
        component: () => import('@/views/employee/List'),
        meta: { title: '员工列表', code: 'YG8001' }
      },
      {
        path: 'import',
        name: 'EmployeeImport',
        component: () => import('@/views/employee/Import'),
        meta: { title: '员工导入', code: 'YG8002' }
      },
      {
        path: 'message',
        name: 'EmployeeMessage',
        component: () => import('@/views/employee/EmployeeMessage'),
        meta: { title: '员工通知', code: 'YG8003' }
      },
      {
        path: 'message-detail',
        name: 'EmployeeMessageDetail',
        component: () => import('@/views/employee/EmployeeMessageDetail'),
        hidden: true,
        meta: { title: '通知详情', code: 0 }
      }
    ]
  },

  {
    path: '/asset',
    component: Layout,
    meta: { title: '资产', icon: 'wallet', code: 'ZC9000' },
    children: [
      {
        path: '',
        name: 'FinancialAccount',
        component: () => import('@/views/asset/FinancialAccount'),
        meta: { title: '资金账户', code: 'ZC9001' }
      },
      {
        path: 'financial-detail',
        name: 'FinancialDetail',
        component: () => import('@/views/asset/FinancialDetail'),
        meta: { title: '资金明细', code: 'ZC9002' }
      },
      {
        path: 'reward-detail-list',
        name: 'RewardDetailList',
        component: () => import('@/views/asset/RewardDetailList'),
        meta: { title: '金币明细', code: 'ZC9005' }
      },
      // {
      //   path: 'account-satement',
      //   name: 'AccountStatement',
      //   component: () => import('@/views/asset/AccountStatement'),
      //   meta: { title: '对账单', code: 'ZC9003' }
      // },
      {
        path: 'list-account',
        name: 'ListAccount',
        component: () => import('@/views/asset/ListAccount'),
        meta: { title: '员工账户', code: 'ZC9004' }
      },
      {
        path: 'withdraw-detail',
        name: 'WithdrawDetail',
        component: () => import('@/views/setting/WithdrawDetail'),
        meta: { title: '提现明细', code: 'ZC9003' }
      }
      /*
      {
        path: 'cashing-record',
        name: 'CashingRecord',
        component: () => import('@/views/asset/CashingRecord'),
        meta: { title: '提现记录', code: 'ZJ7003' }
      }
      */
    ]
  },

  {
    path: '/setting',
    component: Layout,
    meta: { title: '设置', icon: 'gear', code: 'SZ10000' }, // code: 'SZ8000'
    redirect: '/setting/freight',
    children: [
      {
        path: 'freight',
        name: 'SettingFreight',
        component: () => import('@/views/setting/Freight'),
        meta: { title: '运费设置', code: 'SZ10004' }
      },
      {
        path: '',
        name: 'SettingPayment',
        component: () => import('@/views/setting/Payment'),
        meta: { title: '支付设置', code: 'SZ10001' }
      },
      {
        path: 'wxpay',
        name: 'WxPay',
        hidden: true,
        component: () => import('@/views/setting/Wxpay'),
        meta: { title: '微信支付设置', code: 'SZ8000' }
      },
      /*
      {
        path: 'store',
        name: 'Store',
        component: () => import('@/views/setting/Store'),
        meta: { title: '门店设置', code: 'SZ8002' }
      },
      */
      {
        path: 'order',
        name: 'SettingOrder',
        component: () => import('@/views/setting/Order'),
        meta: { title: '订单设置', code: 'SZ10003' }
      },
      {
        path: 'royalty',
        name: 'SettingRoyalty',
        component: () => import('@/views/setting/Royalty'),
        meta: { title: '提成设置', code: 'SZ10005' }
      },
      {
        path: 'score',
        name: 'Score',
        component: () => import('@/views/setting/Score'),
        meta: { title: '积分设置', code: 'SZ10008' }
      },
      {
        path: 'booking',
        name: 'Booking',
        component: () => import('@/views/setting/Booking'),
        meta: { title: '预约设置', code: 'SZ10010' }
      },
      {
        path: 'seller',
        name: 'Seller',
        component: () => import('@/views/setting/Seller'),
        meta: { title: '分销设置', code: 'SZ10009' }
      },
      {
        path: 'permission',
        component: () => import('@/views/setting/permission/index'),
        meta: { title: '权限管理', code: 'SZ10006' },
        children: [
          {
            path: '',
            name: 'PermissionEmployeeList',
            hidden: true,
            component: () => import('@/views/setting/permission/EmployeeList'),
            meta: { title: '员工账户列表', code: 'SZ8005' }
          },
          {
            path: 'add',
            name: 'EmployeePermit',
            hidden: true,
            component: () => import('@/views/setting/permission/EmployeePermit'),
            meta: { title: '创建新员工', code: 'SZ8005' }
          },
          {
            path: 'role',
            name: 'PermissionRoleList',
            hidden: true,
            component: () => import('@/views/setting/permission/RoleList'),
            meta: { title: '角色管理列表', code: 'SZ8005' }
          },
          {
            path: 'roleadd',
            name: 'RoleEdit',
            hidden: true,
            component: () => import('@/views/setting/permission/RoleEdit'),
            meta: { title: '创建新角色', code: 'SZ8005' }
          }
        ]
      },
      {
        path: 'account',
        name: 'SettingAccount',
        component: () => import('@/views/setting/Account'),
        meta: { title: '账号管理', code: 'SZ10007' }
      },
      {
        path: 'logs',
        name: 'Logs',
        component: () => import('@/views/setting/Logs'),
        meta: { title: '操作日志', code: 'SZ10002' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const routerMap2 = [
  {
    path: '/external-link',
    component: Layout,
    meta: { onlyShowParent: true },
    children: [
      {
        path: 'https://cn.vuejs.org/v2/style-guide/',
        meta: { title: 'Vue 风格指南' }
      }
    ]
  },

  {
    path: '/test',
    component: Layout,
    meta: { onlyShowParent: true },
    children: [{
      path: '',
      name: 'test',
      component: () => import('@/views/test/index'),
      meta: { title: 'test' }
    }]
  }
]

if (window.location.hostname === 'localhost') {
  routerMap = routerMap.concat(routerMap2)
}

export const constantRouterMap = routerMap

export default new Router({
  mode: 'history',
  routes: constantRouterMap,
  scrollBehavior: () => ({ y: 0 })
})
