<template>
    <div class="perHome">
        <div class="perInfo">
            <el-image v-if="userInfo.picture" :src="userInfo.picture" class="avatar"></el-image>
            <i v-else class="el-icon-s-custom avatar"></i>
            <div class="information">
                <div class="bold">
                    {{userInfo.username}}
                    <span v-if="userInfo.gender==='男'" class="boy">♂</span>
                    <span v-if="userInfo.gender==='女'" class="girl">♀</span>
                    <span v-if="userInfo.gender==='保密'" class="no"><i class="el-icon-user"></i></span>
                </div>
                <span v-if="userInfo.height">{{userInfo.height}}CM</span>
                <span v-if="userInfo.weight">{{userInfo.weight}}KG</span>
            </div>
            <el-button @click="perInformation">修改个人信息</el-button>
        </div>
        <div class="collectCourses">
            <div class="header">
                <i class="el-icon-star-on"></i>
                <span>视频收藏</span>
                <span class="more" @click="perCollectCourses">更多</span>
            </div>
            <el-row v-if="userInfo.collectCourses">
                <el-col
                        :span="33"
                        v-for="(info,index) in userInfo.collectCourses" v-if="index<3">
                    <div @click="toCourse(info.id)">
                        <img :src="info.cover" :alt="info.name">
                        <span>{{info.name}}</span>
                    </div>
                </el-col>
            </el-row>
            <span class="noCollect" v-else>您还没有收藏视频哦(*/ω＼*)</span>
        </div>
        <div class="collectArticles">
            <div class="header">
                <i class="el-icon-star-on"></i>
                <span>文章收藏</span>
                <span class="more" @click="perCollectArticles">更多</span>
            </div>
            <el-row v-if="userInfo.collectArticles">
                <el-col
                        :span="33"
                        v-for="(info,index) in userInfo.collectArticles" v-if="index<3">
                    <div @click="toArticle(info.sort,info.id)">
                        <img :src="info.cover" :alt="info.fileName">
                        <span>{{info.fileName}}</span>
                    </div>
                </el-col>
            </el-row>
            <span class="noCollect" v-else>您还没有收藏文章哦(*/ω＼*)</span>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        name: "PerHome",
        methods: {
            perInformation() {
                $(window).attr('location', '/#/personalPage/information');
            },
            perCollectCourses(){
                $(window).attr('location', '/#/personalPage/collectCourses');
            },
            perCollectArticles(){
                $(window).attr('location', '/#/personalPage/collectArticles');
            },
            toCourse(id){
                $(window).attr('location', `/#/courses/${id}-1`);
            },
            toArticle(sort,id){
                $(window).attr('location', `/#/article/${sort}-${id}`);
            }
        },
      computed:{
        ...mapState(['userInfo']),
      }
    }
</script>

<style scoped src="../../css/personalPage.less">

</style>