// Generated by CoffeeScript 1.7.1
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Handlebars.registerHelper("relativeTime", function(timeString) {
  return moment(timeString).fromNow();
});

Handlebars.registerHelper("prettifyURL", function(link) {
  var ans, url;
  url = link.split('/');
  ans = url[2];
  ans = ans.replace('www.', '');
  return ans;
});

window.renderData = (function(_this) {
  return function() {
    return $('body').append(template(data));
  };
})(this);

App.PostModel = (function(_super) {
  __extends(PostModel, _super);

  function PostModel() {
    return PostModel.__super__.constructor.apply(this, arguments);
  }

  PostModel.prototype.initialize = function(options) {
    if (this.get('timestamp') == null) {
      if ((options.is_published != null) && options.is_published === false) {
        return this.set('timestamp', options.scheduled_publish_time * 1000);
      } else {
        return this.set('timestamp', options.updated_time);
      }
    }
  };

  return PostModel;

})(Backbone.Model);

App.PostView = (function(_super) {
  __extends(PostView, _super);

  function PostView() {
    return PostView.__super__.constructor.apply(this, arguments);
  }

  PostView.prototype.className = 'post-bar bar';

  PostView.prototype.tagName = 'li';

  PostView.prototype.initialize = function() {
    return _.bindAll(this, 'selectPost');
  };

  PostView.prototype.events = {
    'click': 'selectPost'
  };

  PostView.prototype.selectPost = function() {
    if (!this.$el.hasClass('selected')) {
      this.$el.siblings().removeClass('selected');
      this.$el.addClass('selected');
      return this.renderPostSelection();
    }
  };

  PostView.prototype.renderPostSelection = function() {
    var detail;
    detail = new App.PostDetailView({
      model: this.model
    });
    return $('#app-right').velocity("transition.slideUpOut", {
      duration: 150,
      complete: (function(_this) {
        return function() {
          fetchInsightData(_this.model.get('id'));
          $('#post-detail').empty();
          $('#post-detail').append(detail.render());
          return $('#app-right').velocity("transition.slideUpIn", {
            stagger: 100
          });
        };
      })(this)
    });
  };

  return PostView;

})(Backbone.View);

App.PostInsightView = (function(_super) {
  var postInsightTemplate;

  __extends(PostInsightView, _super);

  function PostInsightView() {
    this.render = __bind(this.render, this);
    return PostInsightView.__super__.constructor.apply(this, arguments);
  }

  postInsightTemplate = Handlebars.compile($('#post-insight-template').html());

  PostInsightView.prototype.className = 'insight-view';

  PostInsightView.prototype.initialize = function() {
    var all_impressions, all_reach, dataset, fan_impressions, fan_reach, nonfan_impressions, nonfan_reach;
    dataset = this.model.get('data');
    all_impressions = dataset[0].values[0].value;
    all_reach = dataset[1].values[0].value;
    fan_impressions = dataset[2].values[0].value;
    fan_reach = dataset[3].values[0].value;
    nonfan_reach = all_reach - fan_reach;
    nonfan_impressions = all_impressions - fan_impressions;
    this.fan_engagement = this.percentify(fan_impressions / all_impressions);
    this.fan_saturation = this.percentify(fan_reach / all_reach);
    this.fan_affinity = this.percentify((fan_impressions / fan_reach) / (nonfan_impressions / nonfan_reach));
    if (all_reach * all_impressions === 0) {
      this.fan_engagement = this.fan_saturation = "";
    }
    if (fan_reach * nonfan_reach === 0) {
      return this.fan_affinity = "";
    }
  };

  PostInsightView.prototype.percentify = function(num) {
    return (num * 100).toPrecision(4) + "%";
  };

  PostInsightView.prototype.render = function() {
    this.$el.html(postInsightTemplate({
      dataset: this.model.get('data'),
      fan_engagement: this.fan_engagement,
      fan_saturation: this.fan_saturation,
      fan_affinity: this.fan_affinity
    }));
    $('.insight-section').empty();
    $('.insight-section').append(this.$el);
    return this.$el;
  };

  return PostInsightView;

})(Backbone.View);

App.PostDetailView = (function(_super) {
  var postDetailTemplate;

  __extends(PostDetailView, _super);

  function PostDetailView() {
    this.render = __bind(this.render, this);
    this.postDelete = __bind(this.postDelete, this);
    return PostDetailView.__super__.constructor.apply(this, arguments);
  }

  postDetailTemplate = Handlebars.compile($('#post-detail-template').html());

  PostDetailView.prototype.events = {
    'click .detail-delete': 'postDelete'
  };

  PostDetailView.prototype.postDelete = function() {
    deletePost(this.model.get('id'), this.model.get('page_access_token'));
    return this.emptyDetailView();
  };

  PostDetailView.prototype.emptyDetailView = function() {
    $('#post-detail').empty();
    return $('.insight-section').empty();
  };

  PostDetailView.prototype.render = function() {
    var sm;
    sm = JSON.stringify(this.model.toJSON(), null, 4);
    this.model.set('is_image', this.model.get('type') === 'image');
    this.model.set('blob', sm);
    this.$el.html(postDetailTemplate(this.model.toJSON()));
    return this.$el;
  };

  return PostDetailView;

})(Backbone.View);

App.PostStatusView = (function(_super) {
  var postStatusTemplate;

  __extends(PostStatusView, _super);

  function PostStatusView() {
    this.render = __bind(this.render, this);
    return PostStatusView.__super__.constructor.apply(this, arguments);
  }

  postStatusTemplate = Handlebars.compile($('#status-post-template').html());

  PostStatusView.prototype.render = function() {
    if (!this.model.get('message')) {
      this.model.set('message', this.model.get('story'));
    }
    this.$el.html(postStatusTemplate(this.model.toJSON()));
    return this.$el;
  };

  return PostStatusView;

})(App.PostView);

App.PostPhotoView = (function(_super) {
  var postPhotoTemplate;

  __extends(PostPhotoView, _super);

  function PostPhotoView() {
    this.render = __bind(this.render, this);
    return PostPhotoView.__super__.constructor.apply(this, arguments);
  }

  postPhotoTemplate = Handlebars.compile($('#photo-post-template').html());

  PostPhotoView.prototype.render = function() {
    if (!this.model.get('story')) {
      this.model.set('story', this.model.get('message'));
    }
    this.$el.html(postPhotoTemplate(this.model.toJSON()));
    return this.$el;
  };

  return PostPhotoView;

})(App.PostView);

App.FeedCollection = (function(_super) {
  __extends(FeedCollection, _super);

  function FeedCollection() {
    return FeedCollection.__super__.constructor.apply(this, arguments);
  }

  return FeedCollection;

})(Backbone.Collection);

App.PageController = (function(_super) {
  __extends(PageController, _super);

  function PageController() {
    this.paginate = __bind(this.paginate, this);
    return PageController.__super__.constructor.apply(this, arguments);
  }

  PageController.prototype.initialize = function(data, access_token, page_id) {
    this.pageNumber = 1;
    this.pageNumberEl = $('.page-number');
    if (data.paging != null) {
      this.paginate(data, access_token);
    }
    return $('#compose-btn').click(function() {
      this.compose = new App.ComposeView({
        model: new Backbone.Model({
          page_id: page_id,
          access_token: access_token
        })
      });
      return this.compose.renderComposeSelection();
    });
  };

  PageController.prototype.assignPagination = function(paging) {
    $('#next-btn').unbind('click');
    $('#prev-btn').unbind('click');
    $('#next-btn').click((function(_this) {
      return function() {
        return paginateFeed(paging.next);
      };
    })(this));
    return $('#prev-btn').click((function(_this) {
      return function() {
        return paginateFeed(paging.previous);
      };
    })(this));
  };

  PageController.prototype.paginate = function(data, access_token) {
    if (data.data.length) {
      this.feed = new App.FeedCollectionView({
        collection: new App.FeedCollection(_.map(data.data, (function(_this) {
          return function(s) {
            var tempModel;
            tempModel = new App.PostModel(s);
            tempModel.set('page_access_token', access_token);
            return tempModel;
          };
        })(this)))
      });
      this.pageNumberEl.text(moment(this.feed.collection.at(0).get('timestamp')).format('ha, MMM DD YYYY'));
      $('#pagination-label').velocity("callout.pulse", {
        duration: 100
      });
    }
    if (data.paging != null) {
      this.assignPagination(data.paging);
    }
    return this.feed.render();
  };

  return PageController;

})(Backbone.View);

App.ComposeView = (function(_super) {
  var postComposeTemplate;

  __extends(ComposeView, _super);

  function ComposeView() {
    this.submitPost = __bind(this.submitPost, this);
    this.render = __bind(this.render, this);
    this.readPostArgs = __bind(this.readPostArgs, this);
    this.composeCancel = __bind(this.composeCancel, this);
    this.composeSwitch = __bind(this.composeSwitch, this);
    this.initialize = __bind(this.initialize, this);
    return ComposeView.__super__.constructor.apply(this, arguments);
  }

  postComposeTemplate = Handlebars.compile($('#post-compose-template').html());

  ComposeView.prototype.initialize = function() {
    $('.post-list li').click(this.unselect);
    this.isURL = false;
    this.isScheduling = false;
    return $(window).on('sucessfulPost', this.composeCancel);
  };

  ComposeView.prototype.events = function() {
    return {
      'click .compose-switch': 'composeSwitch',
      'click .compose-post': 'composePost',
      'click .compose-schedule': 'composeSchedule',
      'click .compose-cancel': 'composeCancel'
    };
  };

  ComposeView.prototype.select = function() {
    $('.post-list li.selected').removeClass('selected');
    return $('#compose-btn').addClass('selected');
  };

  ComposeView.prototype.unselect = function() {
    return $('#compose-btn').removeClass('selected');
  };

  ComposeView.prototype.composeSwitch = function() {
    this.isURL = !this.isURL;
    return $('#post-detail').velocity("transition.slideUpOut", {
      duration: 150,
      complete: (function(_this) {
        return function() {
          $('#post-detail').append(_this.render());
          return $('#post-detail').velocity("transition.slideUpIn", {
            duration: 100
          });
        };
      })(this)
    });
  };

  ComposeView.prototype.composeSchedule = function() {
    this.isScheduling = !this.isScheduling;
    $('.schedule-controls').toggleClass('visible');
    if (this.isScheduling) {
      this.dpi = $('.datepicker').pickadate({
        container: '#schedule-root'
      });
      return this.tpi = $('.timepicker').pickatime({
        container: '#schedule-root'
      });
    }
  };

  ComposeView.prototype.composePost = function() {
    return this.submitPost();
  };

  ComposeView.prototype.composeCancel = function() {
    this.unselect();
    $('#post-detail').empty();
    return $('.insight-section').empty();
  };

  ComposeView.prototype.readPostArgs = function() {
    var dateString, diffAmount, inputDate, nowMoment, postArgs, schedMoment, schedString, schedTimestamp;
    postArgs = {
      page_id: this.model.get('page_id')
    };
    postArgs.access_token = this.model.get('access_token');
    if (this.isScheduling) {
      inputDate = $('.datepicker').val();
      dateString = inputDate === '' ? moment().format('DD MMM, YYYY') : inputDate;
      schedString = dateString + " " + $('.timepicker').val();
      schedMoment = moment(schedString, 'DD MMM, YYYY h:mma');
      schedTimestamp = schedMoment.unix();
      nowMoment = moment();
      diffAmount = nowMoment.diff(schedMoment, 'minutes');
      if (diffAmount < -10) {
        postArgs.scheduled_publish_time = schedTimestamp;
        postArgs.published = false;
      } else if (diffAmount > 1) {
        postArgs.backdated_time = schedTimestamp;
      }
    }
    if (this.isURL) {
      postArgs.link = $('#compose-link').val();
      postArgs.picture = $('#compose-picture').val();
      postArgs.name = $('#compose-name').val();
      postArgs.caption = $('#compose-caption').val();
      postArgs.description = $('#compose-description').val();
    } else {
      postArgs.message = $('#compose-message').val();
    }
    return postArgs;
  };

  ComposeView.prototype.render = function() {
    this.select();
    this.$el.html(postComposeTemplate({
      isURL: this.isURL,
      isScheduling: this.isScheduling
    }));
    return this.$el;
  };

  ComposeView.prototype.submitPost = function(ts) {
    var postArgs;
    if (ts == null) {
      ts = 0;
    }
    postArgs = this.readPostArgs();
    if (!((postArgs.message != null) || (postArgs.link != null))) {
      console.error('need to complete post before submitting');
    }
    if (ts = 0) {
      console.log('defaulting to now');
      ts = moment();
    }
    return publishHelloWorld(postArgs);
  };

  ComposeView.prototype.renderComposeSelection = function() {
    return $('#app-right').velocity("transition.slideUpOut", {
      duration: 150,
      complete: (function(_this) {
        return function() {
          $('.insight-section').empty();
          $('#post-detail').html(_this.render({
            isURL: _this.isURL
          }));
          return $('#app-right').velocity("transition.slideUpIn", {
            stagger: 100,
            duration: 100
          });
        };
      })(this)
    });
  };

  return ComposeView;

})(Backbone.View);

App.FeedCollectionView = (function(_super) {
  __extends(FeedCollectionView, _super);

  function FeedCollectionView() {
    return FeedCollectionView.__super__.constructor.apply(this, arguments);
  }

  FeedCollectionView.prototype.finishPostDelete = function(res) {
    if (!res.success) {
      return alert('Post deletion failed. Please refresh the page and try again.');
    } else {
      this.collection.remove(this.collection.get(res.post_id));
      return $("[data-pid=\"" + res.post_id + "\"]").parent().velocity('transition.slideUpOut', {
        complete: function() {
          return $("[data-pid=\"" + res.post_id + "\"]").parent().remove();
        }
      });
    }
  };

  FeedCollectionView.prototype.renderPostResponse = function(res) {
    var message, newModel, postType, story, ts;
    if (res.error != null) {
      console.error(res.error);
      alert(res.error.error_user_msg);
      return;
    }
    ts = res.requestArgs.scheduled_publish_time != null ? res.requestArgs.scheduled_publish_time : res.requestArgs.backdated_time != null ? res.requestArgs.backdated_time : moment().unix();
    ts = ts * 1000;
    if (res.requestArgs.message != null) {
      postType = 'status';
      story = res.requestArgs.message;
    } else {
      postType = 'link';
      story = res.requestArgs.name;
      message = res.requestArgs.name;
    }
    newModel = new App.PostModel({
      id: res.id,
      type: postType,
      story: story,
      message: message,
      timestamp: ts
    });
    $(window).trigger("sucessfulPost", newModel);
    this.collection.unshift(newModel);
    return this.render();
  };

  FeedCollectionView.prototype.render = function() {
    $('.post-list').empty();
    this.collection.each((function(_this) {
      return function(post) {
        var postR;
        postR = (function() {
          switch (false) {
            case post.get('type') !== 'status':
              return new App.PostStatusView({
                model: post
              });
            case post.get('type') !== 'link':
              return new App.PostStatusView({
                model: post
              });
            case post.get('type') !== 'photo':
              return new App.PostPhotoView({
                model: post
              });
            case post.get('type') !== 'video':
              return new App.PostPhotoView({
                model: post
              });
            default:
              return new App.PostStatusView({
                model: post
              });
          }
        })();
        return $('.post-list').append(postR.render());
      };
    })(this));
    return $('.post-list li').velocity("transition.flipYIn", {
      stagger: 100
    });
  };

  return FeedCollectionView;

})(Backbone.View);
