import Losungen from './losungen';

module.exports = (event, context, callback) => {
    const date = new Date();
    const dateText = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}T00:00:00.0Z`;
    const text = new Losungen().getText(date);
    callback(null, {
        uid: dateText,
        updateDate: dateText,
        titleText: 'Die Losung von heute',
        mainText: text,
        redirectionUrl: 'http://www.losungen.de/fileadmin/media-losungen/kalender/kalendermobil.html'
    });
};
