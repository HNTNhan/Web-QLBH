var db = require('../fn/db');

exports.getNumberOfItems = cart => {
    if (!cart) {
        return -1;
    }

    var n = 0;
    for (var i = cart.length - 1; i >= 0; i--) {
        n += cart[i].quantity;
    }

    return n;
}

exports.add = (cart, item) => {
    for (var i = cart.length - 1; i >= 0; i--) {
        if (cart[i].product.ProID === item.product.ProID) {
            cart[i].quantity += item.quantity;
            return;
        }
    }

    cart.push(item);
}

exports.remove = (cart, proId) => {
    for (var i = cart.length - 1; i >= 0; i--) {
        if (proId === cart[i].product.ProID) {
            cart.splice(i, 1);
            return;
        }
    }
}

exports.addBought = (cart, userid) => {
    var sql = `insert into bought(ID, ProName, ProQuantity, DateBuy) values('${userid}', '${cart.product.ProName}', '${cart.quantity}', CURDATE())`;
    return db.save(sql);
}

exports.loadAllBought = (userid) => {
    var sql = `select * from bought where ID = ${userid} order by DateBuy desc`;
    return db.load(sql);
}

exports.subQuantity = (id, quantity) => {
    var sql = `update products set Quantity = Quantity - ${quantity} where ProID = ${id}`;
    return db.save(sql);
}