<template>
    <div>
        <div class="systemFoodSorts">
            <el-row>
                <el-button type="primary" icon="el-icon-plus" circle @click="showForm('添加',null)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle @click="del(multipleSelection)"></el-button>
                <span v-show="multipleSelection.length">&nbsp;&nbsp;&nbsp;已选&nbsp;{{multipleSelection.length}}&nbsp;个</span>
            </el-row>
            <el-table
                    :data="sorts"
                    stripe
                    ref="multipleSelection"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection">
                </el-table-column>
                <el-table-column prop="img" label="图片" width="150">
                    <template scope="scope">
                        <el-image :src="scope.row.img" class="w50-h50"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="类别" width="200">
                </el-table-column>
                <el-table-column prop="belong" label="所属类型">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template scope="scope">
                        <el-button type="primary" icon="el-icon-edit"
                                   @click="showForm('修改',scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete"
                                   @click="del([scope.row])"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="bg" v-if="formShow">
                <div class="background"></div>
                <div class="form">
                    <div class="formHeader">
                        {{operate}}食品信息
                        <i class="el-icon-close" @click="close"></i>
                    </div>
                    <div class="SWContent">
                        <el-form label-position="right" label-width="80px" :model="foodSortsInfo">
                            <el-form-item label="类别名">
                                <el-input type="text" placeholder="请输入类别名" v-model="foodSortsInfo.sort"></el-input>
                            </el-form-item>
                            <el-form-item label="图片">
                                <el-upload class="avatar-uploader"
                                           action="http://localhost:3000/uploader?fileDir=foodSortImages"
                                           :show-file-list="false"
                                           :on-success="handleAvatarSuccess"
                                           :before-upload="beforeAvatarUpload">
                                    <el-image v-if="imageUrl" :src="imageUrl" class="avatar"></el-image>
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="所属类型">
                                <el-select v-model="foodSortsInfo.belong" placeholder="请选择所属类别" class="elsSelect">
                                    <el-option
                                            v-for="(item,index) in allBelongs"
                                            :key="index"
                                            :label="item.text"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm()">提交</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {foodSort} from "../../api";
    import {clear, getImageUrlAndCover} from "../../js/func";

    export default {
        name: "SystemFoodSorts",
        data() {
            return {
                sorts: [],
                multipleSelection: [],
                imageUrl: '',
                belongs: ['餐厅', '食品'],
                formShow: false,
                operate: '',
                foodSortsInfo: {},
                allBelongs: [
                    {text: '餐厅', value: '餐厅'},
                    {text: '食品', value: '食品'}
                ]
            }
        },
        async created() {
            let {data: res} = await foodSort('select', null);
            this.sorts = res;
            this.$nextTick(() => {
                $('.systemFoodSorts').css({pointerEvents: 'auto'});
            })
        },
        methods: {
            showForm(opera, item) {
                this.formShow = true;
                this.operate = opera;
                if (item) {
                    this.foodSortsInfo = item;
                    this.imageUrl = this.foodSortsInfo.img;
                }
            },
            async submitForm() {
                let operate = this.operate === '添加' ? 'insert' : 'update';
                for (let key in this.foodSortsInfo) {
                    if (!this.foodSortsInfo.hasOwnProperty(key)) continue;
                    if (!this.foodSortsInfo[key] && key !== 'id') {
                        this.$message.error('请填写完全！');
                        return;
                    }
                }
                for (let index in this.sorts) {
                    if (!this.sorts.hasOwnProperty(index)) continue;
                    if (operate === 'update' && this.sorts[index].id === this.foodSortsInfo.id) continue;
                    if (this.foodSortsInfo.sort === this.sorts[index].sort) {
                        this.$message.error('该食品信息已存在，请重新填写！');
                        if (operate === 'insert') {
                            clear(this.foodSortsInfo);
                            this.imageUrl = '';
                        } else {
                            this.foodSortsInfo.sort = '';
                        }
                        return;
                    }
                }
                let {data: res} = await foodSort(operate, this.foodSortsInfo);
                if (res) {
                    this.$message({
                        message:`${this.operate}成功！`,
                        type:"success"
                    });
                    this.$router.go(0);
                }
            },
            del(delItem) {
                let ids = [];
                let sorts = [];
                for (let index in delItem) {
                    if (!delItem.hasOwnProperty(index)) continue;
                    ids.push(delItem[index].id);
                    sorts.push(`"${delItem[index].sort}"`);
                }
                let str = sorts.toString().replace(/,/g, '、');
                this.$confirm(`是否确认删除食品类别${str}的信息?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let {data: res} = await foodSort('delete', {id: ids.toString()});
                    if (res) {
                        this.$message({
                            message:`饮食类别${str}的信息已成功删除！`,
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
                clear(this.foodSortsInfo);
                this.imageUrl = '';
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleAvatarSuccess(res, file) {
                let object = getImageUrlAndCover(res,file,'foodSortImages');
                this.imageUrl = object.imageUrl;
                this.foodSortsInfo.img = object.cover;
            },
            beforeAvatarUpload(file) {
                const isJPG = ['image/jpeg', 'image/png'].includes(file.type);
                const isLt = file.size / 1024 / 1024 < 4;
                if (!isJPG) {
                    this.$message.error('饮食类别图片只能是 JPG 和 PNG 格式!');
                }
                if (!isLt) {
                    this.$message.error('饮食类别图片大小不能超过 4MB!');
                }
                return isJPG && isLt;
            },
        }
    }
</script>

<style scoped lang="less" src="../../css/system.less">

</style>