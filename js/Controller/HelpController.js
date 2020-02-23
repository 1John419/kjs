'use strict';

import queue from '../CommandQueue.js';

class HelpController {

  constructor() {
    this.initialize();
  }

  back() {
    queue.publish('sidebar.change', 'none');
  }

  hide() {
    queue.publish(`${this.helpTask}.hide`, null);
  }

  initialize() {
    this.subscribe();
  }

  readPane() {
    queue.publish('help.task.change', 'help-read');
  }

  show() {
    queue.publish(`${this.helpTask}.show`, null);
  }

  sidebarUpdate(sidebar) {
    this.sidebar = sidebar;
  }

  subscribe() {
    queue.subscribe('help-read', () => {
      this.readPane();
    });

    queue.subscribe('help-topic', (helpTopic) => {
      this.topicPane(helpTopic);
    });
    queue.subscribe('help-topic.select', (helpTopic) => {
      this.topicSelect(helpTopic);
    });

    queue.subscribe('help.back', () => {
      this.back();
    });
    queue.subscribe('help.hide', () => {
      this.hide();
    });
    queue.subscribe('help.show', () => {
      this.show();
    });
    queue.subscribe('help.task.update', (helpTask) => {
      this.taskUpdate(helpTask);
    });
    queue.subscribe('help.topic.update', () => {
      this.topicUpdate();
    });

    queue.subscribe('sidebar.update', (sidebar) => {
      this.sidebarUpdate(sidebar);
    });
  }

  taskUpdate(helpTask) {
    if (this.sidebar === 'help') {
      if (this.helpTask !== helpTask) {
        queue.publish(`${this.helpTask}.hide`, null);
        this.helpTask = helpTask;
        queue.publish(`${this.helpTask}.show`, null);
      }
    } else {
      this.helpTask = helpTask;
    }
  }

  topicPane() {
    queue.publish('help.task.change', 'help-topic');
  }

  topicSelect(helpTopic) {
    this.topicSelectPending = true;
    queue.publish('help.topic.change', helpTopic);
  }

  topicUpdate() {
    if (this.topicSelectPending) {
      this.topicSelectPending = false;
      queue.publish('help.task.change', 'help-read');
    }
  }

}

export { HelpController };
