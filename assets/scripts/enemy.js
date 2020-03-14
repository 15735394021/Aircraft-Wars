
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        this.init();
    },

    init(){
        this.isDie = false;
        var anim = this.getComponent(cc.Animation);//拿到这个节点上的动画    getConponent方法
        anim.play("enemyNormal");
    },

    onCollisionEnter:function(other , self){  //碰撞后会触发的方法
        // if(self.tag == 1){
        //     game.enemyPool.put(self.node);
        // }
    },

    die(){
        this.isDie = true;
        var anim = this.getComponent(cc.Animation);//拿到这个节点上的动画    getConponent方法
        anim.play("enemy");     //播放制定动画，因为一个节点上可能有多个动画，。。。。死亡动画，移动动画。。。
        anim.over = function () {
            game.enemyPool.put(this.node);
        }
    },

    start () {

    },

    update (dt) {
        if(this.isDie){
            return;
        }
        if (game.playType == 1) {
            this.node.y = this.node.y - 2;
        }
        if(this.node.y <= -654){
            game.enemyPool.put(this.node);
        }
    },
});
