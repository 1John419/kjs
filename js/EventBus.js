'use strict';

class EventBus {

  constructor() {
    this.topics = {};
  }

  async publish(topic, data) {
    console.log(topic);
    if (this.topics[topic] && this.topics[topic].length >= 1) {
      for (let listener of this.topics[topic]) {
        await listener(data);
      }
    }
  }

  subscribe(topic, listener) {
    if (!this.topics[topic]) {
      this.topics[topic] = [];
    }
    this.topics[topic].push(listener);
  }

}

let bus = new EventBus();

export { bus };
