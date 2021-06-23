import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

/* Layout */
import Layout from "@/views/layout/index.vue";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin', 'super','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

export const constantRoutes = [
  {
    path: "/login",
    name: "login",
    component: resolve => require(["@/views/common/login.vue"], resolve),//() => import("@/views/common/login.vue"),
    meta: {
      name: "登录"
    },
    hidden: true
  },

  {
    path: "/404",
    component: resolve => require(["@/views/common/404.vue"], resolve),//() => import("@/views/common/404.vue"),
    hidden: true
  },
  {
    path: "/401",
    component: resolve => require(["@/views/common/401.vue"], resolve),//() => import("@/views/common/401.vue"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,

    hidden: true,
    children: [{
      path: "/profile",
      component: resolve => require(["@/views/profile/index.vue"], resolve),//() => import("@/views/profile/index.vue"),
      meta: {
        name: "账户设置",
        icon: "user",
        noCache: true
      }
    }]
  }, {
    path: "/",
    component: Layout,
    hidden: true,
    children: [{
      path: "/openSchool",
      component: resolve => require(["@/views/netSchoolMange/components/openSchool/index.vue"], resolve),//() => import("@/views/profile/index.vue"),
      meta: {
        name: "开通网校",
        icon: "user",
        noCache: true
      }
    }]
  }, {
    path: "/",
    component: Layout,
    hidden: true,
    children: [{
      path: "/productManagePage",
      component: resolve => require(["@/views/netSchoolMange/upLoadPage/subPages/productManagePage.vue"], resolve),//() => import("@/views/profile/index.vue"),
      meta: {
        name: "开通网校",
        icon: "user",
        noCache: true
      }
    }]
  },
  {
    path: "/",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/netSchoolTextImagePage",
        name: "textImagePage",
        component: () => import("@/views/netSchoolMange/upLoadPage/subPages/textImagePage.vue"),//resolve => require(["@/views/netSchoolMange/upLoadPage/subPages/textImagePage.vue"], resolve),
        meta: {
          name: '图文设置',
          icon: 'brand-fill'
        },
      }
    ]

  },
  {
    path: "/",
    component: Layout,
    hidden: true,
    children: [{
      path: "/netSchoolTextVideoPage",
      name: "textVideoPage",
      component: () => import("@/views/netSchoolMange/upLoadPage/subPages/textVideoPage.vue"),//resolve => require(["@/views/netSchoolMange/upLoadPage/subPages/textImagePage.vue"], resolve),
      meta: {
        name: '视频设置',
        icon: 'brand-fill'
      },
    }]
  },

];

export const asyncRouter = [
  {
    path: "/",
    component: Layout,
    name: "subjectManage",
    // redirect: "/subjectManage",
    id: 2,
    code: 10002,
    meta: {
      name: '班级管理',
      icon: 'jg'
    },
    children: [
      {
        path: "/subjectManage",
        id: 9,
        code: 10009,
        component: resolve => require(["@/views/classManage/subjectManage/index.vue"], resolve),//() => import("@/views/classManage/subjectManage/index.vue"),
        meta: {
          name: "科目管理",
          icon: 'kj'
        }
      }, {
        path: "/classManage",
        id: 10,
        code: 10010,
        component: resolve => require(["@/views/classManage/classManage/index.vue"], resolve),//() => import("@/views/classManage/classManage/index.vue"),
        meta: {
          name: "班级管理",
          icon: 'classmate'
        }
      },
      {
        path: "/schoolManage",
        id: 11,
        code: 10011,
        component: resolve => require(["@/views/classManage/schoolManage/index.vue"], resolve),//() => import("@/views/classManage/schoolManage/index.vue"),
        meta: {
          name: "校长管理",
          icon: 'ls'
        }
      }, {
        path: "/studentManage",
        id: 12,
        code: 10012,
        component: resolve => require(["@/views/classManage/studentManage/index.vue"], resolve),//() => import("@/views/classManage/studentManage/index.vue"),
        meta: {
          name: "学生管理",
          icon: 'stu'
        }
      }, {
        path: "/teacherManage",
        id: 13,
        code: 10013,
        component: resolve => require(["@/views/classManage/teacherManage/index.vue"], resolve),//() => import("@/views/classManage/teacherManage/index.vue"),
        meta: {
          name: "教师管理",
          icon: "zb"
        }
      }
    ]
  },
  {
    path: "/",
    component: Layout,
    name: "brandOrganManage",
    id: 22,
    code: 10022,
    meta: {
      name: '品牌机构',
      icon: 'classmate'
    },
    children: [
      {
        path: "/brandOrganManage",
        id: 23,
        code: 10023,
        component: resolve => require(["@/views/brandOrganManage/index.vue"], resolve),//() => import("@/views/school/index.vue"),
        meta: {
          name: '品牌机构',
          icon: 'classmate'
        }
      }
    ]

  },
  {
    path: "/",
    component: Layout,
    name: "courseSearch",
    id: 3,
    code: 10003,
    meta: {
      name: '排课管理',
      icon: 'sz'
    },
    children: [
      {
        path: "/courseSearch",
        id: 14,
        code: 10014,
        component: resolve => require(["@/views/courseManage/courseSearch/index.vue"], resolve),//() => import("@/views/courseManage/courseSearch/index.vue"),
        meta: {
          name: "课表查询",
          icon: "stu"
        }
      }, {
        path: "/courseShedule",
        id: 15,
        code: 10015,
        component: resolve => require(["@/views/courseManage/courseShedule/index.vue"], resolve),//() => import("@/views/courseManage/courseShedule/index.vue"),
        meta: {
          name: "课程排课",
          icon: "all-fill"
        }
      }
    ]

  },
  {
    path: "/",
    component: Layout,
    name: "courseWareManage",
    id: 4,
    code: 10004,
    meta: {
      name: '课件管理',
      icon: 'kj'
    },
    children: [
      {
        path: "/courseWareManage",
        id: 18,
        code: 10018,
        component: resolve => require(["@/views/courseWareManage/index.vue"], resolve),//() => import("@/views/courseWareManage/index.vue"),
        meta: {
          name: '班级课件',
          icon: 'kj'
        },
      },
      // {
      //   path:"/publicCourseWare",
      //   component:()=>import("@/views/courseWareManage/publicCourseWare/index.vue"),
      //   meta:{
      //     name:'公共课件',
      //     icon:'kj'
      //   },
      // }
    ]
  },
  {
    path: "/",
    component: Layout,
    name: "netSchool",
    id: 5,
    code: 10005,
    meta: {
      name: '网校管理',
      icon: 'eye'
    },
    children: [
      {
        path: "/netHomeSchool",
        id: 19,
        code: 10019,
        component: resolve => require(["@/views/school/index.vue"], resolve),//() => import("@/views/school/index.vue"),
        meta: {
          name: '网校管理',
          icon: 'brand-fill'
        }
      },
      {
        path: "/netSchoolNetSchoolCus",
        id: 57,
        code: 10057,
        component: resolve => require(["@/views/netSchoolMange/netSchool/index.vue"], resolve),//() => import("@/views/school/index.vue"),
        meta: {
          name: '网校管理新',
          icon: 'brand-fill'
        }
      },
      {
        path: "/netSchoolShopNavi",
        id: 63,
        code: 10063,
        component: resolve => require(["@/views/netSchoolMange/shopNavi/index.vue"], resolve),//() => import("@/views/school/index.vue"),
        meta: {
          name: '店铺导航',
          icon: 'brand-fill'
        }
      },
      {
        path: "/netSchoolHistoryPage",
        id: 64,
        code: 10064,
        component: resolve => require(["@/views/netSchoolMange/historyPage/index.vue"], resolve),//() => import("@/views/school/index.vue"),
        meta: {
          name: '历史主页',
          icon: 'brand-fill'
        }
      },
      {
        path: "/netSchoolWeichatPage",
        id: 65,
        code: 10065,
        component: resolve => require(["@/views/netSchoolMange/weichatPage/index.vue"], resolve),//() => import("@/views/school/index.vue"),
        meta: {
          name: '微信小程序',
          icon: 'brand-fill'
        }
      },
      {
        path: "/netSchoolUpLoadPage",
        id: 66,
        code: 10066,
        component: resolve => require(["@/views/netSchoolMange/upLoadPage/index.vue"], resolve),//() => import("@/views/school/index.vue"),
        meta: {
          name: '上传中心',
          icon: 'brand-fill'
        },


      },

      {
        path: "/netSchoolDataPage",
        id: 67,
        code: 10067,
        component: resolve => require(["@/views/netSchoolMange/dataPage/index.vue"], resolve),//() => import("@/views/school/index.vue"),
        meta: {
          name: '数据中心',
          icon: 'brand-fill'
        }
      },
      {
        path: "/netSchoolOperationLog",
        id: 68,
        code: 10068,
        component: resolve => require(["@/views/netSchoolMange/operationLog/index.vue"], resolve),//() => import("@/views/school/index.vue"),
        meta: {
          name: '操作日志',
          icon: 'brand-fill'
        }
      },
      {
        path: "/netSchoolUserPage",
        id: 73,
        code: 10073,
        component: resolve => require(["@/views/netSchoolMange/userPage/index.vue"], resolve),//() => import("@/views/school/index.vue"),
        meta: {
          name: '用户列表',
          icon: 'brand-fill'
        }
      },

      {
        path: "/netSchoolMyService",
        id: 69,
        code: 10069,
        component: resolve => require(["@/views/netSchoolMange/myService/index.vue"], resolve),//() => import("@/views/school/index.vue"),
        meta: {
          name: '我的服务',
          icon: 'brand-fill'
        }
      },
      {
        path: "/productPage",
        id: 70,
        code: 10070,
        component: resolve => require(["@/views/netSchoolMange/productPage/index.vue"], resolve),//() => import("@/views/school/index.vue"),
        meta: {
          name: '系统商品',
          icon: 'brand-fill'
        }
      },
      {
        path: "/orderPage",
        id: 72,
        code: 10072,
        component: resolve => require(["@/views/netSchoolMange/orderPage/index.vue"], resolve),//() => import("@/views/school/index.vue"),
        meta: {
          name: '商品订单',
          icon: 'brand-fill'
        }
      }
    ]

  },
  {
    path: "/",
    component: Layout,
    name: "orderManage",
    id: 6,
    code: 10006,
    meta: {
      name: '订单管理',
      icon: 'set'
    },
    children: [
      {
        path: "/orderAccount",
        id: 20,
        code: 10020,
        component: resolve => require(["@/views/orderManage/orderAccount/index.vue"], resolve),//() => import("@/views/orderManage/index.vue"),
        meta: {
          name: '订单管理',
          icon: 'notice-fill'
        },
      },
      // {
      //   path: "/orderAudit",
      //   id: 20,
      //   code: 10021,
      //   component: resolve => require(["@/views/orderManage/orderAudit/index.vue"], resolve),//() => import("@/views/orderManage/index.vue"),
      //   meta: {
      //     name: '订单审核',
      //     icon: 'notice-fill'
      //   },
      // }
    ]
  },

  {
    path: "/",
    component: Layout,
    name: "noticeManage",
    id: 7,
    code: 10007,
    meta: {
      name: '通知管理',
      icon: 'eye'
    },
    children: [
      {
        path: "/noticeManage",
        id: 21,
        code: 10021,
        component: resolve => require(["@/views/noticeManage/index.vue"], resolve),//() => import("@/views/noticeManage/index.vue"),
        meta: {
          name: '通知管理',
          icon: 'brand-fill'
        }
      }
    ]

  },
  {
    path: "/",
    component: Layout,
    name: "authManage",
    id: 8,
    code: 10008,
    meta: {
      name: '权限管理',
      icon: 'set'
    },
    children: [
      {
        path: "/authManage",
        id: 16,
        code: 10016,
        component: resolve => require(["@/views/authManage/roleManage/index.vue"], resolve),//() => import("@/views/authManage/roleManage/index.vue"),
        meta: {
          name: '角色管理',
          icon: 'classmate'
        },
      }, {
        path: "/userManage",
        id: 17,
        code: 10017,
        component: resolve => require(["@/views/authManage/userManage/index.vue"], resolve),//() => import("@/views/authManage/userManage/index.vue"),
        meta: {
          name: '用户管理',
          icon: 'classtime'
        },
      }
    ]

  },


];

const createRouter = () =>
  new VueRouter({
    mode: "history", // require service support
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRoutes
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
