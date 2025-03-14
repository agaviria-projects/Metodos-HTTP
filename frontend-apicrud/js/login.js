//variables globales del formualrio de login
const d = document;
userInput = d.querySelector("#usuarioForm");
passInput = d.querySelector("#contraForm");
btnLogin = d.querySelector(".btnLogin");

//evento al boton del formulario
btnLogin.addEventListener("click",()=>{
    //alert("escribio :"+ userInput.value);
    let dataForm = getData();
    sendData(dataForm);
});

//funcion para validar el formulario
//obtener datos del formulario
let getData = () => {
    //validar formulario
    let user;
    if(userInput.value && passInput.value){
        user = {
            usuario: userInput.value,
            contrasena: passInput.value      
        }
        userInput.value="";
        passInput.value="";
    }else{
        alert("El usuario y la contraseña es obligatorio")
    } 
    console.log(user);
    return user;   

};

//funcion para recibir los datos y 
//realizar la peticion al servidor

let sendData = async (data)=>{
    let url = "http://localhost:8080/backend-apiCrud/login";
    try{
        let respuesta = await fetch(url,{
            method: "POST",
            headers:{
              "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
      });
      let userLogin = await respuesta.json();
      //console.log(userLogin);
      alert(`Bienvenido: ${userLogin.nombre}`);
      location.href = "/frontend-apicrud/index.html";
    }catch(error){
        console.log(error);
    }
    
};

