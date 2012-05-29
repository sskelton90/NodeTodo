var Todo = new (function() {
	this.save = function (todo, opts, callback) {
		if (typeof callback != 'function') {
			callback = function(){};
		}

		todo.saved = true;
		geddy.todos.push(todo);
		return callback(null, todo);
	}

})();

exports.Todo = Todo;