class ReduceMaior {

    constructor(){
    this.getMaior();
    }

  palavra ="qual a maior palavras neste frase";
 

 getMaior(){
     maior = this.palavra.split(' ').reduce((acumulador, valorCorrect) => {
        if (acumulador.length < valorCorrect.trim().length) {
            return valorCorrect.trim()
        }
    
        return acumulador;
     }, '');
   
     console.log(maior);
 }


  

}