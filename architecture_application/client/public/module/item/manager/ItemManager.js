function ItemFactory(Notification, $state) {

  var ItemManager = function (resource, data) {
    this.resource = resource;
    if (data) {
      this.data = data;
    } else {
      this.data = {};
    }
  };

  ItemManager.prototype.create = function (item, redirectLocation) {
    this.resource.save({}, item, function (itemCreated) {
      this.init(null, itemCreated);
      Notification.success({ message: 'the item was succesfully saved :)', title: 'Success' });
      $state.go(redirectLocation);
    }.bind(this), function (error) {
      this.init(error);
      Notification.error({ message: error.status + ' - ' + error.statusText, title: 'Error (' + error.status + ')' });
    }.bind(this));
  };

  ItemManager.prototype.update = function (item, itemID, redirectLocation) {
    this.resource.update({ id: itemID }, item, function (item) {
      this.init(null, item);
      Notification.success({ message: 'the item was succesfully updated :)', title: 'Success' });
      $state.go(redirectLocation);
    }.bind(this), function (error) {
      this.init(error);
      Notification.error({ message: error.status + ' - ' + error.statusText, title: 'Error (' + error.status + ')' });
    }.bind(this));
  };

  ItemManager.prototype.delete = function (itemID) {
    var _this = this;
    var _itemID = itemID
    bootbox.confirm("Are you sure that you want to delete this item?", function (result) {
      _this.resource.delete({ id: _itemID }, {}, function () {
        _this.init();
        Notification.warning({ message: 'the item was succesfully deleted :)', title: 'Success' });
      }.bind(_this), function (error) {
        _this.init(error);
        Notification.error({ message: error.status + ' - ' + error.statusText, title: 'Error (' + error.status + ')' });
      }.bind(_this));
    });
  };

  return ItemManager;
}

angular.module('item').factory('ItemManager', ItemFactory);