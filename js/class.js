	//-----------------------------------
	//	文字コード:utf8.
	//-----------------------------------
	var extendedSprite = (function(){
		return function(){}
	})();
	
	extendedSprite.create = function()
	{
		var clazz = Class.create(enchant.Sprite, {
			initialize:function(w, h, x, y, image)
			{
				enchant.Sprite.call(this, w, h);
				this.moveX = 0;
				this.moveY = 0;
				this.gravity = 0.98;
				this.friction = 0.99;
				this.x = x;
				this.y = y;
				this.dx = x;
				this.dy = y;
				this.rotateVal = 0;
				this.image = game.assets[image];
			},
			update:function()
			{
				
			}
		});
		
		return clazz;
	}