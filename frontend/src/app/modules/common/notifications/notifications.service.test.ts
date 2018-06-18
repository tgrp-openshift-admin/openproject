// -- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2015 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See doc/COPYRIGHT.rdoc for more details.
// ++

import {States} from 'core-components/states.service';
import {OpenprojectHalModule} from 'core-app/modules/hal/openproject-hal.module';
import {TypeDmService} from 'core-app/modules/hal/dm-services/type-dm.service';
import {async, TestBed} from '@angular/core/testing';
import {Injector} from '@angular/core';
import {HalResourceService} from 'core-app/modules/hal/services/hal-resource.service';
import {I18nService} from 'core-app/modules/common/i18n/i18n.service';
import {NotificationsService} from 'core-app/modules/common/notifications/notifications.service';
import {ConfigurationService} from 'core-app/modules/common/config/configuration.service';

describe('NotificationsService', function () {
  var notificationsService:NotificationsService,
    $rootScope:any;

  beforeEach(async(() => {
    // noinspection JSIgnoredPromiseFromCall
    TestBed.configureTestingModule({
      imports: [
        OpenprojectHalModule
      ],
      providers: [
        { provide: ConfigurationService, useValue: { autoHidePopups: () => true } },
        NotificationsService,
      ]
    })
      .compileComponents()
      .then(() => {
        notificationsService = TestBed.get(NotificationsService);
      });
  }));

  it('should be able to create warnings', function () {
    var notification = notificationsService.addWarning('warning!');

    expect(notification).to.eql({message: 'warning!', type: 'warning'});
  });

  it('should be able to create error messages with errors', function () {
    var notification = notificationsService.addError('a super cereal error', ['fooo', 'baarr']);
    expect(notification).to.eql({
      message: 'a super cereal error',
      data: ['fooo', 'baarr'],
      type: 'error'
    });
  });

  it('should be able to create error messages with only a message', function () {
    var notification = notificationsService.addError('a super cereal error');
    expect(notification).to.eql({
      message: 'a super cereal error',
      data: [],
      type: 'error'
    });
  });

  it('should be able to create upload messages with uploads', function () {
    var notification = notificationsService.addWorkPackageUpload('uploading...', [0, 1, 2] as any);
    expect(notification).to.eql({
      message: 'uploading...',
      type: 'upload',
      data: [0, 1, 2]
    });
  });

  it('should throw an Error if trying to create an upload with uploads = null', function () {
    expect(function () {
      notificationsService.addWorkPackageUpload('themUploads', null as any);
    }).to.throw(Error);
  });

  it('should throw an Error if trying to create an upload without uploads', function () {
    expect(function () {
      notificationsService.addWorkPackageUpload('themUploads', []);
    }).to.throw(Error);
  });

  it('sends a broadcast to remove the first notification upon adding a second success notification',
    function () {
      var firstNotification = notificationsService.addSuccess('blubs');
      expect(notificationsService.current.value!.length).to.eql(1);

      notificationsService.addSuccess('blubs2');
      expect(notificationsService.current.value!.length).to.eql(1);
    });

  it('sends a broadcast to remove the first notification upon adding a second error notification',
    function () {
      var firstNotification = notificationsService.addSuccess('blubs');
      notificationsService.addError('blubs2');

      expect(notificationsService.current.value!.length).to.eql(1);
    });
});
