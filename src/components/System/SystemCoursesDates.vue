<template>
    <div>
        <div class="systemCoursesDates">
            <el-row>
                <el-button type="primary" icon="el-icon-plus" circle @click="showForm('添加',null)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle @click="del(multipleSelection)"></el-button>
                <span v-show="multipleSelection.length">&nbsp;&nbsp;&nbsp;已选&nbsp;{{multipleSelection.length}}&nbsp;个</span>
                <div class="search">
                    <el-input type="text" v-model="searchData" placeholder="搜索（所属课程）"
                              @keyup.enter.native="search"></el-input>
                    <i class="el-icon-search" @click="search"></i>
                </div>
            </el-row>
            <el-table
                    :data="show"
                    stripe
                    ref="multipleSelection"
                    @selection-change="handleSelectionChange">
                <el-table-column type="selection">
                </el-table-column>
                <el-table-column prop="date" label="名称">
                </el-table-column>
                <el-table-column prop="course" label="所属课程">
                </el-table-column>
                <el-table-column prop="cost" label="消耗">
                    <template scope="scope">{{scope.row.cost}}卡</template>
                </el-table-column>
                <el-table-column prop="minute" label="时长">
                    <template scope="scope">{{scope.row.minute}}分钟</template>
                </el-table-column>
                <el-table-column prop="actions" label="视频数">
                    <template scope="scope">{{scope.row.actions.length}}个</template>
                </el-table-column>
                <el-table-column prop="id" label="操作" width="250">
                    <template scope="scope">
                        <el-button icon="el-icon-search"
                                   @click="showActions(scope.row)"></el-button>
                        <el-button type="primary" icon="el-icon-edit"
                                   @click="showForm('修改',scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete"
                                   @click="del([scope.row])"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <Paging :pages="pages" @func="showList"></Paging>
            <!--点击查看 观看该动作的视频-->
            <div class="bg" v-if="videoShow">
                <div class="background"></div>
                <div class="form">
                    <div class="formHeader">
                        动作：{{courseDateInfo.course}} > {{courseDateInfo.date}}
                        <i class="el-icon-close" @click="close"></i>
                    </div>
                    <el-carousel :interval="5000" arrow="always" :autoplay="false" :loop="false"
                                 indicator-position="none" v-loading="load">
                        <el-carousel-item v-for="(value,index) in actionVideos" :key="index">
                            <span>第{{index+1}}个：{{value.name}}</span>
                            <video :src="value.video" autoplay loop></video>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
            <div class="bg" v-if="formShow">
                <div class="background"></div>
                <div class="form">
                    <div class="formHeader">
                        {{operate}}课程信息
                        <i class="el-icon-close" @click="close"></i>
                    </div>

                    <el-form label-position="right" label-width="80px" :model="courseDateInfo">
                        <el-form-item label="课程名称">
                            <el-select v-model="courseDateInfo.course"
                                       placeholder="请选择课程名"
                                       filterable
                                       :disabled="disable">
                                <el-option
                                        v-for="(value,index) in allCourses"
                                        :key="index"
                                        :label="value.name"
                                        :value="value.name">
                                    <span style="float: left">{{value.name}}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="名称">
                            <el-input v-model="courseDateInfo.date" type="text" placeholder="天数 - 名称"
                                      class="el-input"></el-input>
                        </el-form-item>
                        <el-form-item label="视频">
                            <el-select v-model="courseDateInfo.actions"
                                       filterable
                                       placeholder="请选择"
                                       multiple
                                       collapse-tags
                                       style="width:100%">
                                <el-option
                                        v-for="(value,index) in allActions"
                                        :key="index"
                                        :label="value.name"
                                        :value="value.name">
                                    <span style="float: left">{{value.name}}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="消耗">
                            <el-input v-model="courseDateInfo.cost" type="text" class="el-input"
                                      style="display: inline-block;width: 100px">
                            </el-input>&nbsp;&nbsp;&nbsp;卡
                        </el-form-item>
                        <el-form-item label="时长">
                            <el-input v-model="courseDateInfo.minute" type="text" class="el-input"
                                      style="display: inline-block;width:100px"></el-input>&nbsp;&nbsp;&nbsp;分钟
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm()">提交</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {courseDate, action, course} from "../../api";
    import Paging from "../Paging.vue";
    import {clear} from "../../js/func";

    export default {
        name: "SystemCoursesDates",
        data() {
            return {
                courses: [],
                coursesDates: [],
                pages: 0,
                page: 0,
                show: [],
                disable: false,
                searchData: '',
                multipleSelection: [],
                courseDateInfo: {},
                videoShow: false,
                formShow: false,
                operate: '',
                actionVideos: [],
                load: true,
                allActions: [],
                allCourses:[],
            }
        },
        async created() {
            this.loading('select', null);
            let {data:res} = await action('select',null);
            this.allActions = res;
            let {data:res2} = await course('select',null);
            this.allCourses = res2;
            this.$nextTick(() => {
                $('.systemCoursesDates').css({pointerEvents: 'auto'});
            })
        },
        components: {
            Paging
        },
        methods: {
            async loading(op, param) {
                let {data: res} = await courseDate(op, param);
                if (res) {
                    this.coursesDates = res;
                    for (let index in this.coursesDates){
                        if (!this.coursesDates.hasOwnProperty(index))continue;
                        this.coursesDates[index].actions = this.coursesDates[index].actions.replace(/'/g,'').split('、');
                    }
                }
                this.page = 1;
                this.pages = Math.ceil(this.coursesDates.length / 20);
                this.$nextTick(() => {
                    this.showList(this.page);
                });
            },
            showList(data) {
                this.page = data;
                this.show = [];
                for (let i = 0; i < 20; i++) {
                    let temp = i + (this.page - 1) * 20;
                    if (this.coursesDates[temp] === undefined) {
                        break;
                    }
                    this.show.push(this.coursesDates[temp]);
                }
                this.multipleSelection = [];
            },
            showForm(opera, item) {
                this.formShow = true;
                this.operate = JSON.parse(JSON.stringify(opera));
                if (opera === '修改') {
                    this.courseDateInfo = JSON.parse(JSON.stringify(item));
                }
            },
            async showActions(item) {
                this.courseDateInfo = JSON.parse(JSON.stringify(item));
                this.videoShow = true;
                for (let index in item.actions){
                    if (!item.actions.hasOwnProperty(index))continue;
                    this.courseDateInfo.actions[index] = `'${item.actions[index]}'`;
                }
                let {data: res} = await action('select', {name: this.courseDateInfo.actions.toString()});
                this.actionVideos = res;
                this.$nextTick(() => {
                    this.load = false;
                })
            },
            async search() {
                if (this.searchData) {
                    this.loading('select', {data: this.searchData});
                } else {
                    this.loading('select', null);
                }
            },
            /*添加和修改共用*/
            async submitForm() {
                let operate = this.operate === '添加' ? 'insert' : 'update';
                this.courseDateInfo.actions = this.courseDateInfo.actions.toString().replace(/,/g,'、');
                for (let key in this.courseDateInfo) {
                    if (!this.courseDateInfo.hasOwnProperty(key)) continue;
                    if (!this.courseDateInfo[key] && key !== 'id') {
                        this.$message.error('请填写完全！');
                        return;
                    }
                }
                for (let index in this.coursesDates) {
                    if (!this.coursesDates.hasOwnProperty(index)) continue;
                    if (this.operate === '修改' && this.coursesDates[index].id === this.courseDateInfo.id) {
                        continue;
                    }
                    if (this.courseDateInfo.date === this.coursesDates[index].date &&
                        this.courseDateInfo.course === this.coursesDates[index].course) {
                        this.$message.error('该具体课程信息已存在，请重新上传！');
                        return;
                    }
                }
                this.courseDateInfo.actions = this.courseDateInfo.actions.toString().replace(/,/g,'、');
                let {data: res} = await courseDate(operate, this.courseDateInfo);
                if (res) {
                    this.$message(`${this.operate}成功！`);
                    this.$router.go(0);
                }
            },
            del(delItem) {
                let ids = [];
                let dates = [];
                if (!delItem.length) return;
                for (let index in delItem) {
                    if (!delItem.hasOwnProperty(index)) continue;
                    ids.push(delItem[index].id);
                    dates.push(`"${delItem[index].course}-${delItem[index].date}"`);
                }
                let str = dates.toString().replace(/,/g, '、');
                this.$confirm(`是否确认删除具体课程${str}的信息?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let {data: res} = await courseDate('delete', {id: ids.toString()});
                    if (res) {
                        this.$message(`具体课程${str}的信息已成功删除！`);
                        this.$router.go(0);
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            /*关闭小窗口*/
            close() {
                this.formShow = false;
                this.videoShow = false;
                clear(this.courseDateInfo);
                this.actionVideos = [];
                this.load = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
        }
    }
</script>

<style scoped src="../../css/system.less">
</style>