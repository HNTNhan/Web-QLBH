var db = require('../fn/db');

exports.loadAll = () => {
    var sql = 'select * from users';
    return db.load(sql);
}

exports.single = id => {
	var sql = `select * from users where ID = ${id}`;
	return db.load(sql);
}

exports.add = (user) => {
    var sql = `insert into users(Username, Password, Name, Email, DOB, Permission) values('${user.Username}', '${user.Password}', '${user.Name}', '${user.Email}', '${user.DOB}', '${user.Permission}')`;
    return db.save(sql);
}

exports.delete = (id) => {
    var sql = `delete from users where ID = ${id}`;
    return db.save(sql);
}

exports.update = (user) => {
    var sql = `update users set Username = '${user.Username}', Password = '${user.Password}', Name = '${user.Name}', Email = '${user.Email}', DOB = '${user.DOB}', Permission = '${user.Permission}' where ID = ${user.ID}`;
    return db.save(sql);
}



