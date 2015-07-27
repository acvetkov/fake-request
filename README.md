# Fake request

[![Build Status](https://travis-ci.org/acvetkov/fake-request.svg?branch=master)](https://travis-ci.org/acvetkov/fake-request)

XMLHttpRequest mocker for testing your awesome js-code.

Installation
------------

```
npm install fake-request
```

Cooking with pleasure
---------------------

Simple module with request:

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://my-domain.com/path/?a=1&b=2');
xhr.send();
```

Let's test it:

```javascript
var FakeRequest = require('fake-request');
before(function () {
    FakeRequest.mock();
});
beforeEach(function () {
    FakeRequest.reset();
});
after(function () {
    FakeRequest.restore();
});
it('should send request', function () {
    assert.lengthOf(FakeRequest.requests, 1);
});
it('should set correct url', function () {
    var uri = FakeRequest.lastRequest.uri; // URIjs inside!
    assert.equal(uri.host(), 'my-domain.com');
    assert.equal(uri.protocol(), 'http');
    assert.equal(uri.pathname(), '/path/');
});
it('should send correct query string', function () {
    assert.deepEqual(FakeRequest.lastRequest.query, {
        a: 1,
        b: 2
    });
});
```

You can test request body

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://my-domain.com/path/?a=1&b=2');
xhr.send('body1=a&body2=b');
```

```javascript
it('should have correct body', function () {
    assert.deepEqual(FakeRequest.lastRequest.body, {
        body1: 'a',
        body2: 'b'
    });
});
```

Maybe you pass FormData/Blob/ArrayBuffer? 

```javascript
var body = new Blob();
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://my-domain.com/path/?a=1&b=2');
xhr.send(blob);
```

```javascript
it('should have correct body', function () {
    assert.equal(FakeRequest.lastRequest.body, blob);
});
```

Let's test request headers

```javascript
var xhr = new XMLHttpRequest();
xhr.setRequestHeader('header1', 'value1');
xhr.setRequestHeader('header2', 'value2');
xhr.setRequestHeader('header3', 'value3');
xhr.open('GET', 'http://my-domain.com/path/?a=1&b=2');
xhr.send('body1=a&body2=b');
```

and tests

```javascript
it('should have correct request headers', function () {
    assert.deepEqual(FakeRequest.lastRequest.headers, {
        header1: 'value1',
        header2: 'value2',
        header3: 'value3'
    });
});
```

What about response
-------------------

```javascript
it('should be ...', function () {
    FakeRequest.respondToLast({ // call onload handler, if it's specified
        readyState: 4,
        status: 200,
        responseText: 'my response'
    });
    FakeRequest.respondTo(0, { // call onload handler for first request, if it's specified
        readyState: 4,
        status: 200,
        responseText: 'my response',
        responseHeaders: 'content-type: text/json'
    });
    FakeRequest.lastRequest.respond({ // call onload handler for last request, if it's specified
        readyState: 4,
        status: 200,
        responseText: 'my response',
        responseHeaders: 'content-type: text/html'
    });
});
```

You can respond to specified request

```javascript
// via number arg
FakeRequest.respondTo(0, response); // responds to first request
FakeRequest.respondTo(1, response); // responds to second request
// via regexp arg (for url)
FakeRequest.respondTo(/my-domain.*a=b/, response);
// via string
FakeRequest.respondTo('http://my-domain/path/?a=b', response);
FakeRequest.respondTo('http://my-domain', response);
```

You can respond to all

```javascript
FakeRequest.respond(response);
```

or respond to last

```javascript
FakeRequest.respondToLast(response);
```

Get request
-----------

You can get any request by FakeRequest.get();

```javascript
// by number
FakeRequest.get(0) // returns first request
FakeRequest.get(0).respond(response); // respond to first
// by regexp
FakeRequest.get(/mydomain\.com/).forEach(function (req) {
    req.respond(response);
});
FakeRequest.get(/mydomain\.com.*\/search/).forEach(function (req) {
    assert.equal(req.status, 200);
});
// by string
FakeRequest.get('http://my-site.com').forEach(function (req) {
    assert.equal(req.status, 200);
});
FakeRequest.get('http://my-site.com/path/?a=b').forEach(function (req) {
    req.respond(response);
});
```

Where it works
--------------

Node.js >= 0.10

```javascript
var FakeRequest = require('fake-request');
```

The goal of this module is testing XMLHttp request on Node.js platform, but you can make build for real browser or PhantomJS.

At first install devDependencies

```javascript
npm install fake-request
```

and make packed UMD version (require.js, CommonJS, global)


```javascript
grunt build
```

and in your browser code

```html
<script src='path/to/fake-request.0.0.2.min.js'>
```
or 

```js
// require.js
define(['path/to/fake-request'], function (FakeRequest) {
    FakeRequest.mock();
});
// or 
var FakeRequest = requirejs('path/to/fake-request');
```

and finally you can use CommonJS version like Node.js

```javascript
var FakeRequest = require('path/to/fake-request');
```

Tests
-----

```javascript
npm install fake-request
```

```javascript
grunt test
```


Any questions?
--------------

Feel free to [open issue](https://github.com/acvetkov/fake-request/issues).
