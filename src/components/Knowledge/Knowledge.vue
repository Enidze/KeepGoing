<template>
    <div>
        <div class="knowledge"
             v-loading="loading"
             element-loading-text="课程加载中..请稍后"
             element-loading-spinner="el-icon-loading"
             element-loading-background="#F2F2F2">
            <div v-for="value in sort" class="bigBox row">
                <span class="title">{{value.sort}} <a @click="toMore(value)">更多</a></span>
                <a v-for="value_2 in value.data" class="page" @click="clickA(value_2)">
                    <img :src="value_2.cover" :alt="value_2.fileName">
                    <span>{{value_2.fileName}}</span>
                    <p>{{value_2.inter}}</p>
                </a>
            </div>
        </div>
    </div>

</template>

<script>
    import {articles} from "../../api";
    import {articleHref} from "../../js/func";

    export default {
        name: "Knowledge",
        async created() {
            for (let index in this.sort) {
                if (!this.sort.hasOwnProperty(index)) continue;
                let {data: res} = await articles('select', {sort: `'${this.sort[index].sort}'`});
                for (let i in [0, 1, 2]) {
                    this.sort[index].data.push(res[i]);
                }
            }
            this.$nextTick(() => {
                this.loading = false;
            })
        },
        data() {
            return {
                sort: [
                    {data: [], sort: '增肌'},
                    {data: [], sort: '健身知识'},
                    {data: [], sort: '减肥'},
                    {data: [], sort: '瑜伽'}
                ],
                loading: true
            }
        },
        methods: {
            clickA(item) {
                articleHref(item.sort, item.id);
            },
            toMore(item) {
                $(window).attr('location', `/#/knowledge/${item.sort}`);
            }
        }
    }
</script>

<style scoped lang="less" src="../../css/knowledge.less">

</style>