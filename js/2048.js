var game = {
  data: null,//游戏启动后是一个二维数组，存储每个各地数字
             //属性与方法之间都要用逗号分隔
  RN: 4,//总行数
  CN: 4,//总列数
  score: 0,//保存游戏分数
  state: 0,//保存游戏的状态
  RUNNING: 1,//专门表示游戏正在进行的状态
  GAMEOVER: 0,//专门表示游戏运行结束
  getGridsHtml: function () {//生成所有背景格的html代码
    //r从0开始，到<RN结束，每次增1，同时声明空数组arr
    for (var r = 0, arr = []; r < this.RN; r++) {
      //c从0开始，到<CN结束，每次加1
      for (var c = 0; c < this.CN; c++) {
        arr.push("" + r + c);
        //将""+r+c组合压入arr中
      }
    }
    return '<div id="g' +
      arr.join('" class="grid"></div><div id="g') + '" class="grid"></div>';
  },
  getCellsHtml: function () {//生成所有前景格的html代码
    //r从0开始，到<RN结束，每次增1，同时声明空数组arr
    for (var r = 0, arr = []; r < this.RN; r++) {
      //c从0开始，到<CN结束，每次加1
      for (var c = 0; c < this.CN; c++) {
        arr.push("" + r + c);
        //将""+r+c组合压入arr中
      }
    }
    return '<div id="c' +
      arr.join('" class="cell"></div><div id="c') + '" class="cell"></div>';
  },
  init: function () {//生成所有背景格和前景格，并加入到页面
    var gp = document.getElementById("gridPanel");
    gp.style.width = 116 * this.CN + 16 + "px";
    gp.style.height = 116 * this.RN + 16 + "px";
    console.log(this.getGridsHtml());
    console.log(this.getCellsHtml());
    gp.innerHTML = this.getGridsHtml() + this.getCellsHtml();
  },
  start: function () {//游戏启动方法，游戏启动时调用
    this.init();
    this.state = this.RUNNING;//游戏状态改为启动
    //初始化数组为RN行，CN列的二维数组，所有元素为0
    /*this.data=[
     [0,2,0,2],
     [2,2,4,0],
     [2,0,0,0],
     [0,2,0,0]
     ];*/
    //初始化空数组
    this.data = [];
    for (var r = 0; r < this.RN; r++) {
      this.data[r] = [];//初始化每一行
      for (var c = 0; c < this.CN; c++) {
        this.data[r][c] = 0;//初始化每个格为0
      }
    }
    this.score = 0;//游戏开始时，初始化游戏分数为0
    /*随机生成两个2或4*/
    this.randomNum();
    this.randomNum();
    this.updateView();//将data的数据更新到页面div
  },
  isGameOver: function () {//判断游戏是否结束
    //遍历data中所有元素
    for (var r = 0; r < this.data.length; r++) {
      for (var c = 0; c < this.data[r].length; c++) {
        if (this.data[r][c] == 0) {//如果当前元素值==0
          return false;//返回false
          //否则 如果当前列不是最右侧列，且当前元素等于右侧元素
        } else {
          if (c != this.data[r].length - 1 && this.data[r][c] == this.data[r][c + 1]) {
            return false;//返回false
            //否则 如果当前行不是最后一行，且当前元素等于下方元素
          } else if (r != this.data.length - 1 && this.data[r][c] == this.data[r + 1][c]) {
            return false;//返回false
          }
        }
      }
    }
    this.state = this.GAMEOVER;//（遍历结束）将游戏状态改为GAMEOVER
    return true;//返回true
  },
  randomNum: function () {//随机挑选一个位置，生成2或4
    if (!this.isFull()) {//只有不满，才执行以下所有代码
      while (true) { //反复执行
        //随机生成一个行下标，保存在r中
        var r = parseInt(Math.random() * (this.RN));//最大值this.RN-1,最小值0
        //随机生成一个列下标，保存在c中
        var c = parseInt(Math.random() * (this.CN));
        //如果data中r行c列位置的值==0
        if (this.data[r][c] == 0) {
          //随机生成2或4放入r行c列的元素中
          //如果生成一个随机数<0.5,就放入2,否则放入4
          this.data[r][c] = Math.random() < 0.5 ? 2 : 4;
          break;//退出循环
        }
      }
    }
  },
  isFull: function () {//专门用来判断数组是否已满
//遍历data中每个元素
    for (var r = 0; r < this.data.length; r++) {//或者写r<this.RN
      for (var c = 0; c < this.data[r].length; c++) {
//只要发现当前元素==0
        if (this.data[r][c] == 0) {
          return false//返回false
        }
      }
    }//(遍历结束)返回true
    return true;
  },
//负责将data中每个元素刷到页面中
//并修改页面每个div的class属性
  updateView: function () {
    //遍历data中每个元素
    for (var r = 0; r < this.data.length; r++) {
      for (var c = 0; c < this.data[r].length; c++) {
        //找到页面中和当前元素相同或者对应位置的div
        var div = document.getElementById("c" + r + c);
        //只有当前元素不等于0
        if (this.data[r][c] != 0) {
          //将当前元素值放入div的内容中
          div.innerHTML = this.data[r][c];
          //给div的class穿上和数值对应的衣服
          div.className =
            "cell n" + this.data[r][c];
        } else {//否则，重置div的样式为cell，并清空内容
          div.className = "cell";
          div.innerHTML = "";
        }
      }
    }
    /*将分数写到页面*/
    var span = document.getElementById("score");
    span.innerHTML = this.score;
    //找到#gameover
    var gameover = document.getElementById("gameover");
    if (this.state == this.GAMEOVER) {//如果游戏结束
      var span = document.getElementById("finalScore")
      span.innerHTML = this.score;
      //修改display为block
      gameover.style.display = "block";
    } else {//否则修改display为none
      gameover.style.display = "none";
    }
  },
  moveLeft: function () {//左移动所有行
    var before = this.data.toString();
    for (var r = 0; r < this.data.length; r++) {
      this.moveLeftInRow(r);
    }
    var after = this.data.toString();
    if (before != after) {
      this.randomNum();//每次移动完，随机生成新数
      this.isGameOver();//判断游戏是否结束
      this.updateView();//更新界面
    }

  },
  moveLeftInRow: function (r) {
    for (var c = 0; c < this.data[r].length - 1; c++) {
      //从c开始，找下一个不为0的位置下标nex
      var next = this.getRightNext(r, c);
      //如果next==-1,说明都是0了
      if (next == -1) {
        break;
      }//退出循环
      else {
        if (this.data[r][c] == 0) {
          this.data[r][c] = this.data[r][next];
          this.data[r][next] = 0;
          c--;
        } else if (this.data[r][c] == this.data[r][next]) {
          this.data[r][c] *= 2;
          this.data[r][next] == 0;
          this.score += this.data[r][c];
        }
      }
    }
  },
  getRightNext: function (r, c) {//专门找当前位置右侧下一个
    //从c+1开始遍历之后所有元素
    for (var next = c + 1; next < this.data[r].length; next++) {
      if (this.data[r][next] != 0) {//如果找到!==0的时候
        return next;//返回next
      }
    }//（遍历结束）返回-1
    return -1;
  },
  moveRight: function () {
    var before = this.data.toString();
    for (var r = 0; r < this.data.length; r++) {
      this.moveRightInRow(r);
    }
    var after = this.data.toString();
    if (before != after) {
      this.randomNum();
      this.isGameOver();//判断游戏是否结束
      this.updateView();
    }
  },
  moveRightInRow: function (r) {
    for (var c = this.data[r].length - 1; c > 0; c--) {
      var prev = this.getLeftPrev(r, c);
      if (prev == -1) {
        break;
      }
      else {
        if (this.data[r][c] == 0) {
          this.data[r][c] = this.data[r][prev];
          this.data[r][prev] = 0;
          c++;
          ;
        } else if (this.data[r][c] == this.data[r][prev]) {
          this.data[r][c] *= 2;
          this.data[r][prev] == 0;
          this.score += this.data[r][c];
        }
      }
    }
  },
  getLeftPrev: function (r, c) {
    for (var prevC = c - 1; prevC >= 0; prevC--) {
      if (this.data[r][prevC] != 0) {
        return prevC;
      }
    }
    return -1;
  },
  moveUp: function () {
    var before = this.data.toString();
    for (var c = 0; c < this.CN; c++) {
      this.moveUpInCol(c);
    }
    var after = this.data.toString();
    if (before != after) {
      this.randomNum();//每次移动完，随机生成新数
      this.isGameOver();//判断游戏是否结束
      this.updateView();//更新界面
    }
  },
  moveUpInCol: function (c) {
    for (var r = 0; r < this.data.length - 1; r++) {
      var down = this.getDownNext(r, c);
      if (down == -1) {
        break;
      }
      else {
        if (this.data[r][c] == 0) {
          this.data[r][c] = this.data[down][c];
          this.data[down][c] = 0;
          r--;
        } else if (this.data[r][c] == this.data[down][c]) {
          this.data[r][c] *= 2;
          this.data[down][c] = 0;
          this.score += this.data[r][c];
        }
      }
    }
  },
  getDownNext: function (r, c) {
    for (var downR = r + 1; downR < this.data.length; downR++) {
      if (this.data[downR][c] != 0) {
        return downR;
      }
    }
    return -1;
  },
  moveDown: function () {
    var before = this.data.toString();
    for (var c = 0; c < this.CN; c++) {
      this.moveDownInCol(c);
    }
    var after = this.data.toString();
    if (before != after) {
      this.randomNum();//每次移动完，随机生成新数
      this.isGameOver();//判断游戏是否结束
      this.updateView();//更新界面
    }
  },
  moveDownInCol: function (c) {
    for (var r = this.data.length - 1; r > 0; r--) {
      var up = this.getUpPrev(r, c);
      if (up == -1) {
        break;
      }
      else {
        if (this.data[r][c] == 0) {
          this.data[r][c] = this.data[up][c];
          this.data[up][c] = 0;
          r++;
        } else if (this.data[r][c] == this.data[up][c]) {
          this.data[r][c] *= 2;
          this.data[up][c] = 0;
          this.score += this.data[r][c];
        }
      }
    }
  },
  getUpPrev: function (r, c) {
    for (var upR = r - 1; upR >= 0; upR--) {
      if (this.data[upR][c] != 0) {
        return upR;
      }
    }
    return -1;
  }
}
//当页面加载后window.onload,启动游戏
window.onload = function () {
  game.start();
  //当按下键时
  document.onkeydown = function () {
    if (game.state == game.RUNNING) {//只有游戏运行时才响应按键操作
      var e = window.event || argument[0];
      if (e.keyCode == 37) {
        game.moveLeft();
      } else if (e.keyCode == 39) {
        game.moveRight();
      } else if (e.keyCode == 38) {
        game.moveUp();
      } else if (e.keyCode == 40) {
        game.moveDown();
      }
    }
  }
};