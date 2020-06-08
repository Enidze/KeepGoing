<template>
    <div>
        <div class="videoCom">
            <video :src="src" @ended="ended" @play="play" id="big-video" :poster="cover" @click="playPause"></video>
            <!--    播放次数 圆形进度条    -->
            <div class="progressBar">
                <el-progress type="circle" :percentage="playedTime*100/time" :format="format"
                             color="#aaa"></el-progress>
            </div>
            <!--    控制条 播放 上一个 下一个  -->
            <div class="controlBar">
                <span class="glyphicon glyphicon-play play_pause" @click="playPause"></span>
                <div class="center">
                    <span class="glyphicon glyphicon-step-backward" @click="backward"></span>
                    <span class="name">{{index+1}}.{{name}}</span>
                    <span class="glyphicon glyphicon-step-forward" @click="forward"></span>
                </div>
            </div>
            <!-- 五秒钟休息界面 -->
            <div class="relax">
                <div class="box1">
                    <video :src="src2" autoplay loop></video>
                    <span class="textRex">休息一下--</span>
                    <div class="progressBar">
                        <el-progress type="circle" :percentage="count*20" :format="format_2" color="#aaa"></el-progress>
                    </div>
                    <span class="textNext">下一个动作：{{name}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Video",
        props: ["curData", "cover"],
        data() {
            return {
                num: this.curData.length,
                index: 0,
                src: "",
                src2: "",
                name: "",
                time: 0,
                playedTime: 0,
                status: "准备",
                count: 0,
                timer: null,
                percent: 0,
            }
        },
        created() {
            this.src = this.curData[this.index].video;
            this.src2 = this.curData[this.index + 1].video;
            this.name = this.curData[this.index].name;
            this.time = parseInt(this.curData[this.index].times);
            this.$nextTick(() => {
                $('.relax').slideUp(0);
                // this.relaxShow();
                $('.el-progress__text').css({color: '#aaa', fontSize: '20px'});
                $('.el-progress-circle').css({width: '100px', height: '100px'});
                this.playedTime = 0;
            });
        },
        methods: {
            format() {
                if (this.status === '') {
                    return this.playedTime + "/" + this.time;
                } else {
                    return this.status;
                }

            },
            format_2() {
                return this.count + 'S';
            },
            playPause() {
                let video = document.querySelector('video');
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                    let btn = document.querySelector('.play_pause');
                    btn.classList.remove("glyphicon-pause");
                    btn.classList.add("glyphicon-play");
                    this.status = "暂停";
                }
                video.poster = null;
            },
            play() {
                if (this.playedTime === 0) {
                    this.playedTime = 1;
                }
                let btn = document.querySelector('.play_pause');
                btn.classList.remove("glyphicon-play");
                btn.classList.add("glyphicon-pause");

                this.status = '';
            },
            ended() {
                let video = document.querySelector('video');
                if (this.playedTime < this.time) {
                    // this.status = this.playedTime+"/"+this.time;
                    this.playedTime += 1;
                    video.play();
                } else {
                    let btn = document.querySelector('.play_pause');
                    btn.classList.remove("glyphicon-pause");
                    btn.classList.add("glyphicon-play");
                    this.index += 1;
                    this.relaxShow();
                    setTimeout(() => {
                        this.refresh();
                    }, 5500);
                }
            },
            relaxShow() {
                $('.connect2').css({transform: ''});
                $('.left2').css({opacity: 0});
                $('.right2').css({opacity: 1});
                /*  判断有下一个的话就在视频播放结束放下来   */
                if (this.judge(this.index)) {
                    $('.relax').slideDown(500);
                } else {
                    return;
                }
                setTimeout(function () {
                    $('.relax').slideUp(500);
                }, 5500);
                /*  文字倒计时   */
                const FIVE_SEC = 5;
                if (!this.timer) {
                    this.count = FIVE_SEC;
                    this.timer = setInterval(() => {
                        if (this.count > 0 && this.count <= FIVE_SEC) {
                            this.count--;
                        } else {
                            clearInterval(this.timer);
                            this.timer = null;
                        }
                    }, 1000);
                }
            },
            backward() {
                if (this.index > 0){
                  this.index -= 1;
                  this.refresh();
                }
            },
            forward() {
              if (this.index < this.curData.length-1){
                this.index += 1;
                this.refresh();
              }
            },
            refresh() {
                let video = document.querySelector('video');
                if (this.judge(this.index)) {
                    this.src = this.curData[this.index].video;
                    if (this.judge(this.index + 1)) {
                        this.src2 = this.curData[this.index + 1].video;
                    }
                    this.name = this.curData[this.index].name;
                    this.time = this.curData[this.index].times;
                    this.playedTime = 0;
                    this.$nextTick(() => {
                        video.play();
                    });
                }
            },
            judge(index) {
                if (index < this.num && index >= 0) {
                    return 1;
                } else {
                    return 0;
                }
            },
        }
    }
</script>

<style scoped lang="less" src="../../css/video.less">
</style>