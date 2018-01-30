import { entries } from '../src/utils';

describe('entries', () => {
  describe('given no obj', () => {
    it('should return empty array', () => {
      expect(entries()).toEqual([]);
    });
  });

  describe('given an object with 2 properties', () => {
    let obj;

    beforeEach(() => {
      obj = {
        prop1: 'content1',
        prop2: 'content2',
      };
    });

    it('should return an array with all keys and contents', () => {
      expect(entries(obj)).toEqual([
        ['prop1', 'content1'],
        ['prop2', 'content2'],
      ]);
    });
  });
});
