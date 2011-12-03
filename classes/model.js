estimateLineItem = function(options) {
	options = options || {};	

	var id = options.id || 0;
	var name = options.name || "";
	var description = options.description || "";
	var quantity = options.quantity || 0;
	var cost = options.cost || 0;
	var total = options.Total || 0; 
	var media = options.media || null;

	Object.defineProperty(this, "Id", {
		value: id,
		writable: false, 
	});

	Object.defineProperty(this, "name", {
		get: function () {return name; },
		set: function (newName) {name = newName;},
		enumerable: true,
	});

	Object.defineProperty(this, "description", {
		get: function () {return description; },
		set: function (newDesc) { description = newDesc;},
		enumerable: true,
	});

	Object.defineProperty(this, "quantity", {
		get: function () {return description; },
		set: function (newQuan) {quantity = newQuan;},
		enumerable: true,
	});

	Object.defineProperty(this, "cost", {
		get: function () {return cost; },
		set: function (newCost) {cost = newCost;},
		enumerable: true,
	});

	Oject.defineProperty(this, "total", {
		get: function () {return total; },
		set: function (newTotal) {total = newTotal;},
		enumerbale: true,
	});

	Object.defineProperty(this, "media", {
		get: function () {return media; },
		set: function (newMedia) {media = newMedia;},
		enumerable: true,
	});
};


exports.estimateLineItem = estimateLineItem; 
