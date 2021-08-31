import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, map, Observable } from 'rxjs';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class EventsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('connection')
  handleConnection(@ConnectedSocket() client: Socket) {
    // console.log(client);
    client.broadcast.emit('events', 'I am here!!!');
  }

  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): WsResponse<unknown> {
    const event = 'events';
    // console.log(data);
    // console.log(client);
    return { event, data };
  }

  @SubscribeMessage('identity')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  afterInit(server: Server) {
    console.log('==========init==========');
    console.log(server);
  }
}
