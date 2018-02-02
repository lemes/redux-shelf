# Redux Shelf

Redux Shelf is a library that provide a simple API to create and manage both **Entity** and
**Communication** state of your application using Redux reducers, by managing for you all the
boilerplate necessary to do that.

## Influences

React applications contains several types of state wich we have to manage. James K. Nelson, on this
[great article](http://jamesknelson.com/5-types-react-application-state/),
identify 5 types of them. On this library we are focused on two of the 5 types: Data state, that we
prefer to call Entity state, and Communication state. Below you can find a summary of each type:

### Data State

> "Data state covers information which your application temporarily stores about the big wide world.
> That is, it covers your business data."
>
> "_Every piece of received Data has a **type**, and a **selector** which exactly specifies which
> data was received._"

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

With Redux Shelf you can reduce Entity and Communication state management boilerplate in your
application, by using a simple and easy to learn API.

## Installation

`yarn add redux-shelf`

or

`npm install redux-shelf`

## Configuration

```javascript
// reducers/index.js
import { combineReducers } from 'redux';

import { entities, communication } from 'redux-shelf';

export default (appReducers = combineReducers({
  entities,
  communication,
}));
```

## API

Bellow you can find the description of the API provided by Redux Shelf library.

### Entity Actions

* `set(type, payload)`: Overrides the current state of an Entity.
* `update(type, payload)`: Merge the current state of an Entity with new state.
* `remove(type, selector)`: Remove a record of an Entity.
* `idsOf(type)`: Returns the array of ids of an Entity type provided as parameter.
* `contentOf(type, selector)`: Returns content object of an specific Entity record, identified by
  its type and selector provided as parameters.
* `of(type, selector?)`: It's an alias for `idsOf` and `contentOf` methods. When only `type`
  parameter is given to `of` method it behaves like `idsOf` call, while when `selector` parameter
  is also provided `of` method will behave like `contentOf` call.

### Communication Actions

* `starting(type, selector?)`: Sets communication status with the `STARTING` status for the given
  entity type and selector.
* `done(type, selector?)`: Sets communication status with the `DONE` status for the given
  entity type and selector.
* `fail(type, selector|error, error)`: Sets communication status with the `FAIL` status for the
  given entity type, selector and/or error.
* `cancel(type, selector?)`: Sets communication status with the `CANCEL` status for the given
  entity type and selector.
* `of(type, selector?)`: Returns an object with `loading` and `error`.

## Usage

```javascript
// userActions.js
import { entities, communication } from 'redux-shelf';

// Here I assuming that you're using some middleware to handle
// asynchronous actions, for example, Redux Thunk
export function fetchUsers() {
  return async (dispatch) => {
    dispatch(communication.starting('users'));

    try {
      const url = 'endpoint_to_get_users_data';
      const request = await fetch(url);
      const payload = request.json();

      dispatch(entities.set('users', payload));
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

    const userIds = entities.of('users');

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
    const user = entities.of('users', userId);

    return {
      name: user.name,
    };
  },
)(UserItem);
```

## License

MIT
