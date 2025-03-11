'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: null },
  { type: 'btn', icon: 'help-read', ariaLabel: null },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'topic', text: 'Topic' },
];

export const helpTopicList = [
  { topic: 'about', name: 'About' },
  { topic: 'overview', name: 'Overview' },
  { topic: 'read', name: 'Read' },
  { topic: 'clipboard-mode', name: 'Clipboard Mode' },
  { topic: 'name-mode', name: 'Name Mode' },
  { topic: 'navigator', name: 'Navigator' },
  { topic: 'bookmark', name: 'Bookmark' },
  { topic: 'search', name: 'Search' },
  { topic: 'strong', name: 'Strong' },
  { topic: 'setting', name: 'Setting' },
  { topic: 'help', name: 'Help' },
];

const templateBtnTopic = (helpTopic) => {
  const btnTopic = template.element('div', 'btn-topic', helpTopic.topic, null, helpTopic.name);
  btnTopic.dataset.topic = helpTopic.topic;
  return btnTopic;
};

const templateListTopic = () => {
  const list = template.element('div', 'list', 'topic', null, null);
  for (const topic of helpTopicList) {
    const btn = templateBtnTopic(topic);
    list.appendChild(btn);
  }
  return list;
};

class HelpTopicView {

  constructor() {
    this.initialize();
  }

  addListeners() {
    this.scroll.addEventListener('click', (event) => {
      this.scrollClick(event);
    });
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  buildPage() {
    this.page = template.page('help-topic');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('help-topic');
    this.list = templateListTopic();
    this.scroll.appendChild(this.list);

    this.page.appendChild(this.scroll);

    this.toolbarLower = template.toolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    const container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  getElements() {
    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnHelpRead = this.toolbarLower.querySelector('.btn-icon--help-read');
  }

  hide() {
    this.page.classList.add('page--hide');
  }

  initialize() {
    this.buildPage();
    this.getElements();
    this.addListeners();
    this.subscribe();
  }

  scrollClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div.btn-topic');
    if (btn) {
      if (btn.classList.contains('btn-topic')) {
        const helpTopic = btn.dataset.topic;
        queue.publish('help-topic.select', helpTopic);
      }
    }
  }

  show() {
    this.page.classList.remove('page--hide');
  }

  subscribe() {
    queue.subscribe('help-topic.show', () => {
      this.show();
    });
    queue.subscribe('help-topic.hide', () => {
      this.hide();
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div.btn-icon');
    if (btn) {
      if (btn === this.btnBack) {
        queue.publish('help.back', null);
      } else if (btn === this.btnHelpRead) {
        queue.publish('help-read', null);
      }
    }
  }

}

export { HelpTopicView };
