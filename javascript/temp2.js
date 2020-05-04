self.changePassword = function () {
    if ($("#newPassword")[0].rawValue.length != 0 && $("#oldPassword")[0].rawValue.length != 0 && $("#confirmNewPassword")[0].rawValue.length != 0) {
        if ($("#newPassword")[0].rawValue == $("#confirmNewPassword")[0].rawValue) {
            if ($("#newPassword")[0].rawValue != $("#oldPassword")[0].rawValue) {
                $.ajax({
                    type: "POST",
                    url: hostnameAuth + changePasswordByUserType,
                    data: "newPassword=" + $("#newPassword")[0].rawValue + "&oldPassword=" + $("#oldPassword")[0].rawValue,
                    dataType: 'json',
                    success: function (data, textStatus, request) {
                        if (data != null && data != undefined && data.responseType != undefined && data.responseType == "D") {
                            var rootViewModel = ko.dataFor(document.getElementById('pageContent'));
                            rootViewModel.documentsModule("documents");
                        } else {
                            alert((data.responseType).substring(1));
                        }
                    },
                    error: function (error) {
                        alert(error.status + " " + error.statusText);
                    }
                });
            }
        }

    }
}

self.changePassword = function () {
    if ($("#newPasswordF")[0].rawValue.length != 0 && $("#oldPasswordF")[0].rawValue.length != 0 && $("#confirmNewPasswordF")[0].rawValue.length != 0) {
        if ($("#newPasswordF")[0].rawValue == $("#confirmNewPasswordF")[0].rawValue) {
            if ($("#newPasswordF")[0].rawValue != $("#oldPasswordF")[0].rawValue) {
                $.ajax({
                    type: "POST",
                    url: hostnameAuth + changePasswordByUserType,
                    data: "newPassword=" + $("#newPasswordF")[0].rawValue + "&oldPassword=" + $("#oldPasswordF")[0].rawValue,
                    dataType: 'json',
                    success: function (data, textStatus, request) {
                        if (data != null && data != undefined && data.responseType != undefined && data.responseType == "D") {
                            var rootViewModel = ko.dataFor(document.getElementById('mainContentIndex'));
                            rootViewModel.dynamicModule('noAuth/login');
                            rootViewModel.mainVC('noAuth/login');
                        } else {
                            alert((data.responseType).substring(1));
                        }

                    },
                    error: function (error) {

                        alert(error.status + " " + error.statusText);
                    }
                });
            }
        }

    }

}