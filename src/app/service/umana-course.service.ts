import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CandidatesResponse } from '../dto/candidates-response';
import { CoursesResponse } from '../dto/courses-response';
import { TokenRequest } from '../dto/token-request';
import { TokenResponse } from '../dto/token-response';
import { Candidate } from '../resource/candidate';
import { Course } from '../resource/course';

const url = "/api"; // in produzione il valore sarà per esempio "https://rest.antreem.it"

@Injectable({
  providedIn: 'root'
})
export class UmanaCourseService {
  isAlive?: boolean;
  // nel constructor del nostro UmanaCourseService mettiamo la dipendenza a HttpClient
  constructor(
    private http: HttpClient
  ) { }
  // sappiamo che tutte le chiamate http vengono fatte in asincrono
  // di conseguenza hanno come risultato un Observable

  // per semplificarci la vita, ad ogni metodo HTTP corrisponde un metodo nell'oggetto http
  // GET -> get
  // POST -> post
  // PATCH -> patch
  // PUT -> put
  // DELETE -> delete
  checkAlive(): void {
    // obiettivo: effetuare una chiamate HTTP GET verso la url (definita sopra)
    // se la url risponde significa che il server REST è "up and running"
    // se non risponde o risponde con errore allora abbiamo un problema

    // il primo parametro è sempre la url da invocare (nel nostro caso è url)
    // ma in generale sarà url + "/courses" oppure url + "/subscriptions"
    // questo vale per tutti i metodi (get, patch, post, eccetera)
    // il secondo parametro sarebbe il body della request da inviare, ma sappiamo
    // anche che la chiamata HTTP GET non ha body per specifiche del protocollo
    // come tipo generico del metodo get DEVO (è sempre meglio farlo) mettere
    // il tipo del parametro della risposta "ok" (nel nostro caso any)
    let response = this.http.get<any>(url);

    // ripasso dell'Observable: devo dichiarare due metodi di callback all'interno della mia
    // class TypeScript, uno per risultato OK e uno per risultato ERRORE
    // poi uso le espressioni freccia (lambda) per invocare i metodi di callback
    response.subscribe((answer) => this.aliveOk(answer), (error) => this.aliveKo(error));

  }

  // la chiamata "alive" è andata bene
  private aliveOk(answer: any): void {
    this.isAlive = true;
  }
  // il tipo dell'errore è sempre HttpErrorResonse
  private aliveKo(error: HttpErrorResponse): void {
    this.isAlive = false;
  }

  roles?: string[];
  token?: string;

  login(username: string, password: string): void {
    let request = new TokenRequest();
    request.username = username;
    request.password = password;
    // primo argomento è la URL
    // il secondo argomento è il body della richiesta HTTP
    let response = this.http.post<TokenResponse>(url + "/token", request);
    // do le arrow expression sui metodi di callback
    response.subscribe((answer) => this.loginOk(answer), (error) => this.loginKo(error));
  }

  private loginOk(answer: TokenResponse): void {
    console.log(answer);
    this.roles = answer.authorization.roles;
    this.token = answer.authentication.token_type + ' ' + answer.authentication.access_token;
  }
  private loginKo(error: HttpErrorResponse): void {
    // error.status è la risposta HTTP: in questo caso 401
    // in realtà può essere anche 0 che è fuori range 100-599
    // la risposta 0 significa timeout

    console.log(error);
  }

  // questa non è la risposta esatta: l'array di Candidate NON deve stare qui, ma in un component
  // lunedì vedremo come sistemare la questione
  candidates?: Candidate[];
  getCandidates(): void {
    if (this.token === undefined) {
      // TODO: in realtà dobbiamo dare un messaggio del tipo: non sei ancora autenticato
      return;
    }
    // creo gli header
    // per aggiungere nuovi header possiamo usare un oggetto TypeScript come argomento
    let headers = new HttpHeaders({
      authorization: this.token
    });
    // primo argomento è la url
    // il secondo argomento è il body - che nella GET non c'è
    // il terzo argomento sono gli header (quelli aggiuntivi rispetto allo standard)
    // vanno messi tra {}
    let response = this.http.get<CandidatesResponse>(url + "/candidates", { headers });
    response.subscribe((answer) => this.getCandidatesOk(answer), (error) => this.getCandidatesKo(error));
  }
  private getCandidatesOk(answer: CandidatesResponse): void {
    this.candidates = answer._embedded.candidates;
  }
  private getCandidatesKo(error: HttpErrorResponse) {
    console.log(error);
  }

  // vedi sopra: non è la risposta giusta
  courses?: Course[];
  getCourses(): void {
    if (this.token === undefined) {
      // TODO: in realtà dobbiamo dare un messaggio del tipo: non sei ancora autenticato
      return;
    }
    // creo gli header
    let headers = new HttpHeaders({
      authorization: this.token
    });
    // creo l'observable
    let response = this.http.get<CoursesResponse>(url + "/courses", { headers });
    response.subscribe((answer) => this.getCoursesOk(answer), (error) => this.getCoursesKo(error));
  }
  private getCoursesOk(answer: CoursesResponse): void {
    this.courses = answer._embedded.courses;
  }
  private getCoursesKo(error: HttpErrorResponse) {
    console.log(error);
  }

}
