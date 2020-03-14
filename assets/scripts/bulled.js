cc.Class({
    extends: cc.Component,

    properties: {},

    // onLoad () {},

    start() {

    },

    onCollisionEnter:function(other , self){  //碰撞后会触发的方法
        if(self.tag == 11){                   //tag是引擎提供的，值可以自定义
            game.bulledPool.put(self.node);
        }
        if(other.tag == 1){
            var js = other.node.getComponent("enemy");
            if(js.isDie == false){
                js.die();
            }
        }
        if(other.tag == 2){
            var js = other.node.getComponent("enemy_2");
            if(js.isDie == false){
                js.hit();
            }
        }
        // if(other.tag == 10){
        //     console.log("飞机撞了")
        // }
    },

    update(dt) {
        if (game.playType == 1) {      //game变量是生命的全局变量，见game.js     的  window.game = this;
            this.node.y = this.node.y + 10;
        }
        if(this.node.y >= 560){
            game.putBulledPool(this.node);
        }
    },
});
