'use strict';

import { queue } from '../CommandQueue.js';

const validTasks = [
  'help-read', 'help-topic',
];
const validTopics = [
  'about', 'bookmark', 'clipboard-mode', 'help', 'name-mode', 'navigator',
  'overview', 'read', 'search', 'setting', 'strong',
];

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
    const defaultTask = 'help-read';
    let helpTask = localStorage.getItem('helpTask');
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
    const defaultTopic = 'overview';
    let helpTopic = localStorage.getItem('helpTopic');
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
    localStorage.setItem('helpTask', JSON.stringify(this.helpTask));
  }

  saveHelpTopic() {
    localStorage.setItem('helpTopic', JSON.stringify(this.helpTopic));
  }

  subscribe() {
    queue.subscribe('help.restore', () => {
      this.restore();
    });
    queue.subscribe('help.task.change', (helpTask) => {
      this.taskChange(helpTask);
    });
    queue.subscribe('help.topic.change', (helpTopic) => {
      this.topicChange(helpTopic);
    });
  }

  taskChange(helpTask) {
    this.helpTask = helpTask;
    this.saveHelpTask();
    queue.publish('help.task.update', this.helpTask);
  }

  topicChange(helpTopic) {
    this.helpTopic = helpTopic;
    this.saveHelpTopic();
    queue.publish('help.topic.update', this.helpTopic);
  }

}

export { HelpModel };
