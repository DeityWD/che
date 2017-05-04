/*
 * Copyright (c) 2015-2017 Codenvy, S.A.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Codenvy, S.A. - initial API and implementation
 */
'use strict';
import {CheStack} from '../../../../../components/api/che-stack.factory';

/**
 * This class is handling the controller for the ready-to-go stacks
 * @author Florent Benoit
 * @author Oleksii Orel
 */
export class ReadyToGoStacksController {

  private $scope: ng.IScope;
  private lodash: _.LoDashStatic;
  private cheStack: CheStack;
  private tabName: string;
  private selectedStackId: string;
  private generalStacks: Array<che.IStack> = [];
  private allStackTags: Array<che.IStack> = [];
  private filteredStackTags:Array<string> = [];
  private stackIconsMap: Map<string, string> = new Map();

  /**
   * Default constructor that is using resource
   * @ngInject for Dependency injection
   */
  constructor($scope: ng.IScope, lodash: _.LoDashStatic, cheStack: CheStack) {
    this.$scope = $scope;
    this.lodash = lodash;
    this.cheStack = cheStack;

    this.generalStacks = [];
    this.allStackTags = [];
    this.filteredStackTags = [];
    this.stackIconsMap = new Map();

    let stacks = cheStack.getStacks();
    if (stacks.length) {
      this.updateData(stacks);
    } else {
      cheStack.fetchStacks().then(() => {
        this.updateData(stacks);
      });
    }
/*
    // todo need to rework
    $scope.$on('event:updateFilter', (event: ng.IAngularEvent, tags: Array<string>) => {
      this.allStackTags = [];
      this.filteredStackTags = [];

      if (!tags) {
        tags = [];
      }
      this.generalStacks.forEach((stack: che.IStack) => {
        let matches = 0,
          stackTags = stack.tags.map(tag => tag.toLowerCase());
        for (let i = 0; i < tags.length; i++) {
          if (stackTags.indexOf(tags[i].toLowerCase()) > -1) {
            matches++;
          }
        }
        if (matches === tags.length) {
          this.filteredStackTags.push(stack.id);
          this.allStackTags = this.allStackTags.concat(stack.tags);
        }
      });
      this.allStackTags = this.lodash.uniq(this.allStackTags);
    });*/

    // set first stack as selected after filtration finished
    $scope.$watch('filteredStacks', (filteredStacks: Array<che.IStack>) => {
      if (filteredStacks && filteredStacks.length) {
        this.setStackSelectionById($scope.filteredStacks[0].id);
      }
    });
  }

  onTagsChanges(tags: Array<string>): void {
    this.allStackTags = tags;
  }

  /**
   * Update stacks' data
   * @param stacks {Array<che.IStack>}
   */
  updateData(stacks: Array<che.IStack>): void {
    stacks.forEach((stack: che.IStack) => {
      if (stack.scope !== 'general') {
        return;
      }
      let findLink = this.lodash.find(stack.links, (link: any) => {
        return link.rel === 'get icon link';
      });
      if (findLink) {
        this.stackIconsMap.set(stack.id, findLink.href);
      }
      this.generalStacks.push(stack);
      this.allStackTags = this.allStackTags.concat(stack.tags);
    });
    this.allStackTags = this.lodash.uniq(this.allStackTags);
  }

  /**
   * Select stack by Id
   * @param stackId {string}
   */
  setStackSelectionById(stackId: string): void {
    this.selectedStackId = stackId;
    if (this.selectedStackId) {
      this.$scope.$emit('event:selectStackId', {tabName: this.tabName, stackId: this.selectedStackId});
    }
  }
}
