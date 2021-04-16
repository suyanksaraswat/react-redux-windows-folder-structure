/* 
  src/reducers/simpleReducer.js
*/
export default (state = {}, action) => {
  switch (action.type) {
    case 'SIMPLE_ACTION':
      return action.payload
    default:
      return {
        currentPath: '/',
        history: ['/'],
        foldersObj: [
          {
            path: "/",
            folders: [],
          },
        ]
      }
  }
}
