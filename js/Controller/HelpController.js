'use strict';

import { bus } from '../EventBus.js';

class HelpController {

  constructor() {
    this.initialize();
  }

  back() {
    bus.publish('sidebar.change', 'none');
  }

  hide() {
    bus.publish(`${this.helpTask}.hide`, null);
  }

  initialize() {
    this.subscribe();
  }

  panesUpdate(panes) {
    this.panes = panes;
  }

  read() {
    bus.publish('help.task.change', 'help-read');
  }

  show() {
    bus.publish(`${this.helpTask}.show`, null);
  }

  sidebarUpdate(sidebar) {
    this.sidebar = sidebar;
  }

  subscribe() {
    bus.subscribe('help-read', () => {
      this.read();
    });

    bus.subscribe('help-topic', (helpTopic) => {
      this.topic(helpTopic);
    });
    bus.subscribe('help-topic.select', (helpTopic) => {
      this.topicSelect(helpTopic);
    });

    bus.subscribe('help.back', () => {
      this.back();
    });
    bus.subscribe('help.hide', () => {
      this.hide();
    });
    bus.subscribe('help.show', () => {
      this.show();
    });
    bus.subscribe('help.task.update', (helpTask) => {
      this.taskUpdate(helpTask);
    });

    bus.subscribe('panes.update', (panes) => {
      this.panesUpdate(panes);
    });

    bus.subscribe('sidebar.update', (sidebar) => {
      this.sidebarUpdate(sidebar);
    });
  }

  taskUpdate(helpTask) {
    if (this.sidebar === 'help') {
      bus.publish(`${this.helpTask}.hide`, null);
      this.helpTask = helpTask;
      bus.publish(`${this.helpTask}.show`, null);
    } else {
      this.helpTask = helpTask;
    }
  }

  topic() {
    bus.publish('help.task.change', 'help-topic');
  }

  topicSelect(helpTopic) {
    bus.publish('help.topic.change', helpTopic);
    bus.publish('help.task.change', 'help-read');
  }

}

export { HelpController };
