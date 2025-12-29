// services/SocketService.ts
import { io, Socket } from "socket.io-client";

class SocketService {
    private static instance: SocketService;
    private socket: Socket | null = null;
    private readonly url = "https://curious-pauline-catchable.ngrok-free.dev";

    private constructor() {
        this.initConnection();
    }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    private initConnection(): void {
        console.log("Initializing socket...");

        this.socket = io(this.url, {
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 10,  // limit retries
            reconnectionDelay: 1000,   // 1s delay
            timeout: 20000,            // 20s timeout
        });

        this.registerDefaultListeners();
    }

    private registerDefaultListeners(): void {
        if (!this.socket) return;

        this.socket.on("connect", () => {
            console.log("Socket connected:", this.socket?.id);
        });

        this.socket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
        });

        this.socket.on("connect_error", (err) => {
            console.log("Connection error:", err.message);
        });

        this.socket.on("reconnect", (attempt) => {
            console.log("Reconnected after attempts:", attempt);
        });

        this.socket.on("reconnect_failed", () => {
            console.log("Reconnection failed.");
        });

        this.socket.on("error", (err) => console.log("Socket error:", err));
        this.socket.io.on("error", (err) => console.log("Manager error:", err));
        this.socket.io.on("reconnect_attempt", (n) => console.log("Reconnect attempt", n));

    }

    public getSocket(): Socket | null {
        return this.socket;
    }

    public disconnect(): void {
        if (this.socket) {
            console.log("Disconnecting socket...");
            this.socket.removeAllListeners();
            this.socket.disconnect();
            this.socket = null;
        }
    }

    public reconnect(): void {
        console.log("Reconnecting socket...");
        this.disconnect();
        this.initConnection();
    }
}

export default SocketService;
