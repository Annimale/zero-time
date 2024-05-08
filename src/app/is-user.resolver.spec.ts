import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { isUserResolver } from './is-user.resolver';

describe('isUserResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => isUserResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
