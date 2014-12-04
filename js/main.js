	var Ball = extendedSprite.create();
	Ball.prototype.m_pathIndex = 0;
	Ball.prototype.m_path = [];
	Ball.prototype.m_stop = false;
	Ball.prototype.m_calcing = false;
	Ball.prototype.setPath = function(path)
	{
		this.m_path = path;
	}
	
	Ball.prototype.init = function()
	{
		this.m_path = [];
		this.m_pathIndex = 0;
	}
	
	Ball.prototype.reCalc = function()
	{
		if(this.m_calcing)
			return false;
		
		this.m_calcing = true;
		initMaze();
		this.init();
		this.m_path = nextStep();
		this.m_stop = false;
		this.m_calcing = false;
	}
	
	Ball.prototype.update = function()
	{
		if(this.m_path.length > 0 && !this.m_stop)
		{
			this.frame++;
			this.dx = this.m_path[this.m_pathIndex].x * blockSize;
			this.dy = this.m_path[this.m_pathIndex].y * blockSize;
			
			this.rotateVal = Math.atan2(this.dy - this.y, this.dx - this.x) * 180/Math.PI;
			this.x += 4*Math.cos(this.rotateVal/180*Math.PI);
			this.y += 4*Math.sin(this.rotateVal/180*Math.PI);
			
			if(Math.pow( (Math.ceil(this.x)-this.dx) , 2) + Math.pow( (Math.ceil(this.y)-this.dy) , 2) < blockSize)
			{
				this.m_pathIndex = ++this.m_pathIndex%this.m_path.length;
				if(this.m_pathIndex == 0)
				{
					this.m_stop = true;

					start = new Point(0, 0);
					this.reCalc();
					this.x = this.m_path[0].x;
					this.y = this.m_path[0].y;
					
				}
			}
		}
	}
	
	var goalHole;
	var ball;
	var Wall = extendedSprite.create();
	var walls = [];
	var touchPos = new Point();
	var isCalculating = false;
	
	var Node = CustomClass.create(function(str, x, y)
	{
		
		var s    = arguments[0][0];
		var xx   = arguments[0][1];
		var yy   = arguments[0][2];
		this.str = s;
		this.x = xx;
		this.y = yy;
		this.gs = 65536;
		this.fs = 65536;
		this.prev = null;
		this.done = false;
		this.drawable = null;
		
		this.isGoal = (s == "G");
		this.isWall = (s == "*");
		this.isStart = (s == "S");
		this.strokeStyle  = "black";
		
	});

	Node.prototype.isHit = function(node)
	{
		var val1 = Math.pow( (node.x-this.x*blockSize) , 2) + Math.pow( (node.y-this.y*blockSize) , 2);
		var val2 = Math.pow(blockSize, 2);
		
		return (val1 < val2);
	}

	Node.prototype.draw = function()
	{
		this.drawable = new Ball(blockSize, blockSize, this.x*blockSize, this.y*blockSize, './img/blue_ball.png');
		this.drawable.opacity = 0;
		game.addSprite(this.drawable);
	}

	Node.prototype.drawPath = function()
	{
		var p = this.prev;
		while(p)
		{
			p.drawable.opacity = 1;
			p.drawable.scaleX = 0.5;
			p.drawable.scaleY = 0.5;
			p = p.prev;
		}
	}

	var goal          = new Point(18,13);
	var start         = new Point(0,0);
	var continueIndex = 0;
    var dx    = [0, 1, 0, -1];   // X方向移動用配列
    var dy    = [1, 0, -1, 0];   // Y方向移動用配列




	var open      = [];
	var fieldMap  = [];
	var blockSize = 32;
	

	function hs(node, node2)
	{
		return Math.abs(node2.x - node.x) + Math.abs(node2.y - node.y);
	}

	function initMaze()
	{
		//-------------------------------------------------------------
		//	フィールドの初期化.
		//-------------------------------------------------------------
		open  = [];
		fieldMap = [];

		for(var ii=0;ii<Math.floor(Game.Screen.Height / blockSize);ii++)
		{
			fieldMap[ii] = [];
			
			for(var jj=0;jj<Math.floor(Game.Screen.Width  / blockSize);jj++)
			{
				var node = new Node('*', jj, ii);
				
				//----------------------------------
				//	スタート地点.
				//----------------------------------
				if(ii == start.y && jj == start.x)
				{
					node.isGoal = true;
				}
				
				
				//----------------------------------
				//	ゴール地点.
				//----------------------------------
				if(ii == goal.y && jj == goal.x)
				{
					node.isStart = true;
					node.gs = 0;
					node.fs = hs(start, goal);
					open.push(node);

					goalHole.x = jj*blockSize;
					goalHole.y = ii*blockSize;
				}
				
				fieldMap[ii][jj] = node;
			}
		}
	}


	function nextStep()
	{
		isCalculating = true;
		var minScore = 65535;
		var minIndex = -1;
		var u = null;
		
		for(var ii=0;ii<open.length;ii++)
		{
			var node = open[ii];
			if(node.done)	continue;
			if(node.fs < minScore)
			{
				minScore = node.fs;
				minIndex = ii;
				u = node;
			}
		}
		
		//未確定ノードがない場合はreturn.
		if(u == null)
		{
			alert("ゴールへの道がありません");
			return false;
		}
		
		//uを確定ノードとする.
		open.splice(minIndex, 1);
		u.done = true;
		//u.draw();
		
		//ゴールだった場合は終了.
		if(u.isGoal)
		{
			//u.drawPath();
			var p = u.prev;
			var paths = [p];
			
			while(p)
			{
				paths.push(p);
				p = p.prev;
			}
			
			isCalculating = false;
			return paths;
		}
		
		//4方向のノードを調べる.
		var W = Math.floor(Game.Screen.Width / blockSize);
		var H = Math.floor(Game.Screen.Height / blockSize);
		for(var ii=0;ii<dx.length;ii++)
		{
            if (u.y + dy[ii] < 0 ||
                u.y + dy[ii] >= H ||
                u.x + dx[ii] < 0 ||
                u.x + dx[ii] >= W) continue;

			
			var node = fieldMap[u.y+dy[ii]][u.x+dx[ii]];
			
			//確定ノードはパス.
			if(node.done)
				continue;
				
			//壁との当たり判定.
			var continueFlag = false;
			for(var jj=0;jj<walls.length;jj++)
			{
				if(node.isHit(walls[jj]))
				{
					continueFlag = true;
					break;
				}
			}
			
			if(continueFlag)
				continue;
			
			if(u.gs + hs(node, goal) < node.fs)
			{
                node.gs = u.gs+1;
                node.fs = node.gs + hs(node, goal);
                node.prev = u;
                // open リストに追加
                if (open.indexOf(node) == -1) open.push(node);
			}
		}
		
		
		//setTimeout("nextStep()", 10);
		return nextStep();
	}








	var Listener = function(){};
	Listener.prototype.onEvent = function(e,d)
	{
		if(e == Game.event.onLoadComplete)
		{
			
			ball = new Ball(blockSize,blockSize, start.x, start.y, './img/green_ball.png');
			ball.m_pathIndex = 0;
			game.addSprite(ball);
			
			goalHole = new Wall(blockSize, blockSize, goal.x, goal.y, './img/hole.png');
			game.addSprite(goalHole);
			
			initMaze();
			
			//setTimeout("nextStep()", 100);
			ball.reCalc();
		}
		
		if(e == Game.event.onTouch || e == Game.event.onTouchMove)
		{
			var xx = d.x - (d.x % 32);
			var yy = d.y - (d.y % 32);
			if((xx != touchPos.x || yy != touchPos.y))
			{
				var wall = new Wall(blockSize, blockSize, xx, yy, './img/brick.png');
				walls.push(wall);
				game.addSprite(wall);
				
				if(ball.m_path.length > 0)
				{
					var tmpPoint = new Point(Math.round(ball.x / 32), Math.round(ball.y / 32));
					start = tmpPoint;
				}
				
				if(start.x != goal.x || start.y != goal.y)
					ball.reCalc();
			}
			
			touchPos.x = xx;
			touchPos.y = yy;
		}
	}
	
	Listener.prototype.onEnterFrame = function()
	{
		
	}

	var listener;
	$(function()
	{
		listener = new Listener();
		game.addEventListenerExtend(Game.event.onLoadComplete, listener);
		game.addEventListenerExtend(Game.event.onTouch, listener);
		game.addEventListenerExtend(Game.event.onTouchMove, listener);
		game.addEventListener(Game.event.onEnterFrame, listener.onEnterFrame);
		game.start();
	});

