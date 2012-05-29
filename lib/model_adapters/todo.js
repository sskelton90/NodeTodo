var Todo = new (function() {
	this.all = function (callback) {
    	var todos = [];
    	geddy.db.todos.find().sort({status: -1, title:1}).toArray(function (err, docs) {
    		if (err) {
    			return callback(err, null);
    		}

    		for (var i in docs) {
    			todos.push(geddy.model.Todo.create(docs[i]));
    		}

    		return callback(null, todos);
    	});
  	}

	this.save = function (todo, opts, callback) {
		if (typeof callback != 'function') {
			callback = function(){};
		}

		// MongoDB only requires properties
		cleanTodo = {
			id: todo.id,
			saved: todo.saved,
			title: todo.title,
			status: todo.status
		};

		todo = geddy.model.Todo.create(cleanTodo);
		if (!todo.isValid()){
			return callback(todo.errors, null);
		}

		geddy.db.todos.findOne({id: todo.id}, function(err,doc) {
			if (err) {
				return callback(err,null);
			}

			if (doc) {
				geddy.db.todos.update({id: todo.id}, cleanTodo, function (err, docs) {
					return callback(todo.errors, todo);
				});
			}
			else {
				todo.saved = true;
				geddy.db.todos.save(todo, function(err,docs) {
					return callback(err,docs);
				})
			}
		})
	}

	this.load = function(id, callback) {
		var todo;

		geddy.db.todos.findOne({id: id}, function (err, doc) {
			if (err) {
				return callback(err, null);
			}

			if (doc) {
				todo = geddy.model.Todo.create(doc);
			}

			return callback(null, todo);
		})
	}

	this.remove = function(id, callback) {
		if (typeof callback != 'function') {
			callback = function(){};
		}

		geddy.db.todos.remove({id: id}, function(err, res) {
			callback(err);
		});
	}

})();

exports.Todo = Todo;