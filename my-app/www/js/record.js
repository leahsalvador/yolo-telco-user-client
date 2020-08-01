$(document).ready(function() {
  var capture = {
    image: function() {
      navigator.device.capture.captureImage(capture.onCaptureImageSuccess);
    },
    video: function() {
      navigator.device.capture.captureVideo(capture.onCaptureVideoSuccess);
    },
    onCaptureImageSuccess: function(mediaFiles) {
      for (var i = 0; i < mediaFiles.length; i++) {
        var path = mediaFiles[i].fullPath;
        $("#Curl").html(path);
        // $('#photo').attr('src',path);
        $("#image_file").val(path);
        $("#send_img").modal("show");
      }
    },
    onCaptureVideoSuccess: function(mediaFiles) {
      for (var i = 0; i < mediaFiles.length; i++) {
        var path = mediaFiles[i].fullPath;
        $("#Vurl").html(path);
        $("#video_file").val(path);
        $("#send_vid").modal("show");
      }
    }
  };

  $(document).on("click", ".get_image_y_task", function() {
    // $('.getImg').click(function(){
    $("#check_img").val($(this).attr("id"));
    $("#send_img").modal("show");
    return;
    if ($(this).attr("id") == $("#check_img").val()) {
      $("#send_img").modal("show");
    } else {
      $("#check_img").val($(this).attr("id"));
      capture.image();
    }
  });

  $(document).on("click", ".get_video_y_task", function() {
    $("#check_vid").val($(this).attr("id"));
    $("#send_vid").modal("show");
    return;
    if ($(this).attr("id") == $("#check_vid").val()) {
      $("#send_vid").modal("show");
    } else {
      $("#check_vid").val($(this).attr("id"));
      capture.video();
    }
  });

  $(document).on("click", ".get_document_y_task", function() {
    // $('.getImg').click(function(){
    $("#send_doc").modal("show");
    $("#check_doc").val($(this).attr("id"));
  });

  send_video_on_progress = false;
  $(document).on("click", "#send_video", function(e) {
    e.preventDefault();
    if(send_video_on_progress){
      return;
    }
    var fileURL = $("#video_file")
      .val()
      .replace(/\\/g, "/");
    var video_name = $("#video_name").val();
    var user = $("#admin_id").val();
    var task_id = $("#check_vid").val();
    /*var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURL.substr(fileURL.lastIndexOf("/") + 1);
    options.mimeType = "video/mp4";//*/
    // alert(fileURL);

    if (video_name == "") {
      swal("Empty!", "Please Provide Video Title", "error");
      return;
    }
    if (user == "") {
      swal("Empty!", "Please Select User", "error");
      return;
    }
    /*if (fileURL == "") {
      swal("Empty!", "Please Record Video", "error");
      return;
    }//*/
    if (video_name != "" && user != "") {

      var form_data = new FormData();
      var files = $("#video_file")[0].files[0];
      form_data.append("file_name", files);
      form_data.append("file_title", video_name);
      form_data.append("users", user);
      form_data.append("task_id", task_id);
      form_data.append("send", 'video');
      send_video_on_progress = true;
      $('#send_video').attr('disabled', '');
      $.ajax({
        url: "http://34.74.113.124/telco_user/user/upload_task_file",
        method: "POST",
        data: form_data,
        contentType: false,
        processData: false,
        beforeSend: function() {
          $("#video_loading").html("<p>Uploading Please Wait ...</p>");
        },
        success: function(data) {
          $("#video_loading").html("");
          send_video_on_progress = false;
          $('#send_video').removeAttr('disabled');
          swal("Success", "Video has sent successfully", "success").then(
            function() {
              $("#send_vid").modal("hide");
              location.reload();
            }
          );
        },
        error: function(data){
          send_video_on_progress = false;
          $("#video_loading").html("");
          $('#send_video').removeAttr('disabled');
          swal("Failed", "Failed to upload the video. Please try again", "error")
        }
      });
      return;
      var ft = new FileTransfer();
      // ft.upload(fileURL, encodeURI("http://192.168.1.2/telco/authentication/upload_video"));
      ft.upload(
        fileURL,
        "http://34.74.113.124/telco_user/user/upload_file",
        function(result) {
          $.ajax({
            url: "http://34.74.113.124/telco_user/user/save_file",
            // url: "http://34.74.113.124/telco/authentication/save_video",
            method: "POST",
            data: {
              file_name: options.fileName,
              file_title: video_name,
              users: user,
              task_id: task_id,
              send: "video"
            },
            success: function(data) {
              swal("Success", "Video has sent successfully", "success").then(
                function() {
                  user_task();
                  $("#send_vid").modal("hide");
                }
              );
            }
          });
        },
        function(error) {
          alert("Error uploading file " + path + ": " + error.code);
        },
        options
      );

      var statusDom;

      statusDom = document.querySelector("#send_video");

      ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
          var perc = Math.floor(
            (progressEvent.loaded / progressEvent.total) * 101
          );
          statusDom.innerHTML = perc + "%";
          console.log(perc);
        } else {
          if (statusDom.innerHTML == "") {
            statusDom.innerHTML = "Loading";
          } else {
            statusDom.innerHTML += ".";
          }
        }
      };
    }
  });
  send_image_on_progress = false;
  $(document).on("click", "#send_image", function(e) {
    e.preventDefault();
    if(send_image_on_progress){
      return;
    }
    var fileURL = $("#image_file")
      .val()
      .replace(/\\/g, "/");

    var image_name = $("#image_name").val();
    var user = $("#admin_id1").val();
    var task_id = $("#check_img").val();
    /*var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURL.substr(fileURL.lastIndexOf("/") + 1);
    options.mimeType = "image/jpeg";//*/
    if (image_name == "") {
      swal("Empty!", "Please Provide Image Title", "error");
      return;
    }
    if (user == "") {
      swal("Empty!", "Please Select User", "error");
      return;
    }
    /*if (fileURL == "") {
      swal("Empty!", "Please Capture Image", "error");
      return;
    }
    alert(fileURL);
    return;//*/
    if(image_name != "" && user != "") {
      var form_data = new FormData();
      var files = $("#image_file")[0].files[0];
      form_data.append("file_name", files);
      form_data.append("file_title", image_name);
      form_data.append("users", user);
      form_data.append("task_id", task_id);
      form_data.append("send", 'image');
      send_video_on_progress = true;
      $('#send_image').attr('disabled', '');
      $.ajax({
        url: "http://34.74.113.124/telco_user/user/upload_task_file",
        method: "POST",
        data: form_data,
        contentType: false,
        processData: false,
        beforeSend: function() {
          $("#image_loading").html("<p>Uploading Please Wait ...</p>");
        },
        success: function(data) {
          $("#image_loading").html("");
          send_image_on_progress = false;
          $('#send_image').removeAttr('disabled');
          swal("Success", "Image has sent successfully", "success").then(
            function() {
              $("#send_img").modal("hide");
              location.reload();
            }
          );
        },
        error: function(data){
          send_image_on_progress = false;
          $("#image_loading").html("");
          $('#send_image').removeAttr('disabled');
          swal("Failed", "Failed to upload the image. Please try again", "error")
        }
      });
      return;
      var ft = new FileTransfer();
      ft.upload(
        fileURL,

        "http://34.74.113.124/telco_user/user/upload_file",
        function(result) {
          $.ajax({
            url: "http://34.74.113.124/telco_user/user/save_file",
            method: "POST",
            data: {
              file_name: options.fileName,
              file_title: image_name,
              users: user,
              task_id: task_id,
              send: "image"
            },
            success: function(data) {
              //   alert(data);
              swal("Success", "Image has sent successfully", "success").then(
                function() {
                  user_task(); //initalize function to get user tasks
                }
              );
            }
          });
        },
        function(error) {
          alert("Error uploading file " + path + ": " + error.code);
        },
        options
      );

      var statusDom;

      statusDom = document.querySelector("#send_image");

      ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
          var perc = Math.floor(
            (progressEvent.loaded / progressEvent.total) * 101
          );
          statusDom.innerHTML = perc + "%";
          console.log(perc);
        } else {
          if (statusDom.innerHTML == "") {
            statusDom.innerHTML = "Loading";
          } else {
            statusDom.innerHTML += ".";
          }
        }
      };
    }
  });

  $(document).on("click", "#send_document", function(e) {
    e.preventDefault();

    var document_name = $("#document_name").val();
    var doc = $("#document_file")[0].files[0];
    var user = $("#admin_id2").val();
    var task_id = $("#check_doc").val();
    var extension = $("#document_file")
      .val()
      .split(".")
      .pop()
      .toLowerCase();

    if (document_name == "") {
      swal("Empty!", "Please Provide Document Title", "error");
      return;
    }
    if (doc == "") {
      swal("Empty!", "Please Select File", "error");
      return;
    }
    if (user == "") {
      swal("Empty!", "Please Select User", "error");
      return;
    }

    if (extension !== "") {
      if (jQuery.inArray(extension, ["docx", "pdf", "xls"]) == -1) {
        swal("Invalid", "Document File Only", "error");
        return;
      }
    }

    if (document_name != "" && doc != "" && user != "") {
      // var ft = new FileTransfer();
      var formData = new FormData();

      formData.append("document", doc);
      formData.append("file_title", document_name);
      formData.append("users", user);
      formData.append("task_id", task_id);
      formData.append("send", "document");
      $.ajax({
        url: "http://34.74.113.124/telco_user/user/save_file",
        method: "POST",
        data: formData,
        contentType: false,
        cache: false,
        processData: false,

        beforeSend: function(xhr) {
          $("#send_document").html("Please Wait");
          $("#send_document").attr("disabled", true);
        },
        success: function(data) {
          swal("Success", "Document has sent successfully", "success").then(
            function() {
              user_task(); //initalize function to get user tasks
              location.reload();
            }
          );
        }
      });
    }
  });

  var member_capture = {
    image: function() {
      navigator.device.capture.captureImage(
        member_capture.onCaptureImageSuccess
      );
    },
    video: function() {
      navigator.device.capture.captureVideo(
        member_capture.onCaptureVideoSuccess
      );
    },
    onCaptureImageSuccess: function(mediaFiles) {
      for (var i = 0; i < mediaFiles.length; i++) {
        var path = mediaFiles[i].fullPath;
        $("#Curl").html(path);
        $("#member_image_file").val(path);
        $("#send_img_member").modal("show");
      }
    },
    onCaptureVideoSuccess: function(mediaFiles) {
      for (var i = 0; i < mediaFiles.length; i++) {
        var path = mediaFiles[i].fullPath;
        $("#Vurl").html(path);
        $("#member_video_file").val(path);
        $("#send_vid_member").modal("show");
      }
    }
  };

  $(document).on("click", ".get_image_member", function() {
    if ($(this).attr("id") == $("#member_check_img").val()) {
      $("#send_img_member").modal("show");
    } else {
      $("#member_check_img").val($(this).attr("id"));
      $("#team_leader_img").val($(this).attr("team_leader"));
      member_capture.image();
    }
  });

  $(document).on("click", ".get_document_member", function() {
    $("#send_doc").modal("show");
    $("#team_leader_document").val($(this).attr("team_leader"));
    $("#member_check_doc").val($(this).attr("id"));
  });

  $(document).on("click", ".get_video_member", function() {
    if ($(this).attr("id") == $("#member_check_vid").val()) {
      $("#send_vid_member").modal("show");
    } else {
      $("#member_check_vid").val($(this).attr("id"));
      $("#team_leader_vid").val($(this).attr("team_leader"));
      member_capture.video();
    }
  });

  $(document).on("click", "#member_send_video", function(e) {
    e.preventDefault();

    var fileURL = $("#member_video_file")
      .val()
      .replace(/\\/g, "/");
    var video_name = $("#member_video_name").val();
    var user = $("#team_leader_vid").val();
    var task_id = $("#member_check_vid").val();
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURL.substr(fileURL.lastIndexOf("/") + 1);
    options.mimeType = "video/mp4";
    if (user == null) {
      user = 0;
    }
    // alert(fileURL);
    if (video_name == "") {
      swal("Empty!", "Please Provide Video Title", "error");
      return;
    }
    if (fileURL == "") {
      swal("Empty!", "Please Record Video", "error");
      return;
    }
    if (fileURL != "" && video_name != "") {
      var ft = new FileTransfer();
      // ft.upload(fileURL, encodeURI("http://192.168.1.2/telco/authentication/upload_video"));
      ft.upload(
        fileURL,
        "http://34.74.113.124/telco_user/user/upload_file",
        function(result) {
          $.ajax({
            url: "http://34.74.113.124/telco_user/user/save_file_member",
            // url: "http://34.74.113.124/telco/authentication/save_video",
            method: "POST",
            data: {
              file_name: options.fileName,
              file_title: video_name,
              users: user,
              task_id: task_id,
              send: "video"
            },
            success: function(data) {
              swal("Success", "Video has sent successfully", "success").then(
                function() {
                  location.reload();
                }
              );
            }
          });
        },
        function(error) {
          alert("Error uploading file " + path + ": " + error.code);
        },
        options
      );

      var statusDom;

      statusDom = document.querySelector("#member_send_video");

      ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
          var perc = Math.floor(
            (progressEvent.loaded / progressEvent.total) * 101
          );
          statusDom.innerHTML = perc + "%";
          console.log(perc);
        } else {
          if (statusDom.innerHTML == "") {
            statusDom.innerHTML = "Loading";
          } else {
            statusDom.innerHTML += ".";
          }
        }
      };
    }
  });

  $(document).on("click", "#member_send_image", function(e) {
    e.preventDefault();
    var fileURL = $("#member_image_file")
      .val()
      .replace(/\\/g, "/");
    var image_name = $("#member_image_name").val();
    var task_id = $("#member_check_img").val();
    var user = $("#team_leader_img").val();
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURL.substr(fileURL.lastIndexOf("/") + 1);
    options.mimeType = "image/jpeg";
    if (user == null) {
      user = 0;
    }
    if (image_name == "") {
      swal("Empty!", "Please Provide Image Title", "error");
      return;
    }
    if (fileURL == "") {
      swal("Empty!", "Please Capture Image", "error");
      return;
    }
    if (fileURL != "" && image_name != "") {
      var ft = new FileTransfer();
      ft.upload(
        fileURL,
        "http://34.74.113.124/telco_user/user/upload_file",
        function(result) {
          $.ajax({
            url: "http://34.74.113.124/telco_user/user/save_file_member",
            method: "POST",
            data: {
              file_name: options.fileName,
              file_title: image_name,
              users: user,
              task_id: task_id,
              send: "image"
            },
            success: function(data) {
              swal("Success", "Image has sent successfully", "success").then(
                function() {
                  location.reload();
                }
              );
              // alert(data);
            }
          });
        },
        function(error) {
          alert("Error uploading file " + path + ": " + error.code);
        },
        options
      );

      var statusDom;

      statusDom = document.querySelector("#member_send_image");

      ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
          var perc = Math.floor(
            (progressEvent.loaded / progressEvent.total) * 101
          );
          statusDom.innerHTML = perc + "%";
          console.log(perc);
        } else {
          if (statusDom.innerHTML == "") {
            statusDom.innerHTML = "Loading";
          } else {
            statusDom.innerHTML += ".";
          }
        }
      };
    }
  });

  $(document).on("click", "#member_send_document", function(e) {
    e.preventDefault();

    var document_name = $("#member_document_name").val();
    var doc = $("#member_document_file")[0].files[0];
    var user = $("#team_leader_document").val();
    var task_id = $("#member_check_doc").val();
    if (document_name == "") {
      swal("Empty!", "Please Provide Document Title", "error");
      return;
    }
    if (fileURL == "") {
      swal("Empty!", "Please Select File", "error");
      return;
    }
    if (user == "") {
      swal("Empty!", "Please Select User", "error");
      return;
    }

    if (document_name != "" && doc != "" && user != "") {
      var formData = new FormData();

      formData.append("document", doc);
      formData.append("file_title", document_name);
      formData.append("users", user);
      formData.append("task_id", task_id);
      formData.append("send", "document");
      $.ajax({
        url: "http://34.74.113.124/telco_user/user/save_file_member",
        method: "POST",
        contentType: false,
        processData: false,
        data: formData,
        beforeSend: function(xhr) {
          $("#member_send_document").html("Please Wait");
          $("#member_send_document").attr("disabled", true);
        },
        success: function(data) {
          swal("Success", "Document has sent successfully", "success").then(
            function() {
              user_task(); //initalize function to get user tasks
              location.reload();
            }
          );
        }
      });
    }
  });
});
