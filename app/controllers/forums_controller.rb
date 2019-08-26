#-- encoding: UTF-8
#-- copyright
# OpenProject is a project management system.
# Copyright (C) 2012-2018 the OpenProject Foundation (OPF)
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License version 3.
#
# OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
# Copyright (C) 2006-2017 Jean-Philippe Lang
# Copyright (C) 2010-2013 the ChiliProject Team
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
#
# See docs/COPYRIGHT.rdoc for more details.
#++

class ForumsController < ApplicationController
  default_search_scope :messages
  before_action :find_project_by_project_id,
                :authorize
  before_action :new_forum, only: %i[new create]
  before_action :find_forum, only: %i[show edit update move destroy]
  accept_key_auth :show

  include SortHelper
  include WatchersHelper
  include PaginationHelper
  include OpenProject::ClientPreferenceExtractor

  def index
    @forums = @project.forums
    render_404 if @forums.empty?
    # show the forum if there is only one
    if @forums.size == 1
      @forum = @forums.first
      show
    end
  end

  current_menu_item [:index, :show] do
    :forums
  end

  def show
    sort_init 'updated_on', 'desc'
    sort_update 'created_on' => "#{Message.table_name}.created_on",
                'replies' => "#{Message.table_name}.replies_count",
                'updated_on' => "#{Message.table_name}.updated_on"

    respond_to do |format|
      format.html do
        set_topics
        @message = Message.new
        render action: 'show', layout: !request.xhr?
      end
      format.json do
        set_topics

        render template: 'messages/index'
      end
      format.atom do
        @messages = @forum
                    .messages
                    .order(["#{Message.table_name}.sticked_on ASC", sort_clause].compact.join(', '))
                    .includes(:author, :forum)
                    .limit(Setting.feeds_limit.to_i)

        render_feed(@messages, title: "#{@project}: #{@forum}")
      end
    end
  end

  def set_topics
    @topics =  @forum
               .topics
               .order(["#{Message.table_name}.sticked_on ASC", sort_clause].compact.join(', '))
               .includes(:author, last_reply: :author)
               .page(page_param)
               .per_page(per_page_param)
  end

  def new; end

  def create
    if @forum.save
      flash[:notice] = l(:notice_successful_create)
      redirect_to_settings_in_projects
    else
      render :new
    end
  end

  def edit; end

  def update
    if @forum.update_attributes(permitted_params.forum)
      flash[:notice] = l(:notice_successful_update)
      redirect_to_settings_in_projects
    else
      render :edit
    end
  end

  def move
    if @forum.update_attributes(permitted_params.forum_move)
      flash[:notice] = t(:notice_successful_update)
    else
      flash.now[:error] = t('forum_could_not_be_saved')
      render action: 'edit'
    end
    redirect_to_settings_in_projects(@forum.project_id)
  end

  def destroy
    @forum.destroy
    flash[:notice] = l(:notice_successful_delete)
    redirect_to_settings_in_projects
  end

  private

  def redirect_to_settings_in_projects(id = @project)
    redirect_to controller: '/project_settings', action: 'show', id: id, tab: 'forums'
  end

  def find_forum
    @forum = @project.forums.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render_404
  end

  def new_forum
    @forum = Forum.new(permitted_params.forum?)
    @forum.project = @project
  end
end
