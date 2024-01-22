import { Component } from '@angular/core';
import { ChatService } from '../services/chat.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private chatService: ChatService) { }

  login(proveedor: string) {
    console.log (proveedor);
    if (proveedor === 'google') {
       this.chatService.login(proveedor);
    } else {
      this.chatService.login(proveedor);
    }
  }

  logout(){
    this.chatService.logout();
  }
}
