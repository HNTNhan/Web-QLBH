var db = require('../fn/db');

exports.loadArrive = () => {
	var sql = 'select * from products order by Arrive desc limit 10';
	return db.load(sql)
}

exports.loadSold = () => {
	var sql = 'select * from products order by Sold desc limit 10';
	return db.load(sql)
}

exports.loadViewed = () => {
	var sql = 'select * from products order by Viewed desc limit 10';
	return db.load(sql)
}