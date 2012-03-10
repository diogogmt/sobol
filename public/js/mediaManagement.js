const CREATE_MEDIA = 1
    , EDIT_MEDIA = 2;

var MediaManagement = function (opt) {
  // console.log("MediaManagemeent cosntructor");
  switch (opt.type) {
    case CREATE_MEDIA:
      this.oldTagsSelect = $("#selectTags-create");
      this.tagsList = $("#tagsList-create");
      this.mediaForm = $("#mediaForm-create");
      this.createTagBtn = $("#createTagBtn-create");
      this.submitBtn = $("#submitMediaBtn-create");
      this.freshTagsInput = $("#freshTags-create");
      this.tagNameInput = $("#tagName-create");
      this.formUrl = "/media/create";
    break;

    case EDIT_MEDIA:
      this.oldTagsSelect = $("#selectTags-edit");
      this.tagsList = $("#tagsList-edit");
      this.mediaForm = $("#mediaForm-edit");
      this.createTagBtn = $("#createTagBtn-edit");
      this.submitBtn = $("#submitMediaBtn-edit");
      this.freshTagsInput = $("#freshTags-edit");
      this.tagNameInput = $("#tagName-edit");
      this.formUrl = "/media/edit";
    break;
  }

  this.freshTags = new Array();
  this.oldTags = new Array();

  this.bindAjaxForm();
  this.bindSubmitFormHandler();
  this.bindCreateTagHandler();
  this.bindSelectTagHandler();
  this.createTagOptions();
}

MediaManagement.prototype.bindAjaxForm = function() {
  // console.log("bindAjaxForm");
  var that = this;
  // console.log("MediaManagement");
  // console.log(that);
  $(this.mediaForm).ajaxForm({
    url:       this.formUrl,
    type:      "POST",
    dataType:  "json",
    clearForm: true,
    beforeSubmit: function (formData, jqForm, options) {
      // formData is an array of objects containing the values of the form
      // jqForm is the html form element
      // options are the object initialized with ajaxForm
      // maybe validate the for before submiting
      // if form is not valid return false
      return true;
    },
    success: function (data) {
      console.log("create media success");
      console.log(data);
      // $("#mediaGalleryTmpl").tmpl(data).prependTo("#mediaList");
      // bindImageListeners();
      mediaSearch.clearFilter();
      mediaSearch.searchMedia();
      that.oldTags = new Array();
      that.freshTags = new Array();
      $(that.tagsList).empty();
      that.createTagOptions();
      
    },
  });
};

MediaManagement.prototype.bindSubmitFormHandler = function() {
  // console.log("bindSubmitFormHandler");
  var that = this;
  $(this.submitBtn).click(function (e) {
    // console.log("create media button");
    $(that.freshTagsInput).val(that.freshTags.concat(that.oldTags));
    // console.log($(that.freshTagsInput).val());
  }); // CLOSE createMedia.click
};

MediaManagement.prototype.bindCreateTagHandler = function() {
  // console.log("bindCreateTagHandler");
  var that = this;
  $(this.createTagBtn).click(function (e) {
    // console.log("create tag click");
    var tag = {
      name: $(that.tagNameInput).val(),
    };
    that.freshTags.push(tag.name);

    var item = $("#mediaTagsTmpl").tmpl(tag).appendTo(that.tagsList);
    $(item).find(".removeTag").click(function (e) {
      // console.log("remove tag click");
      $(this).parent().empty();
      that.freshTags.splice(that.freshTags.indexOf($(that).attr("query")), 1);
      return false;
    });
    $(that.tagNameInput).val("");
    return false;
  }); // CLOSE createTag.click
};

MediaManagement.prototype.bindSelectTagHandler = function() {
  console.log("bindSelectTagHandler");
  var that = this;
  $(this.oldTagsSelect).change(function () {
    console.log("tags available change");
    console.log(that.oldTagsSelect.val());
    console.log($(this).val());
    var tag = {
      name: $(this).val(), // PROBLEM
    };
    that.oldTags.push($(this).val());
    var item = $("#mediaTagsTmpl").tmpl(tag).appendTo(that.tagsList);
 
    $(item).find(".removeTag").click( function (e) {
      console.log("remove existing tag click");
      $(this).parent().empty();
      that.oldTags.splice(that.oldTags.indexOf($(this).attr("query")), 1);
      $("#availableTagsTmpl").tmpl({"value": tag.name, "text": tag.name}).appendTo(that.oldTagsSelect);
      return false;
    });
    
    // $(this).find(":selected").remove(); // PROBLEM
    // console.log(this);
    // console.log($(this));    
    // console.log($(this).find(":selected"));
    // console.log($(this).options[$(this).selectedIndex]);
    $(this).find(":selected").remove();
  }); // CLOSE tagsAvailable.change
};

MediaManagement.prototype.createTagOptions = function() {
  // console.log("createTagOptions");
  var that = this;
  $.get("/media/tags", function (data) {
    // console.log("get media tags");
    // console.log(data);
    var tags = new Array();
    tags.push({"value": 0, "text": "Select a tag"});
    for (var i = 0; i < data.length; i++) {
      tags.push({"value": data[i], "text": data[i]});
    }
    // console.log(tags);
    $(that.oldTagsSelect).empty();
    $(that.freshTagsInput).val("");
    $("#availableTagsTmpl").tmpl(tags).appendTo(that.oldTagsSelect);
  });
};