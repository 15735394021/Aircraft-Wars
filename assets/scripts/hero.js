
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        this.isDid = false;
    },

    onCollisionEnter:function(other , self){  //碰撞后会触发的方法
        if(self.tag == 10 && this.isDid == false){
            this.idDid = true;
            this.die();
        }
    },

    init(){
        this.isDid = false;
        this.node.active = true;
        var anim = this.getComponent(cc.Animation);//拿到这个节点上的动画    getConponent方法
        anim.play("heroNormal");
    },

    die(){
        var anim = this.getComponent(cc.Animation);//拿到这个节点上的动画    getConponent方法
        anim.play("heroDid");
        anim.game_over = function () {
            game.playType = 3;
            this.isDid = true;
            this.node.active = false;
        }.bind(this)
    },

    start () {

    },

    // update (dt) {},
});
