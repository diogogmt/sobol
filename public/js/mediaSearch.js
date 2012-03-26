var MediaSearch = function (opt) {
  console.log("MediaSearch constructor");
	this.searchFilters = new Array();
	this.searchMediaBtn = $("#searchMediaBtn");
  this.resetSearchBtn = $("#resetSearchBtn");
  this.addFilterInput = $("#addFilterInput");
	this.media;
	this.viewMediaOverlay;
	this.editMediaOverlay;

	this.initOverlays();
  this.searchMedia();
  this.bindSearchMediaBtnHandler();
  this.bindResetSearchBtnHandler();
  this.bindClearAddFilterInputHandler();
};

MediaSearch.prototype.bindManageMediaHandlers = function() {
	console.log("bindManageMediaHandlers");
	this.bindViewMediaHandler();
	this.bindEditMediaHandler();
	this.bindDeleteMediaHandler();
};

MediaSearch.prototype.bindViewMediaHandler = function() {
	console.log("bindViewMediaHandlers");
	var that = this;
	$(".viewMedia").click(function (e) {
    console.log("view media button");
    $("#viewMediaOverlay").empty();
    $("#viewMediaOverlayTmpl").tmpl(that.media[$(this).attr("i")]).appendTo("#viewMediaOverlay");
    that.viewMediaOverlay.load();
    $(".close").click(function (e) {
      console.log("close view overlay click");
      that.viewMediaOverlay.close();
    })
  }); // CLOSE viewMedia.click
};

MediaSearch.prototype.bindEditMediaHandler = function() {
	console.log("bindEditMediaHandlers");
	var that = this;
	$(".editMedia").click(function (e) {
    console.log("edit media button");
    $("#editMediaOverlay").empty();
    $("#editMediaOverlayTmpl").tmpl(that.media[$(this).attr("i")]).appendTo("#editMediaOverlay");
    // Listen for the overlay close event then release manageEditMedia
    manageEditMedia = new MediaManagement({"type": EDIT_MEDIA, "editIndex": $(this).attr("i")});
    that.editMediaOverlay.load();

    var tagArray = that.media[$(this).attr("i")].tags;
    var tagCollection = new Array();
    for(var i = 0; i < tagArray.length; i++){
      tagCollection.push({
        name : tagArray[i]
      })
    }
    manageEditMedia.oldTags = tagArray;
    var item = $("#mediaTagsTmpl").tmpl(tagCollection).appendTo(manageEditMedia.tagsList);
    $(item).find(".removeTag").click(function (e) {
      // console.log("remove tag click");
      $(this).parent().remove();
      manageEditMedia.oldTags.splice(manageEditMedia.oldTags.indexOf($(this).attr("query")), 1);
      return false;
    });
    $(".close").click(function (e) {
      console.log("close edit overlay click");
      that.editMediaOverlay.close();
    })
  }); // CLOSE viewMedia.click
};

MediaSearch.prototype.bindDeleteMediaHandler = function() {
	console.log("bindDeleteMediaHandlers");
	var that = this;
	$(".deleteImage").click(function () {
    var mediaID = $(this).attr("media");
    $.post("/media/delete", { "mediaID": mediaID }, function (data) {
      that.searchMedia();
      manageCreateMedia.createTagOptions();
    })
  });
};

MediaSearch.prototype.bindSearchMediaBtnHandler = function() {
	console.log("bindSearchMediaBtnHandler");
	var that = this;
  console.log(this.searchMediaBtn);
	$(this.searchMediaBtn).click(function (e) {
	  console.log("search media button click");

    if ($(that.addFilterInput).val() === "") {
      return false;
    }

	  var data = {
	    name: $(that.addFilterInput).val()
	  };

	  var item = $("#searchMediaTmpl").tmpl(data).appendTo("#searchTags");
	  $(item).find(".removeFilter").click( function (e) {
	    console.log("remove filter click");
	    console.log($(this).attr("query"));
	    $(this).parent().empty();
	    that.searchFilters.splice(that.searchFilters.indexOf($(this).attr("query")), 1);
	    that.searchMedia();
	  });
    $(that.addFilterInput).val("");
    that.searchFilters.push(data.name);
    that.searchMedia();
	  return false;
	}); // CLOSE searchMediaBtn.clickdManagMediaHandlers

};

MediaSearch.prototype.bindResetSearchBtnHandler = function() {
  console.log("bindResetSearchBtnHandler");
  var that = this;
  console.log(this.resetSearchBtn);
  $(this.resetSearchBtn).click(function (e) {
    that.clearFilter();
    $("#searchTags").empty();
    that.searchMedia();
    return false;
  });
};


MediaSearch.prototype.bindClearAddFilterInputHandler = function() {
  console.log("bindClearAddFilterInputHandler");
  var that = this;
  $(this.addFilterInput).click(function (e) {
    console.log("addFilterInput click");
    $(this).val("");
    return false;
  });
};


MediaSearch.prototype.searchMedia = function() {
	console.log("searchMedia");
	var that = this;
  console.log(that.searchFilters);
	$.post("/media/search", { filters: that.searchFilters }, function(data) {
    console.log(data);
    var counter = 0;
    that.media = data;
    if (data) {
      for (var key in data) {
        data[key]["i"] = counter++;
      }
      var otherThat = that;
      $('.gallery').quicksand( $("#mediaGalleryTmpl").tmpl(data), {
        adjustHeight: 'dynamic'
        }, function () {
          console.log("quicksand callback");
          that.bindManageMediaHandlers();
      });
    }
    else {
      $('.gallery').empty();
    }
  });
};

MediaSearch.prototype.initOverlays = function() {
	console.log("initOverlays");
	var that = this;
	$("#viewMediaOverlay").overlay({
    mask: {
      color: '#fff',
      loadSpeed: 200,
      opacity: 0.8
    },
    effect: 'apple',
  });
  that.viewMediaOverlay = $("#viewMediaOverlay").overlay({});

  $("#editMediaOverlay").overlay({
    mask: {
      color: '#fff',
      loadSpeed: 200,
      opacity: 0.8
    },
    effect: 'apple',
  });
  that.editMediaOverlay = $("#editMediaOverlay").overlay({});
};

MediaSearch.prototype.clearFilter = function() {
	this.searchFilters = new Array();
}