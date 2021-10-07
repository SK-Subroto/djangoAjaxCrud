// insert
$("#btnsave").click(() => {
    // console.log('clicked')
    let output = ""
    const sid = $("#stuid").val()
    const nm = $("#nameid").val();
    const em = $("#emailid").val();
    const pw = $("#passwordid").val();
    const csr = $("input[name=csrfmiddlewaretoken]").val();

    if(nm === ''){
        alert('Please enter your name');
    } else if (em === '') {
        alert('Please enter your email');
    } else if (pw === ""){
        alert('Please enter your password');
    } else {
        myData = { stuid:sid, name: nm, email: em, password: pw, csrfmiddlewaretoken: csr}
        $.ajax({
            url: "http://127.0.0.1:8000/save/",
            method: "POST",
            data: myData,
            success: (data) => {
                // console.log(data)
                stu = data.student;
                if (data.status == 'save'){
                    // console.log("Form submitted sucessfully");
                    // console.log(data.student);
                    showMessage("Form Submitted Successfully");
                    for (const s of stu) {
                        output += `
                            <tr>
                                <td>${ s.id }</td>
                                <td>${ s.name }</td>
                                <td>${ s.email }</td>
                                <td>${ s.password }</td>
                                <td>
                                    <input
                                       type="button"
                                       data-sid="${ s.id }"
                                       class="btn btn-warning btn-sm btn-edit"
                                       value="Edit"
                                    />
                                    <input
                                       type="button"
                                       data-sid="${ s.id }"
                                       class="btn btn-danger btn-sm btn-del"
                                       value="Delete"
                                    />
                                </td>
                            </tr>
                        `
                    }

                    $("tbody").html(output);
                     $("#stuid").val('');
                    $("form")[0].reset();
                }

                if (data.status == 0) {
                    // console.log('Unable to save form');
                    showMessage("Form Submitted Failed");
                     $("#stuid").val('');
                }
            },
        })
    }

    // console.log(nm, em, pw);
})

// delete data
$("tbody").on("click", ".btn-del", function () {
    console.log("Delete button");
    const id = $(this).attr("data-sid");
    const csr = $("input[name=csrfmiddlewaretoken]").val();
    // console.log(id);
    myData = { sid: id, csrfmiddlewaretoken: csr };
    myThis = this
    $.ajax({
        url: "http://127.0.0.1:8000/delete/",
        method: "POST",
        data: myData,
        success: function (data) {
            // console.log(data);
            if (data.status == 1){
                // console.log("delete")
                showMessage("Item Deleted Successfully");
                $(myThis).closest("tr").fadeOut();
            }
            else if (data.status == 0){
                // console.log("delete")
                showMessage("Item Deleted Faile");
            }
        },
    });
});


// edit data
$("tbody").on("click", ".btn-edit", function () {
    console.log("Edit button");
    const id = $(this).attr("data-sid");
    const csr = $("input[name=csrfmiddlewaretoken]").val();
    // console.log(id);
    myData = { sid: id, csrfmiddlewaretoken: csr };
    myThis = this
    $.ajax({
        url: "http://127.0.0.1:8000/edit/",
        method: "POST",
        data: myData,
        success: function (data) {
            console.log(data);
            $("#stuid").val(data.id)
            $("#nameid").val(data.name);
            $("#emailid").val(data.email);
            $("#passwordid").val(data.password);
        },
    });
});

const showMessage = (mgs) => {
    $("#msg").text(mgs)
    $("#msg").show()
    setTimeout(() => {
        $("#msg").hide()
    },3000)
}