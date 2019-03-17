import { Injectable } from "@angular/core";

import feathers from '@feathersjs/feathers';
import rest from '@feathersjs/rest-client';

export interface IDataAPI<T> {

    find(params?:any):Promise<T>;
    get(id:string, params?:any):Promise<T>;
    create(data:T, params?:any):Promise<any>;
    update(id:string, data:T, params?:any):Promise<any>;
    patch(id:string, data:T, params?:any):Promise<any>;
    remove(id:string, params?:any):Promise<any>;
    setup(app:any, path:string):any;
}
@Injectable()
export class ApiClientService{

    private client:any;
    private rest:any;

    constructor(){
        this.client = feathers();
        this.rest = rest('http://localhost:3030');
        this.client.configure(this.rest.fetch((url:string, init:any) => {
             let settings = Object.assign({'credentials': 'same-origin'}, init);
             return window.fetch(url, settings);
         }));
    }
    
    public socgen_data():IDataAPI<any[]>{
        return this.client.service('socgen-data');
    }


    public other_data():IDataAPI<any[]>{
        return this.client.service('other-data');
    }
}