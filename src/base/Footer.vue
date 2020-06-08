<template>
    <div class="footer">
        <div class="copy">
            <p>地址：广东省江门市蓬江区东城村55号伊泽健身房</p>
            <p>联系方式：13630443873</p>
            <p>Copyright (C) 广州伊泽科技有限公司</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Footer"
    }
</script>

<style scoped lang="less">
    .footer{
        position: relative;
        z-index: 2;
        width: 100%;
        background-color: #000;
        .copy{
            padding: 50px 0;
            width: 100%;
            color: #777777;
            text-align: center;
            p{
                margin: auto;
                line-height: 20px;
            }
        }
    }
</style>