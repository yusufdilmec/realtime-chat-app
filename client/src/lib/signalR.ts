import * as signalR from "@microsoft/signalr";

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private url: string;

  constructor(hubUrl: string) {
    this.url = hubUrl;
  }

  public async startConnection(token: string): Promise<void> {
    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(this.url, {
          accessTokenFactory: () => token,
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,


        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      await this.connection.start();
      console.log("SignalR Connected.");
    } catch (error) {
      console.error("SignalR Connection Error: ", error);
      setTimeout(() => this.startConnection(token), 5000);
    }
  }

  public async sendMessage(method: string, ...args: any[]): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke(method, ...args);
      } catch (error) {
        console.error(`Error sending message via ${method}: `, error);
      }
    } else {
      console.error("SignalR connection is not established.");
    }
  }

  public on(method: string, callback: (...args: any[]) => void): void {
    if (this.connection) {
      this.connection.on(method, callback);
    }
  }

  public off(method: string): void {
    if (this.connection) {
      this.connection.off(method);
    }
  }

  public async stopConnection(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log("SignalR Disconnected.");
      } catch (error) {
        console.error("Error stopping SignalR connection: ", error);
      }
    }
  }
}
export const chatHubService = new SignalRService(
  "http://localhost:5285/chathub"
);



