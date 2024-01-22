import { Component } from '@angular/core';
import { Firestore, collectionData,} from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { ChatService } from './components/services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  public usuario: any = {};
  public chats$!: Observable<any[]>;


  constructor(private afAuth: Firestore, public chatService: ChatService) {
    const itemCollection = collection(this.afAuth, 'chats');
    this.chats$ = collectionData(itemCollection);
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    console.log (this.usuario);
  }


  logout(){
    this.chatService.logout();
  }
}
