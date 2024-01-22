import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss'
})
export class ChatsComponent implements OnInit{


  public mensaje: string = '';
  public elemento: any;
  

  constructor(public chatService: ChatService) { 
    this.getChats();
  }
  ngOnInit(): void {
    this.elemento = document.getElementById('app-mensajes')!;
  }


  enviarMensaje(){
   
    if (this.mensaje.length === 0){
      return;
    }
    this.chatService.agregarMensaje(this.mensaje).then( () => {
      this.mensaje = '';
    }).catch( (err) => {
      console.log('Error al enviar', err);
    });
  }


  getChats(){
    this.chatService.cargarmensajes().subscribe(() => {
      setTimeout(() => {
        this.elemento.scrollTop = this.elemento.scrollHeight;
      },20)
    });
  }

}
