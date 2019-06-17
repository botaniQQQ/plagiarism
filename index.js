const axios = require('axios');
const qs = require('qs');

const plagiarism = async (text, params) => {
    if (typeof text === 'object' && text['text.ru'].uid) {
        params = JSON.parse(JSON.stringify(text));
    } else if (text.length < 100 || text.length > 15000) {
        return Promise.reject('100..15000');
    } else if (!params) {
        return Promise.reject('ERROR PARAMS');
    }

    let api = params['text.ru'] ? JSON.parse(JSON.stringify(params['text.ru'])) : {};
    api.timeout = api.timeout ? parseInt(api.timeout) : 120;
    let {uid} = api;

    if (!uid) {
        try {
            let {data} = await axios.post('https://api.text.ru/post', qs.stringify({text, ...api}));
            if (!data.text_uid) {
                return Promise.reject('ERROR UID');
            }
            api.uid = data.text_uid;
            if (api.callback) {
                return Promise.resolve({"text.ru": api, "main": {}});
            }
        } catch (e) {
            console.error(e);
            return Promise.reject('ERROR POST');
        }
    }

    return new Promise(resolve => {
        let result = {"text.ru": api, "main": {}}, n = 0, i = setInterval(() => {
            axios.post('https://api.text.ru/post', qs.stringify(api)).then(res => {
                let {text_unique, spell_check, seo_check} = res && res.data ? res.data : {};
                let un = !!text_unique;
                let sp = !!spell_check;
                let se = !!seo_check;
                if (un || sp || se) {
                    text_unique = text_unique ? parseFloat(text_unique) : '';
                    spell_check = spell_check ? JSON.parse(spell_check) : '';
                    seo_check = seo_check ? JSON.parse(seo_check) : '';
                    const {count_chars_with_space, count_words, spam_percent, water_percent} = seo_check || {};
                    result.main.percent = typeof text_unique === 'number' ? text_unique : '';
                    result.main.chars = typeof count_chars_with_space === 'number' ? count_chars_with_space : '';
                    result.main.words = typeof count_words === 'number' ? count_words : '';
                    result.main.spam = typeof spam_percent === 'number' ? spam_percent : '';
                    result.main.water = typeof water_percent === 'number' ? water_percent : '';
                    result["text.ru"] = {...result["text.ru"], ...{text_unique, spell_check, seo_check}};
                }
                if (uid) {
                    if (un) {
                        if (api.jsonvisible) {
                            if (sp && se) {
                                clearInterval(i);
                                return resolve(result);
                            }
                        } else {
                            clearInterval(i);
                            return resolve(result);
                        }
                    }
                } else if (un || sp || se) {
                    clearInterval(i);
                    return resolve(result);
                }
            }).catch(() => {
                clearInterval(i);
                return resolve(result);
            });
            if (++n >= api.timeout / 2) {
                clearInterval(i);
                return resolve(result);
            }
        }, 2000);
    });
};

module.exports = plagiarism;