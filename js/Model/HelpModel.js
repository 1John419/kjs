'use strict';

import { bus } from '../EventBus.js';
import { appPrefix } from '../util.js';

const validTasks = ['help-read', 'help-topic'];
const validTopics = ['about', 'bookmark', 'help', 'navigator', 'overview',
  'read', 'search', 'setting', 'strong', 'thats-my-king'];

class HelpModel {

  constructor() {
    this.initialize();
  }

  initialize() {
    this.subscribe();
  }

  restore() {
    this.restoreTask();
    this.restoreTopic();
  }

  restoreTask() {
    let defaultTask = 'help-read';
    let helpTask = localStorage.getItem(`${appPrefix}-helpTask`);
    if (!helpTask) {
      helpTask = defaultTask;
    } else {
      try {
        helpTask = JSON.parse(helpTask);
      } catch (error) {
        helpTask = defaultTask;
      }
      if (!validTasks.includes(helpTask)) {
        helpTask = defaultTask;
      }
    }
    this.taskChange(helpTask);
  }

  restoreTopic() {
    let defaultTopic = 'overview';
    let helpTopic = localStorage.getItem(`${appPrefix}-helpTopic`);
    if (!helpTopic) {
      helpTopic = defaultTopic;
    } else {
      try {
        helpTopic = JSON.parse(helpTopic);
      } catch (error) {
        helpTopic = defaultTopic;
      }
      if (!validTopics.includes(helpTopic)) {
        helpTopic = defaultTopic;
      }
    }
    this.topicChange(helpTopic);
  }

  saveHelpTask() {
    localStorage.setItem(`${appPrefix}-helpTask`, JSON.stringify(this.helpTask));
  }

  saveHelpTopic() {
    localStorage.setItem(`${appPrefix}-helpTopic`, JSON.stringify(this.helpTopic));
  }

  subscribe() {
    bus.subscribe('help.restore', () => {
      this.restore();
    });
    bus.subscribe('help.task.change', (helpTask) => {
      this.taskChange(helpTask);
    });
    bus.subscribe('help.topic.change', (helpTopic) => {
      this.topicChange(helpTopic);
    });
  }

  taskChange(helpTask) {
    this.helpTask = helpTask;
    this.saveHelpTask();
    bus.publish('help.task.update', this.helpTask);
  }

  topicChange(helpTopic) {
    this.helpTopic = helpTopic;
    this.saveHelpTopic();
    bus.publish('help.topic.update', this.helpTopic);
  }

}

export { HelpModel };
