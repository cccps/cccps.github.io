var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TodoConstants = require('../constants/TodoConstants');
var assign = require('object-assign');

var CHANGE_EVENTS = 'change';

var _todos = {}; // collection of todo items

/**
 * Create a TODO item.
 * @param {string} text The content of the TODO
 */
function create(text){
	var id = Date.now();
	_todos[id] = {
		id : id,
		complete : false,
		text : text
	};
}

/**
 * Delete a TODO item.
 * @param {string} id
 */
function destroy(id) {
  delete _todos[id];
}

var Store = assign({},EventEmitter.prototype,{

	/**
	   * Get the entire collection of TODOs.
	   * @return {object}
	   */
	getAll : function(){
		return _todos;
	},

	emitChange : function(){
		this.emit(CHANGE_EVENTS);
	},

	/**
	   * @param {function} callback
	   */
	addChangeListener : function(callback){
		this.on(CHANGE_EVENTS,callback);
	},

	/**
	   * @param {function} callback
	   */
	removeChangeListener: function(callback) {
	    this.removeListener(CHANGE_EVENT, callback);
	},

	dispatcherIndex = AppDispatcher.register(function(payload){
		var action = payload.action;
		var text;

		switch(action.actionType){
			case TodoConstants.TODO_CREATE:
					text = action.text.trim();
					if(text !== ''){
						create(text);
						Store.emitChange();
					}
					break;
			case TodoConstants.TODO_DESTROY:
			        destroy(action.id);
			        Store.emitChange();
			        break;
		}

		return true; // No errors. Needed by promise in Dispatcher.
	})
});

module.exports = Store;
