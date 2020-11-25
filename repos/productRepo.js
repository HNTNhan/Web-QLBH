var db = require('../fn/db');
var config = require('../config/config');

exports.loadAll = () => {
    var sql = 'select * from products';
    return db.load(sql);
}

// exports.loadAllByCat = (catId) => {
//     var sql = `select * from products where CatID = ${catId}`;
//     return db.load(sql);
// }

exports.loadPageByPrice = (Price1, Price2, offset) => {
    var sql = `select * from products where Price > ${Price1} and Price < ${Price2} limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return db.load(sql);
}

exports.countByPrice = (Price1, Price2) => {
	var sql = `select count(*) as total from products where Price > ${Price1} and Price < ${Price2}`;
    return db.load(sql);
}

exports.loadPageByCat = (CatID, offset) => {
    var sql = `select * from products where CatID = ${CatID} limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return db.load(sql);
}

exports.countByCat = CatID => {
	var sql = `select count(*) as total from products where CatID = ${CatID}`;
    return db.load(sql);
}

exports.loadPageByCatF = (Firm, offset) => {
    var sql = `select * from products where Firm = '${Firm}' limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return db.load(sql);
}

exports.countByCatF = Firm => {
	var sql = `select count(*) as total from products where Firm = '${Firm}'`;
    return db.load(sql);
}

exports.single = id => {
	var sql = `select * from products where ProID = ${id}`;
	return db.load(sql);
}

exports.loadPageBySearch = (proName, offset) => {
    var sql = `select * from products where ProName like '%${proName}%' limit ${config.PRODUCTS_PER_PAGE} offset ${offset}`;
    return db.load(sql);
}

exports.countBySearch = proName => {
    var sql = `select count(*) as total from products where ProName like '%${proName}%'`;
    return db.load(sql);
}

exports.add = (product) => {
    var sql = `insert into products(ProName, Price, Quantity, Viewed, Sold, Origin, Species, Firm, Arrive) values('${product.ProName}', '${product.Price}', '${product.Quantity}', '${product.Viewed}', '${product.Sold}', '${product.Origin}', '${product.Species}', '${product.Firm}', '${product.Arrive}')`;
    return db.save(sql);
}

exports.delete = (id) => {
    var sql = `delete from products where ProID = ${id}`;
    return db.save(sql);
}

exports.update = (product) => {
    var sql = `update products set ProName = '${product.ProName}', Price = '${product.Price}', Quantity = '${product.Quantity}', Viewed = '${product.Viewed}', Sold = '${product.Sold}', Origin = '${product.Origin}', Species = '${product.Species}', Firm = '${product.Firm}', Arrive = '${product.Arrive}' where ProID = ${product.ProID}`;
    return db.save(sql);
}