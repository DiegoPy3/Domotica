$(function () {
  //Initialize Select2 Elements
  $('.select2').select2()
});

$(function () {

  var fecha = new Date();
  var hoy = (fecha.getFullYear()) +  "-" + (fecha.getMonth() +1) + "-" + fecha.getDate();
  var fechaInicial = 0;
  if(fecha.getDate() < 7){

    var dia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();
    var diferencia = 7 - fecha.getDate();
    fechaInicial = (fecha.getFullYear()) +  "-" + (fecha.getMonth()) + "-" + (dia - diferencia);
  }else{

    fechaInicial = (fecha.getFullYear()) +  "-" + (fecha.getMonth() +1) + "-" + (fecha.getDate() - 7);
  }

  $('#rangoFechas').daterangepicker({
    maxDate: hoy, 
    "locale": {
      "format": "YYYY-MM-DD",
      "separator": " - ",
      "applyLabel": "Guardar",
      "cancelLabel": "Cancelar",
      "fromLabel": "Desde",
      "toLabel": "Hasta",
      "customRangeLabel": "Personalizar",
      "daysOfWeek": [
        "Do",
        "Lu",
        "Ma",
        "Mi",
        "Ju",
        "Vi",
        "Sa"
      ],
      "monthNames": [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Setiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
      ],
      "firstDay": 1
    },
    "startDate": fechaInicial,
    "endDate": hoy,
    "opens": "center"
  });
});

function changeSelect(event) {

  var ventanaEditar = $('#modalEditarVentana').is(':visible');

  var ventanaCrear = $('#modalAgregarVentana').is(':visible');

  // guarda los dias seleccionado
  var guardarDias = "";

  // guardar cual de las dos ventanas modales está activado
  var tipoVentana = "";

  if (ventanaEditar == true) {

    tipoVentana = "editar";
  }

  if (ventanaCrear == true) {

    tipoVentana = "nuevo";
  }

  try {
    document.getElementById(tipoVentana + 'UsuarioPermitido').value = $(event.target).val();
  } catch (error) {
    console.log("abri la ventana modal de editar");
  }


};



$(document).on('change', 'input[type="checkbox"]', function (e) {

  var ventanaEditar = $('#modalEditarVentana').is(':visible');

  var ventanaCrear = $('#modalAgregarVentana').is(':visible');

  // guarda los dias seleccionado
  var guardarDias = "";

  // guardar cual de las dos ventanas modales está activado
  var tipoVentana = "";

  if (ventanaEditar == true) {

    tipoVentana = "editar";
  }

  if (ventanaCrear == true) {

    tipoVentana = "nuevo";
  }

  for (let index = 1; index <= 7; index++) {

    var idDia = tipoVentana + "Dia" + index

    if (document.getElementById(idDia).checked == true) {

      guardarDias = guardarDias + "," + document.getElementById(idDia).value;

    }
  }

  // borra la coma del inicio
  guardarDias = guardarDias.slice(1);

  // guardar los dias en un input de tipo hidden
  document.getElementById(tipoVentana + 'GuardarDias').value = guardarDias;


});

/*===============================================
=     Limpia los checkbox de la ventana modal   =
=           de editar cuando se cierra          =
================================================*/

$('#modalEditarVentana').on('hidden.bs.modal', function () {
  for (let index = 1; index <= 7; index++) {
    $('#editarDia' + index).prop("checked", false);
  }
});




/*=============================================
=    VALIDA EL FORMATO DE LA IMAGEN           =
=============================================*/

$(".nuevaFoto").change(function () {

  var imagen = this.files[0];

  /*=============================================
  Validar Formato Foto
  =============================================*/

  if (imagen["type"] != "image/jpeg" && imagen["type"] != "image/png") {

    $(".nuevaFoto").val("");

    Swal.fire({

      type: 'error',
      background: '#343a40',
      html: '<p class="tituloWhite">¡Error al subir la imagen! </p>',
      text: 'La imagen debe estar en formato JPG o PNG',
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Ok'

    });

  } else if (imagen["size"] > 2000000) {

    $(".nuevaFoto").val("");

    Swal.fire({

      type: 'error',
      background: '#343a40',
      html: '<p class="tituloWhite"> ¡Error al subir la imagen! </p>',
      text: 'La imagen excede el tamaño permitido de 2MB',
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Ok'

    });

  } else {

    var datosImagen = new FileReader;

    datosImagen.readAsDataURL(imagen);

    $(datosImagen).on("load", function (event) {

      var rutaImagen = event.target.result;

      $(".previsualizar").attr("src", rutaImagen);
    });
  }
})

$("#rangoFechas").change(function () {

  var rangoFechas = document.getElementById('rangoFechas').value;

  var datos = new FormData();
  datos.append("rangoFechas", rangoFechas);
  $.ajax({

    url: 'ajax/ventana.ajax.php',
    method: 'POST',
    data: datos,
    cache: false,
    contentType: false,
    processData: false,
    dataType: 'json',
    success: function (respuesta) {
      $('#barChart').remove(); // this is my <canvas> element 
      $('.chart').append('<canvas id="barChart" style="min-height: 350px; height: 350px; max-height: 100%; max-width: 100%;" ></canvas>');
      crearGrafica(respuesta[0], respuesta[1], rangoFechas);
    }
  });

})


function crearGrafica(cantidad1, cantidad2, fechas) {


  var areaChartData = {
    labels: [
      fechas
    ],
    datasets: [
      {
        label: 'Limpieza Suave',
        backgroundColor: 'rgba(60,141,188,0.9)',
        borderColor: 'rgba(60,141,188,0.8)',
        pointRadius: false,
        pointColor: '#3b8bba',
        pointStrokeColor: 'rgba(60,141,188,1)',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(60,141,188,1)',

        data: [
          cantidad1

        ]
      },
      {
        label: 'Limpiza Profunda',
        backgroundColor: 'rgba(210, 214, 222, 1)',
        borderColor: 'rgba(210, 214, 222, 1)',
        pointRadius: false,
        pointColor: 'rgba(210, 214, 222, 1)',
        pointStrokeColor: '#c1c7d1',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: [
          cantidad2

        ]
      },
    ]
  }



  //-------------
  //- BAR CHART -
  //-------------
  var barChartCanvas = $('#barChart').get(0).getContext('2d')
  var barChartData = jQuery.extend(true, {}, areaChartData)
  var temp0 = areaChartData.datasets[0]
  var temp1 = areaChartData.datasets[1]
  barChartData.datasets[0] = temp0
  barChartData.datasets[1] = temp1

  var barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    datasetFill: false,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }

  }

  var barChart = new Chart(barChartCanvas, {
    type: 'bar',
    data: barChartData,
    options: barChartOptions
  })

  areaChartData.update();
}

/*=============================================
=            EDITAR Ventana            =
=============================================*/

$(document).on("click", ".btnEditarVentana", function () {

  var idVentana = $(this).attr("idVentana");

  document.getElementById('idActual').value = idVentana;

  console.log("el id es: " + idVentana);

  var datos = new FormData();

  datos.append("idVentana", idVentana);

  $.ajax({

    url: 'ajax/ventana.ajax.php',
    method: 'POST',
    data: datos,
    cache: false,
    contentType: false,
    processData: false,
    dataType: 'json',
    success: function (respuesta) {


      var UsuarioPermitido = respuesta["usuario_permitidos"].split(",");

      $("#editarReferencia").val(respuesta["referencia"]);
      $("#editarUbicacion").val(respuesta["ubicacion"]);
      $("#editarOpcionesUsuarios").val(UsuarioPermitido).trigger('change');

      $("#editarUsuarioPermitido").val(respuesta["usuario_permitidos"]);

      $("#editarGuardarDias").val(respuesta["dias_limpieza"]);

      var diasLimpieza = respuesta["dias_limpieza"].split(",");

      var guardarAcumulador = 1;

      // evalua los dias que hay en la base de datos con los checkbox
      for (let i = 0; i < diasLimpieza.length; i++) {
        for (let j = guardarAcumulador; j <= 7; j++) {
          if (document.getElementById('editarDia' + j).value == diasLimpieza[i]) {
            $('#editarDia' + j).prop("checked", true);
            guardarAcumulador = j + 1; // guarda el checkBox marcado
            console.log(j);
            break;
          }

        }
      }

      $("#editarHora").val(respuesta["hora_limpieza"]);

      $("#fotoActual").val(respuesta["foto_ventana"]);

      if (respuesta["foto_ventana"] != "") {
        $(".previsualizar").attr("src", respuesta["foto_ventana"]);
      }

    }

  });


})

/*========================================
=            Eliminar Usuario            =
========================================*/
$(document).on("click", '.btnEliminarVentana', function () {

  var idVentana = $(this).attr("idVentana");

  var fotoVentana = $(this).attr("fotoVentana");

  var referencia = $(this).attr("referencia");

  console.log("La referencia es: " + referencia);

  Swal.fire({

    title: '<span class="tituloWhite"> ¿Estas seguro de eliminarlo? </span>',
    html: '<p class="text-white"> Puedes cancelar la accion si no estas seguro </p>',
    type: 'warning',
    background: '#343a40',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'si, eliminarlo!'

  }).then(function (result) {

    if (result.value) {

      window.location = "index.php?vista=ventanas&idVentana=" + idVentana + "&referencia=" + referencia + "&fotoVentana=" + fotoVentana;

    }
  })



});


/*=====  End of Eliminar Usuario  ======*/