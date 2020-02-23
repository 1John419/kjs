'use strict';

class CommandQueue {

  constructor() {
    this.queue = [];
    this.queueRunning = false;
    this.commands = {};
  }

  publish(command, data) {
    // console.log(command);
    if (this.commands[command] && this.commands[command].length >= 1) {
      for (let listener of this.commands[command]) {
        this.queue.push({listener, data});
      }
      if (!this.queueRunning) {
        this.runQueue();
      }
    }
  }

  runQueue() {
    this.queueRunning = true;
    while (this.queue.length) {
      let task = this.queue.shift();
      task.listener(task.data);
    }
    this.queueRunning = false;
  }

  subscribe(command, listener) {
    if (!this.commands[command]) {
      this.commands[command] = [];
    }
    this.commands[command].push(listener);
  }

}

let queue = new CommandQueue();

export default queue;
