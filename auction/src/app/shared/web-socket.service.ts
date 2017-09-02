import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/Rx';

@Injectable()
export class WebSocketService {

  ws:WebSocket;

  constructor() { }

  createObservableSocket(url:string, id:number): Observable<any> {
      this.ws = new WebSocket(url);
      return new Observable<string> (
          observer => {
           // 当ws收到一个消息时，流发射下一个元素
              this.ws.onmessage = (event) => observer.next(event.data);
           // 抛出异常
              this.ws.onerror = (event) => observer.error(event);
           // 发送流结束的信号
              this.ws.onclose = (event) => observer.complete();
              this.ws.onopen = (event) => this.sendMessage({productId:id});
              return () => this.ws.close();
          }
      ).map(message => {JSON.parse(message)});
  }

  sendMessage(message:any) {
      this.ws.send(JSON.stringify(message));
  }

}
