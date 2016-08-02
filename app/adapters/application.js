import Ember from 'ember';
import DS from 'ember-data';
import config from '../config/environment';

export default DS.Adapter.extend({
  websockets: Ember.inject.service('socket-io'),

  init() {
    this._super(...arguments);
    const socket = this.get('websockets').socketFor(config.socketEndpoint);
    this.set('socket', socket);
  },

  findRecord(store, type, id) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('socket').emit(`${type.modelName}:get`, { id }, (res) => {
        if (res.code === 200) {
          Ember.run(null, resolve, res.data);
        }
        else {
          Ember.run(null, reject, null);
        }
      });
    });
  },

  createRecord(store, type, snapshot) {
    let modelName = type.modelName;
    let serializer = store.serializerFor(modelName);
    let data = {};

    serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('socket').emit(`${modelName}:create`, data, (res) => {
        if (res.code === 200) {
          resolve();
          // Ember.run(null, resolve, res.data);
        }
        else {
          Ember.run(null, reject, null);
        }
      });
    });
  },

  updateRecord(store, type, snapshot) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('socket').emit(`${type.modelName}:update`, snapshot, (res) => {
        if (res.code === 200) {
          Ember.run(null, resolve, res.data);
        }
        else {
          Ember.run(null, reject, null);
        }
      });
    });
  },

  deleteRecord(store, type, snapshot) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('socket').emit(`${type.modelName}:delete`, { id: snapshot.id }, (res) => {
        if (res.code === 200) {
          Ember.run(null, resolve, res.data);
        }
        else {
          Ember.run(null, reject, null);
        }
      });
    });
  },

  findAll(store, type) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('socket').emit(`${type.modelName}:list`, (res) => {
        if (res.code === 200) {
          Ember.run(null, resolve, res.data);
        }
        else {
          Ember.run(null, reject, null);
        }
      });
    });
  },

  query(store, type, query) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('socket').emit(`${type.modelName}:list`, { params: query }, (res) => {
        if (res.code === 200) {
          Ember.run(null, resolve, res.data);
        }
        else {
          Ember.run(null, reject, null);
        }
      });
    });
  }


});
