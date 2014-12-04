	//文字コード = utf8
	enchant();

	/*------------------------------------
		仮想ハードスペック.
		
		Graphics
			Background Layer1 (implemented)
			Background Layer2 (implemented)
			Sprite Layer      (implemented)
			Front Layer       (implemented)
		
		Controls Input
			Digital Directional Pad(8way)      (implemented see game_define.js)
			A, B, C, D      Regular Buttons    (implemented see game_define.js)
			L,R             Side Buttons       (implemented see game_define.js)
			Start, Select   Modifier Buttons   (implemented see game_define.js)
			
		Sound
			1channel PCM    For music playback   (implemented Game.Sound chBGM)
			4channel PCM    For SE playback      (implemented Game.Sound ch1~ch4)

	------------------------------------*/

	var game;
	
	//window.onload = function()
	$(function()
	{
	    //--------------------------------------------------
	    // スクリーンサイズ.
	    //--------------------------------------------------
		Game.Screen = {};
		Game.Screen.Width  = SCREEN_WIDTH;
		Game.Screen.Height = SCREEN_HEIGHT;

	    //--------------------------------------------------
	    // 表示レイヤー
	    //--------------------------------------------------
	    Game.Layer        = {};
	    Game.Layer.BG1    = null;
	    Game.Layer.BG2    = null;
	    Game.Layer.Sprite = null;
	    Game.Layer.Front  = null;
	    
	    
	    //--------------------------------------------------
	    // サウンドチャンネル.
	    //--------------------------------------------------
	    Game.Sound = {};
	    Game.Sound["ch1"]   = null;
	    Game.Sound["ch2"]   = null;
	    Game.Sound["ch3"]   = null;
	    Game.Sound["ch4"]   = null;
	    Game.Sound["chBGM"] = null;
	    
	    Game.SoundInfo = {};
	    Game.SoundInfo["ch1"] = {volume:1};
	    Game.SoundInfo["ch2"] = {volume:1};
	    Game.SoundInfo["ch3"] = {volume:1};
	    Game.SoundInfo["ch4"] = {volume:1};
	    Game.SoundInfo["chBGM"] = {volume:1};
	    
	    Game.prototype.setVolume = function(Channel, volume)
	    {
			Game.SoundInfo[Channel].volume = volume;
		}
	    
	    Game.prototype.playSE = function(Channel, sound)
	    {
			if(Game.Sound[Channel] != null)
			{
				Game.Sound[Channel].stop();
				Game.Sound[Channel] = null;
			}
			
			Game.Sound[Channel] = game.assets[sound];
			Game.Sound[Channel].volume = Game.SoundInfo[Channel].volume;
			Game.Sound[Channel].play();
		}
	    
	    Game.prototype.playBGM = function(sound, loop)
	    {
			if(typeof loop == "undefined")
				loop = false;
			
			if(Game.Sound["chBGM"] != null)
			{
				Game.Sound["chBGM"].stop();
				Game.Sound["chBGM"] = null;
			}
			
			Game.Sound["chBGM"] = game.assets[sound];
			Game.Sound["chBGM"].volume = Game.SoundInfo["chBGM"].volume;
			Game.Sound["chBGM"].play();
			if(loop)
				Game.Sound["chBGM"].src.loop = true;
		}
	    
	    //--------------------------------------------------
	    // イベントディスパッチャを継承.
	    //--------------------------------------------------
	    Game.event = {};
	    Game.event.onLoadComplete = "ON_LOAD_COMPLETE";
	    Game.event.onEnterFrame   = "enterframe";
	    Game.event.onTouch = "ON_TOUCH";
	    Game.event.onTouchMove = "ON_TOUCH_MOVE";
	    $.extend(Game.prototype, new EventDispatcher());
	    
	    
	    Game.prototype.m_sprites = [];
	    

	    //--------------------------------------------------
	    // スプライトの追加.
	    //--------------------------------------------------
	    Game.prototype.addSprite = function(sprite)
	    {
			Game.Layer.Sprite.addChild(sprite);
			this.m_sprites.push(sprite);
		}



	    
	    game = new Game(SCREEN_WIDTH, SCREEN_HEIGHT);
	    game.fps = FPS;
	    game.preload(PRELOAD_IMAGES);
	    
	    
	    //--------------------------------------------------
	    // キー入力設定.
	    //--------------------------------------------------
	    game.keybind(KEYCODE_UP, "up");
	    game.keybind(KEYCODE_DOWN, "down");
	    game.keybind(KEYCODE_LEFT, "left");
	    game.keybind(KEYCODE_RIGHT, "right");
	    game.keybind(KEYCODE_A, "a");
	    game.keybind(KEYCODE_B, "b");
	    game.keybind(KEYCODE_C, "c");
	    game.keybind(KEYCODE_D, "d");
	    game.keybind(KEYCODE_L, "l");
	    game.keybind(KEYCODE_R, "r");
	    
	    
	    game.initGraphicDevice = function()
	    {
			Game.Layer.BG1     = new Scene();
	        Game.Layer.BG2     = new Scene();
	        Game.Layer.Sprite  = new Scene();
	        Game.Layer.Front   = new Scene();
	        
	        var layers = new Group();
	        layers.addChild(Game.Layer.BG1);
	        layers.addChild(Game.Layer.BG2);
	        layers.addChild(Game.Layer.Sprite);
	        layers.addChild(Game.Layer.Front);
	        this.rootScene.addChild(layers);

		}





	    game.onEnterFrame = function()
	    {
			for(var ii=0;ii<game.m_sprites.length;ii++)
			{
				game.m_sprites[ii].update();
			}
		};
	    
	    game.onTouch = function(e)
	    {
			var data = {x:e.localX, y:e.localY};
			game.notify(Game.event.onTouch, data);
		}
	    
	    game.onTouchMove = function(e)
	    {
			var data = {x:e.localX, y:e.localY};
			game.notify(Game.event.onTouchMove, data);
		}
	    
	    game.update = function()
	    {
			
		};
	    
	    
	    
	    game.onload = function(){
	        
	        //Init Graphics device.
	        game.initGraphicDevice();
			
			game.notify(Game.event.onLoadComplete);
			
	        //Set mainloop.
			game.addEventListener('enterframe', game.onEnterFrame);
			game.rootScene.addEventListener('touchstart', game.onTouch);
			game.rootScene.addEventListener('touchmove', game.onTouchMove);
	    };
	});
	
	
	
	var Point = function(x,y)
	{
		if(typeof x != 'undefined')
			this.x = x;
		else
			this.x = 0;

		if(typeof y != 'undefined')
			this.y = y;
		else
			this.y = 0;
				
	}