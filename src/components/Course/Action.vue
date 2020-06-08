<template>
    <div>
        <div class="action">
            <video :src="action.video" controls autoplay loop></video>
        </div>
        <div class="info">
            <div class="actionInfo">
                <div class="title">
                    <span>
                        {{action.name}}
                    </span>
                </div>
                <div class="info">
                    类型：&nbsp;{{action.type}}
                    <br>
                    级别：&nbsp;{{action.level}}
                </div>
                <div class="info">
                    主要肌肉群：&nbsp;{{action.mainMuscle}}
                    <br>
                    其他肌肉：&nbsp;{{action.otherMuscle}}
                </div>
                <div class="info">
                    &nbsp;
                    <br>
                    器械要求：&nbsp;{{action.equip}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {action} from "../../api";

    export default {
        name: "Action",
        async created() {
            let {data: res} = await action('select', {id: this.id});
            if (res){
                this.action = res[0];
            }

        },
        data(){
            return{
                action:[],
                id:this.$route.path.match(/\/action\/([0-9]*)/)[1]
            }
        }
    }
</script>

<style scoped lang="less">
    .action{
        width: 1200px;
        height: 695px;
        position: relative;
        margin: 0 auto;
        padding: 20px 0 0 0;
        video{
            width: 100%;
            height: 100%;
        }
    }
    .info{
        width: 1200px;
        height: 160px;
        background-color: #ffffff;
        position: relative;
        margin: 0 auto 20px auto;
        color: #444444;
        .actionInfo{
            width: 100%;
            height: 160px;
            background-color: #ffffff;
            position: relative;
            margin: 20px 0;
            .title{
                width: 100%;
                height: 50px;
                border-bottom: 1px solid #ccc;
                opacity: 1;
                span{
                    padding: 0 40px;
                    line-height: 50px;
                    font-size: 20px;
                    opacity: 1;
                    color: black;
                }
            }
            .info{
                width: auto;
                height: 110px;
                display: inline-block;
                padding: 20px 40px;
                line-height: 35px;
                font-size: 15px;
                font-weight: bold;
                margin-right: 60px;
            }
        }
    }
</style>