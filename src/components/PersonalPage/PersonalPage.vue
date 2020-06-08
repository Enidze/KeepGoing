<template>
    <div>
        <div class="personalPage">
            <div class='background'></div>
            <div class="outBox">
                <div class="left">
                    <el-row class="tac sideList">
                        <el-col :span="4">
                            <el-menu
                                    :default-active="$route.fullPath"
                                    class="el-menu-vertical-demo"
                                    text-color="#000"
                                    active-text-color="#D9D9D9"
                                    router>
                                <el-menu-item index="1" disabled class="menuTitle">
                                    <span>个人中心</span>
                                </el-menu-item>
                                <el-menu-item index="/personalPage/home">
                                    <i class="el-icon-video-camera"></i>
                                    <span slot="title">首页</span>
                                </el-menu-item>
                                <el-menu-item index="/personalPage/information">
                                    <i class="el-icon-reading"></i>
                                    <span slot="title">我的信息</span>
                                </el-menu-item>
                                <el-submenu index="1">
                                    <template slot="title">
                                        <i class="el-icon-reading"></i>
                                        <span slot="title">我的收藏</span>
                                    </template>
                                    <el-menu-item-group>
                                        <el-menu-item index="/personalPage/collectCourses">视频收藏</el-menu-item>
                                        <el-menu-item index="/personalPage/collectArticles">文章收藏</el-menu-item>
                                    </el-menu-item-group>
                                </el-submenu>
                                <el-menu-item index="/personalPage/application">
                                    <i class="el-icon-reading"></i>
                                    <span slot="title">我的办理</span>
                                </el-menu-item>

                            </el-menu>
                        </el-col>
                    </el-row>
                </div>
                <div class="right" v-if="userInfo">
                    <router-view
                            :userInfo="userInfo"
                            class="routerView"
                            :key="$route.fullPath">
                    </router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: 'PersonalPage',
    data() {
      return {
      }
    },
    created() {
      this.$nextTick(()=>{
        if (!window.localStorage.user) {
          $(window).attr('location', '/#/home')
        }
      })
    },
    computed:{
      ...mapState(['userInfo']),
    }
  }
</script>

<style scoped src="../../css/personalPage.less">

</style>