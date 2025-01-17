// -- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2018 the OpenProject Foundation (OPF)
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

import {APP_INITIALIZER, NgModule} from '@angular/core';
import {EditFieldService} from "core-app/modules/fields/edit/edit-field.service";
import {DisplayFieldService} from "core-app/modules/fields/display/display-field.service";
import {initializeCoreEditFields} from "core-app/modules/fields/edit/edit-field.initializer";
import {initializeCoreDisplayFields} from "core-app/modules/fields/display/display-field.initializer";
import {BooleanEditFieldComponent} from "core-app/modules/fields/edit/field-types/boolean-edit-field.component";
import {DateEditFieldComponent} from "core-app/modules/fields/edit/field-types/date-edit-field.component";
import {DurationEditFieldComponent} from "core-app/modules/fields/edit/field-types/duration-edit-field.component";
import {FloatEditFieldComponent} from "core-app/modules/fields/edit/field-types/float-edit-field.component";
import {IntegerEditFieldComponent} from "core-app/modules/fields/edit/field-types/integer-edit-field.component";
import {MultiSelectEditFieldComponent} from "core-app/modules/fields/edit/field-types/multi-select-edit-field.component";
import {SelectEditFieldComponent} from "core-app/modules/fields/edit/field-types/select-edit-field.component";
import {FormattableEditFieldComponent} from "core-app/modules/fields/edit/field-types/formattable-edit-field.component";
import {TextEditFieldComponent} from "core-app/modules/fields/edit/field-types/text-edit-field.component";
import {OpenprojectCommonModule} from "core-app/modules/common/openproject-common.module";
import {WorkPackageEditingPortalService} from "core-app/modules/fields/edit/editing-portal/wp-editing-portal-service";
import {EditFormPortalComponent} from "core-app/modules/fields/edit/editing-portal/edit-form-portal.component";
import {EditFieldControlsComponent,} from "core-app/modules/fields/edit/field-controls/edit-field-controls.component";
import {OpenprojectAccessibilityModule} from "core-app/modules/a11y/openproject-a11y.module";
import {WorkPackageEditFieldComponent} from "core-app/modules/fields/edit/field-types/work-package-edit-field.component";
import {OpenprojectEditorModule} from 'core-app/modules/editor/openproject-editor.module';
import {UserFieldPortalComponent} from "core-app/modules/fields/display/display-portal/display-user-field-portal/user-field-portal.component";
import {UserFieldPortalService} from "core-app/modules/fields/display/display-portal/display-user-field-portal/user-field-portal-service";
import {SelectAutocompleterRegisterService} from "core-app/modules/fields/edit/field-types/select-autocompleter-register.service";

@NgModule({
  imports: [
    OpenprojectCommonModule,
    OpenprojectAccessibilityModule,
    OpenprojectEditorModule,
  ],
  exports: [
    EditFieldControlsComponent,
    EditFormPortalComponent,
    UserFieldPortalComponent,
  ],
  providers: [
    WorkPackageEditingPortalService,
    UserFieldPortalService,
    DisplayFieldService,
    EditFieldService,
    SelectAutocompleterRegisterService,
    { provide: APP_INITIALIZER, useFactory: initializeCoreEditFields, deps: [EditFieldService, SelectAutocompleterRegisterService], multi: true },
    { provide: APP_INITIALIZER, useFactory: initializeCoreDisplayFields, deps: [DisplayFieldService], multi: true },
  ],
  declarations: [
    EditFormPortalComponent,
    UserFieldPortalComponent,
    BooleanEditFieldComponent,
    DateEditFieldComponent,
    DurationEditFieldComponent,
    FloatEditFieldComponent,
    IntegerEditFieldComponent,
    FormattableEditFieldComponent,
    MultiSelectEditFieldComponent,
    SelectEditFieldComponent,
    TextEditFieldComponent,
    EditFieldControlsComponent,
    WorkPackageEditFieldComponent,
  ],
  entryComponents: [
    EditFormPortalComponent,
    UserFieldPortalComponent,
    BooleanEditFieldComponent,
    DateEditFieldComponent,
    DurationEditFieldComponent,
    FloatEditFieldComponent,
    IntegerEditFieldComponent,
    FormattableEditFieldComponent,
    MultiSelectEditFieldComponent,
    SelectEditFieldComponent,
    TextEditFieldComponent,
    WorkPackageEditFieldComponent,
  ]
})
export class OpenprojectFieldsModule { }

