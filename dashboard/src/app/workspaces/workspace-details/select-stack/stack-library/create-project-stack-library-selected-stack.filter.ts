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

/**
 * Defines a filter that match if given value is containing stack ID
 * @author Oleksii Kurinnyi
 */

export class CreateProjectStackLibrarySelectedStackFilter {

  constructor(register: che.IRegisterService) {
    register.app.filter('stackSelectedStackFilter', () => {
      return (templates: Array<che.IStack>, tagsFilter: string) => {
        if (!templates) {
          return [];
        }

        if (!tagsFilter || !tagsFilter.length) {
          return templates;
        }

        let filtered = templates.filter((template: che.IStack) => {
          return true;
        });

        templates.forEach((template) => {
          if (tagsFilter.indexOf(template.id) > -1) {
            filtered.push(template);
          }
        });
        return filtered;
      };
    });
  }
}
