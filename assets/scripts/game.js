cc.Class({
    extends: cc.Component,

    properties: {
        bg_1: cc.Node,
        bg_2: cc.Node,
        title: cc.Node,
        pause_view: cc.Node,
        game_play: cc.Node,
        hero: cc.Node,
        pre_bulled: cc.Prefab,   //预制体
    },

    onLoad() {
        window.game = this;     //声明一个全局变量，在整个项目中都可以使用，跨js
        this.title.active = true;
        this.pause_view.active = false;
        this.game_play.active = false;
        this.isBgMove = false;
        this.hero.active = false;
        this.bg_1.y = 0;
        this.bg_2.y = this.bg_1.y + this.bg_1.height;
        this.setTouch();
        this.pause_view.zIndex = 2;   //设置层级的优先级，越高则能显示，低的会被覆盖
        this.bulledTime = 0;
        this.bulledPool = new cc.NodePool();   //子弹的对象池

        this.playType = 0;   //0:ready   1:playing  2:pause   3:over
    },

    start() {

    },

    setTouch() {
        this.node.on('touchstart', function (event) {
            this.title.active = false;    //将节点显示与隐藏    active
            this.isBgMove = true;
            this.game_play.active = true;
            this.hero.active = true;
            this.playType = 1;
        }, this);
        this.node.on('touchmove', function (event) {
            var hero_pos = this.hero.getPosition();    //获取节点的位置坐标，相对于父节点的坐标
            var pos_move = event.getDelta();    //获取触摸移动的当前位置
            this.hero.setPosition(cc.v2(hero_pos.x + pos_move.x, hero_pos.y + pos_move.y));   //设置节点位置
        }, this);
        this.node.on('touchend', function (event) {
            // var bulled = cc.instantiate(this.pre_bulled);    //拿到预制体资源   //浪费资源
            // bulled.parent = this.node;      //把预制体放到当前节点上         
            // bulled.setPosition(cc.v2(this.hero.x,this.hero.y + this.hero.height / 2));
        }, this);
        this.node.on('touchcancel', function (event) {

        }, this);
    },

    click(b, a) {
        switch (a) {
            case 'pause':
                this.playType = 2;
                this.isBgMove = false;
                this.pause_view.active = true;
                break;
            case 'continue':
                this.pause_view.active = false;
                this.isBgMove = true;
                this.playType = 1;
                break;
            case 'restart':
                this.pause_view.active = false;
                this.isBgMove = true;
                this.playType = 1;
                break;
            case 'backIndex':
                this.title.active = true;
                this.pause_view.active = false;
                this.game_play.active = false;
                this.playType = 0;
                break;
        }
    },

    setBg() {
        this.bg_1.y = this.bg_1.y - 10;
        this.bg_2.y = this.bg_2.y - 10;
        if (this.bg_1.y <= -this.bg_1.height) {
            this.bg_1.y = this.bg_1.height;
        }
        if (this.bg_2.y <= -this.bg_2.height) {
            this.bg_2.y = this.bg_2.height;
        }
    },
    //  创建对象池
    createBulled() {
        let bulled = null;
        if (this.bulledPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            bulled = this.bulledPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            bulled = cc.instantiate(this.pre_bulled);
            this.bulledPool.put(bulled);
        }
        bulled.parent = this.node;      //把预制体放到当前节点上         
        // bulled.setPosition(this.hero.getPosition());
        var pos = this.hero.getPosition();
        bulled.setPosition(cc.v2(pos.x, pos.y + this.hero.height / 2));
    },
    //回收资源到对象池
    onEnemyKilled: function (bulled) {
        // bulled 应该是一个 cc.Node
        this.bulledPool.put(bulled); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    },

    remove() {
        var children = this.node.children;      //得到节点下的子节点
        for (let i = children.length - 1; i >= 0; i--) {
            var js = children[i].getComponent("bulled");//获得子节点上绑定的js脚本
            if (true) {

            }
        }
    },

    update(dt) {
        if (this.isBgMove) {
            this.setBg();
        }
        this.bulledTime++;
        if (this.bulledTime == 5) {
            this.bulledTime = 0;
            if (this.playType == 1) {
                this.createBulled();
            }
        }
    },
});
