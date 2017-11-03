function {{className}}Factory(ItemManager, {{className}}Resource, $state){

    var {{className}}Manager = function(scope,{{className}}Resolve){
        ItemManager.call(this,{{className}}Resource, {{className}}Resolve);
    };

    {{className}}Manager.prototype = Object.create(ItemManager.prototype);
    {{className}}Manager.constructor = {{className}}Manager;

    {{className}}Manager.prototype.init = function(err,item){
        if(err){

        }else {
            $state.reload();
        }
    };



    return {{className}}Manager;
}

angular.module('{{moduleName}}').factory('{{className}}Manager', {{className}}Factory);