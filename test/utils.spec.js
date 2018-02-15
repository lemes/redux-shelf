import { entries, normalize } from '../src/utils';

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

describe('normalize', () => {
  const defaultObj = { ids: [], content: {} };

  describe('When payload provided is not an array or an object', () => {
    describe('When payload provided is the undefined value', () => {
      it('should return default normalized object', () => {
        expect(normalize()).toEqual(defaultObj);
      });
    });

    describe('When payload provided is the null value', () => {
      it('should return default normalized object', () => {
        expect(normalize(null)).toEqual(defaultObj);
      });
    });

    describe('When payload provided is a boolean value', () => {
      it('should return default normalized object', () => {
        expect(normalize(true)).toEqual(defaultObj);
      });
    });

    describe('When payload provided is a number value', () => {
      it('should return default normalized object', () => {
        expect(normalize(42)).toEqual(defaultObj);
      });
    });

    describe('When payload provided is a function', () => {
      it('should return default normalized object', () => {
        expect(normalize(() => {})).toEqual(defaultObj);
      });
    });
  });

  describe('When payload provided is an array or an object', () => {
    let payload;
    let result;
    let expectResult;

    describe('When payload provided is an array', () => {
      describe('When `key` parameter is not provided', () => {
        describe('When all elements contained on payload array have `id` property', () => {
          beforeEach(() => {
            payload = [
              { id: 1, name: 'Product 1' },
              { id: 2, name: 'Product 2' },
            ];
            result = normalize(payload);
            expectResult = {
              ids: [1, 2],
              content: {
                1: { id: 1, name: 'Product 1' },
                2: { id: 2, name: 'Product 2' },
              },
            };
          });

          it('should return payload normalized on ids/content shape', () => {
            expect(result).toEqual(expectResult);
          });
        });

        describe('When none element conteined on payload array have `id` property', () => {
          beforeEach(() => {
            payload = [
              { Id: 1, name: 'Product 1' },
              { idd: 2, name: 'Product 2' },
            ];
            result = normalize(payload);
          });

          it('should return default normalized object', () => {
            expect(result).toEqual(defaultObj);
          });
        });

        describe('When some elements contained on payload array have `id` property', () => {
          beforeEach(() => {
            payload = [
              { id: 1, name: 'Product 1' },
              { id: 2, name: 'Product 2' },
              { Id: 3, name: 'Product 3' },
            ];
            result = normalize(payload);
            expectResult = {
              ids: [1, 2],
              content: {
                1: { id: 1, name: 'Product 1' },
                2: { id: 2, name: 'Product 2' },
              },
            };
          });

          it('should return on normalized payload, only the valid elements', () => {
            expect(result).toEqual(expectResult);
          });
        });
      });

      describe('When `key` parameter is provided', () => {
        describe('When all elements contained on payload array have `key` provided as property', () => {
          beforeEach(() => {
            payload = [
              { identifier: 1, name: 'Product 1' },
              { identifier: 2, name: 'Product 2' },
            ];
            result = normalize(payload, 'identifier');
            expectResult = {
              ids: [1, 2],
              content: {
                1: { identifier: 1, name: 'Product 1' },
                2: { identifier: 2, name: 'Product 2' },
              },
            };
          });

          it('should return payload normalized on ids/content shape', () => {
            expect(result).toEqual(expectResult);
          });
        });

        describe('When none element conteined on payload array have `key` provided as property', () => {
          beforeEach(() => {
            payload = [
              { Id: 1, name: 'Product 1' },
              { idd: 2, name: 'Product 2' },
            ];
            result = normalize(payload, 'identifier');
          });

          it('should return default normalized object', () => {
            expect(result).toEqual(defaultObj);
          });
        });

        describe('When some elements contained on payload array have `key` provided as property', () => {
          beforeEach(() => {
            payload = [
              { identifier: 1, name: 'Product 1' },
              { identifier: 2, name: 'Product 2' },
              { Id: 3, name: 'Product 3' },
            ];
            result = normalize(payload, 'identifier');
            expectResult = {
              ids: [1, 2],
              content: {
                1: { identifier: 1, name: 'Product 1' },
                2: { identifier: 2, name: 'Product 2' },
              },
            };
          });

          it('should return on normalized payload, only the valid elements', () => {
            expect(result).toEqual(expectResult);
          });
        });
      });
    });

    describe('When payload provided is an object', () => {
      describe('When `key` parameter is not provided', () => {
        describe('When payload provided has `id` property', () => {
          beforeEach(() => {
            payload = {
              id: 1,
              name: 'Product 1',
            };
            result = normalize(payload);
            expectResult = {
              ids: [1],
              content: {
                1: {
                  id: 1,
                  name: 'Product 1',
                },
              },
            };
          });

          it('should return a normalized paylod on ids/content shape', () => {
            expect(result).toEqual(expectResult);
          });
        });

        describe('When payload provided does not have `id` property', () => {
          beforeEach(() => {
            payload = {
              identifier: 1,
              name: 'Product 1',
            };
            result = normalize(payload);
          });

          it('should return default normalized object', () => {
            expect(result).toEqual(defaultObj);
          });
        });
      });

      describe('When `key` parameter is provided', () => {
        describe('When payload contains has `key` provided as property', () => {
          beforeEach(() => {
            payload = {
              identifier: 1,
              name: 'Product 1',
            };
            result = normalize(payload, 'identifier');
            expectResult = {
              ids: [1],
              content: {
                1: {
                  identifier: 1,
                  name: 'Product 1',
                },
              },
            };
          });

          it('should return a normalized paylod on ids/content shape', () => {
            expect(result).toEqual(expectResult);
          });
        });

        describe('When payload contains does not have `key` provided as property', () => {
          beforeEach(() => {
            payload = {
              id: 1,
              name: 'Product 1',
            };
            result = normalize(payload, 'identifier');
          });

          it('should return default normalized object', () => {
            expect(result).toEqual(defaultObj);
          });
        });
      });
    });
  });
});
