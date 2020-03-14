
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        this.init();
    },

    init(){
        this.hp = 3;
        this.isDie = false;
        var anim = this.getComponent(cc.Animation);//拿到这个节点上的动画    getConponent方法
        anim.play("enemy_2Normal");
    },

    hit(){
        this.hp--;
        if(this.hp <= 0){
            this.die();
            return;
        }
        var anim = this.getComponent(cc.Animation);//拿到这个节点上的动画    getConponent方法
        anim.play("enemy_2Hit");
        anim.hited = function () {
            var anim = this.getComponent(cc.Animation);//拿到这个节点上的动画    getConponent方法
            anim.play("enemy_2Normal");
        }
    },

    die(){
        this.isDie = true;
        var anim = this.getComponent(cc.Animation);//拿到这个节点上的动画    getConponent方法
        anim.play("enemy_2");     //播放制定动画，因为一个节点上可能有多个动画，。。。。死亡动画，移动动画。。。
        anim.over_2 = function () {
            game.enemy_2Pool.put(this.node);
        }
    },

    start () {

    },

    update (dt) {
        if(this.isDie){
            return;
        }
        if (game.playType == 1) {
            this.node.y = this.node.y - 1.5;
        }
        if(this.node.y <= -654){
            game.enemy_2Pool.put(this.node);
        }
    },
});