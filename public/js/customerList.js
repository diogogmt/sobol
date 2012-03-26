var CustomerList = function (opt) {
	this.initOverlay();
	this.loadCustDataTable();
	this.createHandlers();
};

CustomerList.prototype.createHandlers = function() {
	var that = this;
	$("#createCustBtn").click(function (e) {
		$("#createCustOverlay").overlay().load();
		return false;
	});

	$("#cancelCustBtn").click(function (e) {
		$("#createCustOverlay").overlay().close();
		return false;
	});

	$("#saveCustBtn").click(function (e) {
		if (that.validateCust()) {
			that.createCust();
		}
		return false;
	});

	$('#showArchived').click(function() {
		that.loadCustDataTable();
  });

	$("#customerTable tbody tr").live("click", function() {
      var data = $("#customerTable").dataTable().fnGetData(this);
      var custID = data[0];
      window.location.href = "/customer/" + custID;
    });
};

CustomerList.prototype.initOverlay = function() {
	$("#createCustOverlay").overlay({
    top: 260,
    mask: {
      color: '#fff',
      loadSpeed: 200
    },
    closeOnClick: false,
  });
};

CustomerList.prototype.loadCustDataTable = function(status) {
	status = $('#showArchived').is(':checked')
         ? "Archived"
         : "Active"
	$("#customerTable").dataTable( {
    "bProcessing": true,
    "bDestroy": true,
    //"sAjaxSource": "/datatable/customer/findAll",
    "sAjaxSource": "/datatable/customers?status=" + status,
    "aoColumnDefs": [
      { "bVisible" : false, "aTargets" : [0] }
    ],
    "aaSorting": [[6, "desc"], [1, "asc"]]
  });
};

CustomerList.prototype.createCust = function() {
	var that = this;
	$.ajax({
    url: "/customer/create",
    type: "POST",
    data: that.getFormData(),
    success: function (data) {
      console.log("success");
      console.log(data);
      $("#createCustForm").clearForm();
      $("#createCustOverlay").overlay().close();
      that.loadCustDataTable();
    },
    error: function () {
      console.log("error");
    },
    complete: function () {
      console.log("complete");
    }
  }); // END ajax
}

CustomerList.prototype.validateCust = function() {
	return true;
}

CustomerList.prototype.getFormData = function() {
	return {
		"cust": {
			"firstName": $("#firstName").val(),
			"lastName": $("#lastName").val(),
			"address1": $("#address1").val(),
			"country": $("#country").val(),
			"province": $("#province").val(),
			"city": $("#city").val(),
			"postal": $("#posta;").val(),
			"phone1": $('#tel1a').val() + '-' + $('#tel1b').val() + '-'
				+ $('#tel1c').val(),
			"phone2": $('#tel2a').val() + '-' + $('#tel2b').val() + '-'
				+ $('#tel2c').val(),
			"email": $("#email").val(),
		}
	}
}