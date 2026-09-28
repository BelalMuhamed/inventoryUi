import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment.production';


@Injectable({
  providedIn: 'root'
})
export class SignalRServiceService {
   baseLink = environment.baseLink;

  private hubConnection!: signalR.HubConnection;

  public startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseLink+'notificationHub')
      .build();

    this.hubConnection
      .start()
      .catch(err => console.error('SignalR error:', err));
  }

    onReceiveNotification(callback: (message: string) => void) {
    this.hubConnection.on('ReceiveNotification', callback);
  }

  onComponentLocked(callback: (componentName: string, userName: string) => void) {
    this.hubConnection.on('ComponentLocked', callback);
  }

  onComponentUnlocked(callback: (componentName: string) => void) {
    this.hubConnection.on('ComponentUnlocked', callback);
  }

  lockComponent(componentName: string, userName: string) {
  this.hubConnection.invoke("ComponentLocked", componentName, userName)
    .catch(err => console.error(err));
}

unlockComponent(componentName: string) {
  this.hubConnection.invoke("ComponentUnlocked", componentName)
    .catch(err => console.error(err));
}


}
