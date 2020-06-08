<template>
    <div>
        <div class="articleList">
            <div class="bigBox row">
                <h3 class="title">{{sort}}</h3>

                <a v-for="value_2 in show" class="page" @click="clickA(value_2)">
                    <img :src="value_2.cover" :alt="value_2.fileName">
                    <span>{{value_2.fileName}}</span>
                    <p>{{value_2.inter}}……</p>
                </a>
            </div>
            <Paging :pages="pages" @func="pagingBack"></Paging>
        </div>
    </div>
</template>

<script>
    import {articles} from "../../api";
    import Paging from "../Paging.vue";
    import {articleHref, showList} from "../../js/func";

    export default {
        name: "ArticleList",
        components:{
            Paging
        },
        data(){
            return{
                sort:decodeURI(this.$route.path.match(/\/knowledge\/(.*)/)[1]),
                articles:'',
                pages:0,
                show:{},
            }
        },
        async created(){
            let {data:res} = await articles('select',{sort:`'${this.sort}'`});
            this.articles = res;
            this.pages = Math.ceil(this.articles.length / 10);
            this.$nextTick(() => {
                this.pagingBack(1);
            });
        },
        methods:{
            pagingBack(data){
                this.show = showList(data,this.articles,10);

            },
            clickA(item){
                articleHref(item.sort,item.id);
            }
        }
    }
</script>

<style scoped lang="less" src="../../css/knowledge.less">

</style>