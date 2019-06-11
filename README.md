# Plagiarism checker for NodeJS

<p align="center">
    <img src="https://raw.githubusercontent.com/botaniQQQ/plagiarism/master/logo.png">
</p>

### Installation
```
npm i plagiarism
```

### Usage

```javascript
const plagiarism = require('plagiarism');

plagiarism('Your text ...', {
    "text.ru": {
        "userkey": "USER KEY"
    }
}).then(res => {
    console.log(res);
    //{
    //    "text.ru": {
    //        "userkey": "USER KEY",
    //        "timeout": 120,
    //        "uid": "TEXT UID",
    //        "text_unique": 43.02,
    //        "spell_check": "",
    //        "seo_check": ""
    //    },
    //    "main" {
    //        "percent": 43.02,
    //        "chars": "",
    //        "words": "",
    //        "spam": "",
    //        "water": "",
    //    }
    //}
}).catch(err => {
    console.error(err);
});
```

### Params `text.ru`

- `text` - checked text for uniqueness from 100 to 150000 characters (required);
- `userkey` - your personal secret key (required);
- `exceptdomain` - domains that you want to exclude are separated by spaces or commas (optional);
- `excepturl` - Links that you want to exclude from checking are separated by spaces or commas (optional);
- `visible` - availability of test results to other users. The default is the result (`https://text.ru/plagiarism/{TEXT UID}`) available only to your account. If you want the results of the checks to be open, you must pass the value `vis_on` (optional);
- `copying` - if you do not want a link with a visual design of the test results `https://text.ru/plagiarism/{TEXT UID}`, then you need to pass the value `noadd` (optional);
- `callback` - your URL (link) to which we will send a POST request with the results of the verification immediately after its completion (optional);
- `uid` - unique text identifier (optional);
- `jsonvisible` - if you want to get more detailed information about the test results (see the additional parameters below), you need to pass the value `detail` (optional);
- `timeout` - the number of seconds to wait for a response, by the expiration of the time, a response will be sent with the `uid` text, which can be received upon repeated request (default 120 sec).

More information: https://text.ru/api-check/manual

### Result `text.ru`

```json
{
    "text.ru": {
        "userkey": "USER KEY",
        "timeout": 120,
        "uid": "TEXT UID",
        "text_unique": 43.02,
        "spell_check": "",
        "seo_check": ""
    },
    "main": {
        "percent": 43.02,
        "chars": "",
        "words": "",
        "spam": "",
        "water": ""
    }
}
```

**Option:** `{"jsonvisible": "detail"}`

As soon as one of the parameters `text_unique` or `spell_check` or `seo_check` is available, the result will be sent.

```json
{
    "text.ru": {
        "userkey": "USER KEY",
        "jsonvisible": "detail",
        "timeout": 120,
        "uid": "TEXT UID",
        "text_unique": "",
        "spell_check": [],
        "seo_check": {
            "count_chars_with_space": 150,
            "count_chars_without_space": 132,
            "count_words": 20,
            "water_percent": 3,
            "list_keys": [],
            "list_keys_group": [],
            "spam_percent": 35,
            "mixed_words": []
        }
    },
    "main": {
        "percent": "",
        "chars": 150,
        "words": 20,
        "spam": 35,
        "water": 3
    }
}
```

Next, send a second request and get a full response.

```json
{
    "text.ru": {
        "userkey": "USER KEY",
        "jsonvisible": "detail",
        "timeout": 120,
        "uid": "TEXT UID",
        "text_unique": 43.02,
        "spell_check": [],
        "seo_check": {
            "count_chars_with_space": 150,
            "count_chars_without_space": 132,
            "count_words": 20,
            "water_percent": 3,
            "list_keys": [],
            "list_keys_group": [],
            "spam_percent": 35,
            "mixed_words": []
        }
    },
    "main": {
        "percent": 43.02,
        "chars": 150,
        "words": 20,
        "spam": 35,
        "water": 3
    }
}
```

**Option:** `{"callback": "https://exanple.com/callback"}`

```json
{
    "text.ru": {
        "userkey": "USER KEY",
        "callback": "https://exanple.com/callback",
        "timeout": 120,
        "uid": "TEXT UID"
    },
    "main": {}
}
```

###### 2019, botaniQQQ