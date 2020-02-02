'use strict';

import { queue } from '../CommandQueue.js';

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

  read() {
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
      this.read();
    });

    queue.subscribe('help-topic', (helpTopic) => {
      this.topic(helpTopic);
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

  topic() {
    queue.publish('help.task.change', 'help-topic');
  }

  topicSelect(helpTopic) {
    queue.publish('help.topic.change', helpTopic);
    queue.publish('help.task.change', 'help-read');
  }

}

export { HelpController };
