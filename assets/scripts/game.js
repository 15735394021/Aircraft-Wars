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
        pre_enemy:cc.Prefab,
        pre_enemy_2:cc.Prefab,
    },

    onLoad() {
        cc.director.getCollisionManager().enabled = true;   //开启碰撞检测

        window.game = this;     //声明一个全局变量，在整个项目中都可以使用，跨js
        this.randomNum = [30,60,90];
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
        this.enemyTime = 0;
        // this.schedule((function () {     //计时器
        //     this.createEnemy(2);
        // }),2)
        this.bulledPool = new cc.NodePool();   //子弹的对象池
        this.enemyPool = new cc.NodePool();    //敌机的对象池
        this.enemy_2Pool = new cc.NodePool();    //敌机2的对象池

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
            this.hero.active = true;
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
                this.removeBulled() ;
                this.removeAllEnemy();
                this.hero.setPosition(cc.v2(0,-350));//飞机的初始化位置
                var js = this.hero.getComponent("hero");
                if(js){
                    js.init();
                }
                break;
            case 'backIndex':
                this.title.active = true;
                this.pause_view.active = false;
                this.game_play.active = false;
                this.playType = 0;
                this.removeBulled();
                this.removeAllEnemy();
                this.hero.setPosition(cc.v2(0,-350));//飞机的初始化位置
                var js = this.hero.getComponent("hero");
                if(js){
                    js.init();
                }
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
        }
        bulled.parent = this.node;      //把预制体放到当前节点上         
        // bulled.setPosition(this.hero.getPosition());
        var pos = this.hero.getPosition();
        bulled.setPosition(cc.v2(pos.x, pos.y + this.hero.height / 2));
    },
    //创建敌机的对象池
    createEnemy(enemyType) {
        let enemy = null;
        var str = '';
        var pos_enemy = cc.v2(0,0);
        if(enemyType == 1){//创建敌机1
            if (this.enemyPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                enemy = this.enemyPool.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                enemy = cc.instantiate(this.pre_enemy);
            }
            str = "enemy";
            // pos_enemy.x = -320 + Math.random() * 640;
            // pos_enemy.y = 320 + Math.random() * 640;
        }else if(enemyType == 2){
            if (this.enemy_2Pool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                enemy = this.enemy_2Pool.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                enemy = cc.instantiate(this.pre_enemy_2);
            }
            str = "enemy_2";
        }else{
            if (this.enemyPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                enemy = this.enemyPool.get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                enemy = cc.instantiate(this.pre_enemy);
            }
            str = "enemy";
        }
        enemy.parent = this.node;      //把预制体放到当前节点上
        var js = enemy.getComponent(str);
        if(js){
            js.init();
        }
        var pos = cc.v2(-320 + Math.random() * 640,666);
        enemy.setPosition(pos);
    },
    //移除子弹
    putBulledPool (bulled){
        this.bulledPool.put(bulled);//把对象放回到对象池里
    },

    putEnemyPool(enemy,enemtType){
        if(enemtType ==1){
            this.enemyPool.put(enemy);
        }else if(enemtType == 2){
            this.enemy_2Pool.put(enemy);
        }
    },

    removeAllEnemy(){
        var children = this.node.children;      //得到节点下的子节点
        for (let i = children.length - 1; i >= 0; i--) {
            if (children[i].getComponent("enemy")) {
                this.enemyPool.put(children[i]);
            }else if (children[i].getComponent("enemy_2")) {
                this.enemy_2Pool.put(children[i]);
            }
        }
    },

    removeBulled() {
        var children = this.node.children;      //得到节点下的子节点
        for (let i = children.length - 1; i >= 0; i--) {
            var js = children[i].getComponent("bulled");//获得子节点上绑定的js脚本  bulled是脚本的名字
            if (js) {
                this.putBulledPool(children[i]);
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
        this.enemyTime++;
        if(this.enemyTime == 120){
            this.enemyTime = 0;
            if (this.playType == 1) {
                var num = Math.random() * 100;
                if(num < this.randomNum[0]){
                    this.createEnemy(1);
                }else if(num < this.randomNum[1]){
                    this.createEnemy(2);
                }else if(num < this.randomNum[2]){
                    this.createEnemy(3);
                }
            }
        }
    },
});
