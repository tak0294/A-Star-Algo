	//-----------------------------------
	//	文字コード:utf8.
	//-----------------------------------
	var CustomClass = (function()
	{
		return function()
		{
			
		}
	})();
	
	CustomClass.classCount = 0;
	
	CustomClass.create = function(func)
	{
		if(typeof func != 'function')
			func = function(){};
		
		var F = function() {
			
			this.construct(arguments);
		};
		F.prototype.construct = func;
		F.prototype.id		 = this.classCount++;
		F.Event		 = {};
		F.State		 = {};
		F.extend     = function(ext)
		{
			F.prototype = $.extend({}, F.prototype, ext);
		}
		
;
		return F;
	}
