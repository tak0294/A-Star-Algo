	var EventDispatcher = function()
	{
		this.m_observers = {};
	};

	//---------------------------------------------------
	//	イベントリスナの追加.
	//---------------------------------------------------
	EventDispatcher.prototype.addEventListenerExtend = function(type, obj)
	{
		if(this.m_observers[type] == null)
			this.m_observers[type] = [];
		this.m_observers[type].push(obj);
	}
	
	//---------------------------------------------------
	//	イベントの通知.
	//---------------------------------------------------
	EventDispatcher.prototype.notify = function(type, data)
	{
		if(this.m_observers[type] == null)
			return false;
		
		if(typeof data == "undefined")
			data = {};
		
		for(var ii=0;ii<this.m_observers[type].length;ii++)
		{
			this.m_observers[type][ii].onEvent(type, data);
		}
	}
