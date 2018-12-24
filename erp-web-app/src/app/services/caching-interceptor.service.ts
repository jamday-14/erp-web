import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RequestCacheWithMap } from './request-cache.service';

@Injectable({
  providedIn: 'root'
})
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: RequestCacheWithMap) { }

  sendRequest(
    req: HttpRequest<any>,
    next: HttpHandler,
    cache: RequestCacheWithMap): Observable<HttpEvent<any>> {

    // No headers allowed in npm search request
    //const noHeaderReq = req.clone({ headers: new HttpHeaders() });

    return next.handle(req).pipe(
      tap(event => {
        // There may be other events besides the response.
        if (event instanceof HttpResponse) {
          cache.put(req, event); // Update the cache.
        }
      })
    );
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // continue if not cachable.
    if (!this.isCachable(req)) { return next.handle(req); }

    const cachedResponse = this.cache.get(req);
    return cachedResponse ?
      of(cachedResponse) : this.sendRequest(req, next, this.cache);
  }

  isCachable(req: HttpRequest<any>) {
    // Only GET requests are cachable
    return req.method === 'GET' && req.headers.get("cacheable") === 'true';
  }
}
