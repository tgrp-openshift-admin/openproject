import {derive, input, InputState, State, StatesGroup} from 'reactivestates';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {QueryResource} from 'core-app/modules/hal/resources/query-resource';
import {GroupObject, WorkPackageCollectionResource} from 'core-app/modules/hal/resources/wp-collection-resource';
import {QueryFormResource} from "core-app/modules/hal/resources/query-form-resource";
import {WPFocusState} from "core-app/modules/work_packages/routing/wp-view-base/view-services/wp-view-focus.service";
import {QueryColumn} from "core-components/wp-query/query-column";
import {WorkPackageTableRefreshRequest} from "core-components/wp-table/wp-table-refresh-request.service";
import {RenderedWorkPackage} from "core-app/modules/work_packages/render-info/rendered-work-package.type";

@Injectable()
export class IsolatedQuerySpace extends StatesGroup {

  constructor() {
    super();
  }

  name = 'IsolatedQuerySpace';

  // The query that results in this table state
  query:InputState<QueryResource> = input<QueryResource>();

  // the query form associated with the table
  queryForm = input<QueryFormResource>();

  // the results associated with the table
  results = input<WorkPackageCollectionResource>();
  // all groups returned as results
  groups = input<GroupObject[]>();
  // Set of columns in strict order of appearance
  columns = input<QueryColumn[]>();

  // Current state of collapsed groups (if any)
  collapsedGroups = input<{ [identifier:string]:boolean }>();

  // State to be updated when the table is up to date
  rendered = input<RenderedWorkPackage[]>();

  renderedWorkPackages:State<RenderedWorkPackage[]> = derive(this.rendered, $ => $.pipe(
    map(rows => rows.filter(row => !!row.workPackageId)))
  );

  renderedWorkPackageIds:State<string[]> = derive(this.renderedWorkPackages, $ => $.pipe(
    map(rows => rows.map(row => row.workPackageId!.toString())))
  );

  // Current focused work package (e.g, row preselected for details button)
  focusedWorkPackage:InputState<WPFocusState> = input<WPFocusState>();

  // Subject used to unregister all listeners of states above.
  stopAllSubscriptions = new Subject();
  // Fire when table refresh is required
  refreshRequired = input<WorkPackageTableRefreshRequest>();

  // Required work packages to be rendered by hierarchy mode + relation columns
  additionalRequiredWorkPackages = input<null>();

  // Input state that emits whenever table services have initialized
  initialized = input<unknown>();
}
