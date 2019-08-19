module Overviews
  class Engine < ::Rails::Engine
    isolate_namespace Overviews

    engine_name :overviews

    include OpenProject::Plugins::ActsAsOpEngine

    initializer 'overviews.menu' do
      ::Redmine::MenuManager.map(:project_menu) do |menu|
        menu.push(:overview,
                  { controller: 'overviews/overviews', action: 'show' },
                  caption: :'overviews.label',
                  param: :project_id,
                  first: true,
                  engine: :project_overview,
                  icon: 'icon2 icon-info1')
      end
    end

    initializer 'overviews.permissions' do
      OpenProject::AccessControl.permission(:view_project)
        .actions
        .push('overviews/overviews/show')

      OpenProject::AccessControl.map do |ac_map|
        ac_map.project_module nil do |map|
          map.permission :manage_overview,
                         'overviews/overviews': ['show'],
                         public: true
        end
      end
    end

    config.to_prepare do
      Overviews::GridRegistration.register!
    end
  end
end
