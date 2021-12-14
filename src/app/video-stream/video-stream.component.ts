import { Component, Input, OnInit } from '@angular/core';
import { RpcService } from 'src/services/rpc.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { VideoStreamUtility } from '../utilities/video-stream.utility';

@Component({
  selector: 'app-video-stream',
  templateUrl: './video-stream.component.html',
  styleUrls: ['./video-stream.component.scss'],
  providers: [RpcService]
})
export class VideoStreamComponent implements OnInit {
  @Input() showInput = false;

  callId: string;

  localStream: MediaStream;
  remoteStream: MediaStream;

  videoStreamUtility: VideoStreamUtility;

  constructor(
    private rpcService: RpcService,
    private firestore: AngularFirestore
  ) {
    this.videoStreamUtility = new VideoStreamUtility(rpcService, firestore);
  }

  ngOnInit(): void {
  }


  async startCall(): Promise<void> {
    this.videoStreamUtility.startCall().then(res => {
      if (!res) return;
      this.localStream = res.localStream;
      this.remoteStream = res.remoteStream;
    });
  }

  joinCall(): void {
    this.videoStreamUtility.startCall(this.callId).then(res => {
      this.localStream = res.localStream;
      this.remoteStream = res.remoteStream;
    });
  }
}
