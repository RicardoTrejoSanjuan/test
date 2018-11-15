import {Injectable} from '@angular/core';
import { NotificationsService } from 'angular2-notifications';

@Injectable()
export class Notifications {

    constructor(private _service: NotificationsService){
    }


  success(title?: string, content?: string) {
      this.validaData(title,content,'success');
  }

  error(title?: string, content?: string) {
    this.validaData(title,content,'error');
  }
  alert(title?: string, content?: string) {
    this.validaData(title,content,'alert');
  }
  info(title?: string, content?: string) {
    this.validaData(title,content,'info');
  }


  private validaData(title,content,success):void{
      if(title !== undefined && content !== undefined){
        this.configurationNotifications(this.validTitle(title),content,success);
      }else{
        this.configurationNotifications(this.validTitle(undefined),title,success);
      }
  }

  private validTitle(title):string{
    if(title !== undefined){
        title = title;
    }else{
        title = 'PortalBig';
    }
    return title;
  };

  private configurationNotifications(title:string, content:string,type:string):void{
      let timeOut = 2500;
    if(type === 'success'){
        this._service.success(
            title,
            content,
            {
                timeOut: timeOut,
                showProgressBar: true,
                clickToClose: true,
            }
        );
      }
      else if(type === 'error'){
        this._service.error(
            title,
            content,
            {
                timeOut: timeOut,
                showProgressBar: true,
                clickToClose: true,
            }
        );
      }
      else if(type === 'alert'){
        this._service.alert(
            title,
            content,
            {
                timeOut: timeOut,
                showProgressBar: true,
                clickToClose: true,
            }
        );
      }
      else if(type === 'info'){
        this._service.info(
            title,
            content,
            {
                timeOut: timeOut,
                showProgressBar: true,
                clickToClose: true,
            }
        );
      }
  }

}
