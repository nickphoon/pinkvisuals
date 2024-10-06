var selectedTable; // Declare selectedTable variable outside the $(document).ready() function
var dataStructTableVisible = false; // Variable to track if the Data Structures table is visible or not
window.onload = function () {
  // selectedTable = "#sort";

  $(selectedTable).DataTable({
    pagingType: "simple",
    searching: false,
    lengthChange: false,
    info: false,
    bPaginate: false,
    drawCallback: function (settings) {
      MathJax.typeset();
    }
  });





  var currentData = [];

  function fetchTableData(url) {
    $.ajax({
      url: url,
      dataType: "json",
      success: function (data) {
        currentData = data;
        console.log("Fetched data:", currentData);
        updateTable();
      },
      error: function (xhr, status, error) {
        console.error("Error fetching table data:", error);
      },
    });
  }

  function updateTable() {
    var dataTable = $("#sort").DataTable();
    dataTable.clear();

    for (var i = 0; i < currentData.length; i++) {
      var rowData = [
        currentData[i].Name,
        currentData[i].Best,
        currentData[i].Average,
        currentData[i].Worst
      ];

      dataTable.row.add(rowData);
    }

    dataTable.draw();
    MathJax.typeset();
  }
  function fetchTableDataDataStruct(url) {
    $.ajax({
      url: url,
      dataType: "json",
      success: function (data) {
        currentDataDataStruct = data;
        console.log("Fetched data for data structures:", currentDataDataStruct);
        updateDataStructTable();
      },
      error: function (xhr, status, error) {
        console.error("Error fetching data structures table data:", error);
      },
    });
  }
  function updateDataStructTable() {
    var dataTable = $("#dataStruct").DataTable();
    dataTable.clear();

    for (var i = 0; i < currentDataDataStruct.length; i++) {
      var rowData = [
        currentDataDataStruct[i].Name,
        currentDataDataStruct[i].Access,
        currentDataDataStruct[i].Search,
        currentDataDataStruct[i].Insertion,
        currentDataDataStruct[i].Delete
      ];

      dataTable.row.add(rowData);
    }

    dataTable.draw();
    MathJax.typeset();
  }

  function highlightButton(buttonId) {
    $(".btn").removeClass("active-button"); // Remove the class from all buttons
    $(buttonId).addClass("active-button"); // Add the class to the clicked button
  }
  function showDataStructHeader(headerText) {
    $("#dataStructHeader h2").text(headerText);
    $("#dataStructHeader").show();
  }
  
  function hideDataStructHeader() {
    $("#dataStructHeader").hide();
  }

  $("#sortingAlgoTable").click(function () {
    selectedTable = "#sort";
    fetchTableData("sorting.json");
    $("#dataStruct").hide();
    $(selectedTable).show();
    $("#dataStruct_wrapper").hide();
    $("#sort_wrapper").show();
    highlightButton("#sortingAlgoTable");
  });

  $("#mazingAlgoTable").click(function () {
    selectedTable = "#sort";
    fetchTableData("mazing.json");
    $("#dataStruct").hide();
    $(selectedTable).show();
    $("#dataStruct_wrapper").hide();
    $("#sort_wrapper").show();
    highlightButton("#mazingAlgoTable");
  });

  $("#searchAlgoTable").click(function () {
    selectedTable = "#sort";
    fetchTableData("search.json");
    $("#dataStruct").hide();
    $(selectedTable).show();
    $("#dataStruct_wrapper").hide();
    $("#sort_wrapper").show();
    highlightButton("#searchAlgoTable");
  });

  $("#dataStructAlgoTable").click(function () {
    selectedTable = "#dataStruct";
    // Show the Best, Average, and Worst buttons only if the Data Structures table is not already visible
    if (!dataStructTableVisible) {
      $("#bestDataStructTable").show();
      $("#averageDataStructTable").show();
      $("#worstDataStructTable").show();
      dataStructTableVisible = true;
    }
    // $("#dataStruct_wrapper").show();
    $("#sort_wrapper").hide();
    highlightButton("#dataStructAlgoTable");
  });

   // Event listener for the Best button under Data Structures table
   $("#bestDataStructTable").click(function () {
    showDataStructHeader("Best Data Structures Time Complexity");
    fetchTableDataDataStruct("dataStruct.json");
    selectedTable = "#dataStruct";
    fetchTableData("search.json");
    $("#sort").hide();
    $(selectedTable).show();
    $("#dataStruct_wrapper").show();
    $("#sort_wrapper").hide();
    highlightButton("#bestDataStructTable");
    
  });

  // Event listener for the Average button under Data Structures table
  $("#averageDataStructTable").click(function () {
    showDataStructHeader("Average Data Structures Time Complexity");
    fetchTableDataDataStruct("dataStructAverage.json");
    selectedTable = "#dataStruct";
    fetchTableData("search.json");
    $("#sort").hide();
    $(selectedTable).show();
    $("#dataStruct_wrapper").show();
    $("#sort_wrapper").hide();
    highlightButton("#averageDataStructTable");
  });

  // Event listener for the Worst button under Data Structures table
  $("#worstDataStructTable").click(function () {
    showDataStructHeader("Worst Data Structures Time Complexity");
    fetchTableDataDataStruct("dataStructWorst.json");
    selectedTable = "#dataStruct";
    fetchTableData("search.json");
    $("#sort").hide();
    $(selectedTable).show();
    $("#dataStruct_wrapper").show();
    $("#sort_wrapper").hide();
    highlightButton("#worstDataStructTable");
  });
  // Event listener for other buttons to hide the additional buttons
  $("#sortingAlgoTable, #mazingAlgoTable, #searchAlgoTable").click(function () {
    hideDataStructHeader();
    $("#bestDataStructTable").hide();
    $("#averageDataStructTable").hide();
    $("#worstDataStructTable").hide();
    $("#dataStruct_wrapper").hide();
    dataStructTableVisible = false;
  });
  $("#bestDataStructTable").hide();
  $("#averageDataStructTable").hide();
  $("#worstDataStructTable").hide();
  
};
