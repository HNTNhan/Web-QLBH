var db = require('../fn/db');

exports.single = id => {
    var sql = `select ID, Username, Password, Name, Email, date_add(DOB, interval 1 day) AS DOB, Permission from users where ID = ${id}`;
    return db.load(sql);
}
exports.check = username => {
    var sql = `select ID, Username from users where Username = '${username}'`;
    return db.load(sql);
}

exports.add = user => {
	var sql = `insert into users(Username, Password, Name, Email, DOB, Permission) values('${user.username}', '${user.password}', '${user.name}', '${user.email}', '${user.dob}', ${user.permisson})`;
	return db.save(sql);
}

exports.login = user => {
	var sql = `select ID, Username, Password, Name, Email, date_add(DOB, interval 1 day) AS DOB, Permission from users where Username = '${user.username}' and Password = '${user.password}'`;
	return db.load(sql);
}

exports.update = (user) => {
	var sql = `update users set Username = '${user.username}', Name = '${user.name}', Email = '${user.email}', DOB = '${user.dob}' where ID = ${user.id}`;
	return db.save(sql);
}

exports.updatePass = (user) => {
	var sql = `update users set Password = '${user.password}' where ID = ${user.id}`;
	return db.save(sql);
}

exports.loadAllMsg = () => {
	var sql = 'select * from messages order by IDMsg desc';
	return db.load(sql);
}
