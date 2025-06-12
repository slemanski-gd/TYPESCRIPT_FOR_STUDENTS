var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["Ok"] = 200] = "Ok";
    HttpStatus[HttpStatus["InternalServerError"] = 500] = "InternalServerError";
})(HttpStatus || (HttpStatus = {}));
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["Post"] = "POST";
    HttpMethod["Get"] = "GET";
})(HttpMethod || (HttpMethod = {}));
var Observer = /** @class */ (function () {
    function Observer(handlers) {
        this.isUnsubscribed = false;
        this.handlers = handlers;
    }
    Observer.prototype.next = function (value) {
        var _a;
        if (((_a = this.handlers) === null || _a === void 0 ? void 0 : _a.next) && !this.isUnsubscribed) {
            this.handlers.next(value);
        }
    };
    Observer.prototype.complete = function () {
        var _a;
        if (!this.isUnsubscribed) {
            if ((_a = this.handlers) === null || _a === void 0 ? void 0 : _a.complete) {
                this.handlers.complete();
            }
            this.unsubscribe();
        }
    };
    Observer.prototype.unsubscribe = function () {
        this.isUnsubscribed = true;
        if (this._unsubscribe) {
            this._unsubscribe();
        }
    };
    return Observer;
}());
var Observable = /** @class */ (function () {
    function Observable(subscribe) {
        this._subscribe = subscribe;
    }
    Observable.from = function (values) {
        return new Observable(function (observer) {
            values.forEach(function (value) { return observer.next(value); });
            observer.complete();
            return function () {
                console.log('unsubscribed');
            };
        });
    };
    Observable.prototype.subscribe = function (obs) {
        var observer = new Observer(obs);
        observer._unsubscribe = this._subscribe(observer);
        return {
            unsubscribe: function () {
                observer.unsubscribe();
            },
        };
    };
    return Observable;
}());
var userMock = {
    name: 'User Name',
    age: 26,
    roles: ['user', 'admin'],
    createdAt: new Date(),
    isDeleated: false,
};
var requestsMock = [
    {
        method: HttpMethod.Post,
        host: 'service.example',
        path: 'user',
        body: userMock,
        params: {},
    },
    {
        method: HttpMethod.Get,
        host: 'service.example',
        path: 'user',
        params: {
            id: '3f5h67s4s',
        },
    },
];
var handleRequest = function (request) {
    // handling of request
    return { status: HttpStatus.Ok };
};
var handleError = function (error) {
    // handling of error
    return { status: HttpStatus.InternalServerError };
};
var handleComplete = function () { return console.log('complete'); };
var requests$ = Observable.from(requestsMock);
var subscription = requests$.subscribe({
    next: handleRequest,
    error: handleError,
    complete: handleComplete,
});
subscription.unsubscribe();
