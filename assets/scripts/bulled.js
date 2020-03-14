cc.Class({
    extends: cc.Component,

    properties: {},

    // onLoad () {},

    start() {

    },

    update(dt) {
        if (game.playType == 1) {      //game变量是生命的全局变量，见game.js     的  window.game = this;
            this.node.y = this.node.y + 10;
        }
    },
});
