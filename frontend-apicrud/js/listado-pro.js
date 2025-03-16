//variables globales
let tablePro=document.querySelector("#table-pro > tbody");
let searchInput =document.querySelector("#search-input");
let nameUser = document.querySelector("#nombre-usuario");
let btnLogout =document.querySelector("#btnLogout");

//funcion para poner el nombre del usuario
let getUser =() => {
    let user = JSON.parse(localStorage.getItem("userLogin"));
    nameUser.textContent = user.nombre;
};

//Evento para el boton del logout
btnLogout.addEventListener("click", ()=>{
    localStorage.removeItem("userLogin");
    location.href="/frontend-apicrud/login.html";
});

//evento para probar el campo de buscar
searchInput.addEventListener("keyup", ()=>{
   // console.log(searchInput.value);
   searchProductTable();

});
//evento para el navegador
document.addEventListener("DOMContentLoaded",()=>{
    getTableData();
    getUser();
});

//funcion para traer los datos de la BD a la tabla
let getTableData = async()=>{
      let url="http://localhost:8080/backend-apiCrud/productos";  
      try{
        let respuesta = await fetch(url,{
            method: "GET",
            headers:{
              "Content-Type" : "application/json"
            }
      });
      if(respuesta.status === 204){
       console.log("No hay datos");
      }else{
        let tableData = await respuesta.json();
        console.log(tableData);
        //agrega los datos de la tabla a localStorage
        localStorage.setItem("datosTabla", JSON.stringify(tableData));
        //agregar los datos a la tabla
        tableData.forEach((dato,i) => {
          let row=document.createElement("tr");
          row.innerHTML =`
            <td>${i+1} </td>
            <td>${dato.nombre} </td>
            <td>${dato.descripcion} </td>
            <td>${dato.precio} </td>
            <td>${dato.stock} </td>
            <td><img src="${dato.imagen}"width="100" </td>
            <td>
              <button id="btn-edit" onclick="editDataTable(${i})" type="button" class="btn btn-warning">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg>
              </button> -
              ${ nameUser.textContent == "vendedor" ?"":
              `<button id="btn-delete" onclick="deleteDataTable(${i})" type="button" class="btn btn-danger">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                </svg>
              </button>`}
            </td> 
          `;
          tablePro.appendChild(row);
        });
      }
    
    }catch(error){
        console.log(error);
    }
   
};
//funcion para editar algun producto de la tabla
let editDataTable=( id )=>{
    let products =[];
    let productsSave = JSON.parse(localStorage.getItem("datosTabla"));
    if(productsSave != null){
      products=productsSave;
    }
    let singleProduct = products[id];
    //console.log(singleProduct);
    //console.log(products);
    localStorage.setItem("productEdit",JSON.stringify(singleProduct));
    localStorage.removeItem("datosTabla");
    location.href="/frontend-apicrud/crear-pro.html";
}

//funcion para elimianr algun producto de la tabla
let deleteDataTable=( id )=>{
  let products =[];
  let productsSave = JSON.parse(localStorage.getItem("datosTabla"));
  if(productsSave != null){
    products=productsSave;
  }
  let singleProduct = products[id];
 // console.log("Producto a eliminar  " +singleProduct.nombre);
 let IDProduct ={
    id:singleProduct.id
 }
 let confirmar = confirm(`¿Deseas eliminar el pedido...${singleProduct.nombre}?`);
 if(confirmar){
    //llamar la funcion para realizar la peticion
    sendDeleteProduct(IDProduct);
 }

}
//funcion para realizar la peticion de eliminar productos
let sendDeleteProduct= async (id)=>{
  let url = "http://localhost:8080/backend-apiCrud/productos";
  try{
      let respuesta = await fetch(url,{
          method: "DELETE",
          headers:{
            "Content-Type" : "application/json"
          },
          body: JSON.stringify(id)
    });
    if(respuesta.status === 406){
      alert("El ID enviado no fue admitido");
    }else{
      let mensaje = await respuesta.json();
      alert(mensaje.message);
      location.reload();
    }  
  }catch(error){
      console.log(error);
  }
}
//funcion para quitar productos de la tabla
let clearDataTable = ()=>{
  let rowTable=document.querySelectorAll("#table-pro > tbody > tr");
  //console.log(rowTable);
  rowTable.forEach((row)=>{
    row.remove();
  });
};

//funcion para buscar un producto de la tabla
let searchProductTable =()=>{
  let products =[];
  let productsSave = JSON.parse(localStorage.getItem("datosTabla"));
  if(productsSave != null){
    products=productsSave;
  }
  //console.log(products);

  //obtener lo escrito en campo de texto
  let textSearch = searchInput.value.toLowerCase();
  //console.log(textSearch);
  clearDataTable();
  let i = 0;
  for (let pro of products){
      //comprobar coincidencia de los productos
      if(pro.nombre.toLowerCase().indexOf(textSearch)!= -1 ) {
        //console.log("Encontre algo")
        let row=document.createElement("tr");
        row.innerHTML =`
          <td>${i++} </td>
          <td>${pro.nombre} </td>
          <td>${pro.descripcion} </td>
          <td>${pro.precio} </td>
          <td>${pro.stock} </td>
          <td><img src="${pro.imagen}"width="100" </td>
          <td>
            <button id="btn-edit" onclick="editDataTable(${i})" type="button" class="btn btn-warning">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
              </svg>
            </button> -
            ${ nameUser.textContent == "vendedor" ?"":
            `<button id="btn-delete" onclick="deleteDataTable(${i})" type="button" class="btn btn-danger">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
              </svg>
            </button>`}
          </td> 
        `;
        tablePro.appendChild(row);
      }
  }
};
