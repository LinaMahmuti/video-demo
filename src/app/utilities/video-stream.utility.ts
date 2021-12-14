import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RpcService } from 'src/services/rpc.service';

export interface Stream {
  localStream: MediaStream;
  remoteStream: MediaStream;
}

export class VideoStreamUtility {
  isCallActive: boolean;
  localStream: MediaStream;
  remoteStream: MediaStream;

  constructor(
    private rpcService: RpcService,
    private firestore: AngularFirestore
  ) { }

  async startCall(callId?: string): Promise<Stream> {
    if (this.isCallActive) {
      alert('Another call is in progres...');
      return null;
    }

    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    this.remoteStream = new MediaStream();
    this.initializeStreams();

    if (callId) await this.joinCall(callId);
    else await this.makeCall();

    this.isCallActive = true;

    return {
      localStream: this.localStream,
      remoteStream: this.remoteStream,
    } as Stream;
  }

  private initializeStreams(): void {
    this.localStream.getTracks().forEach((track) => {
      this.rpcService.pc.addTrack(track);
    });

    this.rpcService.pc.ontrack = (event: RTCTrackEvent) => {
      this.remoteStream.addTrack(event.track);
    };
  }

  private async makeCall(): Promise<void> {
    const callDoc = this.firestore.collection('calls').doc();
    const offerCandidates = callDoc.collection('offerCandidates');
    const answerCandidates = callDoc.collection('answerCandidates');

    this.rpcService.pc.onicecandidate = (event) => {
      if (event.candidate) offerCandidates.add(event.candidate.toJSON());
    };

    const offerDesctiption = await this.rpcService.pc.createOffer();
    this.rpcService.pc.setLocalDescription(offerDesctiption);

    const offer = {
      sdp: offerDesctiption.sdp,
      type: offerDesctiption.type,
    };

    await callDoc.set({
      date: new Date(),
      offer
    });

    callDoc.snapshotChanges().subscribe((snapshot) => {
      console.log(snapshot.payload.data());

      const data: any = snapshot.payload.data();

      if (!this.rpcService.pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);

        this.rpcService.pc.setRemoteDescription(answerDescription);
      }
    });

    answerCandidates.snapshotChanges().subscribe((snapshots) => {
      snapshots.forEach((snapshot) => {
        if (snapshot.type === 'added') {
          const candidate = new RTCIceCandidate(snapshot.payload.doc.data());
          this.rpcService.pc.addIceCandidate(candidate);
        }
      });
    });
  }

  private async joinCall(callId: string): Promise<void> {
    const callDoc = this.firestore.collection('calls').doc(callId);
    const answerCandidates = callDoc.collection('answerCandidates');
    const offerCandidates = callDoc.collection('offerCandidates');

    this.rpcService.pc.onicecandidate = (event) => {
      if (event.candidate) answerCandidates.add(event.candidate.toJSON());
    };

    let res = await callDoc.get().toPromise();

    const offerDesctiption = res.data() as RTCSessionDescriptionInit;
    await this.rpcService.pc.setRemoteDescription(
      new RTCSessionDescription(offerDesctiption)
    );

    const answerDescription = await this.rpcService.pc.createAnswer();
    await this.rpcService.pc.setLocalDescription(answerDescription);

    const answer = {
      sdp: answerDescription.sdp,
      type: answerDescription.type,
    };

    callDoc.update({ date: new Date(), answer });

    offerCandidates.snapshotChanges().subscribe((snapshot) => {
      snapshot.forEach((item) => {
        if (item.type === 'added') {
          debugger
          const data = item.payload.doc.data();
          this.rpcService.pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  }
}
