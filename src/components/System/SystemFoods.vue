<template>
    <div>
        <div class="systemFoods">
            <el-row>
                <el-button type="primary" icon="el-icon-plus" circle @click="showForm('添加',null)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle @click="del(multipleSelection)"></el-button>
                <span v-show="multipleSelection.length">&nbsp;&nbsp;&nbsp;已选&nbsp;{{multipleSelection.length}}&nbsp;个</span>
                <div class="search">
                    <el-input type="text" v-model="searchData" placeholder="搜索（食品名）"
                              @keyup.enter.native="search"></el-input>
                    <i class="el-icon-search" @click="search"></i>
                </div>
            </el-row>
            <el-table
                    :data="show"
                    stripe
                    ref="multipleSelection"
                    @selection-change="handleSelectionChange"
                    @filter-change="filterTagTable">
                <el-table-column
                        type="selection">
                </el-table-column>
                <el-table-column prop="img" label="图片" width="150">
                    <template scope="scope">
                        <el-image :src="scope.row.img" class="w50-h50"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="cost" label="热量" width="200px">
                    <template scope="scope">{{scope.row.cost}}大卡 / 100克</template>
                </el-table-column>
                <el-table-column
                        prop="sort"
                        label="类别"
                        :filters="list.sort"
                        :filter-multiple="false"
                        column-key='sort'
                        filter-placement="bottom-end"
                        width="250px">
                    <template slot-scope="scope">
                        <el-tag v-for="sort in scope.row.sort"
                                disable-transitions>{{sort}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="食品名">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template scope="scope">
                        <el-button type="primary" icon="el-icon-edit"
                                   @click="showForm('修改',scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete"
                                   @click="del([show[scope.$index]])"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Paging :pages="pages" @func="pagingBack"></Paging>
            <div class="bg" v-if="formShow">
                <div class="background"></div>
                <div class="form">
                    <div class="formHeader">
                        {{operate}}食品信息
                        <i class="el-icon-close" @click="close"></i>
                    </div>
                    <el-form label-position="right" label-width="80px" :model="foodInfo">
                        <el-form-item label="食品名">
                            <el-input v-model="foodInfo.name"></el-input>
                        </el-form-item>
                        <el-form-item label="热量">
                            <template>
                                <el-input v-model="foodInfo.cost" placeholder="大卡 / 100克"></el-input>
                            </template>
                        </el-form-item>
                        <el-form-item label="类别">
                            <el-select
                                    v-model="foodInfo.sort"
                                    multiple
                                    collapse-tags
                                    placeholder="请选择（两个及以下）"
                                    multiple-limit="2">
                                <el-option
                                        v-for="(item,index) in list.sort"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="图片">
                            <el-upload class="avatar-uploader"
                                       action="http://localhost:3000/uploader?fileDir=foodImages"
                                       :show-file-list="false"
                                       :on-success="handleAvatarSuccess"
                                       :before-upload="beforeAvatarUpload">
                                <el-image v-if="imageUrl" fit="cover" :src="imageUrl" class="avatar"></el-image>
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
    import {foodSort, food} from "../../api";
    import Paging from "../Paging.vue";
    import {getImageUrlAndCover,showList,filter} from "../../js/func.js";
    import {clear} from "../../js/func";

    export default {
        name: "SystemFoods",
        data() {
            return {
                foods: [],
                show: [],
                page: 0,
                pages: 0,
                searchData: '',
                formShow: false,
                foodInfo:{},
                imageUrl: '',
                multipleSelection:[],
                operate:'',
                list:{
                    sort:[]
                }
            }
        },
        components: {
            Paging
        },
        async created() {
            this.loading('select', null);
            let {data: res} = await foodSort('select', null);
            if (res){
                for (let i in res) {
                    if (!res.hasOwnProperty(i))continue;
                    this.list.sort.push({text:res[i].sort,value:res[i].sort});
                }
            }
            this.$nextTick(()=>{
                $('.systemFoods').css({pointerEvents: 'auto'});
            })
        },
        methods: {
            async loading(op, param) {
                let {data: res} = await food(op, param);
                if (res) {
                    this.foods = res;
                    for (let index in this.foods){
                        if (!this.foods.hasOwnProperty(index))continue;
                        this.foods[index].sort = this.foods[index].sort.split(',');
                    }
                }
                this.page = 1;
                this.pages = Math.ceil(this.foods.length / 20);
                this.$nextTick(() => {
                    this.pagingBack(this.page);
                });
            },
            pagingBack(data) {
                this.show = showList(data,this.foods,20);
                this.multipleSelection = [];
            },
            showForm(opera, item) {
                this.formShow = true;
                this.operate = opera;
                if (item) {
                    this.foodInfo = JSON.parse(JSON.stringify(item));
                    this.imageUrl = this.foodInfo.img;
                }
            },
            async search() {
                this.loading('select', this.searchData?{data: this.searchData}:null);
            },
            async submitForm() {
                let operate = this.operate === '添加' ? 'insert' : 'update';
                for (let key in this.foodInfo) {
                    if (!this.foodInfo.hasOwnProperty(key)) continue;
                    if (!this.foodInfo[key] && key !== 'id') {
                        this.$message.error('请填写完全！');
                        return ;
                    }
                }
                for (let index in this.foods) {
                    if (!this.foods.hasOwnProperty(index)) continue;
                    if (operate === 'update' && this.foods[index].name === this.foodInfo.name) continue;
                    if (this.foodInfo.name === this.foods[index].name) {
                        this.$message.error('该食品信息已存在，请重新填写！');
                        if (operate === 'insert'){
                            clear(this.foodInfo);
                            this.imageUrl = '';
                        }else {
                            this.foodInfo.name = '';
                        }
                        return;
                    }
                }
                let {data: res} = await food(operate, this.foodInfo);
                if (res) {
                    this.$message(`${this.operate}成功！`);
                    this.$router.go(0);
                }
            },
            del(delItem) {
                let ids = [];
                let names = [];
                for (let index in delItem) {
                    if (!delItem.hasOwnProperty(index)) continue;
                    ids.push(delItem[index].id);
                    names.push(`"${delItem[index].name}"`);
                }
                let str = names.toString().replace(/,/g, '、');
                this.$confirm(`是否确认删除食品${str}的信息?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let {data: res} = await food('delete', {id: ids.toString()});
                    if (res) {
                        this.$message({
                            message:`食品${str}的信息已成功删除！`,
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
            filterTagTable(filters) {
                this.loading('select', filter(filters,this.list,{sort:''}));
            },
            close() {
                this.formShow = false;
                clear(this.foodInfo);
                this.imageUrl = '';
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleAvatarSuccess(res, file) {
                let object = getImageUrlAndCover(res,file,'foodImages');
                this.imageUrl = object.imageUrl;
                this.foodInfo.img = object.cover;
            },
            beforeAvatarUpload(file) {
                const isJPG = ['image/jpeg', 'image/png'].includes(file.type);
                const isLt = file.size / 1024 / 1024 < 4;
                if (!isJPG) {
                    this.$message.error('饮食图片只能是 JPG 和 PNG 格式!');
                }
                if (!isLt) {
                    this.$message.error('饮食图片大小不能超过 4MB!');
                }
                return isJPG && isLt;
            },
        }
    }
</script>

<style scoped src="../../css/system.less">

</style>