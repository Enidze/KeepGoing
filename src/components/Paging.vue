<template>
    <div>
        <div class="paging" v-if="pages>1">
            <!--分页-->
            <div class="block nav">
                <el-pagination
                        :current-page.sync='page'
                        :page-size='1'
                        background
                        layout="prev, pager, next, jumper"
                        :total="pages">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Paging",
        created() {
            this.page = 1;
        },
        data(){
            return{
                page:0
            }
        },
        props:['pages'],
        watch:{
            /*当当前页变化的时候要做一些操作*/
            page: function () {
                // 在第一页的时候，左边的“<<”要为不能点击
                if (this.page === 1) {
                    $('.left').css({pointerEvents: "none"});
                    $('.right').css({pointerEvents: ""});
                }
                // 在最后一页的时候，右边的“>>”不能点击
                else if (this.page === this.pages) {
                    $('.right').css({pointerEvents: "none"});
                    $('.left').css({pointerEvents: ""});
                }
                // 其他情况下左右两个都能点击（这个一定要写，否则点了第一页或最后一页后再点中间的页，左右两个按钮的属性不会恢复）
                else {
                    $('.right').css({pointerEvents: ""});
                    $('.left').css({pointerEvents: ""});
                }
                /*vue自定义事件实现子向父通信*/
                this.$emit('func',this.page);
            },
        }
    }
</script>

<style scoped src="../css/system.less">

</style>