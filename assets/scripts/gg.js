
cc.Class({
    extends: cc.Component,

    properties: {
        label:cc.Label,//类型为文字
    },

    onLoad () {
        this.timeNum = 5;
        this.label.string = this.timeNum;
        this.schedule((function () {
            this.label.string --;
            if(this.label.string == 0){
                this.goToGame();
            }
        }),1)//计时器。每一秒执行一次
    },

    goToGame(){
        cc.director.loadScene("game");                                //切换场景
    },

    start () {

    },

    // update (dt) {
    //
    // },
});
