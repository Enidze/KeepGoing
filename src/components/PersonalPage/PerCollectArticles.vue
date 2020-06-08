<template>
    <div>
        <div class="perCollectArticles">
            <div class="header">
                <span>文章收藏</span>
            </div>
            <!--批量删除-->
            <div class="batchCancel">
                <el-button
                        class="btnBatchCancel"
                        v-if="btnShow"
                        @click="showBtn">
                    批量操作
                </el-button>
                <div v-else>
                    <el-checkbox
                            :indeterminate="isIndeterminate"
                            v-model="checkAll"
                            @change="handleCheckAllChange">
                        全选
                    </el-checkbox>
                    <span>已选{{cancelList.length}}个</span>
                    <el-button
                            class="btnCancel"
                            :disabled="btnCancelDisabled"
                            @click="cancelCollect(cancelList)">
                        取消收藏
                    </el-button>
                    <el-button
                            class="btnBack"
                            @click="showBtn">
                        返回
                    </el-button>
                </div>
            </div>
            <el-row v-if="userInfo.collectArticles">
                <el-col
                        :span="33"
                        v-for="(info,index) in userInfo.collectArticles">
                    <el-checkbox
                            v-if="!btnShow"
                            v-model="checked[index]"
                            @change="handleCheckedChange">
                    </el-checkbox>
                    <div @click="toArticle(info.id,info.sort)">
                        <img :src="info.cover" :alt="info.name">
                        <span>{{info.fileName}}</span>
                        <el-dropdown @command="cancelCollect([info.id])">
                            <i class="el-icon-more el-icon--right"></i>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="info.id">取消收藏</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </el-col>
            </el-row>
            <span class="noCollect" v-else>您还没有收藏文章哦(*/ω＼*)</span>
        </div>
    </div>
</template>

<script>
    import {userCollect} from "../../api";
    import { mapState } from 'vuex'
    import { collect } from '../../js/func'

    export default {
        name: "PerCollectArticles",
        data() {
            return {
                isIndeterminate: false,
                checkAll: false,
                checked: [], /*1 作为监听对象来响应改变cancelList的值*/
                cancelList: [], /*1 已选X个 2 作为删除多个传入的参数*/
                btnCancelDisabled: true,
                btnShow: true
            }
        },
        methods: {
            toArticle(id, sort) {
                $(window).attr('location', `/#/article/${sort}-${id}`);
            },
            /*1 遍历所有collectArticles 把id添加到newIdList中
            * 2 遍历传入的参数idList
            * 3 找到相同的 从newIdList中删除*/
            async cancelCollect(idList){
                let {data: res} = await userCollect('collectArticles', {
                    id: collect(this.userInfo.collectArticles,false,idList),
                    username: window.localStorage.user
                });
                if (res) {
                    this.$message('已取消收藏');
                    this.$router.go(0);
                }
            },
            /*点击“取消收藏” “返回”
            * 每次点击的时候都把cancelList清空 checked全为false 全选按钮为false*/
            showBtn() {
                this.btnShow ? this.btnShow = false : this.btnShow = true;
                this.cancelList = [];
                for (let index in this.userInfo.collectArticles) {
                    if (!this.userInfo.collectArticles.hasOwnProperty(index)) continue;
                    this.checked[index] = false;
                }
                this.checkAll = false;
            },
            /*点全选
            *全选： 把所有id加到cancelList中 checked全为true
            * 取消全选： cancelList清空 checked全为false*/
            handleCheckAllChange(val) {
                for (let index in this.userInfo.collectArticles) {
                    if (!this.userInfo.collectArticles.hasOwnProperty(index)) continue;
                    if (val){
                        this.cancelList.push(this.userInfo.collectArticles[index].id);
                        this.checked[index] = val;
                    }else {
                        this.cancelList = [];
                        this.checked[index] = val;
                    }
                }
            },
            /*一个一个选
            *1 每次点击的时候斗仙清空cancelList
            * 2 判断checked列表中那些值为true
            * 3 把值为true的对应的id添加到cancelList中*/
            handleCheckedChange() {
                this.cancelList = [];
                for (let index in this.checked) {
                    if (!this.checked.hasOwnProperty(index)) continue;
                    if (this.checked[index]) {
                        this.cancelList.push(this.userInfo.collectArticles[index].id);
                    }
                }
            }
        },
        computed: {
          ...mapState(['userInfo']),
            /*要监听多个值*/
            dateRange() {
                const {checked, checkAll} = this;
                return {
                    checked,
                    checkAll
                }
            }
        },
        watch: {
            /*1 是否至少有一个选中
            * 2 是否全选*/
            dateRange: function () {
                let flag = true;
                let leastOne = false;
                for (let index in this.checked) {
                    if (!this.checked.hasOwnProperty(index)) continue;
                    /*有一个选中*/
                    if (this.checked[index]) {
                        leastOne = true;
                    }else {
                        flag = false;
                    }
                }
                this.btnCancelDisabled = !leastOne;
                this.checkAll = flag;
            }
        }
    }
</script>

<style scoped src="../../css/personalPage.less">

</style>