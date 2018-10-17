// Grab the articles as a json
$("#scrape").on("click", function () {
  console.log("scraped");
  $.getJSON("/articles", function (data) {
    // For each one

    console.log(data);
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append(
        `<a class="list-group-item list-group-item-action flex-column align-items-start active">
      <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1" >` + data[i].title + `</h5>
      </div>
      <p class="mb-1" id="recent`+ data[i]._id + `"></p>
      <p class="mb-1" id="notes`+ data[i]._id + `"></p>
      <button type="button" id="addNote" data-id=`+ data[i]._id + ` class="btn btn-secondary btn-small">Add Note</button>
    </a>
    <a href="http://bbc.com` + data[i].link + `" target="blank"><small>via BBC</small><a/>
      `);
    }
  });
});

// Whenever someone clicks a p tag
$(document).on("click", "#addNote", function () {
  // Empty the notes from the note section
  // $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  console.log("test");
  console.log(thisId);

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // // The title of the article
      // $("#notes").append("<h2>" + data.title + "</h2>");
      // // An input to enter a new title
      // $("#notes").append("<input id='titleinput' name='title' >");
      // // A textarea to add a new note body
      $("#notes" + data._id).append(`
      <div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon1">Note Title</span>
  </div>
  <input type="text" id="noteTitle" class="form-control" placeholder="Title of note" aria-label="Username" aria-describedby="basic-addon1">
</div>
      <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">Write Comment</span>
      </div>
      <textarea class="form-control" id="noteBody" aria-label="Write Note"></textarea>
    </div>`);
      // A button to submit a new note, with the id of the article saved to it
      $("#notes" + data._id).append(`<button type="button" id="saveNote" data-id=` + data._id + ` class="btn btn-primary btn-small">Submit</button>`);

      // // If there's a note in the article
      // if (data.note) {
      //   // Place the title of the note in the title input
      //   $("#titleinput").val(data.note.title);
      //   // Place the body of the note in the body textarea
      //   $("#bodyinput").val(data.note.body);
      // }
    });
});

// When you click the savenote button
$(document).on("click", "#saveNote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  $("#recent" + thisId).append("<p>Title: "+ $("#noteTitle").val()+
" Note: "+$("#noteBody").val()+"</p>"
);
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#noteTitle").val(),
      // Value taken from note textarea
      body: $("#noteBody").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      
      $("#notes"+ thisId).empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#noteTitle").val("");
  $("#noteBody").val("");
});
