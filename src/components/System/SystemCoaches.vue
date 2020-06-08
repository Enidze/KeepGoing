<template>
    <div>
        <div class="systemCoaches">
            <el-row>
                <el-button type="primary" icon="el-icon-plus" circle @click="showForm('insert',null)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle @click="del(multipleSelection)"></el-button>
                <span v-show="multipleSelection.length">&nbsp;&nbsp;&nbsp;已选&nbsp;{{multipleSelection.length}}&nbsp;个</span>
                <!--<div class="search">
                    <el-input type="text" v-model="searchData" placeholder="搜索"
                              @keyup.enter.native="search"></el-input>
                    <i class="el-icon-search"></i>
                </div>-->
            </el-row>
            <el-table
                    :data="coaches"
                    stripe
                    ref="multipleTable"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection">
                </el-table-column>
                <el-table-column label="照片" prop="picture" width="200">
                    <template scope="scope">
                        <el-image :src="scope.row.picture" class="w100-h120"></el-image>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="名字" width="200">
                </el-table-column>
                <el-table-column
                        prop="age"
                        label="年龄" width="200">
                    <template scope="scope">
                        <span>{{scope.row.age}}岁</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="courses"
                        label="授课">
                </el-table-column>
                <el-table-column label="操作" prop="id" width="180">
                    <template scope="scope">
                        <el-button type="primary" icon="el-icon-edit"
                                   @click="showForm('update',scope.row.id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="del([coaches[scope.$index]])"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="bg" v-if="formShow">
                <div class="background"></div>
                <div class="form">
                    <div class="formHeader">
                        添加
                        <i class="el-icon-close" @click="close"></i>
                    </div>
                    <el-form label-position="right" label-width="80px" :model="coachInfo">
                        <el-form-item label="姓名">
                            <el-input v-model="coachInfo.name"></el-input>
                        </el-form-item>
                        <el-form-item label="出生年份">
                            <el-date-picker
                                    v-model="coachInfo.age"
                                    type="year"
                                    placeholder="选择年">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="授课">
                            <el-select
                                    v-model="coachInfo.courses"
                                    multiple
                                    collapse-tags
                                    style="margin-left: 20px;"
                                    placeholder="请选择">
                                <el-option
                                        v-for="(item,index) in courses"
                                        :key="index"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="照片">
                            <el-upload class="avatar-uploader"
                                       action="http://localhost:3000/uploader?fileDir=coachImages"
                                       :show-file-list="false"
                                       :on-success="handleAvatarSuccess"
                                       :before-upload="beforeAvatarUpload">
                                <el-image v-if="imageUrl" :src="imageUrl" class="avatar"></el-image>
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
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
    import {coach} from "../../api";
    import {clear, getImageUrlAndCover} from "../../js/func";

    export default {
        name: "SystemCoaches",
        data() {
            return {
                coaches: [],
                searchData: '',
                delNum: 0,
                imageUrl: '',
                coachInfo: {
                    id: '',
                    name: '',
                    age: '',
                    picture: '',
                    courses: ''
                },
                formShow: false,
                courses: ['游泳', '瑜伽', '健身操'],
                operate:'',
                multipleSelection:[],
            }
        },
        async created() {
            let {data: res} = await coach('select', null);
            this.coaches = res;
        },
        methods: {
            showForm(opera, id) {
                this.formShow = true;
                this.operate = opera;
                if (opera === 'update') {
                    for (let index in this.coaches) {
                        if (this.coaches[index].id === id) {
                            this.coachInfo = JSON.parse(JSON.stringify(this.coaches[index]));
                            this.imageUrl = this.coachInfo.picture;
                            this.coachInfo.courses = this.coachInfo.courses.split(',');
                            let date = new Date();
                            let year = date.getFullYear();
                            this.coachInfo.age = 'Fri Jan 01 ' + (year - parseInt(this.coachInfo.age)) + ' 00:00:00 GMT+0800 (中国标准时间)';
                        }
                    }
                }
            },
            async submitForm() {
                let operate = this.operate;
                let date = new Date();
                let year = date.getFullYear();
                this.coachInfo.age = (year - parseInt(this.coachInfo.age.toString().split(' ')[3]).toString());
                if (!this.coachInfo.name || !this.coachInfo.picture || !this.coachInfo.age || !this.coachInfo.courses) {
                    this.$message.error('请填写完全！');
                } else {
                    for (let index in this.coaches) {
                        if (operate === 'update' && this.coaches[index].name === this.coachInfo.name){
                            continue;
                        }
                        if (this.coachInfo.name === this.coaches[index].name) {
                            this.$message.error('该教练信息已存在，请重新填写！');
                            this.clear();
                            return;
                        }
                    }
                    let {data: res} = await coach(operate, this.coachInfo);
                    if (res) {
                        operate === 'insert' ? operate = '添加' : operate = '修改';
                        this.$message({
                            message:`${operate}成功！`,
                            type:"success"
                        });
                        this.$router.go(0);
                    }
                }
            },
            del(delItem){
                let ids = [];
                let names = [];
                for (let index in delItem){
                    ids.push(delItem[index].id);
                    names.push(`"${delItem[index].name}"`);
                }
                let str = names.toString().replace(/,/g,'、');
                this.$confirm(`是否确认删除教练${str}的信息?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let {data:res} = await coach('delete',{id:ids.toString()});
                    if (res){
                        this.$message({
                            message:`教练${str}的信息已成功删除！`,
                            type:"success"
                        });
                        this.$router.go(0);
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            close() {
                this.formShow = false;
                clear(this.coachInfo);
                this.imageUrl = '';
            },
            handleSelectionChange(val){
                this.multipleSelection = val;
            },
            handleAvatarSuccess(res, file) {
                let object = getImageUrlAndCover(res,file,'coachImages');
                this.imageUrl = object.imageUrl;
                this.coachInfo.picture = object.cover;
            },
            beforeAvatarUpload(file) {
                const isJPG = ['image/jpeg', 'image/png'].includes(file.type);
                const isLt = file.size / 1024 / 1024 < 4;
                if (!isJPG) {
                    this.$message.error('教练照片只能是 JPG 和 PNG 格式!');
                }
                if (!isLt) {
                    this.$message.error('教练照片大小不能超过 4MB!');
                }
                return isJPG && isLt;
            },
        }
    }
</script>

<style scoped src="../../css/system.less">

</style>