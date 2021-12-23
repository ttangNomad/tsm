

$(document).ready(function () {

    $('#uploadForm').submit(function (e) {
        console.log("click");
        e.preventDefault()
        if (RefID == null) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Warning',
                text: 'Please select ReferenceNo.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            })
        } else {
            let data = new FormData($('#uploadForm')[0])
            $.ajax({
                url: '/image/upload/' + RefID,
                type: 'post',
                data: data,
                processData: false,
                contentType: false,
                success: function (data) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Uploded',
                        text: 'Successfully uploaded.',
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#dc3545',
                        allowOutsideClick: false
                    })
                }
            })
        }
    })
})