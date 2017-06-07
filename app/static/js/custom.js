var $wrapper,
    $createModal,
    $updateModal,
    $deleteModal,
    items = {};

// Simple JavaScript Templating
// John Resig - https://johnresig.com/ - MIT Licensed
(function(){
  var cache = {};

  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();

var kvadra = {

    getItems: function () {
        $.ajax({
            type: "GET",
            url: itemsListURL,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                kvadra.renderList(data['data']);
                kvadra.initEvents()
            }
        });
    },

    renderList: function (arr) {
        $.each(arr, function (idx, item) {
            items[item.id] = item;
            kvadra.renderListItem(item);
        })
    },

    renderListItem: function (obj) {
        $wrapper.append(tmpl("list_item_tmpl", obj));
    },

    initEvents: function () {
        $('.create-item-button').on('click', function () {
            kvadra.showCreatePopup();
        });

        $('tr.item').each(function (idx, obj) {
            $(this).find('.update span').on('click', function (e) {
                kvadra.showUpdatePopup(items[$(obj).data('id')]);
            });
            $(this).find('.delete span').on('click', function (e) {
                kvadra.showDeletePopup(items[$(obj).data('id')]);
            })
        })
    },

    showCreatePopup: function () {
        $createModal.find('.modal-body').html(tmpl("item_create_tmpl"));
        $createModal.find('form').on('submit', function (e) {
            e.preventDefault();
            kvadra.createObject(this);
        });
        $createModal.on('hidden.bs.modal', function (event) {
            $createModal.find('.modal-body').empty()
        });
        $createModal.modal('show');
    },

    showUpdatePopup: function (obj) {
        $updateModal.find('.modal-body').html(tmpl("item_update_tmpl", obj));
        $updateModal.find('form').on('submit', function (e) {
            e.preventDefault();
            kvadra.saveObject(this);
        });
        $updateModal.on('hidden.bs.modal', function (event) {
            $updateModal.find('.modal-body').empty()
        });
        $updateModal.modal('show');
    },

    showDeletePopup: function (obj) {
        $deleteModal.find('.modal-body').html(tmpl("item_delete_tmpl", obj));
        $deleteModal.find('form').on('submit', function (e) {
            e.preventDefault();
            kvadra.deleteObject(this);
        });
        $deleteModal.on('hidden.bs.modal', function (event) {
            $deleteModal.find('.modal-body').empty()
        });
        $deleteModal.modal('show');
    },

    createObject: function (form) {

        var payload = {
            'text': $(form).find('input').val()
        };

        $.ajax({
            type: "POST",
            url: form.action,
            data: JSON.stringify( payload ),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                $wrapper.empty();
                kvadra.getItems();
                $createModal.modal('hide');
            }
        });

    },


    saveObject: function (form) {

        var payload = {
            'text': $(form).find('input').val()
        };

        $.ajax({
            type: "PUT",
            url: form.action,
            data: JSON.stringify( payload ),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                $wrapper.empty();
                kvadra.getItems();
                $updateModal.modal('hide');
            }
        });

    },

    deleteObject: function (form) {

        $.ajax({
            type: "DELETE",
            url: form.action,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                $wrapper.empty();
                kvadra.getItems();
                $deleteModal.modal('hide');
            }
        });

    }
};

$(document).ready(function () {
    $wrapper = $(".content-wrapper");
    $createModal = $(".create-item");
    $updateModal = $(".update-item");
    $deleteModal = $(".delete-item");
    kvadra.getItems()

});