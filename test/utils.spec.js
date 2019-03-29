import { entries, guaranteeArray } from '../src/utils'

describe('entries', () => {
  describe('given no obj', () => {
    it('should return empty array', () => {
      expect(entries()).toEqual([])
    })
  })

  describe('given an object with 2 properties', () => {
    let obj

    beforeEach(() => {
      obj = {
        prop1: 'content1',
        prop2: 'content2',
      }
    })

    it('should return an array with all keys and contents', () => {
      expect(entries(obj)).toEqual([
        ['prop1', 'content1'],
        ['prop2', 'content2'],
      ])
    })
  })
})

describe('guaranteeArray', () => {
  describe('When parameter is not provided', () => {
    it('should return an empty array', () => {
      expect(guaranteeArray()).toEqual([])
    })
  })

  describe('When paramenter is provided', () => {
    let parameter
    let result
    let expectResult

    describe('When parameter provided is not an array', () => {
      beforeEach(() => {
        parameter = 42
        result = guaranteeArray(parameter)
        expectResult = [parameter]
      })

      it('should return an array that contains provided parameter', () => {
        expect(result).toEqual(expectResult)
      })
    })

    describe('When parameter provided is an array', () => {
      beforeEach(() => {
        parameter = [1, 2, 3]
        result = guaranteeArray(parameter)
        expectResult = parameter
      })

      it('should return the same array provided as parameter', () => {
        expect(result).toEqual(expectResult)
      })
    })
  })
})
