import { Injectable } from '@angular/core';
import { StunServersConfig } from 'src/configs/stun-servers.config';

@Injectable({
  providedIn: 'root'
})
export class RpcService {

  pc: RTCPeerConnection = new RTCPeerConnection(StunServersConfig.stunServerList);

  constructor() { }
}
