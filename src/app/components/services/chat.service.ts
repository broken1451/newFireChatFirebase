import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, CollectionReference, DocumentReference } from '@angular/fire/firestore';
import { collection, addDoc, query,limit,orderBy } from "firebase/firestore"; 
import { Mensaje } from '../interfaces/chat.interface';
import { Observable, map } from 'rxjs';

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { environment } from '../../../environments/environment';
import { getAuth, signInWithPopup, GoogleAuthProvider, TwitterAuthProvider } from "firebase/auth";
import { setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from "firebase/auth";
import { signInWithRedirect } from '@angular/fire/auth';



@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public chats: Mensaje[] = [];

  private itemCollections!: Observable<Mensaje[]>;
  public chatCollection!: CollectionReference<Mensaje>;
  public usuario: any = {};
  public token: any;


  constructor(private http: HttpClient, private fireStorage: Firestore) {
    this.token = localStorage.getItem('token');
    console.log ('Token ', this.token);
  }



  /**
   * Carga los mensajes del chat.
   * El bucle for interno se encarga de invertir el orden de los elementos en el array mensajes y almacenarlos en el array chats. 
   * Esto asegura que los mensajes más recientes se encuentren al principio del array chats.
   * 
   * @returns Un observable que emite un array de mensajes cargados.
   */
  cargarmensajes(){
    const itemCollections = query(collection(this.fireStorage, 'chats'), orderBy('fecha', 'desc'),limit(5));
    this.itemCollections = collectionData( itemCollections ) as Observable<Mensaje[]>;
    return this.itemCollections.pipe(
      map( (mensajes: Mensaje[]) => {
        // this.chats = mensajes;
        this.chats = [];
        for (let mensaje of mensajes){
          this.chats.unshift(mensaje);
        }
        // console.log (this.chats);
        return this.chats;
      }),
    );
  }

 async  agregarMensaje(texto: string){
    let mensaje: Mensaje  | any = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    }
    console.log (this.usuario);
  
    const app = initializeApp(environment.firebaseConfig);
    const db = getFirestore(app);
    const docRef = await addDoc(collection(db, "chats"),mensaje);
    return docRef;
  }


  login(proveedor: string) {
    console.log (proveedor);
    const auth = getAuth();
    if (proveedor === 'google') {
      signInWithPopup(auth, new GoogleAuthProvider()).then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token: any = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;       // IdP data available using getAdditionalUserInfo(result)
        // ...
        this.usuario.nombre = user.displayName;
        this.usuario.uid = user.uid;
        localStorage.setItem('usuario', JSON.stringify(this.usuario));
        localStorage.setItem('token', token);
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
    } else {
      console.log ('Twitter');
      // const provider = new TwitterAuthProvider();
      signInWithPopup(auth, new TwitterAuthProvider)
      .then((result) => {
        console.log ('Result ', result);
        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        // You can use these server side with your app's credentials to access the Twitter API.
        const credential = TwitterAuthProvider.credentialFromResult(result);
        const token:any = credential?.accessToken;
        const secret = credential?.secret;
    
        // The signed-in user info.
        const user = result.user;
        this.usuario.nombre = user.displayName;
        this.usuario.uid = user.uid;
        localStorage.setItem('token', token);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        console.log ('Error ', error);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = TwitterAuthProvider.credentialFromError(error);
        // ...
      });
    }
  }


  logout(){
    const auth = getAuth();
    auth.signOut().then(() => {
      // Sign-out successful.
      console.log('Sign-out successful.');
      this.usuario = {};
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
    }).catch((error) => {
      // An error happened.
      console.log('An error happened.');
    });
  }
}