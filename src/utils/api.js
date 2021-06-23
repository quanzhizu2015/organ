const API = {
    course: {
        list: "/train/subject/list",
        detail: '/train/subject/detail',
        addSubject: '/train/subject/addSubject',
        updateSubject: "/train/subject/updateSubject",
        deleteSubject: "/train/subject/deleteSubject",
        subjectAll: "/train/subject/all",
        pagePo: "/train/course/listPo", //根据班级查科目
    },
    courseMan: {
        list: "/train/courseTable/list",
        insertList: "/train/courseTable/insertList",
        insert: "/train/courseTable/insert",
        update: "/train/courseTable/update",
        delete: "/train/courseTable/delete",
        saveLastWeekCourse: "train/courseTable/saveLastWeekCourse"

    },
    courseWare: {
        list: "/train/course/page",
        floderList: "/train/courseCoursewareFolder/list",
        insert: "/train/course/insert",  //parentId 大于0新增章节 为0新增科目
        update: "train/course/rename",
        delete: "/train/course/delete",
        courseWareInsert: "/train/courseware/insert",
        courseWareList: "train/course/getCoursewaresByCourseId",
        courseDelete: "/train/courseware/delete"
    },
    folder: {
        list: "/train/courseCoursewareFolder/list",
        insert: "/train/courseCoursewareFolder/insert",
        insertCourseware: "train/course/insertCourseware",
        update: "train/courseCoursewareFolder/update",
        delete: "/train/courseCoursewareFolder/delete"
    },


    teacher: {
        list: "train/teacher/page",
        insert: "/train/teacher/insert",
        update: "train/teacher/update",
        courseTeacher: "/train/teacher/courseTeacher",

        band: "train/teacher/band",
        unband: "train/teacher/unband",
        getById: "train/teacher/getById",
        delete: "train/teacher/delete",


    },
    student: {   //学生管理
        list: "/train/student/page",
        update: "/train/student/update",
        resetPassword: "/train/student/resetPassword",
        delete: "/train/student/delete"

    },
    school: {  //校长管理
        list: "/train/headMaster/page",
        insert: "/train/headMaster/insert",
        update: "train/headMaster/update"
    },
    class: {
        list: "/train/class/v2/list",
        add: "/train/class/v2/addClass",
        updateClass: "/train/class/v2/updateClass",
        deleteClass: "/train/class/v2/deleteClass",

        detail: "/train/class/v2/detail"

    },
    upLoadImageApi: {
        upLoadImageConfig: 'art/tool/ossAppConfig'
    },
    user: {
        changePwd: "/art/user/changePassword"
    },
    roleManage: {
        trainRoleAdd: "/train/role/add",
        trainRoleMenuSelect: "/train/role/menuSelect",
        trainRolePage: "/train/role/page",
        trainRoleRemove: "/train/role/remove",
        trainRoleUpdate: "/train/role/update",
        trainRoleUpdateMenu: "/train/role/updateMenu"
    },
    userManage: {
        trainAdminAdd: "/train/admin/add",
        trainAdminEnableDisable: "/train/admin/enableDisable",
        trainAdminPage: "/train/admin/page",
        trainAdminResetPassword: "/train/admin/resetPassword",
        trainAdminRoleSelect: "/train/admin/roleSelect",
        trainAdminUpdate: "/train/admin/update"
    },
    order: {
        page: "/train/trainSchoolPurchaseOrder/page",
        operateLog: "/train/trainSchoolPurchaseOrder/operateLog",
        open: "/train/trainSchoolPurchaseOrder/open",
        delaySelect: "/train/trainSchoolPurchaseOrder/delaySelect",
        delay: "/train/trainSchoolPurchaseOrder/delay"
    },
    organ: {
        brandSchoolPage: "/train/school/brandSchoolPage",
        shareInfo: "/train/school/shareInfo",
        getShareInfo: "/teacher/school/shareInfo"
    },
    newNetSchool: {
        //网校绑定
        school: {
            bind: "/school/bind",
            change: "/school/change",
            changeSelect: "/school/changeSelect",
            open: "/school/open",
            reg: "/school/reg",
            unbind: "/school/unbind"
        },
        //素材组
        group: {
            add: "/school/material/group/add",
            page: "/school/material/group/page",
            remove: "/school/material/group/remove",
            update: "/school/material/group/update"
        },
        //素材
        material: {
            add: "/school/material/add",
            checkUploadSize: "/school/material/checkUploadSize",
            groupSelect: "/school/material/groupSelect",
            page: "/school/material/page",
            remove: "/school/material/remove",
            update: "/school/material/update"
        },
        //操作日志
        operate: { page: "/school/operate/log/page" },
        //网校数据组
        schoolGroup: {
            add: "/school/data/group/add",
            groupSelect: "/school/data/group/groupSelect",
            remove: "/school/data/group/remove",
            update: "/school/data/group/update",
            page: "/school/data/group/page",
            removeData: "/school/data/group/removeData",
            bindDataPage: "/school/data/group/bindDataPage",
            bindData: "/school/data/group/bindData"
        },
        //网校数据
        schoolData: {
            add: "/school/data/add",
            changeState: "/school/data/changeState",
            detail: "/school/data/detail",
            page: "/school/data/page",
            remove: "/school/data/remove",
            update: "/school/data/update",
            sysIcon: "/school/material/sysIcon"
        },
        //网校导航
        schoolNavi: {
            detail: "/school/navigation/detail",
            save: "/school/navigation/save"

        },

        //网校主页
        schoolPage: {
            change: "/school/page/change",
            create: "/school/page/create",
            detail: "/school/page/detail",
            edit: "/school/page/edit",
            list: "/school/page/list",
            remove: "/school/page/remove",
            serverDate: "/school/page/serverDate",

        },

        //系统商品
        sysProduct: {
            page: "/school/sysProduct/page"

        },
        //网校订单
        schoolOrder: {
            create: "/school/order/create",
            detail: "/school/order/detail",
            page: "/school/order/page",
            pay: "/school/order/pay",
            remove: "/school/order/remove",
            cancel: "/school/order/cancel"

        },

        //网校用户
        schoolUser: {
            page: "/school/manage/user/page"
        },
        //网校统计

        schoolDataSta: {
            data: "/school/count/data"
        }



    }


}


export default API