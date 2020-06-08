<template>
    <div>
        <div class="system">
            <div class="left" v-if="showPage">
                <el-row class="tac sideList">
                    <el-col :span="4">
                        <el-menu
                                :default-active="$route.fullPath"
                                class="el-menu-vertical-demo"
                                background-color="#555"
                                text-color="#fff"
                                active-text-color="#D9D9D9"
                                unique-opened
                                router>
                            <el-submenu index="1">
                                <template slot="title">
                                    <i class="el-icon-video-camera"></i>
                                    <span>健身视频</span>
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item index="/system/courses">课程信息</el-menu-item>
                                    <el-menu-item index="/system/courses-dates">课程具体信息</el-menu-item>
                                    <el-menu-item index="/system/actions">动作视频信息</el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                            <el-menu-item index="/system/articles">
                                <i class="el-icon-reading"></i>
                                <span slot="title">健身知识</span>
                            </el-menu-item>
                            <el-submenu index="2">
                                <template slot="title">
                                    <i class="el-icon-food"></i>
                                    <span>饮食查询</span>
                                </template>
                                <el-menu-item-group >
                                    <el-menu-item index="/system/foods">饮食信息</el-menu-item>
                                    <el-menu-item index="/system/foodSorts">饮食类别信息</el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                            <el-menu-item index="/system/coaches">
                                <i class="el-icon-s-custom"></i>
                                <span slot="title">教练信息</span>
                            </el-menu-item>
                            <el-menu-item index="/system/users">
                                <i class="el-icon-user"></i>
                                <span slot="title">用户管理</span>
                            </el-menu-item>
                        </el-menu>
                    </el-col>
                </el-row>
            </div>
            <div class="right">
                <router-view class="routerView" :key="$route.fullPath"></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    import router from "../../router";
    export default {
        name: "System",
        router,
        created() {
            window.localStorage.user!=='root'?$(window).attr('location','#/home'):null;
            this.$nextTick(()=>{
                this.showPage = true;
            })
        },
        data(){
            return{
                showPage:false
            }
        }
    }
</script>

<style scoped lang="less">
    .system{
        width: 100%;
        min-height: 1000px;
        background-color: #d9d9d9;
        .left{
            z-index: 2;
            display: inline-block;
            position: fixed;
            height: 100%;
            background-color: #555555;
            .el-menu-vertical-demo{
                width: 250px;
                height: 100%;
                border: 0;
            }
        }
    }
</style>