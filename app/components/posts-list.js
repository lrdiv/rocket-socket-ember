import Ember from 'ember'

export default Ember.Component.extend({
  socketService: Ember.inject.service('socket-io'),

  newPost: new Ember.Object(),
  init() {
    this._super(...arguments);
    this.socket = this.get('socketService').socketFor('ws://localhost:3000/');
    this.socket.on('connect', this.onConnect, this);
    this.socket.on('post:create', (res) => {
      console.log(res);
      this.get('posts').addObject(res);
    })
  },

  onConnect() {
    console.log("Conect")
    this.socket.emit('posts:list', (posts) => {
      this.set('posts', posts)
    });
  },

  actions: {
    createPost() {
      this.socket.emit('posts:create', this.get('newPost'), () => {
        this.set('newPost', new Ember.Object())
      })
    }
  }

})
