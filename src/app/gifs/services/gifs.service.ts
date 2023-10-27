import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchReponse, Gif } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string [] = [];


  private apiKey    : string = 'ACNF2F2b6onwiOVNVij8ezrv87uDm9Ye';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor( private http: HttpClient) {
    this.getLocalStorage();
    console.log('Gifs service ready...');

    if( this.tagHistory.length !== 0){
      this.searchTag(this.tagHistory[0]);
    }

   }

  get tagHistory(){
    return [...this._tagsHistory];
  }

  // async searchTag( tag: string ): Promise<void> {
  //   if( tag.length === 0) return;
  //   this.organizeHistory(tag);
  //   //this._tagsHistory.unshift( tag );

  //   const resp = await fetch('https://api.giphy.com/v1/gifs/search?api_key=ACNF2F2b6onwiOVNVij8ezrv87uDm9Ye&q=valorant&limit=10');
  //   const data = await resp.json();
  //   console.log( data );

  // }

  searchTag( tag: string ): void {

      if( tag.length === 0) return;
      this.organizeHistory(tag);

      const params = new HttpParams()
              .set('api_key',this.apiKey)
              .set('limit', '10')
              .set('q', tag);

      this.http.get<SearchReponse>(`${this.serviceUrl}/search`, { params })   // { params: params }
            .subscribe( resp => {
              this.gifList = resp.data;
              //console.log( {gifList: this.gifList } );
            } );

   }

  private organizeHistory( tag: string){
    tag = tag.toLowerCase();

    if ( this._tagsHistory.includes(tag) ){
      this._tagsHistory = this._tagsHistory.filter( oldTag => oldTag !== tag);
    }
    this._tagsHistory.unshift( tag );
    this._tagsHistory = this._tagsHistory.splice(0,10);

    this.saveLocalStorage();

  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify( this._tagsHistory) );
  }

  private getLocalStorage() {
    if( !localStorage.getItem('history') ) return;
    this._tagsHistory = JSON.parse( localStorage.getItem('history')! );
  }



}
