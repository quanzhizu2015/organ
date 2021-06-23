import {
  getToken,
  setToken,
  removeToken,
  setUsers
} from "@/utils/auth";
import {
  resetRouter
} from "@/router";
import request from "@/utils/request";
import {
  Message
} from "element-ui";

import Layout from "@/views/layout/index.vue";

const state = {
  token: getToken(),
  userName: "",
  nickname: "",
  loginCode: "",
  imgUrl: "",
  roles: [],
  menu: []
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERNAME: (state, username) => {
    state.userName = username;
  },
  SET_NICKNAME: (state, nickname) => {
    state.nickname = nickname;
  },
  SET_IMGURL: (state, imgUrl) => {
    state.imgUrl = imgUrl;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_MENU: (state, menu) => {
    state.menu = menu;
  },
  SET_LOGINCODE: (state, loginCode) => {
    state.loginCode = loginCode;
  }
};

const actions = {
  login({
    commit
  }, data) {
    return new Promise((resolve, reject) => {
      request({
        // url: "/auth/admin",
        url: "art/user/trainLogin",
        method: "post",
        data: {
          // username: data.username.trim(),
          // password: data.password
          phone: data.username,
          type: 2,
          password: data.password,
          // authCode: "666666",
          device: "pc",
          isOrgan: 1,
          imgCode: data.imgCode,
          imgCodeKey: data.imgCodeKey,
        }
      }).then(response => {
        console.log(response.code)
        if (response.code === "0") {
          // console.log(response)
          commit("SET_TOKEN", response.data.token);
          commit("SET_USERNAME", response.data.user.userName);
          commit("SET_IMGURL", response.data.user.imgUrl);
          commit("SET_MENU", response.data.menu);
          commit("SET_LOGINCODE", response.data.user.loginCode);
          commit("SET_ROLES", null);
          setToken(response.data.token);
          localStorage.setItem("user_name", response.data.user.userName);
          localStorage.setItem("user_avatar", response.data.user.imgUrl);
          localStorage.setItem("user_loginCode", response.data.user.loginCode);
          //if(response.data.user.usedSchool){
          localStorage.setItem("school_id", response.data.user.usedSchool.id)
          //}

          localStorage.setItem("currentSchoolId", response.data.user.usedSchool.currentSchoolId)
          localStorage.setItem("currentSchoolType", response.data.user.usedSchool.type)// 1机构  2网校

          localStorage.setItem("menu", JSON.stringify(response.data.menu))

          console.log(response.data.user.loginCode)

          resolve(response);
        } else {
          // console.log('response.message')
          Message.error(response.message);
          reject();
        }
      })
        .catch(error => {
          reject(error);
        });
    });
  },

  getInfo({
    commit
  }) {
    return new Promise((resolve, reject) => {
      commit("SET_ROLES", ["admin"]);
      resolve({
        roles: ["admin"],
        routes: [{
          path: "*",
          alwaysShow: true,
          component: Layout,
          redirect: "/404",
          hidden: true
        }]
      });

      // request({
      //   url: "/admin/admin/info",
      //   method: "get"
      // }).then(response => {
      //   // roles must be a non-empty array
      //   if (!response.roles || response.roles.length <= 0) {
      //     reject("该角色不存在");
      //   }

      //   commit("SET_ROLES", response.roles);
      //   commit("SET_USERNAME", response.username);
      //   commit("SET_NICKNAME", response.nickname);
      //   resolve(response);
      // }).catch(error => {
      //   reject(error);
      // });
    });
  },

  logout({
    commit,
    dispatch
  }) {
    return new Promise((resolve) => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      commit("SET_MENU", []);
      localStorage.removeItem("currentSchoolId")
      removeToken();
      resetRouter();
      // dispatch("tagsView/delAllViews", null, {
      //   root: true
      // });
      resolve();
    });
  },
  //
  upDateInfo({
    commit
  }, data) {
    return new Promise(resolve => {
      commit("SET_USERNAME", data.userName);
      commit("SET_IMGURL", data.imgUrl);
    });

  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      commit("SET_MENU", []);
      removeToken();
      resolve();
    });

  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};