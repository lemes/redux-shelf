# Redux Shelf

[![Build Status](https://travis-ci.org/lemes/redux-shelf.svg?branch=master)](https://travis-ci.org/lemes/redux-shelf)

Avoid writing boilerplate code by using Redux Shelf APIs to manage both **Entity** and **Communication** state of an application using Redux's reducers. 

## Influences

Typically, a React application contains several types of state. James K. Nelson, on this [great article](http://jamesknelson.com/5-types-react-application-state/), has identified 5 of them. Redux Shelf focus on two of the 5 types: Data state (optionally named Entity state) and Communication state. Below you can find a summary of each type:

### Data State

> "Data state covers information which your application temporarily stores about the big wide world. That is, it covers your business data."
>
> "_Every piece of received Data has a **type**, and a **selector** which exactly specifies which data was received._"

### Communication State

> "This type of state covers the seemingly simple yet somewhat thorny information which represents
> things like loading spinners and error messages."
>
> "_Communication state is the status of any not-yet-complete requests to other services._"
>
> "This means that all of the following are communication state:
>
> * The type/selector for any Data you expect to receive
> * The type, selector and expected change of any operations you have requested on Data
> * The error messages for anything which didn’t go quite as planned."

## Getting Started

### Prerequisites
`redux-shelf` is build on top of `redux`, therefore, it's important to understand its concepts.

### Installing
`yarn add redux redux-shelf`

or

`npm install redux redux-shelf`

### Configuration

```javascript
// reducers/index.js
import { combineReducers } from 'redux';

import { entities, communication } from 'redux-shelf';

export default (appReducers = combineReducers({
  entities,
  communication,
}));
```

## Usage

The following example uses React components.

```javascript
// userActions.js
import { entities, communication, normalize } from 'redux-shelf';

// Here I assuming that you're using some middleware to handle
// asynchronous actions, for example, Redux Thunk
export function fetchUsers() {
  return async (dispatch) => {
    dispatch(communication.starting('users'));

    try {
      const url = 'endpoint_to_get_users_data';
      const request = await fetch(url);
      const payload = request.json();

	  // redux-shelf requires that the server data is normalized
      dispatch(entities.set('users', normalize(payload)));
      dispatch(communication.done('users'));
    } catch (e) {
      dispatch(communication.fail('users', e));
      console.log(e);
    }
  };
}

...

// UserList.jsx
export const UserList = ({ loading, error, userIds }) => {
  if (error) {
    return <div>Failed to load users</div>
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {userIds.map(userId => <UserItem key={userId} userId={id} />)}
    </div>
  );
);

export default connect(
  ({ entities, communication }) => {
    const {
      loading,
      error,
    } = communication.of('users');

    const userIds = entities.idsOf('users');

    return {
      loading,
      error,
      userIds,
    };
  },
)(UserList);

...

// UserItem.jsx
export const UserItem = ({ name }) => (
  <span>
    {name}
  </span>
);

export default connect(
  ({ entities }, { userId }) => {
    const user = entities.contentOf('users', userId);

    return {
      name: user.name,
    };
  },
)(UserItem);
```
## API

Bellow you can find the API documentation of Redux Shelf.

### Entity

* `set(type, payload)`: Overrides the current state of an Entity.
* `update(type, payload)`: Merge the current state of an Entity with new state.
* `remove(type, selector)`: Remove a record of an Entity.
* `idsOf(type)`: Returns the array of ids of an Entity type provided as parameter.
* `contentOf(type, selector)`: Returns content object of an specific Entity record, identified by its type and selector both provided as parameters.
* `of(type, selector?)`: It's an alias for `idsOf` and `contentOf` methods. When only `type` parameter is given to `of` method it behaves like `idsOf` call, while when `selector` parameter is also provided `of` method will behave like `contentOf` call.

**Note:** By using Entity Actions API we're assuming that you'll normalize Entity data on ids/content form. So, you **must** either use `normalize` function provided by the library or use another one that works similarly (check _Utils_ section).

### Communication

* `starting(type, selector?)`: Sets communication with `STARTING` status for the given entity type and selector.
* `done(type, selector?)`: Sets communication with `DONE` status for the given entity type and selector.
* `fail(type, selector|error, error)`: Sets communication with `FAIL` status for the given entity type, selector and/or error.
* `cancel(type, selector?)`: Sets communication with `CANCEL` status for the given entity type and selector.
* `of(type, selector?)`: Returns an object with `loading` and `error`.

### Utils

* `normalize(payload, key?)`: Normalizes a given payload to ids/content shape. If `key` parameter is not provided, the function will normalize the payload by _id_ property, assuming that it has it. The valid values for _payload_ parameter are: An object or an array of objects. If the value provided as _payload_ parameter is invalid, the function will return a default normalized object `{ ids: [], content: {} }`. See the examples below:

```javascript
const payload = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
console.log(normalize(payload, 'id'));
// console output
/*
  {
    ids: [1, 2],
    content: {
      1: { id: 1, name: 'Product 1' },
      2: { id: 2, name: 'Product 2' },
    },
  }
*/

...

const payload = { id: 1, name: 'Product 1' };
console.log(normalize(payload));
// console output
/*
  {
    ids: [1],
    content: {
      1: { id: 1, name: 'Product 1' },
    },
  }
*/

...

const payload = [
  { identifier: 1, name: 'Product 1' },
  { identifier: 2, name: 'Product 2' },
  { id: 3, name: 'Product 2' },
  true,
  null,
  42,
];
console.log(normalize(payload, 'identifier'));
// console output
/*
  {
    ids: [1, 2],
    content: {
      1: { identifier: 1, name: 'Product 1' },
      2: { identifier: 2, name: 'Product 2' },
    },
  }
*/
```

## License

MIT
