'use strict';

import { queue } from '../CommandQueue.js';
import { template } from '../template.js';
import { helpTopicList } from '../View/HelpTopicView.js';

const lowerToolSet = [
  { type: 'btn', icon: 'back', ariaLabel: null },
  { type: 'btn', icon: 'help-topic', ariaLabel: null },
];

const upperToolSet = [
  { type: 'banner', cssModifier: 'help-read', text: null },
];

class HelpReadView {

  constructor() {
    this.initialize();
  }

  addListeners() {
    this.toolbarLower.addEventListener('click', (event) => {
      this.toolbarLowerClick(event);
    });
  }

  buildPage() {
    this.page = template.page('help-read');

    this.toolbarUpper = template.toolbarUpper(upperToolSet);
    this.page.appendChild(this.toolbarUpper);

    this.scroll = template.scroll('help-read');
    this.page.appendChild(this.scroll);

    this.toolbarLower = template.toolbarLower(lowerToolSet);
    this.page.appendChild(this.toolbarLower);

    const container = document.querySelector('.container');
    container.appendChild(this.page);
  }

  getElements() {
    this.banner = this.toolbarUpper.querySelector('.banner--help-read');

    this.btnBack = this.toolbarLower.querySelector('.btn-icon--back');
    this.btnHelpTopic = this.toolbarLower.querySelector('.btn-icon--help-topic');
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

  show() {
    this.page.classList.remove('page--hide');
  }

  subscribe() {
    queue.subscribe('help-read.show', () => {
      this.show();
    });
    queue.subscribe('help-read.hide', () => {
      this.hide();
    });

    queue.subscribe('help.topic.update', (helpTopic) => {
      this.topicUpdate(helpTopic);
    });
  }

  toolbarLowerClick(event) {
    event.preventDefault();
    const btn = event.target.closest('div.btn-icon');
    if (btn) {
      if (btn === this.btnBack) {
        queue.publish('help.back', null);
      } else if (btn === this.btnHelpTopic) {
        queue.publish('help-topic', null);
      }
    }
  }

  topicUpdate(helpTopic) {
    this.updateBanner(helpTopic);
    this.scroll.innerHTML = '';
    const url = `help/${helpTopic}.html`;
    fetch(url).then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error('fetch failed');
      }
    }).then((html) => {
      this.scroll.innerHTML = html;
      this.scroll.scrollTop = 0;
    }).catch((error) => {
      console.log(error.message);
    });
  }

  updateBanner(helpTopic) {
    const title = helpTopicList.find(obj => obj.topic === helpTopic).name;
    this.banner.textContent = title;
  }

}

export { HelpReadView };
