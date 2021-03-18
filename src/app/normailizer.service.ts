import { Injectable } from '@angular/core';

@Injectable()
export class NormailizerService {

  constructor() { }

  normalize = (function () {
    let from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç®Å",
      to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunnccRfA",
      mapping = {};

    for (let i = 0, j = from.length; i < j; i++)
      mapping[from.charAt(i)] = (from.charAt(i) == 'Ñ' || from.charAt(i) == 'ñ') ? 'ni' : to.charAt(i);

    return function (str: string) {
      let ret = [];
      for (let i = 0, j = str.length; i < j; i++) {
        let c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i)))
          ret.push(mapping[c]);
        else
          ret.push(c);
      }
      return ret.join('');
    }

  })();


}
