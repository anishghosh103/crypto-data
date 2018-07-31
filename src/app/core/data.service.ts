import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private socket = io.connect('https://coincap.io');
  private subscribers = [];

  constructor(private http: HttpClient) {
    this.socket.on('trades', data => {
      this.subscribers.forEach(subscriber => subscriber(data.msg));
    });
  }

  getData() {
    return new Promise((resolve, reject) => {
      this.http.get('https://coincap.io/front').subscribe(
        resolve, reject
      );
    });
  }

  subscribe(subscriber) {
    this.subscribers.push(subscriber);
  }

}
