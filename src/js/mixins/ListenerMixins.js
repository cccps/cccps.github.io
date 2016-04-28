var ListenerMixins = {
	/*
		requested properties
	*/
	// _listeners:[],
	// _callback:function(){
	// 	console.warn("ListenerMixins: '_callback' function should be overrided ");
	// },

	componentDidMount: function() {
		var self = this;
		this._listeners.forEach(function(listener){
			AppStore.addChangeListener(listener,self._callback);
		})
	},
	componentWillUnmount: function() {
		var self = this;
		this._listeners.forEach(function(listener){
			AppStore.removeChangeListener(listener,self._callback);
		})
	}
}


module.exports = ListenerMixins;