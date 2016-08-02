import DS from 'ember-data';
import Ember from 'ember';
import config from '../config/environment';

export default DS.Store.extend({
  websockets: Ember.inject.service('socket-io'),

  init() {
    const socket = this.get('websockets').socketFor(config.socketEndpoint);

    socket.on('post:create', (response) => {
      console.log(response);
      let existingPost = this.peekRecord('post', response.data.attributes.id);
      console.log(existingPost);
      this.push(response);
    });

    return this._super(...arguments);
  }
});
