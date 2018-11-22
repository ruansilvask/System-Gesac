import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

    getLocalUser() {
        const usr = localStorage.getItem('localUser');
        if (usr == null) {
            return null;
        } else {
            return JSON.parse(usr);
        }
    }

    setLocalUser(obj) {
        if (obj == null) {
            localStorage.removeItem('localUser');
        } else {
            localStorage.setItem('localUser', JSON.stringify(obj));
        }
    }

}
