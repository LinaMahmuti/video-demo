export class StunServersConfig {
    static readonly stunServerList = {
        iceServers: [
            {
                urls: ['stun:stun.l.google.com:19302']
            }
        ],
        iceCandidatePoolSize: 10
    }
}
