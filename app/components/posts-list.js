import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),

  init() {
    this._super(...arguments);
    let newPost = this.get('store').createRecord('post');
    this.set('newPost', newPost);
  },

  visiblePosts: Ember.computed.filter('posts', (post) => {
    return !post.get('isNew');
  }),

  actions: {
    createPost() {
      let post = this.get('newPost');
      post.save().then(() => {
        let newPost = this.get('store').createRecord('post');
        this.set('newPost', newPost);
      }, (error) => {
        console.log("Error happened...");
        console.log(error);
      });
      // this.socket.emit('posts:create', this.get('newPost'), () => {
      //   this.set('newPost', new Ember.Object())
      // })
    }
  }

});
