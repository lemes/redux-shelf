# Redux Shelf

Redux Shelf is a library that provide a simple API to create and manage both **Entity** and **Communication** state of your application using Redux reducers, by managing for you all the boilerplate necessary to do that.

## Influences

React applications contains several types of state wich we have to manage. James K. Nelson, on this [great article](http://jamesknelson.com/5-types-react-application-state/) about the subject, identify 5 types of them. On this library we are focused on two of the 5 types: Data state, that we prefer to call Entity state, and Communication state. Below you can find a summary of each type:

### Data State
> "Data state covers information which your application temporarily stores about the big wide world. That is, it covers your business data.*
>
> _Every piece of received Data has a **type**, and a **selector** which exactly specifies which data was received._"

### Communication State

>"This type of state covers the seemingly simple yet somewhat thorny information which represents things like loading spinners and error messages."
>
>"*Communication state is the status of any not-yet-complete requests to other services.*"
>
>"This means that all of the following are communication state:
> 
> - The type/selector for any Data you expect to receive 
> - The type, selector and expected change of any operations you have requested on
> - Data The error messages for anything which didn’t go quite as planned."

With Redux Shelf you can reduce Entity and Communication state management boilerplate in your application, by using a simple and easy to learn API.

## Installation

## API
Bellow you can find the description of the API provided by Redux Shelf library.

### Entity State Management

- `set(newState)`: Overrides the current state of an Entity.
- `update(identifier?, newState)`: Merge the current state of an Entity with new state.
- `remove(identifier)`: Remove an specific occurrence of an Entity.  

### Communication State Management
- `starting`:
- `done`:
- `fail`:
- `cancel`:

## Examples

## License
MIT
