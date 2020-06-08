<template>
    <div>
        <div class="systemUsers">
            <el-row>
                <div class="search">
                    <el-input type="text" v-model="searchData" placeholder="搜索（名字）"
                              @keyup.enter.native="search"></el-input>
                    <i class="el-icon-search" @click="search"></i>
                </div>
            </el-row>
            <el-table :data="users">
                <el-table-column prop="username" label="账号名">
                </el-table-column>
                <el-table-column prop="applyName" label="名字">
                </el-table-column>
                <el-table-column prop="applyDuration" label="期效">
                    <template scope="scope">{{scope.row.applyDuration}}个月</template>
                </el-table-column>
                <el-table-column prop="applyIsCoach" label="是否选择教练">
                    <template scope="scope">{{scope.row.applyIsCoach==='true'?'是':'否'}}</template>
                </el-table-column>
                <el-table-column prop="applyCost" label="费用">
                </el-table-column>
                <el-table-column
                        :filters="[{ text: '是', value: '是' }, { text: '否', value: '否' }]"
                        :filter-method="filterTag"
                        filter-placement="bottom-end"
                        :filter-multiple="false"
                        prop="applyDate"
                        label="是否确认">
                    <template scope="scope">
                        {{IsOverdue(scope.row)}}
                    </template>
                </el-table-column>
                <el-table-column prop="applyId" label="编号">
                    <template scope="scope">{{scope.row.applyId}}</template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template scope="scope">
                        <el-button type="primary"
                                   @click="confirm(scope.row)" :disabled="!!scope.row.applyDate">确认
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {userConfirm, userInfo} from "../../api";
    import {overdue} from "../../js/func";

    export default {
        name: "SystemUsers",
        data() {
            return {
                users: [],
                searchData:''
            }
        },
        async created() {
            let {data: res} = await userInfo('systemSelect', null);
            for (let index in res) {
                if (!res.hasOwnProperty(index))continue;
                if (res[index].applyName) {
                    this.users.push(res[index]);
                }
            }
        },
        methods: {
            confirm(userInfo) {
                this.$alert(`是否确认用户${userInfo.applyName}(账号名：${userInfo.username})已缴费？`, '确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(async () => {
                    let now = new Date();
                    let year = now.getFullYear();
                    let month = now.getMonth()+1;
                    let date = now.getDate();
                    userInfo.applyDate = `${year}.${month < 10 ? '0' + month : month}.${date}`;
                    let deadlineMonth = now.getMonth() + 1 + parseInt(userInfo.applyDuration);
                    if (deadlineMonth>12){
                        year += 1;
                        deadlineMonth -= 12;
                    }
                    if (deadlineMonth<10){
                        deadlineMonth = '0' + deadlineMonth;
                    }
                    userInfo.applyDeadline = `${year}.${deadlineMonth}.${date}`;
                    if (!userInfo.applyId) {
                        userInfo.applyId = `${userInfo.applyDate}${'0'.repeat(4 - userInfo.id.toString().length)}${userInfo.id}${Math.floor(Math.random() * 100 + 1)}`.replace(/\./g, '');
                    }
                    console.log(userInfo.applyDate, userInfo.applyDeadline, userInfo.applyId);
                    let {data: res} = await userConfirm(userInfo);
                    if (res === 'success') {
                        this.$message({
                            type: 'success',
                            message: '已成功确认!'
                        });
                        this.$router.go(0);
                    }
                });
            },
            async search(){
                let {data:res} = await userInfo('systemSelectByName',{applyName:this.searchData});
                if (res){
                    this.users = res;
                }
            },
            filterTag(value, row) {
                if (row.applyDate){
                    return '是' === value;
                }
            },
        },
        computed: {
            IsOverdue() {
                return function(userInfo){
                    if (userInfo.applyDate){
                        if (overdue(userInfo.applyDeadline)){
                            return '(已过期)';
                        }else {
                            return `是(${userInfo.applyDate})`;
                        }
                    }else {
                        return '否';
                    }
                }
            }
        }
    }
</script>

<style scoped src="../../css/system.less">

</style>