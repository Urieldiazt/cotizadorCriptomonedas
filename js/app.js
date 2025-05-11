
//Variables
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const moneda = document.querySelector('#moneda');
const criptomonedas = document.querySelector('#criptomonedas');

//Obejeto Criptomoneda
const objCripto ={
    moneda : '',
    criptomoneda: ''
}

//EventListenners
document.addEventListener('DOMContentLoaded', colocarCriptomonedad);

formulario.addEventListener('submit', cotizarCriptomoneda);

moneda.addEventListener('change', (e)=>{
   objCripto[e.target.name] = e.target.value;
});
criptomonedas.addEventListener('change', (e)=>{
    objCripto[e.target.name] = e.target.value;
});



//Class
class UI{
    imprimirCriptomonedas(criptomonedas){
        //Iterando sobre array criptomonedas
        criptomonedas.forEach(criptomoneda => {
            //Nombre de la moneda
            const {FullName, Name} = criptomoneda.CoinInfo;
            
            //Campo elige tu criptomoneda
            const criptomonedasCampo = document.querySelector('#criptomonedas');

            const option = document.createElement('OPTION');
            option.value = Name;
            option.textContent = FullName;

            criptomonedasCampo.appendChild(option);

        });
    }

    imprirmirAlerta(mensaje){
        const existeAlerta = document.querySelector('.alerta');

        if(!existeAlerta){
            const alerta = document.createElement('P');
            alerta.classList.add('error', 'alerta');
            alerta.textContent = mensaje;

            resultado.appendChild(alerta);

            setTimeout(()=>{
                alerta.remove();
            },3000);
        }
    }

    mostrarCotizacion(cotizacion){

        this.limpiarHTML();

        //Mostar Spinner
        ui.mostrarSpinner();

        const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

        const precio = document.createElement('P');
        precio.classList.add('precio');
        precio.textContent = `El precio es: ${PRICE}`;

        const precioAlto = document.createElement('P');
        precioAlto.textContent = `El precio mas Alto: ${HIGHDAY}`;

        const precioBajo = document.createElement('P');
        precioBajo.textContent = `EL precio mas Bajo: ${LOWDAY}`;

        const ultimasHoras = document.createElement('P');
        ultimasHoras.textContent = `Variavión últimas 24 horas: ${CHANGEPCT24HOUR}`;

        const ultimaActualizacion = document.createElement('P');
        ultimaActualizacion.textContent = `Ultima Actualizacion: ${LASTUPDATE}`;

        setTimeout(()=>{
            this.limpiarHTML();
            resultado.appendChild(precio);
            resultado.appendChild(precioAlto);
            resultado.appendChild(precioBajo);
            resultado.appendChild(ultimasHoras);
            resultado.appendChild(ultimaActualizacion);
        },3000);

    }

    limpiarHTML(){
        while(resultado.firstChild){
            resultado.removeChild(resultado.firstChild);
        }
    }

    mostrarSpinner(){
        const spinner = document.createElement('DIV');
        spinner.classList.add('sk-folding-cube');
        spinner.innerHTML = `
            <div class="sk-cube1 sk-cube"></div>
            <div class="sk-cube2 sk-cube"></div>
            <div class="sk-cube4 sk-cube"></div>
            <div class="sk-cube3 sk-cube"></div>
        `;

        resultado.appendChild(spinner);

        setTimeout(()=>{
            spinner.remove();
        },3000);
    }
}

//Instanciar
const ui = new UI;


//Functions

//Crear Promise
const obtenerCriptomonedas = criptomonedas => new Promise(resolve =>{
    resolve(criptomonedas);
});

function colocarCriptomonedad(){
    //API de criptomoneda
     const URL = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD&api_key=2988b3613a77ff100dbff2d665628ebbce9a8bcb4f1e0e3f12140b3c478f27f2`;

     fetch(URL)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado))
        .then(criptomoneda => {
            ui.imprimirCriptomonedas(criptomoneda.Data);
        });
}

function cotizarCriptomoneda(e){
    e.preventDefault();

    const {moneda, criptomoneda} = objCripto;

    if(moneda === '' || criptomoneda === ''){
        ui.imprirmirAlerta('Ambos campos son obligatorios');
        return;
    }

    consultarCriptomoneda();

}

function consultarCriptomoneda(){

    const {moneda, criptomoneda} = objCripto;

    const URL = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}&api_key=2988b3613a77ff100dbff2d665628ebbce9a8bcb4f1e0e3f12140b3c478f27f2`;


    fetch(URL)
        .then(respuesta => respuesta.json())
        .then(resultado => ui.mostrarCotizacion(resultado.DISPLAY[criptomoneda][moneda]));
    
}



