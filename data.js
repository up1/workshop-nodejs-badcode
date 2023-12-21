/**
 * @typedef User    - User object
 * @property {number} id    - User ID
 * @property {string} name  - User name
 * @property {string} refresh - Refresh token
 */
const users = [
    { id: 1, name: 'User 1', refresh: null },
    { id: 2, name: 'User 2', refresh: null },
    { id: 3, name: 'User 3', refresh: null },
  ];

module.exports = { users }