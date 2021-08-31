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
    client.broadcast.emit('events', 'I am here!!!');
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('disconnecting');
  }

  @SubscribeMessage('room_list')
  handleRoomList(@ConnectedSocket() client: Socket): WsResponse<unknown> {
    const event = 'room_list';
    const rooms = this.server.sockets.adapter.rooms;
    return { event, data: rooms };
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomName: string,
  ): WsResponse<unknown> {
    const event = 'join_room_response';
    client.join(roomName);

    return { event, data: roomName };
  }

  @SubscribeMessage('new_message')
  handleNewMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { roomName: string; nickname: string; message: string },
  ) {
    const { roomName, nickname, message } = data;
    this.server.to(roomName).emit('new_message', message);
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
