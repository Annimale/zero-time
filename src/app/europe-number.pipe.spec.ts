import { EuropeNumberPipe } from './europe-number.pipe';

describe('EuropeNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new EuropeNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
