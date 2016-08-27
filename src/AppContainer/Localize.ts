import * as i18next from 'i18next';
import * as moment from 'moment';
import * as numeral from 'numeral';

export default class LocalizeSpawner {
  constructor (private translationResources: any) {
  }

  loadLocale (langCode: string): LocalizeContext {
    const i18n = i18next.init({
      lng: langCode,
      resources: this.translationResources,
    });

    const localMoment = moment().locale(langCode);

    return new LocalizeContext(langCode, i18n);
  }
}


export class LocalizeContext {
  constructor (
    private langCode: string,
    private i18n: I18next.I18n
  ) {
  }

  translate (key: string, params?: any) {
    return this.i18n.t(key, params);
  }

  private formatMoment (datetime: any, format: string): string {
    return moment(datetime).locale(this.langCode).format(format);
  }

  customDatetime (datetime: any, format: string): string { return this.formatMoment(datetime, format); }
  time (datetime: any): string { return this.formatMoment(datetime, "LT"); }
  fullDatetime (datetime: any): string { return this.formatMoment(datetime, "LLL"); }
  abbrDatetime (datetime: any): string { return this.formatMoment(datetime, "lll"); }
  fullDate (datetime: any): string { return this.formatMoment(datetime, "LL"); }
  abbrDate (datetime: any): string { return this.formatMoment(datetime, "ll"); }
  numericDate (datetime: any): string { return this.formatMoment(datetime, "L"); }
}
