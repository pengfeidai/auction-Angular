"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var ws_1 = require("ws");
var app = express();
var Product = (function () {
    function Product(id, title, price, rating, desc, imgUrl, categories) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.rating = rating;
        this.desc = desc;
        this.imgUrl = imgUrl;
        this.categories = categories;
    }
    return Product;
}());
exports.Product = Product;
var Comment = (function () {
    function Comment(id, productId, timestamp, user, rating, content) {
        this.id = id;
        this.productId = productId;
        this.timestamp = timestamp;
        this.user = user;
        this.rating = rating;
        this.content = content;
    }
    return Comment;
}());
exports.Comment = Comment;
var products = [
    new Product(1, '华为荣耀8', 1999, 3.5, '这是第一部手机，是我在学习Angular入门实战时创建的', '../assets/images/1.jpg', ['电子产品', '手机']),
    new Product(2, 'vivo x9s', 2999, 2.5, '这是第二部手机，是我在学习Angular入门实战时创建的', '../assets/images/2.jpg', ['手机', '硬件设备']),
    new Product(3, '魅蓝note6', 3999, 4.5, '这是第三部手机，是我在学习Angular入门实战时创建的', '../assets/images/3.jpg', ['电子产品']),
    new Product(4, 'Iphone 8', 1899, 3.5, '这是第四部手机，是我在学习Angular入门实战时创建的', '../assets/images/4.jpg', ['电子产品', '手机']),
    new Product(5, '红米4X', 5999, 3.5, '这是第五部手机，是我在学习Angular入门实战时创建的', '../assets/images/5.jpg', ['硬件设备']),
    new Product(6, '三星 S8', 3899, 2.5, '这是第六部手机，是我在学习Angular入门实战时创建的', '../assets/images/6.jpg', ['电子产品'])
];
var comments = [
    new Comment(1, 1, '2017-02-02 20:19:20', '张三', 3, '东西非常好'),
    new Comment(2, 1, '2017-03-12 23:59:20', '李四', 3, '东西还不错'),
    new Comment(3, 1, '2017-03-18 12:20:56', '王五', 3, '东西不错，值得购买'),
    new Comment(4, 2, '2017-04-22 18:39:20', '赵六', 3, '东西非常好'),
    new Comment(5, 3, '2017-02-02 20:19:20', '张三', 3, '东西非常好'),
    new Comment(6, 4, '2017-03-12 23:59:20', '李四', 3, '东西还不错'),
    new Comment(7, 5, '2017-03-18 12:20:56', '王五', 3, '东西不错，值得购买'),
    new Comment(8, 5, '2017-04-22 18:39:20', '赵六', 3, '东西非常好'),
    new Comment(9, 6, '2017-02-02 20:19:20', '张三', 3, '东西非常好'),
    new Comment(10, 6, '2017-03-12 23:59:20', '李四', 3, '东西还不错'),
    new Comment(11, 5, '2017-03-18 12:20:56', '王五', 3, '东西不错，值得购买'),
    new Comment(12, 4, '2017-04-22 18:39:20', '赵六', 3, '东西非常好')
];
app.use('', express.static(path.join(__dirname, '..', 'client')));
app.get('/api/products', function (req, res) {
    var result = products;
    // let params = req.query;
    // if(params.title) {
    //     result = result.filter((p) => p.title.indexOf(params.title) !== -1);
    // }
    // if(params.price && result.length > 0) {
    //     result = result.filter((p) => p.price <= parseInt(params.price));
    // }
    // if(params.category !== "-1" && result.length > 0) {
    //     result = result.filter((p) => p.categories.indexOf(params.category) !== -1);
    // }
    res.json(result);
});
app.get('/api/product/:id', function (req, res) {
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
app.get('/api/product/:id/comments', function (req, res) {
    res.json(comments.filter(function (comment) { return comment.productId == req.params.id; }));
});
var server = app.listen(8000, "localhost", function () {
    console.log('服务器已启动！');
});
var subscriptions = new Map();
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on("connection", function (websocket) {
    websocket.on('message', function (message) {
        var messageObj = JSON.parse(message);
        var productIds = subscriptions.get(websocket) || [];
        subscriptions.set(websocket, productIds.concat([messageObj.productId]));
    });
});
var currentBids = new Map();
setInterval(function () {
    products.forEach(function (p) {
        var currentBid = currentBids.get(p.id) || p.price;
        var newBid = currentBid - Math.random() * 100;
        currentBids.set(p.id, newBid);
    });
    subscriptions.forEach(function (productIds, ws) {
        if (ws.readyState === 1) {
            var newBids = productIds.map(function (pid) { return ({
                productId: pid,
                bid: currentBids.get(pid)
            }); });
            ws.send(JSON.stringify(newBids));
        }
        else {
            subscriptions.delete(ws);
        }
    });
}, 2000);
