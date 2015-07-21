Fake request
============

XMLHttpRequest mocker for testing your awesome js-code.

Installation
------------

```
npm install fake-request
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
npm install fake-request --save-dev
```

and make packed version


```javascript
grunt build
```

and in your browser code

```html
<script src='path/to/fake-request.0.0.2.min.js'>
```


Cooking with pleasure
---------------------

Simple module with request:

```javascript
// your own XMLHttpRequest module
var Request = require('request');
new Request()
        .set('header', 'value') // set request header
        .get('http://my-domain.com/path/?a=1&b=2'); // send GET request
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
    var uri = FakeRequest.lastRequest.uriObject; // URIjs inside!
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
it('should have correct body', function () {
    assert.deepEqual(FakeRequest.lastRequest.body, {
        param: 'body_param' 
    });
});
```

Maybe you pass FormData? 

```javascript
it('should have correct body', function () {
    assert.equal(FakeRequest.lastRequest.body, yourFormData);
});
```

Let's test request headers

```javascript
new Request()
        .set('header1', 'value1') // set request headers
        .set('header2', 'value2')
        .set('header3', 'value3')
        .set('header4', 'value4')
        .get('url');
```

and tests

```javascript
it('should have correct request headers', function () {
    assert.deepEqual(FakeRequest.lastRequest.headers, {
        header1: 'value1',
        header2: 'value2',
        header3: 'value3',
        header4: 'value4'
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

Any questions?
--------------

Feel free to [open issue](https://github.com/acvetkov/fake-request/issues).