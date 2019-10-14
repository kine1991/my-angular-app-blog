import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User, FbAuthResponse } from 'src/app/shared/interfaces';
import { Observable, throwError, Subject} from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {

    public error$: Subject<string> = new Subject<string>()

    constructor(private http: HttpClient) { }

    get token(): string {
        const expDate = new Date(localStorage.getItem('fb-token-exp'))
        if(new Date() > expDate){
            this.logout()
            return null
        }
        return localStorage.getItem('fb-token')
    }

    login(user: User): Observable<any>{
        user.returnSecureToken = true
        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
            .pipe(
                tap(this.setToken),
                catchError(this.handleError.bind(this)) // bind(this) потому что в методе handleError будем использовать слово this
            )
    }

    register(data){
        const {email, password, name} = data
        const user = {email, password, returnSecureToken: true}
        // console.log(email, password, name)
        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}`, user)
            .pipe(
                tap(this.setToken),
                catchError(this.handleError.bind(this)) // bind(this) потому что в методе handleError будем использовать слово this
            )
    }

    logout(){
        this.setToken(null)
    }

    isAuthenticated(): boolean{
        return !!this.token
    }

    private handleError(error: HttpErrorResponse){
        const {message} = error.error.error
        console.log(message)
        switch(message){
            case 'INVALID_EMAIL':
                this.error$.next('Invalid email')
                break
            case 'INVALID_PASSWORD':
                this.error$.next('Invalid password')
                break
            case 'EMAIL_NOT_FOUND':
                this.error$.next('Email not found')
            case 'EMAIL_EXISTS':
                this.error$.next('The email address is already in use by another account')
            case 'OPERATION_NOT_ALLOWED':
                this.error$.next('Password sign-in is disabled for this project')
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                this.error$.next('We have blocked all requests from this device due to unusual activity. Try again later.')
                break
        }
        
        return throwError(error)
        console.log('eeerrroor----')
    }

    private setToken(res: FbAuthResponse | null){
        if(res){
            const expDate = new Date(new Date().getTime() + +res.expiresIn * 1000)
            localStorage.setItem('fb-token', res.idToken)
            localStorage.setItem('fb-token-exp', expDate.toString())
        } else {
            localStorage.clear()
        }

        // console.log('res')
        // console.log(res)
    }
}