enum HttpStatus {
  Ok = 200,
  InternalServerError = 500,
}

enum HttpMethod {
  Post = 'POST',
  Get = 'GET',
}

type HandlersType = {
  next?: (request: RequestMockType) => any;
  error?: (error: any) => any;
  complete?: () => void;
};

type UserMockType = {
  name: string;
  age: number;
  roles: string[];
  createdAt: Date;
  isDeleated: boolean;
};

type RequestMockType = {
  method: HttpMethod;
  host: string;
  path: string;
  body?: UserMockType;
  params: {
    [key: string]: string;
  };
};

class Observer {
  handlers?: HandlersType;
  isUnsubscribed = false;
  _unsubscribe: Function;

  constructor(handlers: HandlersType) {
    this.handlers = handlers;
  }

  next(value: RequestMockType): void {
    if (this.handlers?.next && !this.isUnsubscribed) {
      this.handlers.next(value);
    }
  }

  complete(): void {
    if (!this.isUnsubscribed) {
      if (this.handlers?.complete) {
        this.handlers.complete();
      }
      this.unsubscribe();
    }
  }

  unsubscribe(): void {
    this.isUnsubscribed = true;

    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }
}

class Observable {
  private _subscribe?;

  constructor(subscribe: Function) {
    this._subscribe = subscribe;
  }

  static from(values: RequestMockType[]): Observable {
    return new Observable((observer: Observer) => {
      values.forEach((value: RequestMockType) => observer.next(value));

      observer.complete();

      return () => {
        console.log('unsubscribed');
      };
    });
  }

  subscribe(obs: HandlersType): { unsubscribe: () => void } {
    const observer = new Observer(obs);

    observer._unsubscribe = this._subscribe(observer);

    return {
      unsubscribe() {
        observer.unsubscribe();
      },
    };
  }
}

const userMock: UserMockType = {
  name: 'User Name',
  age: 26,
  roles: ['user', 'admin'],
  createdAt: new Date(),
  isDeleated: false,
};

const requestsMock: RequestMockType[] = [
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

const handleRequest = (request: {}) => {
  // handling of request
  return { status: HttpStatus.Ok };
};
const handleError = (error: {}) => {
  // handling of error
  return { status: HttpStatus.InternalServerError };
};

const handleComplete = (): void => console.log('complete');

const requests$ = Observable.from(requestsMock);

const subscription = requests$.subscribe({
  next: handleRequest,
  error: handleError,
  complete: handleComplete,
});

subscription.unsubscribe();
