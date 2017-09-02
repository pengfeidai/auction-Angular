import * as express from 'express';
import {Server} from 'ws';

const app = express();

export class Product {
  constructor(
    public id: number,
    public title: string,
    public price: number,
    public rating: number,
    public desc: string,
    public imgUrl: string,
    public categories: Array<string>
  ) {}
}

export class Comment {
  constructor(
    public id: number,
    public productId: number,
    public timestamp: string,
    public user: string,
    public rating: number,
    public content: string
  ) {}
}

const products: Product [] = [
  new Product(1, '华为荣耀8', 1999, 3.5, '这是第一部手机，是我在学习Angular入门实战时创建的', '../assets/images/1.jpg', ['电子产品', '手机']),
  new Product(2, 'vivo x9s', 2999, 2.5, '这是第二部手机，是我在学习Angular入门实战时创建的', '../assets/images/2.jpg', ['手机','硬件设备']),
  new Product(3, '魅蓝note6', 3999, 4.5, '这是第三部手机，是我在学习Angular入门实战时创建的', '../assets/images/3.jpg', ['电子产品']),
  new Product(4, 'Iphone 8', 1899, 3.5, '这是第四部手机，是我在学习Angular入门实战时创建的', '../assets/images/4.jpg', ['电子产品', '手机']),
  new Product(5, '红米4X', 5999, 3.5, '这是第五部手机，是我在学习Angular入门实战时创建的', '../assets/images/5.jpg', ['硬件设备']),
  new Product(6, '三星 S8', 3899, 2.5, '这是第六部手机，是我在学习Angular入门实战时创建的', '../assets/images/6.jpg', ['电子产品'])
];

const comments: Comment [] = [
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


app.get('/api/products', (req, res) => {
    let result = products
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

app.get('/api/product/:id', (req, res) => {
    res.json(products.find((product) => product.id == req.params.id));
});

app.get('/api/product/:id/comments', (req, res) => {
    res.json(comments.filter((comment: Comment) => comment.productId == req.params.id));
});

const server = app.listen(8000, "localhost", () => {
    console.log('服务器已启动！');
});

const subscriptions = new Map<any, number[]>();

const wsServer = new Server({port:8085});
wsServer.on("connection", websocket => {
  websocket.on('message', (message:string) => {
    let messageObj = JSON.parse(message);
    let productIds = subscriptions.get(websocket) || [];
    subscriptions.set(websocket, [...productIds, messageObj.productId]);
  });
});

const currentBids = new Map<number, number>();

setInterval(() => {
  products.forEach( p => {
    let currentBid = currentBids.get(p.id) || p.price;
    let newBid = currentBid - Math.random() * 100;
    currentBids.set(p.id, newBid);
  });

  subscriptions.forEach((productIds: number[], ws) => {
    if(ws.readyState === 1) {
      let newBids = productIds.map( pid => ({
      productId: pid,
      bid: currentBids.get(pid)
    }));
    ws.send(JSON.stringify(newBids));
    } else {
      subscriptions.delete(ws);
    }
  });

},2000);